package com.finalanswer.server.game.rareminds;

/**
 * Rarity = the estimated share of players who give an answer.
 * <ul><li>While a question has fewer than {@link #MIN_SAMPLE} real recorded answers, the share is the curated starting
 * estimate from the bank ({@code popularity / Σ popularity}) — a handful of games never decides rarity.</li>
 * <li>From {@link #MIN_SAMPLE} answers on, rarity comes <b>only from the game's own statistics</b>:
 * {@code p = (count + 1) / (total + answers)} (add-one smoothing, so an answer nobody has given yet is rare but finite).</li></ul>
 * Only valid answers are ever scored; validity is decided elsewhere.
 */
public final class Rarity {
    /** Real recorded answers a question needs before its rarity comes only from the game's statistics. */
    public static final int MIN_SAMPLE=200;

    public enum Tier {
        COMMON(100,"COMMON","ОБЫЧНЫЙ",.060),
        RARE(300,"RARE","РЕДКИЙ",.025),
        EPIC(600,"EPIC","ЭПИЧЕСКИЙ",.008),
        LEGENDARY(1000,"LEGENDARY","ЛЕГЕНДАРНЫЙ",0);
        public final int souls;public final String en,ru;final double minShare;
        Tier(int souls,String en,String ru,double minShare){this.souls=souls;this.en=en;this.ru=ru;this.minShare=minShare;}
        /** RISK IT clears a collision only at EPIC or above. */
        public boolean deep(){return ordinal()>=EPIC.ordinal();}
    }
    /** @param score −ln(p) in micro-units: higher is rarer; integer so comparisons are exact and repeatable */
    public record Estimate(Tier tier,double share,long score){}

    private Rarity(){}

    public static Estimate estimate(RareQuestion q,String answerId,RarityStats stats){
        var a=q.answer(answerId);if(a==null)throw new IllegalArgumentException("unknown answer "+answerId);
        double prior=a.popularity()/(double)q.popularityTotal();
        long total=stats.total(q.id());
        double p=total<MIN_SAMPLE?prior:(stats.count(q.id(),answerId)+1.0)/(total+q.answers().size());
        p=Math.max(1e-9,Math.min(1,p));
        return new Estimate(tierOf(p),p,Math.round(-Math.log(p)*1_000_000));
    }
    public static Tier tierOf(double share){for(Tier t:Tier.values())if(share>=t.minShare)return t;return Tier.LEGENDARY;}
}
