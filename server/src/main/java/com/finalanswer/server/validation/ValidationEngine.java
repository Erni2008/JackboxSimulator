package com.finalanswer.server.validation;

import java.util.*;
import java.util.concurrent.*;

/**
 * Final Answer Validation Engine — reusable by any mode that accepts free text.
 *
 * <pre>
 * raw → sanitize/normalize ({@link AnswerInput}) → known wrong answers → verified aliases → non-answers ("не знаю", "idk") → category rule
 *     → conservative typo → AI cache → [optional AI judge, asynchronous] → fallback
 * </pre>
 * The fallback never treats an unknown answer as wrong unless the category is exhaustive: it becomes UNCERTAIN, and
 * the caller resolves it with a vote. Personal duplicates and originality are the caller's job (they need the round).
 *
 * <p>{@link #validate} is synchronous, deterministic and allocation-light (safe on a network thread).
 * {@link #judgeLater} queues PENDING answers for the AI judge on a background thread: identical requests share one
 * future, requests are batched per category, every batch has a timeout, and any failure resolves as UNCERTAIN.
 */
public final class ValidationEngine implements AutoCloseable {
    private final List<ValidationStep> steps;private final VerifiedAnswers verified;
    private final ValidationCache cache;private final AiJudge ai;
    private final ScheduledExecutorService worker;
    private final Map<String,CompletableFuture<Verdict>> inflight=new ConcurrentHashMap<>();
    private final Map<String,List<Waiting>> batches=new HashMap<>();
    private record Waiting(Category category,String lang,AnswerInput input,CompletableFuture<Verdict> future){}
    static final long BATCH_DELAY_MS=60;static final int BATCH_MAX=16;static final long AI_HARD_TIMEOUT_MS=15_000;

    public ValidationEngine(WordDictionary dictionary,ValidationCache cache,AiJudge ai){
        verified=new VerifiedAnswers();this.cache=cache==null?ValidationCache.NONE:cache;this.ai=ai;
        steps=List.of(verified.knownInvalid(),verified.exact(),NonAnswers.STEP,RuleSteps.words(dictionary),RuleSteps.numbers(),verified.typo(),this::cached);
        worker=ai==null?null:Executors.newSingleThreadScheduledExecutor(r->{Thread t=new Thread(r,"validation-ai");t.setDaemon(true);return t;});
    }
    /** Deterministic engine without AI or cache (tests, tools). */
    public static ValidationEngine deterministic(WordDictionary d){return new ValidationEngine(d,ValidationCache.NONE,null);}
    public boolean aiAvailable(){return ai!=null;}

    /** @return VALID / INVALID / UNCERTAIN, or PENDING when the AI judge should be asked ({@link #judgeLater}). */
    public Verdict validate(Category c,AnswerInput in){
        // a knowledge category with a letter-count rule ("an animal with exactly five letters"): a Latin answer of the wrong length is wrong at once
        if(c.type()==Category.Type.KNOWLEDGE&&c.rule()!=null&&"LENGTH".equals(c.rule().kind())){String k=in.key().replace(" ","");
            if(!k.isEmpty()&&k.matches("[a-z]+")&&k.length()!=c.rule().n())return Verdict.invalid(Verdict.Source.RULE);}
        for(ValidationStep s:steps){Verdict v=s.check(c,in);if(v!=null)return v;}
        if(c.exhaustive())return Verdict.invalid(Verdict.Source.FALLBACK);
        return ai!=null&&c.allowUnknown()?Verdict.pending():Verdict.uncertain(Verdict.Source.FALLBACK);
    }
    private Verdict cached(Category c,AnswerInput in){
        if(ai==null)return null;var e=cache.get(c.id(),c.version(),in.key(),ai.modelVersion());if(e==null)return null;
        return e.status()==ValidationStatus.VALID?Verdict.valid(e.canonicalId(),Verdict.Source.CACHE):Verdict.invalid(Verdict.Source.CACHE);
    }

    /** Queue a PENDING answer for the AI judge; completes with VALID, INVALID or UNCERTAIN (never exceptionally). */
    public CompletableFuture<Verdict> judgeLater(Category c,String lang,AnswerInput in){
        if(ai==null)return CompletableFuture.completedFuture(Verdict.uncertain(Verdict.Source.FALLBACK));
        String id=c.id()+"#"+c.version()+"\u0000"+in.key();
        return inflight.computeIfAbsent(id,k->{
            CompletableFuture<Verdict> f=new CompletableFuture<>();
            synchronized(batches){List<Waiting> b=batches.computeIfAbsent(c.id(),x->new ArrayList<>());b.add(new Waiting(c,lang,in,f));
                if(b.size()==1)worker.schedule(()->flush(c.id()),BATCH_DELAY_MS,TimeUnit.MILLISECONDS);
                else if(b.size()>=BATCH_MAX)worker.execute(()->flush(c.id()));}
            f.whenComplete((v,t)->inflight.remove(k));
            return f;});
    }
    private void flush(String categoryId){
        List<Waiting> b;synchronized(batches){b=batches.remove(categoryId);}
        if(b==null||b.isEmpty())return;
        Category c=b.get(0).category();
        Set<String> known=verified.canonicalIds(c);List<String> ids=new ArrayList<>(known);
        // non-blocking: every answer is its own queued request, so one slow category never holds up another room
        for(int i=0;i<b.size();i++){Waiting w=b.get(i);
            CompletableFuture<AiJudge.Result> f;
            try{f=ai.judgeOne(c,w.lang(),new AiJudge.Item("a"+i,w.input().clean()),ids);}catch(RuntimeException e){f=CompletableFuture.failedFuture(e);}
            f.orTimeout(AI_HARD_TIMEOUT_MS,TimeUnit.MILLISECONDS).whenComplete((r,e)->{
                if(e!=null){System.err.println("[validation] AI judge failed for one answer: "+e);w.future().complete(Verdict.uncertain(Verdict.Source.FALLBACK));return;}
                Verdict v=reconcile(r,w.input(),known);
                if(v.status()!=ValidationStatus.UNCERTAIN)cache.put(new ValidationCache.Entry(c.id(),c.version(),w.input().key(),v.status(),v.canonicalId(),ai.modelVersion(),System.currentTimeMillis(),"AI"));
                w.future().complete(v);});}
    }
    /**
     * An AI canonical id may only MERGE an answer into a verified concept. Otherwise the id is derived from the
     * player's own normalized text, so the model can never split two identical answers to dodge duplicate detection.
     */
    static Verdict reconcile(AiJudge.Result r,AnswerInput in,Set<String> knownIds){
        if(r==null)return Verdict.uncertain(Verdict.Source.FALLBACK);
        return switch(r.verdict()){
            case VALID->Verdict.valid(r.canonicalAnswer()!=null&&knownIds.contains(r.canonicalAnswer())?r.canonicalAnswer():"ai:"+in.key(),Verdict.Source.AI);
            case INVALID->Verdict.invalid(Verdict.Source.AI);
            default->Verdict.uncertain(Verdict.Source.AI);
        };
    }
    @Override public void close(){if(worker!=null)worker.shutdownNow();}
}
