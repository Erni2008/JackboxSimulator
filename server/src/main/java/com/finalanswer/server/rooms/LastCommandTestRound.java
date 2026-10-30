package com.finalanswer.server.rooms;

import java.util.*;

/** Explicit development puzzles, not the final set of twenty tasks. Rules execute only on Java. */
final class LastCommandTestRound {
    final String attemptId=UUID.randomUUID().toString();
    final String scenario,code,animal,symbol,light,lever; final int angle,button;
    final List<String> signals; final long startedAt,deadline;long inputAt,signalStartedAt,finishedAt;String finishReason="";int replays; final int round;
    int step,mistakes; String status="PLAYING",feedback="Тестовый сценарий начат";
    LastCommandTestRound(long seed,int round,String scenario,long now){
        if(!Set.of("mechanisms","memory","inspection").contains(scenario))throw new IllegalArgumentException();
        signalStartedAt=now;this.scenario=scenario;this.round=round;startedAt=now;deadline=now+180_000;
        Random rng=new Random(seed+round*104729L);code=String.format(Locale.ROOT,"%04d",rng.nextInt(10000));
        animal=List.of("CAT","OWL","WOLF","DEER").get(rng.nextInt(4));symbol=List.of("SUN","MOON","STAR","KEY").get(rng.nextInt(4));
        light=List.of("RED","GREEN","YELLOW","BLUE").get(rng.nextInt(4));lever=rng.nextBoolean()?"DOWN":"MIDDLE";angle=(1+rng.nextInt(3))*45;button=1+rng.nextInt(4);
        List<String> pattern=new ArrayList<>();for(int i=0;i<4;i++)pattern.add("SMALL_BUTTON_"+(1+rng.nextInt(4)));signals=List.copyOf(pattern);inputAt=now+signals.size()*850+500;
    }
    boolean timeout(long now){if(status.equals("PLAYING")&&now>=deadline){finish("LOST","TIMEOUT",deadline);feedback="Время вышло";return true;}return false;}
    void action(String element,String action,String value,Map<String,Object> panel,long now){
        timeout(now);if(!status.equals("PLAYING")||action.equals("RELEASE"))return;
        if(scenario.equals("inspection")){
            step=inspectionScore(panel);
            if(element.equals("BIG_BUTTON")&&action.equals("PRESS")){if(step==7){finish("WON","COMPLETED",now);feedback="Аварийный протокол восстановлен";}else wrong(now);}
            else feedback="Узлы восстановлены: "+step+" / 7";
            return;
        }
        if(scenario.equals("memory")){
            if(!element.startsWith("SMALL_BUTTON_")||!action.equals("PRESS"))return;
            if(now<inputAt){feedback="Дождитесь завершения показа";return;}
            if(element.equals(signals.get(step))){step++;feedback="Верно";if(step==signals.size())finish("WON","COMPLETED",now);}
            else {step=0;wrong(now);}return;
        }
        if(step==0||step==1){
            if(element.equals("BIG_BUTTON")&&action.equals("PRESS")){
                boolean correct=step==0?lever.equals(panel.get("lever")):Objects.equals(angle,panel.get("adjuster"));
                if(correct){step++;feedback="Положение подтверждено";}else wrong(now);
            }else if(element.equals(step==0?"LEVER_MODULE":"ADJUSTER"))feedback="Установите нужное положение и подтвердите красной кнопкой";
            return;
        }
        String expected=switch(step){case 0->"LEVER_MODULE";case 1->"ADJUSTER";case 2->"HIDDEN_HATCH";case 3->"BIG_BUTTON";case 4->"ANIMAL_PANEL";case 5->"SYMBOL_PANEL";case 6->"LIGHT_MODULE";case 7->"SMALL_BUTTON_"+button;default->"BIG_BUTTON";};
        if(!element.equals(expected))return;
        boolean correct=switch(step){case 0->value.equals(lever);case 1->value.equals(""+angle);case 2->value.equals("OPEN");case 3->action.equals("PRESS")&&code.equals(panel.get("code"));case 4->value.equals(animal);case 5->value.equals(symbol);case 6->value.equals(light);default->action.equals("PRESS");};
        if(correct){step++;feedback="Верно";if(step==9){finish("WON","COMPLETED",now);feedback="Проверка всех механизмов завершена";}}else if(action.equals("SET")){feedback="Продолжайте переключение до нужного положения";}else wrong(now);
    }
    boolean replay(long now){if(now>=deadline){timeout(now);return false;}if(!scenario.equals("memory")||!status.equals("PLAYING")||now<inputAt||replays>=2)return false;replays++;step=0;signalStartedAt=now;inputAt=now+signals.size()*850+500;feedback="Повтор сигнала "+replays+" / 2";return true;}
    private int inspectionScore(Map<String,Object> panel){int score=0;if(lever.equals(panel.get("lever")))score++;if(Objects.equals(angle,panel.get("adjuster")))score++;if(Boolean.TRUE.equals(panel.get("hatch")))score++;if(code.equals(panel.get("code")))score++;if(animal.equals(panel.get("animal")))score++;if(symbol.equals(panel.get("symbol")))score++;if(light.equals(panel.get("light")))score++;return score;}
    private List<Map<String,Object>> checklist(Map<String,Object> panel){return List.of(
        objective("Рычаг",lever,lever.equals(panel.get("lever"))),objective("Регулятор",angle+"°",Objects.equals(angle,panel.get("adjuster"))),objective("Секретный люк","Открыт",Boolean.TRUE.equals(panel.get("hatch"))),objective("Код","Из люка",code.equals(panel.get("code"))),objective("Животное",animal,animal.equals(panel.get("animal"))),objective("Символ",symbol,symbol.equals(panel.get("symbol"))),objective("Индикатор",light,light.equals(panel.get("light"))));}
    private Map<String,Object> objective(String label,String value,boolean complete){return Map.of("label",label,"value",value,"complete",complete);}
    private void wrong(long now){mistakes++;feedback="Неверное действие. Осталось попыток: "+(3-mistakes);if(mistakes>=3)finish("LOST","MISTAKES",now);}
    private void finish(String status,String reason,long now){if(!this.status.equals("PLAYING"))return;this.status=status;finishReason=reason;finishedAt=now;}
    Map<String,Object> snapshot(long now){return snapshot(now,Map.of());}
    Map<String,Object> snapshot(long now,Map<String,Object> panel){
        timeout(now);String instruction;
        if(!status.equals("PLAYING"))instruction=status.equals("WON")?"Тест пройден":"Тест не пройден";
        else if(scenario.equals("memory"))instruction=now<inputAt?"Запомните сигналы индикатора (панель также сзади)":"Повторите последовательность четырьмя цветными кнопками";
        else if(scenario.equals("inspection"))instruction="Восстановите все узлы по протоколу. Подтвердите большой кнопкой.";
        else instruction=switch(step){case 0->"Установите рычаг: "+lever+" / подтвердите красной кнопкой";case 1->"Установите регулятор: "+angle+"° / подтвердите красной кнопкой";case 2->"Найдите и откройте секретный люк";case 3->"Введите код из люка и нажмите большую кнопку";case 4->"На задней панели выберите животное: "+animal;case 5->"На задней панели выберите символ: "+symbol;case 6->"Переключите индикатор на "+light;case 7->"Нажмите маленькую кнопку №"+button;default->"Нажмите большую кнопку для завершения";};
        Map<String,Object> r=new LinkedHashMap<>();r.put("attemptId",attemptId);r.put("testScenario",true);r.put("scenario",scenario);r.put("round",round);r.put("status",status);r.put("instruction",instruction);r.put("step",step);r.put("steps",scenario.equals("memory")?4:scenario.equals("inspection")?7:9);r.put("mistakes",mistakes);r.put("feedback",feedback);r.put("startedAt",startedAt);r.put("finishedAt",finishedAt);r.put("finishReason",finishReason);r.put("elapsedMs",Math.max(0,(status.equals("PLAYING")?now:finishedAt)-startedAt));r.put("deadline",deadline);r.put("inputAt",inputAt);r.put("signalStartedAt",signalStartedAt);r.put("replays",replays);r.put("canReplay",scenario.equals("memory")&&replays<2&&now>=inputAt&&status.equals("PLAYING"));if(scenario.equals("inspection"))r.put("objectives",checklist(panel));r.put("focusId",scenario.equals("memory")?(now<inputAt?"LIGHT_MODULE":"BIG_BUTTON"):scenario.equals("inspection")?(Boolean.TRUE.equals(panel.get("hatch"))?"BIG_BUTTON":"HIDDEN_HATCH"):switch(step){case 0->"LEVER_MODULE";case 1->"ADJUSTER";case 2->"HIDDEN_HATCH";case 3->"CODE_PANEL";case 4->"ANIMAL_PANEL";case 5->"SYMBOL_PANEL";case 6->"LIGHT_MODULE";default->"BIG_BUTTON";});r.put("signals",scenario.equals("memory")?signals:List.of());return r;
    }
}
