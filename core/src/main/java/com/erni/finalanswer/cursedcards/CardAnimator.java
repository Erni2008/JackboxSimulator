package com.erni.finalanswer.cursedcards;

import com.badlogic.gdx.math.*;
import com.badlogic.gdx.utils.Array;
import com.erni.finalanswer.cursedcards.CardMotion.Ease;

/**
 * Reusable, frame-rate independent card choreography (DEAL, FLIP, MOVE, RETURN, SHUFFLE) built from
 * {@link CardMotion} legs. Every factory only queues legs; {@link #update} advances them by delta time.
 */
public final class CardAnimator {
    /** Machine-side poses the DEAL leg passes through, in world space. */
    public static final class DealPath {
        public final CardPose feed=new CardPose(),inside=new CardPose(),outside=new CardPose();
    }
    public static final float THICKNESS_GAP=1.15f;
    private final CardPose tmp=new CardPose();

    public void update(Array<Card3D> cards,float dt){
        for(Card3D card:cards){float left=dt;
            while(left>=0&&!card.queue.isEmpty()){float rest=card.queue.peekFirst().step(card,left);if(rest<0)break;card.queue.pollFirst();left=rest;if(rest==0)break;}
            card.sync();}
    }
    public boolean busy(Array<Card3D> cards){for(Card3D c:cards)if(c.busy())return true;return false;}
    public void stop(Card3D card){card.queue.clear();}

    /** Cards above this height are on the machine's platform; moves to/from it arc high enough to clear the front panel. */
    public static float platformHeight=.3f;
    /** DEAL: the bottom card is drawn back under the stack into the machine, accelerates out of the slot, arcs to the player and settles. */
    public float deal(Card3D card,DealPath path,CardPose destination,float delay,Runnable onDispense,Runnable onLanded){return deal(card,path,destination,delay,0,onDispense,onLanded);}
    /** @param minArc lowest allowed apex above the straight path (e.g. to clear the machine for seats behind it). */
    public float deal(Card3D card,DealPath path,CardPose destination,float delay,float minArc,Runnable onDispense,Runnable onLanded){
        card.queue.add(CardMotion.to(path.feed,.34f,Ease.SMOOTH).delay(delay));
        card.queue.add(CardMotion.to(path.inside,0,Ease.LINEAR).visible(false));
        card.queue.add(CardMotion.to(path.inside,.08f,Ease.LINEAR).visible(true));
        card.queue.add(CardMotion.to(path.outside,.38f,Ease.ACCELERATE).onStart(onDispense));
        float distance=path.outside.position.dst(destination.position);
        tmp.set(destination);tmp.position.y+=.018f;
        card.queue.add(CardMotion.to(tmp,.62f+.25f*distance,Ease.DECELERATE).arc(Math.max(minArc,.16f+.12f*distance)).lift(-12).wobble(8));
        card.queue.add(CardMotion.to(destination,.22f,Ease.DECELERATE).onEnd(onLanded));
        return delay+.34f+.08f+.38f+.62f+.25f*distance+.22f;
    }
    /** FLIP: lift, turn 180 degrees about the long axis, settle in place. */
    public float flip(Card3D card,float delay){
        tmp.set(card.queue.isEmpty()?card.pose:card.queue.peekLast().target);float baseY=tmp.position.y;tmp.roll+=180;tmp.position.y+=.012f;
        card.queue.add(CardMotion.to(tmp,.6f,Ease.SMOOTH).arc(.1f).lift(-6).delay(delay));
        tmp.position.y=baseY;card.queue.add(CardMotion.to(tmp,.18f,Ease.DECELERATE));
        return delay+.78f;
    }
    /** MOVE: smooth arc between two resting positions. */
    public float move(Card3D card,CardPose target,float duration,float delay){
        CardPose from=card.queue.isEmpty()?card.pose:card.queue.peekLast().target;float distance=from.position.dst(target.position);
        boolean platform=(from.position.y>platformHeight)!=(target.position.y>platformHeight);
        card.queue.add(CardMotion.to(target,duration,Ease.SMOOTH).arc(platform?.55f:Math.min(.3f,.12f*distance+.02f)).delay(delay));return delay+duration;
    }
    /** RETURN: lift away, glide back to a designated position (deck, discard, owner) and drop into it. */
    public float returnTo(Card3D card,CardPose target,float delay){
        tmp.set(target);tmp.position.y+=.05f;
        float t=move(card,tmp,.75f,delay);card.queue.add(CardMotion.to(target,.22f,Ease.DECELERATE));return t+.22f;
    }
    /**
     * SHUFFLE: gather into a stack at {@code centre}, split into two halves, riffle them back together.
     * Cards are re-stacked in their array order; callers shuffle values/order beforehand.
     */
    public float shuffle(Array<Card3D> cards,CardPose centre,float thickness,float delay){
        float t=delay,step=thickness*THICKNESS_GAP;int n=cards.size;
        for(int i=0;i<n;i++){tmp.set(centre);tmp.position.y+=i*step;move(cards.get(i),tmp,.7f,t+i*.05f);}
        t+=.7f+n*.05f+.08f;
        Vector3 right=new Vector3(MathUtils.cosDeg(centre.yaw),0,-MathUtils.sinDeg(centre.yaw));
        for(int i=0;i<n;i++){boolean left=i%2==0;tmp.set(centre);tmp.position.mulAdd(right,(left?-1:1)*.42f);tmp.position.y+=(i/2)*step;tmp.yaw+=left?12:-12;
            cards.get(i).queue.add(CardMotion.to(tmp,.36f,Ease.SMOOTH).arc(.05f).delay(Math.max(0,t-endOf(cards.get(i)))));}
        t+=.36f+.12f;
        for(int i=0;i<n;i++){tmp.set(centre);tmp.position.y+=i*step;
            cards.get(i).queue.add(CardMotion.to(tmp,.22f,Ease.DECELERATE).arc(.03f).lift(-6).delay(Math.max(0,t+i*.07f-endOf(cards.get(i)))));}
        return t+n*.07f+.22f;
    }
    /** Time at which the card's currently queued legs end, measured from now. */
    private static float endOf(Card3D card){float sum=0;for(CardMotion m:card.queue)sum+=Math.max(0,m.delay)+Math.max(0,m.duration-m.elapsed);return sum;}
}
