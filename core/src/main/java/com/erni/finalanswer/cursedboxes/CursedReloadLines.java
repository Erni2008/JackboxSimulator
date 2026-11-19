package com.erni.finalanswer.cursedboxes;

import com.erni.finalanswer.localization.Localization;

import java.util.function.Predicate;

/** What the host says (and shows) while refilling the shotgun mid-turn. Character jokes only when that character is hidden and alive. */
public final class CursedReloadLines {
    public record Line(String text,String voice,CursedCharacterType needs){}
    public static final Line[] LINES={
        line(1,Localization.tr("Патроны кончились. Терпение — нет.", "Out of ammo. Not out of patience."),null),
        line(2,Localization.tr("Патроны по акции брал. Три по цене пяти.", "Got the ammo on sale. Three for the price of five."),null),
        line(3,Localization.tr("Зомби, не высовывайся! У тебя и так голова еле держится.", "Zombie, keep your head down! It's barely hanging on as it is."),CursedCharacterType.ZOMBIE),
        line(4,Localization.tr("Тыква, я вижу твою улыбку сквозь доски. Перестань светиться!", "Pumpkin, I can see your grin through the boards. Stop glowing!"),CursedCharacterType.PUMPKIN),
        line(5,Localization.tr("Дракула, не кусай ящик изнутри, это аренда!", "Dracula, stop biting the box from the inside, it's a rental!"),CursedCharacterType.DRACULA)};
    private static Line line(int n,String text,CursedCharacterType needs){return new Line(text,String.format("cursed_boxes/voice/reload_%02d.ogg",n),needs);}
    private final java.util.Random random;private final boolean[] spent=new boolean[LINES.length];private int last=-1;
    public CursedReloadLines(long seed){random=new java.util.Random(seed);}
    /** A fresh line: every eligible line once before any repeats, never the same twice in a row. */
    public Line next(Predicate<CursedCharacterType> alive){
        int[] pool=new int[LINES.length];int n=0;
        for(int pass=0;pass<2&&n==0;pass++){if(pass==1)java.util.Arrays.fill(spent,false);
            for(int i=0;i<LINES.length;i++)if(!spent[i]&&i!=last&&(LINES[i].needs()==null||alive.test(LINES[i].needs())))pool[n++]=i;}
        if(n==0)return LINES[0];
        int pick=pool[random.nextInt(n)];spent[pick]=true;last=pick;return LINES[pick];
    }
}
