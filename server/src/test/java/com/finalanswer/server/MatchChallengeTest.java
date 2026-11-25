package com.finalanswer.server;

import com.finalanswer.protocol.Protocol;
import com.finalanswer.server.rooms.RoomService;
import com.finalanswer.server.transport.Peer;
import com.google.gson.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

/** THINK OR DIE as one challenge inside the main match (integrated mode). */
class MatchChallengeTest {
    static final List<String> CHARS=List.of("skeleton","ghost","zombie","dracula","pumpkin","plague_doctor","voodoo","puppeteer");
    final AtomicLong clock=new AtomicLong(1_000_000);
    final RoomService service=new RoomService(clock::get,1000,"https://play.example.test");{service.randomCharacters=false;}
    JsonObject host;Peer0 h=new Peer0();
    final List<Peer0> peers=new ArrayList<>();final List<JsonObject> seats=new ArrayList<>();

    @BeforeAll static void props(){System.setProperty("thinkordie.integrated.category","in_kitchen");System.setProperty("race.qa","true");}
    @AfterAll static void clear(){System.clearProperty("thinkordie.integrated.category");System.clearProperty("race.qa");}

    void room(int players,int questions){
        host=obj(service.create(Map.of("name","Match","maxPlayers",""+players,"gameMode","standard","questionCount",""+questions)));
        service.attach(s(host,"code"),s(host,"token"),h,"h");
        command(h,"SET_LANGUAGE",Map.of("language","en"));
        for(int i=0;i<players;i++){var j=obj(service.join(s(host,"code"),Map.of("name","P"+i,"characterId",CHARS.get(i))));var p=new Peer0();
            service.attach(s(host,"code"),s(j,"token"),p,"p"+i);seats.add(j);peers.add(p);}
        command(h,"START_GAME",Map.of());clock.addAndGet(Protocol.LOBBY_TRANSITION_MILLIS);service.tick();
    }
    void command(Peer0 p,String type,Map<String,?> payload){service.command(p,Protocol.decode(Protocol.event(type,UUID.randomUUID().toString(),payload)));}
    Map<String,Object> q(){JsonObject st=h.latest();return Map.of("gameId",s(st,"gameId"),"questionId",s(st.getAsJsonObject("question"),"id"));}
    /** Every living player answers correctly, so no CURSED BOXES round interrupts the match under test. */
    void question(){command(h,"PRESENTATION_READY",q());
        String id=s(h.latest().getAsJsonObject("question"),"id");int right=com.erni.finalanswer.gameplay.questions.QuestionCatalog.all("en").stream().filter(x->x.id().equals(id)).findFirst().orElseThrow().correctAnswerIndex();
        for(var p:peers){var f=new HashMap<String,Object>(q());f.put("answerIndex",right);try{command(p,"SUBMIT_ANSWER",f);}catch(RoomService.Failure ignored){}}
        clock.addAndGet(20_000);service.tick();clock.addAndGet(720);command(h,"REVEAL_READY",q());clock.addAndGet(3100);command(h,"NEXT_READY",q());}
    JsonObject tod(Peer0 p){var l=p.latest();return l.has("thinkOrDie")?l.getAsJsonObject("thinkOrDie"):null;}
    void until(String phase){for(int i=0;i<3000;i++){var t=tod(h);if(t!=null&&phase.equals(s(t,"phase")))return;clock.addAndGet(100);service.tick();}fail("never reached "+phase+", now "+tod(h));}
    void say(int seat,String text){clock.addAndGet(300);command(peers.get(seat),"TOD_SUBMIT",Map.of("sessionId",s(tod(h),"sessionId"),"round",1,"text",text));service.tick();}
    int counter(int seat){clock.addAndGet(200);service.tick();for(var e:tod(h).getAsJsonArray("players"))if(s(e.getAsJsonObject(),"id").equals(s(seats.get(seat),"selfId")))return e.getAsJsonObject().get("answers").getAsInt();return -1;}
    long souls(int seat){for(var p:h.latest().getAsJsonArray("players")){var o=p.getAsJsonObject();if(s(o,"id").equals(s(seats.get(seat),"selfId")))return o.get("souls").getAsLong();}return -1;}
    boolean alive(int seat){for(var p:h.latest().getAsJsonArray("players")){var o=p.getAsJsonObject();if(s(o,"id").equals(s(seats.get(seat),"selfId")))return o.get("isAlive").getAsBoolean();}return false;}
    long quizSouls(){return 0;}
    void finishChallenge(){for(int i=0;i<3000&&tod(h)!=null;i++){clock.addAndGet(100);service.tick();}assertNull(tod(h),"the challenge closes itself");}

    @Test void challengeFollowsEverySecondQuestionAndTheMatchContinues(){
        room(2,5);
        question();assertNull(tod(h),"no challenge after the first question");
        question();
        var t=tod(h);assertNotNull(t,"a challenge follows the second question");
        assertTrue(t.get("integrated").getAsBoolean());assertTrue(t.get("rules").getAsBoolean(),"first challenge explains the rules");
        assertEquals(1,t.get("rounds").getAsInt());assertEquals(25_000,t.get("answerMs").getAsLong());
        assertEquals(2,h.latest().get("questionNumber").getAsInt());
        command(h,"NEXT_READY",q());assertNotNull(tod(h),"NEXT_READY cannot skip the challenge");
        long before0=souls(0),before1=souls(1);
        until("ANSWERING");
        say(0,"fridge");say(0,"oven");say(0,"fridge");say(0,"  FRIDGE ");
        say(1,"fridge");say(1,"kettle");say(1,"whisk");say(1,"not a kitchen thing at all");
        assertEquals(2,counter(0),"exact own repeats never count");assertEquals(4,counter(1),"wrong answers count: nothing is revealed early");
        // the phone learns nothing about right or wrong before the reveal
        var mine=tod(peers.get(0)).getAsJsonObject("me").getAsJsonArray("history");
        Set<String> states=new HashSet<>();for(var e:mine){states.add(s(e.getAsJsonObject(),"state"));assertFalse(e.getAsJsonObject().has("label"));}
        assertEquals(Set.of("SENT","REPEAT"),states);
        assertFalse(tod(peers.get(1)).toString().contains("oven"),"no other player's text before the reveal");
        until("ANSWER_REVEAL");
        assertEquals(before0,souls(0),"souls only after the reveal");
        until("ROUND_RESULTS");
        assertEquals(before0+100+200,souls(0));assertEquals(before1+100+200+200,souls(1));
        for(int i=0;i<20;i++){clock.addAndGet(100);service.tick();}
        assertEquals(before0+300,souls(0),"paid exactly once");
        finishChallenge();
        assertEquals(3,h.latest().get("questionNumber").getAsInt(),"the match continues with the next question");
        assertEquals("QUESTION_PRESENTATION",s(h.latest(),"phase"));
        question();question();
        t=tod(h);assertNotNull(t,"second appearance after question four");assertFalse(t.get("rules").getAsBoolean(),"rules are not repeated");
        finishChallenge();
        assertEquals(5,h.latest().get("questionNumber").getAsInt());
        question();assertNull(tod(h),"never after the last question");
        assertEquals("GAME_FINISHED",s(h.latest(),"phase"));
    }
    @Test void rewardTiersFollowHowManyPlayersMatched(){
        room(8,3);question();question();until("ANSWERING");
        for(int i=0;i<8;i++)say(i,"fridge");             // 8 players: no souls
        for(int i=0;i<3;i++)say(i,"oven");               // 3 players: 25 each
        for(int i=3;i<5;i++)say(i,"kettle");             // 2 players: 100 each
        say(7,"whisk");                                  // alone: 200
        long[] before=new long[8];for(int i=0;i<8;i++)before[i]=souls(i);
        until("ROUND_RESULTS");
        long[] gain=new long[8];for(int i=0;i<8;i++)gain[i]=souls(i)-before[i];
        assertArrayEquals(new long[]{25,25,25,100,100,0,0,200},gain);
        var reveal=tod(h).getAsJsonArray("reveal");Map<String,String> status=new HashMap<>();
        for(var r:reveal)status.put(s(r.getAsJsonObject(),"label").toLowerCase(Locale.ROOT),s(r.getAsJsonObject(),"status"));
        assertTrue(status.containsValue("CROWD"),"four or more players: the red crowd tier "+status);
        assertTrue(status.containsValue("UNIQUE")&&status.containsValue("SHARED")&&status.containsValue("MANY"));
    }
    @Test void simultaneousAnswersAreAllCountedOnce() throws Exception{
        room(8,3);question();question();until("ANSWERING");
        String session=s(tod(h),"sessionId");List<String> words=List.of("fridge","oven","kettle","fork","spoon");
        var pool=Executors.newFixedThreadPool(8);var go=new CountDownLatch(1);List<Future<?>> jobs=new ArrayList<>();
        for(int i=0;i<8;i++){int seat=i;jobs.add(pool.submit(()->{go.await();for(int k=0;k<5;k++){
            synchronized(clock){clock.addAndGet(300);}
            command(peers.get(seat),"TOD_SUBMIT",Map.of("sessionId",session,"round",1,"text",words.get(k)));}return null;}));}
        go.countDown();for(var j:jobs)j.get(20,TimeUnit.SECONDS);pool.shutdown();
        for(int i=0;i<8;i++)assertEquals(5,counter(i));
    }
    @Test void aGhostWithFiveUnsharedCorrectAnswersReturnsAfterTheReveal(){
        room(3,3);command(h,"QA_SET_ALIVE",Map.of("id",s(seats.get(1),"selfId"),"alive",false));assertFalse(alive(1));
        question();question();until("ANSWERING");
        for(String w:List.of("fridge","oven","kettle","fork","spoon"))say(1,w);
        say(1,"definitely not in any kitchen");        // a wrong answer does not cancel the return
        say(0,"whisk");say(2,"whisk");
        until("ANSWER_REVEAL");assertFalse(alive(1),"the return waits for the reveal");
        until("ROUND_RESULTS");assertTrue(alive(1),"back to life");
        finishChallenge();
        command(h,"PRESENTATION_READY",q());command(peers.get(1),"SUBMIT_ANSWER",Map.of("gameId",q().get("gameId"),"questionId",q().get("questionId"),"answerIndex",0));
        assertTrue(peers.get(1).latest().get("hasSubmittedAnswer").getAsBoolean(),"the revived player answers classic questions again");
    }
    @Test void aSharedAnswerKeepsTheGhostDead(){
        room(2,3);command(h,"QA_SET_ALIVE",Map.of("id",s(seats.get(1),"selfId"),"alive",false));
        question();question();until("ANSWERING");
        for(String w:List.of("fridge","oven","kettle","fork","spoon","whisk"))say(1,w);say(0,"fridge");
        until("ROUND_RESULTS");assertFalse(alive(1));
    }
    @Test void reconnectKeepsHistoryAndCounter(){
        room(2,3);question();question();until("ANSWERING");
        say(0,"fridge");say(0,"oven");
        service.detach(peers.get(0).id());var again=new Peer0();service.attach(s(host,"code"),s(seats.get(0),"token"),again,"again");peers.set(0,again);
        assertEquals(2,tod(again).getAsJsonObject("me").getAsJsonArray("history").size());
        say(0,"kettle");assertEquals(3,counter(0));
        until("ROUND_RESULTS");
    }
    @Test void timersAreServerAuthoritative(){
        room(2,3);question();question();var t=tod(h);
        long intro=t.get("phaseEndsAt").getAsLong()-t.get("phaseStartedAt").getAsLong();
        assertEquals(7000,intro,"logo 2 s + rules 5 s");
        until("CATEGORY_REVEAL");t=tod(h);assertEquals(3000,t.get("phaseEndsAt").getAsLong()-t.get("phaseStartedAt").getAsLong());
        until("ANSWERING");t=tod(h);assertEquals(25_000,t.get("phaseEndsAt").getAsLong()-t.get("phaseStartedAt").getAsLong());
        clock.set(t.get("phaseEndsAt").getAsLong()+1000);
        assertThrows(RoomService.Failure.class,()->say(0,"fridge"),"answers after the deadline are refused");
    }

    static String s(JsonObject o,String k){return o.get(k).getAsString();}
    static JsonObject obj(String s){return JsonParser.parseString(s).getAsJsonObject();}
    static final class Peer0 implements Peer{
        final String id=UUID.randomUUID().toString();final List<JsonObject> events=new CopyOnWriteArrayList<>();
        public String id(){return id;}public void send(String text){events.add(obj(text));}public void close(int code,String reason){}
        JsonObject latest(){for(int i=events.size()-1;i>=0;i--){JsonObject p=events.get(i).getAsJsonObject("payload");if(p!=null&&p.has("phase"))return p;}throw new AssertionError("no state");}
    }
}
