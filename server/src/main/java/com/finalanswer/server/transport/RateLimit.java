package com.finalanswer.server.transport;

import java.util.*;

/** Bounded token buckets. Monotonic clock; old IPs cannot grow the registry forever. */
public final class RateLimit {
    private final Map<String,Bucket> entries=new HashMap<>();
    public synchronized boolean allow(String key,int capacity,double perSecond) {
        long now=System.nanoTime();
        if(entries.size()>10000) entries.entrySet().removeIf(e->now-e.getValue().last>120_000_000_000L);
        if(entries.size()>10000&&!entries.containsKey(key)) return false;
        Bucket b=entries.computeIfAbsent(key,k->new Bucket(capacity,now));
        b.tokens=Math.min(capacity,b.tokens+(now-b.last)/1e9*perSecond); b.last=now;
        if(b.tokens<1) return false; b.tokens--; return true;
    }
    private static final class Bucket {double tokens;long last;Bucket(double tokens,long last){this.tokens=tokens;this.last=last;}}
}
