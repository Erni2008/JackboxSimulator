package com.finalanswer.server.game.rareminds;

/**
 * Hybrid rarity. The estimated share of players who give an answer is
 * <pre>  p = (observed + K · prior) / (total + K)        prior = popularity / Σ popularity</pre>
 * Two safeguards keep a handful of games from swinging the tiers: below {@link #MIN_SAMPLE} recorded answers for a
 * question only the curated prior counts, and after that the prior still weighs as K pseudo-answers, so real
 * frequencies take over gradually as answers accumulate. Only valid answers are ever scored, and an answer nobody has
 * given yet still gets its curated prior — it is never "maximally rare" just for being unseen.
 */
public final class Rarity {
    /** Pseudo-count of the prior: the number of real answers it takes for live data to weigh as much as the bank. */
    public static final int K=200;
    /** Recorded answers a question needs before live statistics are used at all. */
    public static final int MIN_SAMPLE=30;

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
        double p=total<MIN_SAMPLE?prior:(stats.count(q.id(),answerId)+K*prior)/(total+K);
        p=Math.max(1e-9,Math.min(1,p));
        return new Estimate(tierOf(p),p,Math.round(-Math.log(p)*1_000_000));
    }
    public static Tier tierOf(double share){for(Tier t:Tier.values())if(share>=t.minShare)return t;return Tier.LEGENDARY;}
}
