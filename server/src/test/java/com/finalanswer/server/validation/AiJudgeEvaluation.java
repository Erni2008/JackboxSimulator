package com.finalanswer.server.validation;

import java.time.Duration;
import java.util.*;

/**
 * Accuracy check of the optional AI judge against a labelled set of answers that are NOT in the verified data.
 * Needs a running llama-server (see docs/think-or-die/AI_PACK.md):
 *
 *   ./gradlew :server:aiJudgeEval -Pai.url=http://127.0.0.1:18431
 *
 * Prints false accepts (wrong answer judged VALID — the costly error), false rejects, uncertain share and latency.
 */
public final class AiJudgeEvaluation {
    record Case(String category,String lang,String answer,boolean valid){}
    /** Labelled cases from /think_or_die/ai_eval.tsv (category, lang, answer, 1 or 0). */
    /** "@id<TAB>English question<TAB>Russian question[<TAB>criteria]": a category that is not in the pack (no lists), to test unseen questions. */
    static final Map<String,Category> EXTRA=new LinkedHashMap<>();
    static final List<Case> CASES=load();
    static List<Case> load(){
        try(var in=AiJudgeEvaluation.class.getResourceAsStream(System.getProperty("ai.set","/think_or_die/ai_eval.tsv"))){
            List<Case> out=new ArrayList<>();
            for(String line:new String(in.readAllBytes(),java.nio.charset.StandardCharsets.UTF_8).split("\\R")){
                if(line.isBlank()||line.startsWith("#"))continue;String[] f=line.split("\t");
                if(line.startsWith("@")){EXTRA.put(f[0].substring(1),new Category(f[0].substring(1),1,Category.Type.KNOWLEDGE,"unseen",f[1],f[2],f.length>3?f[3]:null,null,null,List.of(),List.of(),true,false));continue;}
                out.add(new Case(f[0],f[1],f[2],f[3].trim().equals("1")));}
            return out;
        }catch(Exception e){throw new IllegalStateException("ai_eval.tsv unreadable",e);}
    }

    public static void main(String[] a) throws Exception{
        String url=System.getProperty("ai.url","http://127.0.0.1:18431");
        var judge=new LlamaCppJudge(url,"qwen3-4b-instruct-2507-q4_k_m",Duration.ofSeconds(60));
        var pack=CategoryPack.load();
        if(Boolean.getBoolean("ai.engine")){engineMode(judge,pack);return;}
        int fa=0,fr=0,unc=0,ok=0;long worst=0,total=0;
        Map<String,List<Case>> by=new LinkedHashMap<>();for(Case c:CASES){String k0=c.category()+"|"+c.lang();int part=0;while(by.getOrDefault(k0+"|"+part,List.of()).size()>=Integer.getInteger("ai.batch",12))part++;by.computeIfAbsent(k0+"|"+part,k->new ArrayList<>()).add(c);} // round-sized batches
        for(var e:by.entrySet()){var cs=e.getValue();Category cat=pack.get(cs.get(0).category());if(cat==null)cat=EXTRA.get(cs.get(0).category());
            List<AiJudge.Item> items=new ArrayList<>();for(int i=0;i<cs.size();i++)items.add(new AiJudge.Item("a"+i,cs.get(i).answer()));
            long t0=System.nanoTime();var res=judge.judge(cat,cs.get(0).lang(),items,new ArrayList<>(new VerifiedAnswers().canonicalIds(cat)));long ms=(System.nanoTime()-t0)/1_000_000;
            worst=Math.max(worst,ms);total+=ms;
            for(int i=0;i<cs.size();i++){Case c=cs.get(i);var v=res.get(i).verdict();String mark;
                if(v==ValidationStatus.UNCERTAIN){unc++;mark="?";}
                else if((v==ValidationStatus.VALID)==c.valid()){ok++;mark="ok";}
                else if(v==ValidationStatus.VALID){fa++;mark="FALSE ACCEPT";}else{fr++;mark="false reject";}
                System.out.printf("%-16s %-3s %-55s %-9s %s%n",c.category(),c.lang(),c.answer(),v,mark);}
            System.out.println("   batch of "+cs.size()+": "+ms+" ms");}
        int n=CASES.size();
        System.out.printf("%nRESULT: %d cases, correct %d (%.0f%%), false accepts %d (%.1f%%), false rejects %d (%.1f%%), uncertain %d (%.0f%%); batch latency avg %d ms, worst %d ms%n",
            n,ok,100.0*ok/n,fa,100.0*fa/n,fr,100.0*fr/n,unc,100.0*unc/n,total/by.size(),worst);
    }
    /** Whole system as in a game: non-answers, lists, rules, typos first; only the rest goes to the AI. */
    static void engineMode(LlamaCppJudge judge,CategoryPack pack) throws Exception{
        judge.tune(4,120_000);var engine=new ValidationEngine(new WordDictionary(),ValidationCache.NONE,judge);
        int ok=0,fa=0,fr=0,byList=0,byAi=0,vote=0;
        for(Case c:CASES){Category cat=pack.get(c.category());if(cat==null)cat=EXTRA.get(c.category());AnswerInput in=AnswerInput.of(c.answer());
            Verdict v=in==null?Verdict.invalid(Verdict.Source.KNOWN_INVALID):engine.validate(cat,in);
            if(v.status()==ValidationStatus.PENDING){byAi++;v=engine.judgeLater(cat,c.lang(),in).get(60,java.util.concurrent.TimeUnit.SECONDS);}else byList++;
            boolean valid=v.status()==ValidationStatus.VALID;
            if(v.status()==ValidationStatus.UNCERTAIN){vote++;System.out.println("to vote       "+c.category()+"  "+c.answer()+"  (expected "+(c.valid()?"valid":"wrong")+")");continue;}
            if(valid==c.valid())ok++;else if(valid){fa++;System.out.println("FALSE ACCEPT  "+c.category()+"  "+c.answer()+"  ("+v.source()+")");}else{fr++;System.out.println("false reject  "+c.category()+"  "+c.answer()+"  ("+v.source()+")");}}
        int n=CASES.size();
        System.out.printf("%nSYSTEM: %d cases (%d decided without AI, %d by AI): correct %d (%.1f%%), false accepts %d, false rejects %d, to players' vote %d; never wrong %.1f%%%n",n,byList,byAi,ok,100.0*ok/n,fa,fr,vote,100.0*(ok+vote)/n);
        engine.close();System.exit(0);
    }
}
