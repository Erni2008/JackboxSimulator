package com.finalanswer.server.game;

import com.erni.finalanswer.gameplay.questions.*;
import com.finalanswer.protocol.Protocol;
import com.finalanswer.protocol.Protocol.*;
import java.util.*;

/** Authoritative per-room state. RoomService serializes every call, including deadline checks. */
public final class GameSession {
    public final String id = UUID.randomUUID().toString();
    public final List<Question> questions;
    public final EndPolicy endPolicy;
    public final Set<String> participants;
    public final Map<String, Integer> submitted = new LinkedHashMap<>();
    public Phase phase = Phase.STARTING;
    public int index = -1;
    public long questionStartedAt, phaseStartedAt, deadline, answeringStartedAt, endedAt;
    public String finishReason = "";

    public GameSession(int count, Set<String> participants, EndPolicy policy, long now) {
        if(count<1 || count>12) throw new IllegalArgumentException("INVALID_QUESTION_COUNT");
        this.questions=List.copyOf(catalog().subList(0,count));
        this.participants=Set.copyOf(participants); this.endPolicy=policy; phaseStartedAt=now;
    }
    public Question question() { return index < 0 ? null : questions.get(index); }
    public void next(long now) {
        if(phase!=Phase.STARTING && phase!=Phase.RESULTS) throw new IllegalStateException("INVALID_PHASE");
        if(index+1>=questions.size()) { finish("COMPLETED",now); return; }
        index++; questionStartedAt=now; submitted.clear(); deadline=answeringStartedAt=endedAt=0;
        change(Phase.QUESTION_PRESENTATION,now);
    }
    public void beginAnswers(long now) {
        if(phase!=Phase.QUESTION_PRESENTATION) throw new IllegalStateException("INVALID_PHASE");
        answeringStartedAt=now; deadline=now+Protocol.ANSWER_MILLIS; change(Phase.ANSWERING,now);
    }
    public void endAnswers(long now) {
        if(phase!=Phase.ANSWERING) return;
        endedAt=Math.min(now,deadline); change(Phase.REVEALING,endedAt);
    }
    public boolean allSubmitted() { return submitted.keySet().containsAll(participants); }
    public void reveal(long now) {
        if(phase!=Phase.REVEALING || now<endedAt+Protocol.CLOCK_EXIT_MILLIS) throw new IllegalStateException("NOT_READY");
        change(Phase.RESULTS,now);
    }
    public boolean resultHoldComplete(long now) {
        return phase==Phase.RESULTS && now>=phaseStartedAt+Protocol.RESULT_ANIMATION_MILLIS+Protocol.RESULT_HOLD_MILLIS;
    }
    public void finish(String reason, long now) { finishReason=reason; change(Phase.GAME_FINISHED,now); }
    private void change(Phase next, long now) { phase=next; phaseStartedAt=now; }
    public List<Map<String,Object>> results() {
        if(question()==null) return List.of();
        return participants.stream().sorted().map(player -> {
            int selected=submitted.getOrDefault(player,-1);
            return Map.<String,Object>of("playerId",player,"selectedAnswer",selected,
                "isCorrect",selected==question().correctAnswerIndex(),"answeredInTime",selected>=0);
        }).toList();
    }
    private static List<Question> catalog() {
        var source=new DemoQuestionSource(); var list=new ArrayList<Question>();
        for(int i=0;i<source.size();i++) list.add(source.get(i));
        list.add(new Question("sunlight","Какое легендарное существо боится солнечного света?",List.of("Вампир","Скелет","Призрак","Оборотень"),0));
        list.add(new Question("chemical-gold","Какой химический символ обозначает золото?",List.of("Ag","Fe","Au","Cu"),2));
        list.add(new Question("chess-king","Какая шахматная фигура ходит на одну клетку в любом направлении?",List.of("Слон","Ладья","Ферзь","Король"),3));
        list.add(new Question("octopus","Сколько сердец у осьминога?",List.of("Одно","Два","Три","Четыре"),2));
        list.add(new Question("frankenstein","Кто написал роман «Франкенштейн»?",List.of("Мэри Шелли","Брэм Стокер","Джейн Остин","Эмили Бронте"),0));
        list.add(new Question("sound-space","Почему обычный звук не распространяется в вакууме?",List.of("Там слишком холодно","Нет среды для звуковых волн","Свет поглощает звук","Ему мешает гравитация"),1));
        list.add(new Question("triangle","Чему равна сумма внутренних углов треугольника в евклидовой геометрии?",List.of("90 градусов","180 градусов","270 градусов","360 градусов"),1));
        return list;
    }
}
