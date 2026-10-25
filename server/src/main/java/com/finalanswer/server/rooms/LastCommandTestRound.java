package com.finalanswer.server.rooms;

import java.util.*;

/** Explicit development puzzles, not the final set of twenty tasks. Rules execute only on Java. */
final class LastCommandTestRound {
    final String scenario,code,animal,symbol,light,lever; final int angle,button;
    final List<String> signals; final long startedAt,deadline,inputAt; final int round;
    int step,mistakes; String status="PLAYING",feedback="Тестовый сценарий начат";
    LastCommandTestRound(long seed,int round,String scenario,long now){
        if(!Set.of("mechanisms","memory").contains(scenario))throw new IllegalArgumentException();
        this.scenario=scenario;this.round=round;startedAt=now;deadline=now+180_000;
        Random rng=new Random(seed+round*104729L);code=String.format(Locale.ROOT,"%04d",rng.nextInt(10000));
        animal=List.of("CAT","OWL","WOLF","DEER").get(rng.nextInt(4));symbol=List.of("SUN","MOON","STAR","KEY").get(rng.nextInt(4));
        light=List.of("RED","GREEN","YELLOW","BLUE").get(rng.nextInt(4));lever=rng.nextBoolean()?"DOWN":"MIDDLE";angle=(1+rng.nextInt(3))*45;button=1+rng.nextInt(4);
        List<String> pattern=new ArrayList<>();for(int i=0;i<4;i++)pattern.add("SMALL_BUTTON_"+(1+rng.nextInt(4)));signals=List.copyOf(pattern);inputAt=now+signals.size()*850+500;
    }
    boolean timeout(long now){if(status.equals("PLAYING")&&now>=deadline){status="LOST";feedback="Время вышло";return true;}return false;}
    void action(String element,String action,String value,Map<String,Object> panel,long now){
        timeout(now);if(!status.equals("PLAYING")||action.equals("RELEASE"))return;
        if(scenario.equals("memory")){
            if(!element.startsWith("SMALL_BUTTON_")||!action.equals("PRESS"))return;
            if(now<inputAt){feedback="Дождитесь завершения показа";return;}
            if(element.equals(signals.get(step))){step++;feedback="Верно";if(step==signals.size())status="WON";}
            else {step=0;wrong();}return;
        }
        String expected=switch(step){case 0->"LEVER_MODULE";case 1->"ADJUSTER";case 2->"HIDDEN_HATCH";case 3->"BIG_BUTTON";case 4->"ANIMAL_PANEL";case 5->"SYMBOL_PANEL";case 6->"LIGHT_MODULE";case 7->"SMALL_BUTTON_"+button;default->"BIG_BUTTON";};
        if(!element.equals(expected))return;
        boolean correct=switch(step){case 0->value.equals(lever);case 1->value.equals(""+angle);case 2->value.equals("OPEN");case 3->action.equals("PRESS")&&code.equals(panel.get("code"));case 4->value.equals(animal);case 5->value.equals(symbol);case 6->value.equals(light);default->action.equals("PRESS");};
        if(correct){step++;feedback="Верно";if(step==9){status="WON";feedback="Проверка всех механизмов завершена";}}else if(action.equals("SET")){feedback="Продолжайте переключение до нужного положения";}else wrong();
    }
    private void wrong(){mistakes++;feedback="Неверное действие. Осталось попыток: "+(3-mistakes);if(mistakes>=3)status="LOST";}
    Map<String,Object> snapshot(long now){
        timeout(now);String instruction;
        if(!status.equals("PLAYING"))instruction=status.equals("WON")?"Тест пройден":"Тест не пройден";
        else if(scenario.equals("memory"))instruction=now<inputAt?"Запомните сигналы индикатора (панель также сзади)":"Повторите последовательность четырьмя цветными кнопками";
        else instruction=switch(step){case 0->"Установите рычаг: "+lever;case 1->"Установите регулятор: "+angle+"°";case 2->"Найдите и откройте секретный люк";case 3->"Введите код из люка и нажмите большую кнопку";case 4->"На задней панели выберите животное: "+animal;case 5->"На задней панели выберите символ: "+symbol;case 6->"Переключите индикатор на "+light;case 7->"Нажмите маленькую кнопку №"+button;default->"Нажмите большую кнопку для завершения";};
        Map<String,Object> r=new LinkedHashMap<>();r.put("testScenario",true);r.put("scenario",scenario);r.put("round",round);r.put("status",status);r.put("instruction",instruction);r.put("step",step);r.put("steps",scenario.equals("memory")?4:9);r.put("mistakes",mistakes);r.put("feedback",feedback);r.put("startedAt",startedAt);r.put("deadline",deadline);r.put("inputAt",inputAt);r.put("signals",scenario.equals("memory")?signals:List.of());return r;
    }
}
