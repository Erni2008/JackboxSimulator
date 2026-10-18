package com.finalanswer.server.rooms;

import com.finalanswer.protocol.Protocol;
import com.finalanswer.protocol.Protocol.*;
import com.finalanswer.server.game.GameSession;
import com.finalanswer.server.transport.Peer;
import com.google.gson.*;
import java.security.*;
import java.util.*;
import java.util.function.LongSupplier;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

/** One authoritative registry. Membership, phase changes, deadlines and submissions share a lock. */
public final class RoomService {
    private static final String ALPHABET="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final Set<String> MODES=Set.of("standard","deadline","every_man_for_himself","trust_no_one","house_rules");
    private final SecureRandom random=new SecureRandom();
    private final Map<String,Room> rooms=new HashMap<>();
    private final Map<String,Binding> bindings=new HashMap<>();
    private final LongSupplier time;
    private final int maxRooms;
    private final String publicUrl;
    private final EndPolicy endPolicy;
    public RoomService() { this(monotonicTime(),1000,""); }
    public RoomService(LongSupplier time,int maxRooms,String publicUrl) { this(time,maxRooms,publicUrl,EndPolicy.TIME_ONLY); }
    /** Server-selected policy; players cannot choose it in protocol messages. */
    public RoomService(LongSupplier time,int maxRooms,String publicUrl,EndPolicy endPolicy) {
        this.time=time; this.maxRooms=maxRooms; this.publicUrl=publicUrl; this.endPolicy=Objects.requireNonNull(endPolicy);
    }
    public static LongSupplier monotonicTime() {
        long epoch=System.currentTimeMillis(), origin=System.nanoTime();
        return () -> epoch+(System.nanoTime()-origin)/1_000_000;
    }
    public synchronized String create(Map<String,String> data) {
        tick();
        if(rooms.size()>=maxRooms) throw new Failure(503,"SERVER_FULL");
        String name=text(data.get("name"),40,"INVALID_ROOM_NAME");
        int max=integer(data.getOrDefault("maxPlayers","4"),2,8,"INVALID_PLAYER_LIMIT");
        int questions=integer(data.getOrDefault("questionCount","5"),1,12,"INVALID_QUESTION_COUNT");
        String mode=data.getOrDefault("gameMode","standard");
        if(!MODES.contains(mode)) throw new Failure(400,"INVALID_GAME_MODE");
        String password=data.getOrDefault("password","");
        if(password.length()>64) throw new Failure(400,"INVALID_PASSWORD");
        byte[] salt=new byte[16]; random.nextBytes(salt);
        Room room=new Room(code(),name,max,mode,questions,salt,password.isEmpty()?null:hash(password,salt));
        room.host=new Member("Host",true,token(),now());
        rooms.put(room.code,room);
        return json(snapshot(room,room.host,true));
    }
    public synchronized String join(String code,Map<String,String> data) {
        Room room=find(code);
        if(room.game!=null) throw new Failure(409,"GAME_ALREADY_STARTED");
        String name=text(data.get("name"),24,"INVALID_NICKNAME");
        String password=data.getOrDefault("password","");
        if(password.length()>64 || room.passwordHash!=null&&!MessageDigest.isEqual(room.passwordHash,hash(password,room.salt)))
            throw new Failure(403,"INVALID_PASSWORD");
        if(room.members.size()>=room.maxPlayers) throw new Failure(409,"ROOM_IS_FULL");
        if(room.members.values().stream().anyMatch(m->m.name.equalsIgnoreCase(name))) throw new Failure(409,"NICKNAME_IN_USE");
        Member member=new Member(name,false,token(),now());
        member.characterId="guest_"+(room.members.size()+1);
        room.members.put(member.token,member);
        broadcast(room,"PLAYER_JOINED");
        return json(snapshot(room,member,true));
    }
    public synchronized String heartbeat(String code,String token) {
        Room room=find(code); Member member=authenticate(room,token);
        member.seen=now(); return json(snapshot(room,member,true));
    }
    public synchronized String view(String code) { return json(snapshot(find(code),null,false)); }
    public synchronized String reroll(String code,Map<String,String> data) {
        Room room=find(code); Member host=authenticate(room,data.getOrDefault("token","")); requireHost(host);
        if(room.game!=null || !room.members.isEmpty()) throw new Failure(409,"ROOM_NOT_EMPTY");
        // Generate while the old code is still reserved, so reroll always changes it.
        String replacement=code();
        rooms.remove(room.code); room.code=replacement; rooms.put(room.code,room); host.seen=now();
        broadcast(room,"ROOM_UPDATED"); return json(snapshot(room,host,true));
    }
    public synchronized void leave(String code,String token) {
        Room room=find(code); Member member=authenticate(room,token);
        if(member.host) { closeRoom(room,"HOST_CLOSED_ROOM"); return; }
        disconnectMember(member,"PLAYER_LEFT");
        if(room.game==null) room.members.remove(member.token);
        else member.left=true;
        broadcast(room,"PLAYER_LEFT");
    }
    public synchronized void attach(String code,String token,Peer peer,String requestId) {
        if(bindings.containsKey(peer.id())) throw new Failure(409,"ALREADY_AUTHENTICATED");
        Room room=find(code); Member member=authenticate(room,token);
        if(member.left) throw new Failure(403,"SESSION_ENDED");
        boolean reconnect=member.everConnected;
        if(member.peer!=null) {
            Peer previous=member.peer;
            bindings.remove(previous.id()); previous.close(4001,"SESSION_REPLACED");
        }
        member.peer=peer; member.seen=now(); member.everConnected=true;
        bindings.put(peer.id(),new Binding(room,member));
        broadcast(room,reconnect?"PLAYER_RECONNECTED":"ROOM_UPDATED");
        peer.send(Protocol.event("AUTHENTICATED",requestId,snapshot(room,member,false)));
    }
    public synchronized void detach(String peerId) {
        Binding binding=bindings.remove(peerId);
        if(binding==null || binding.member.peer==null || !binding.member.peer.id().equals(peerId)) return;
        binding.member.peer=null; binding.member.seen=now();
        broadcast(binding.room,"PLAYER_LEFT");
    }
    public synchronized void command(Peer peer,Message message) {
        Binding b=bindings.get(peer.id());
        if(b==null || b.member.peer!=peer) throw new Failure(403,"AUTH_REQUIRED");
        Room room=b.room; Member member=b.member; member.seen=now();
        tickRoom(room);
        JsonObject data=message.payload();
        String suppliedCode=Protocol.string(data,"roomCode");
        if(!suppliedCode.isEmpty() && !room.code.equals(suppliedCode)) throw new Failure(409,"WRONG_ROOM");
        if(message.type().equals("PING") || message.type().equals("SYNC")) {
            peer.send(Protocol.event("STATE",message.requestId(),snapshot(room,member,false))); return;
        }
        if(message.type().equals("LEAVE_ROOM")) { leave(room.code,member.token); return; }
        if(message.type().equals("START_GAME")) {
            requireHost(member);
            if(room.game!=null) throw new Failure(409,"GAME_ALREADY_STARTED");
            Set<String> participants=new LinkedHashSet<>();
            room.members.values().stream().filter(m->m.peer!=null&&!m.left).forEach(m->participants.add(m.id));
            if(participants.isEmpty()) throw new Failure(409,"NOT_ENOUGH_PLAYERS");
            room.game=new GameSession(room.questionCount,participants,endPolicy,now());
            broadcast(room,"GAME_STARTED"); room.game.next(now()); broadcast(room,"QUESTION_STARTED");
            reply(peer,room,member,message); return;
        }
        GameSession game=room.game;
        if(game==null || !game.id.equals(Protocol.string(data,"gameId")) || game.question()==null
            || !game.question().id().equals(Protocol.string(data,"questionId"))) throw new Failure(409,"STALE_QUESTION");
        switch(message.type()) {
            case "PRESENTATION_READY" -> {
                requireHost(member);
                if(game.phase==Phase.QUESTION_PRESENTATION) { game.beginAnswers(now()); broadcast(room,"ANSWERING_STARTED"); }
                else if(game.phase!=Phase.ANSWERING) throw new Failure(409,"INVALID_PHASE");
            }
            case "REVEAL_READY" -> {
                requireHost(member);
                if(game.phase==Phase.REVEALING) {
                    if(now()<game.endedAt+Protocol.CLOCK_EXIT_MILLIS) throw new Failure(409,"NOT_READY");
                    game.reveal(now());
                    for(Member player:room.members.values()) if(game.submitted.getOrDefault(player.id,-1)==game.question().correctAnswerIndex()) player.score+=100;
                    broadcast(room,"REVEAL_STARTED"); broadcast(room,"QUESTION_RESULTS"); broadcast(room,"RESULTS_STARTED");
                } else if(game.phase!=Phase.RESULTS) throw new Failure(409,"INVALID_PHASE");
            }
            case "NEXT_READY" -> {
                requireHost(member);
                if(!game.resultHoldComplete(now())) throw new Failure(409,"NOT_READY");
                game.next(now()); broadcast(room,game.phase==Phase.GAME_FINISHED?"GAME_FINISHED":"QUESTION_STARTED");
            }
            case "SUBMIT_ANSWER" -> {
                if(member.host||member.left||!member.alive||!game.participants.contains(member.id)) throw new Failure(403,"NOT_A_PLAYER");
                if(game.phase!=Phase.ANSWERING || now()>=game.deadline) throw new Failure(409,
                    game.phase==Phase.QUESTION_PRESENTATION?"ANSWERING_NOT_STARTED":"ANSWER_TOO_LATE");
                if(game.submitted.containsKey(member.id)) throw new Failure(409,"ANSWER_ALREADY_SUBMITTED");
                JsonElement value=data.get("answerIndex");
                if(value==null || !value.isJsonPrimitive() || !value.getAsJsonPrimitive().isNumber()
                    || !value.toString().matches("[0-3]")) throw new Failure(400,"INVALID_ANSWER");
                game.submitted.put(member.id,value.getAsInt());
                peer.send(Protocol.event("ANSWER_ACCEPTED",message.requestId(),snapshot(room,member,false)));
                broadcast(room,"ROOM_UPDATED");
                if(game.endPolicy==EndPolicy.ALL_SUBMITTED_OR_TIMEOUT && game.allSubmitted()) {
                    game.endAnswers(now()); broadcast(room,"ANSWERING_FINISHED");
                }
                return;
            }
            default -> throw new Failure(400,"UNKNOWN_EVENT");
        }
        reply(peer,room,member,message);
    }
    private void reply(Peer peer,Room room,Member member,Message message) {
        peer.send(Protocol.event("STATE",message.requestId(),snapshot(room,member,false)));
    }
    public synchronized void tick() {
        for(Room room:new ArrayList<>(rooms.values())) {
            // Host heartbeat keeps an unconfirmed CREATE -> GENERATE room alive too.
            if(room.host.peer==null && now()-room.host.seen>120_000) { closeRoom(room,"HOST_DISCONNECTED"); continue; }
            for(Member member:new ArrayList<>(room.members.values())) {
                if(room.game==null && member.peer==null && now()-member.seen>600_000) {
                    room.members.remove(member.token); broadcast(room,"PLAYER_LEFT");
                }
            }
            tickRoom(room);
        }
    }
    private void tickRoom(Room room) {
        GameSession game=room.game; if(game==null || game.phase==Phase.GAME_FINISHED) return;
        if(game.phase==Phase.ANSWERING && now()>=game.deadline) {
            game.endAnswers(game.deadline); broadcast(room,"ANSWERING_FINISHED");
        }
        long limit=switch(game.phase) {
            case QUESTION_PRESENTATION -> 90_000;
            case REVEALING, RESULTS -> 30_000;
            default -> Long.MAX_VALUE;
        };
        if(now()-game.phaseStartedAt>limit || room.host.peer==null && now()-room.host.seen>60_000) {
            game.finish("HOST_UNRESPONSIVE",now()); broadcast(room,"GAME_FINISHED");
        }
    }
    public synchronized void shutdown() { for(Room r:new ArrayList<>(rooms.values())) closeRoom(r,"SERVER_SHUTDOWN"); }
    private void closeRoom(Room room,String reason) {
        room.revision++;
        for(Member member:allMembers(room)) if(member.peer!=null) {
            member.peer.send(Protocol.event("ROOM_CLOSED","",Map.of("reason",reason)));
            disconnectMember(member,reason);
        }
        rooms.remove(room.code);
    }
    private void disconnectMember(Member member,String reason) {
        if(member.peer!=null) { bindings.remove(member.peer.id()); member.peer.close(4002,reason); member.peer=null; }
        member.seen=now();
    }
    private void broadcast(Room room,String type) {
        room.revision++;
        for(Member member:allMembers(room)) if(member.peer!=null)
            member.peer.send(Protocol.event(type,"",snapshot(room,member,false)));
    }
    private List<Member> allMembers(Room room) {
        var members=new ArrayList<>(room.members.values()); members.add(room.host); return members;
    }
    private Map<String,Object> snapshot(Room room,Member self,boolean credentials) {
        GameSession game=room.game; Phase phase=game==null?Phase.LOBBY:game.phase;
        Map<String,Object> value=new LinkedHashMap<>();
        value.put("protocolVersion",Protocol.VERSION); value.put("roomId",room.id); value.put("code",room.code); value.put("roomCode",room.code);
        value.put("name",room.name); value.put("maxPlayers",room.maxPlayers); value.put("gameMode",room.mode); value.put("questionCount",room.questionCount);
        value.put("roomSettings",Map.of("name",room.name,"maxPlayers",room.maxPlayers,"gameMode",room.mode,"questionCount",room.questionCount,"passwordRequired",room.passwordHash!=null));
        value.put("roomStatus",game==null?"LOBBY":phase==Phase.GAME_FINISHED?"GAME_FINISHED":"IN_GAME");
        value.put("phase",phase.name()); value.put("revision",room.revision); value.put("serverTime",now()); value.put("publicUrl",publicUrl);
        value.put("hostConnected",room.host.peer!=null);
        List<Map<String,Object>> players=new ArrayList<>();
        for(Member member:room.members.values()) {
            Map<String,Object> p=new LinkedHashMap<>();
            p.put("id",member.id); p.put("name",member.name); p.put("nickname",member.name); p.put("host",false);
            p.put("characterId",member.characterId); p.put("connectionStatus",member.peer==null?"OFFLINE":"ONLINE");
            p.put("isAlive",member.alive); p.put("score",member.score);
            p.put("hasSubmittedAnswer",game!=null&&game.submitted.containsKey(member.id)); players.add(p);
        }
        value.put("players",players); value.put("currentPlayers",players);
        if(self!=null) {
            value.put("host",self.host); value.put("selfId",self.id);
            value.put("hasSubmittedAnswer",game!=null&&game.submitted.containsKey(self.id));
            value.put("currentAnswer",game==null?-1:game.submitted.getOrDefault(self.id,-1));
            if(credentials) { value.put("token",self.token); if(self.host) value.put("hostSession",self.token); else value.put("sessionToken",self.token); }
        }
        if(game!=null) {
            value.put("gameId",game.id); value.put("questionNumber",game.index+1); value.put("questionCount",game.questions.size());
            value.put("questionStartTime",game.questionStartedAt); value.put("phaseStartedAt",game.phaseStartedAt); value.put("answeringStartedAt",game.answeringStartedAt);
            value.put("deadline",game.deadline); value.put("answeringEndedAt",game.endedAt);
            value.put("remainingMilliseconds",phase==Phase.ANSWERING?Math.max(0,game.deadline-now()):0);
            value.put("finishReason",game.finishReason);
            if(game.question()!=null) {
                var q=game.question(); Map<String,Object> question=new LinkedHashMap<>();
                question.put("id",q.id()); question.put("text",q.text()); question.put("answers",q.answers());
                // Host gets the key only AFTER deadline, to prepare its existing closing/reveal animation.
                if(phase==Phase.RESULTS || phase==Phase.GAME_FINISHED || phase==Phase.REVEALING&&self!=null&&self.host)
                    question.put("correctAnswerIndex",q.correctAnswerIndex());
                value.put("question",question);
                if(phase==Phase.RESULTS || phase==Phase.GAME_FINISHED) value.put("results",game.results());
            }
        }
        return value;
    }
    private Room find(String code) {
        Room room=rooms.get(code.toUpperCase(Locale.ROOT));
        if(room==null) throw new Failure(404,"ROOM_NOT_FOUND"); return room;
    }
    private Member authenticate(Room room,String token) {
        Member m=room.host.token.equals(token)?room.host:room.members.get(token);
        if(m==null||m.left) throw new Failure(403,"SESSION_ENDED"); return m;
    }
    private static void requireHost(Member m) { if(!m.host) throw new Failure(403,"HOST_ONLY"); }
    private long now() { return time.getAsLong(); }
    private String code() { String code; do { StringBuilder b=new StringBuilder(); for(int i=0;i<6;i++) b.append(ALPHABET.charAt(random.nextInt(ALPHABET.length()))); code=b.toString(); } while(rooms.containsKey(code)); return code; }
    private String token() { byte[] bytes=new byte[32]; random.nextBytes(bytes); return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes); }
    private static int integer(String raw,int min,int max,String error) { try { int n=Integer.parseInt(raw); if(n>=min&&n<=max)return n; } catch(NumberFormatException ignored){} throw new Failure(400,error); }
    private static String text(String value,int max,String error) {
        String s=value==null?"":value.strip();
        if(s.isBlank()||s.codePointCount(0,s.length())>max||s.codePoints().anyMatch(c->Character.isISOControl(c)||Character.getType(c)==Character.FORMAT)) throw new Failure(400,error);
        return s;
    }
    private static byte[] hash(String password,byte[] salt) {
        PBEKeySpec spec=new PBEKeySpec(password.toCharArray(),salt,100_000,256);
        try { return SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded(); }
        catch(GeneralSecurityException e) { throw new IllegalStateException(e); } finally {spec.clearPassword();}
    }
    public static String quote(String text) { return Protocol.JSON.toJson(text); }
    private static String json(Object value) {return Protocol.JSON.toJson(value);}
    private record Binding(Room room,Member member) {}
    private static final class Room {
        final String id=UUID.randomUUID().toString(), name,mode; String code;
        final int maxPlayers,questionCount; final byte[] salt,passwordHash;
        final Map<String,Member> members=new LinkedHashMap<>(); Member host; GameSession game; long revision;
        Room(String code,String name,int max,String mode,int questions,byte[] salt,byte[] hash) {
            this.code=code;this.name=name;maxPlayers=max;this.mode=mode;questionCount=questions;this.salt=salt;passwordHash=hash;
        }
    }
    private static final class Member {
        final String id=UUID.randomUUID().toString(),name,token; final boolean host;
        String characterId="host"; boolean alive=true,left,everConnected; int score; long seen; Peer peer;
        Member(String name,boolean host,String token,long now){this.name=name;this.host=host;this.token=token;seen=now;}
    }
    public static final class Failure extends RuntimeException {
        public final int status;
        public Failure(int status,String code){super(code);this.status=status;}
    }
}
