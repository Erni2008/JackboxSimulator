package com.finalanswer.server.validation;

import java.time.Duration;
import java.util.*;
import java.util.concurrent.*;

/**
 * Burst load on the AI judge through the real engine: every labelled answer of ai_eval.tsv is submitted at the same
 * instant (as if dozens of rooms ended a round together), with no cache. Prints latency percentiles and how many
 * answers were dropped by the admission queue. Needs a running llama-server:
 *
 *   ./gradlew :server:aiJudgeLoad [-Pai.slots=4] [-Pai.queueMs=6000]
 */
public final class AiJudgeLoadTest {
    public static void main(String[] a) throws Exception{
        var judge=new LlamaCppJudge(System.getProperty("ai.url","http://127.0.0.1:18431"),"qwen3-4b-instruct-2507-q4_k_m",Duration.ofSeconds(10));
        judge.tune(Integer.getInteger("ai.slots",4),Long.getLong("ai.queueMs",6000L));
        var engine=new ValidationEngine(new WordDictionary(),ValidationCache.NONE,judge);var pack=CategoryPack.load();
        List<CompletableFuture<Long>> fs=new ArrayList<>();long t0=System.nanoTime();int sent=0;
        for(var c:AiJudgeEvaluation.CASES){Category cat=pack.get(c.category());AnswerInput in=AnswerInput.of(c.answer());if(in==null)continue;
            Verdict v=engine.validate(cat,in);if(v.status()!=ValidationStatus.PENDING)continue;sent++;
            fs.add(engine.judgeLater(cat,c.lang(),in).thenApply(x->x.status()==ValidationStatus.UNCERTAIN?-1L:(System.nanoTime()-t0)/1_000_000));}
        List<Long> ok=new ArrayList<>();int dropped=0;
        for(var f:fs){long ms=f.get(30,TimeUnit.SECONDS);if(ms<0)dropped++;else ok.add(ms);}
        Collections.sort(ok);long wall=(System.nanoTime()-t0)/1_000_000;
        System.out.printf("burst of %d answers at once: judged %d, dropped by the queue %d (%.0f%%); latency p50 %d ms, p95 %d ms, max %d ms; throughput %.1f answers/s%n%s%n",
            sent,ok.size(),dropped,100.0*dropped/Math.max(1,sent),ok.isEmpty()?0:ok.get(ok.size()/2),ok.isEmpty()?0:ok.get((int)(ok.size()*.95)),ok.isEmpty()?0:ok.get(ok.size()-1),
            ok.size()*1000.0/Math.max(1,ok.isEmpty()?wall:ok.get(ok.size()-1)),judge.stats());
        engine.close();System.exit(0);
    }
}
