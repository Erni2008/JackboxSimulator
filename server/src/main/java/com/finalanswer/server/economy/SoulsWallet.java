package com.finalanswer.server.economy;

import java.util.*;

/**
 * SOULS — the room's in-game currency, separate from quiz score. Server-authoritative and in memory for the room's
 * session (the project has no persistent profiles yet); balances are keyed by player id, so a reconnecting player
 * keeps theirs. Every grant carries a unique reward key, so a duplicated message, a repeated reveal or a retried
 * request can never pay twice. Persistent storage can later implement {@link #restore}/{@link #balances}.
 */
public final class SoulsWallet {
    private final Map<String,Long> balances=new HashMap<>();
    private final Set<String> granted=new HashSet<>();
    private final ArrayDeque<Entry> ledger=new ArrayDeque<>();
    private static final int LEDGER_SIZE=256;
    /** One balance change, for diagnostics and future history views. */
    public record Entry(String playerId,long amount,String reason,String key,long balanceAfter){}

    /**
     * Grants {@code amount} SOULS once per {@code rewardKey}. Mini-games will call this with their own amounts and
     * reasons; none do yet.
     * @return the amount actually granted (0 for a duplicate key or a non-positive amount)
     */
    public synchronized long reward(String playerId,long amount,String reason,String rewardKey){
        Objects.requireNonNull(playerId);Objects.requireNonNull(reason);Objects.requireNonNull(rewardKey);
        if(amount<=0||!granted.add(rewardKey+"|"+playerId))return 0;
        long after=Math.addExact(balance(playerId),amount);balances.put(playerId,after);log(new Entry(playerId,amount,reason,rewardKey,after));return amount;
    }
    /** Future spending: never below zero, once per key. @return true when the SOULS were taken. */
    public synchronized boolean spend(String playerId,long amount,String reason,String spendKey){
        if(amount<=0||balance(playerId)<amount||!granted.add("spend:"+spendKey+"|"+playerId))return false;
        long after=balance(playerId)-amount;balances.put(playerId,after);log(new Entry(playerId,-amount,reason,spendKey,after));return true;
    }
    public synchronized long balance(String playerId){return balances.getOrDefault(playerId,0L);}
    public synchronized Map<String,Long> balances(){return Map.copyOf(balances);}
    /** Hook for a future persistent profile store. */
    public synchronized void restore(String playerId,long balance){if(balance<0)throw new IllegalArgumentException("negative SOULS");balances.put(playerId,balance);}
    public synchronized List<Entry> ledger(){return List.copyOf(ledger);}
    private void log(Entry e){ledger.addLast(e);while(ledger.size()>LEDGER_SIZE)ledger.removeFirst();}
}
