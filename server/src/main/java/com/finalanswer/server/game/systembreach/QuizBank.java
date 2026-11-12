package com.finalanswer.server.game.systembreach;

import java.util.*;

/** Quick party questions: small arithmetic and everyday facts, always four options, one right. Server-only answers. */
final class QuizBank {
    record Question(String text,List<String> options,String answer){}
    private static final String[][] FACTS={
        {"Какого цвета трава?","Зелёного","Синего","Красного","Жёлтого"},
        {"Какого цвета небо днём?","Голубого","Зелёного","Чёрного","Розового"},
        {"Сколько дней в неделе?","7","5","8","10"},
        {"Сколько месяцев в году?","12","10","11","14"},
        {"Сколько лап у кошки?","4","2","6","8"},
        {"Сколько ног у паука?","8","6","4","10"},
        {"Какое животное мяукает?","Кошка","Собака","Корова","Утка"},
        {"Какое животное лает?","Собака","Кошка","Рыба","Сова"},
        {"Что светит днём?","Солнце","Луна","Фонарь","Звёзды"},
        {"Какого цвета снег?","Белого","Чёрного","Зелёного","Красного"},
        {"Сколько часов в сутках?","24","12","20","48"},
        {"Сколько минут в часе?","60","100","30","90"},
        {"Где живут рыбы?","В воде","На дереве","В песке","В облаках"},
        {"Что пьёт корова?","Воду","Молоко","Сок","Чай"},
        {"Какой фрукт жёлтый и длинный?","Банан","Яблоко","Слива","Вишня"},
        {"Сколько колёс у велосипеда?","2","3","4","1"},
        {"Какого цвета помидор?","Красного","Синего","Белого","Фиолетового"},
        {"Что идёт после понедельника?","Вторник","Среда","Воскресенье","Пятница"},
        {"Какое время года самое холодное?","Зима","Лето","Весна","Осень"},
        {"Сколько пальцев на одной руке?","5","4","6","10"},
        {"Чем дышат люди?","Воздухом","Водой","Песком","Светом"},
        {"Какая птица не летает?","Пингвин","Голубь","Ворона","Орёл"},
        {"Что из этого овощ?","Морковь","Яблоко","Груша","Виноград"},
        {"Сколько углов у треугольника?","3","4","5","2"},
        {"Какого цвета уголь?","Чёрного","Белого","Жёлтого","Голубого"},
        {"Что тяжелее: 1 кг пуха или 1 кг железа?","Одинаково","Железо","Пух","Не знаю"},
        {"Сколько ушей у зайца?","2","4","1","3"},
        {"Какая планета наша?","Земля","Марс","Луна","Солнце"},
    };
    private final Random random;
    QuizBank(Random random){this.random=random;}

    Question next(int difficulty){return random.nextInt(100)<55?math(difficulty):fact();}
    private Question fact(){
        String[] f=FACTS[random.nextInt(FACTS.length)];List<String> options=new ArrayList<>(List.of(f[1],f[2],f[3],f[4]));Collections.shuffle(options,random);
        return new Question(f[0],List.copyOf(options),f[1]);
    }
    private Question math(int difficulty){
        int kind=random.nextInt(difficulty>1?3:2),a,b,r;String op;
        switch(kind){
            case 0->{a=2+random.nextInt(9*difficulty+9);b=2+random.nextInt(9*difficulty+9);r=a+b;op="+";}
            case 1->{a=10+random.nextInt(10*difficulty+10);b=1+random.nextInt(a-1);r=a-b;op="−";}
            default->{a=2+random.nextInt(8);b=2+random.nextInt(8);r=a*b;op="×";}
        }
        Set<Integer> wrong=new LinkedHashSet<>();int[] near={1,-1,2,-2,10,-10,3,-3};
        while(wrong.size()<3){int w=r+near[random.nextInt(near.length)];if(w!=r&&w>=0)wrong.add(w);}
        List<String> options=new ArrayList<>();options.add(String.valueOf(r));for(int w:wrong)options.add(String.valueOf(w));Collections.shuffle(options,random);
        return new Question(a+" "+op+" "+b+" = ?",List.copyOf(options),String.valueOf(r));
    }
}
