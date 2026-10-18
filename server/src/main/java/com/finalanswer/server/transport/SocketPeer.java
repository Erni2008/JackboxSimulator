package com.finalanswer.server.transport;

import org.eclipse.jetty.websocket.api.*;
import java.util.*;

/** Bounded sequential async writes: slow phones never block the room registry. */
public final class SocketPeer implements Peer {
    private final String id,ip;
    private final Session session;
    private final ArrayDeque<String> queue=new ArrayDeque<>();
    private boolean sending,closed;
    public volatile boolean authenticated;
    public final long connectedAt=System.nanoTime();
    public SocketPeer(String id,String ip,Session session){this.id=id;this.ip=ip;this.session=session;}
    @Override public String id(){return id;}
    public String ip(){return ip;}
    @Override public synchronized void send(String message) {
        if(closed)return;
        if(queue.size()>=64){close(4003,"SLOW_CONNECTION");return;}
        queue.add(message); if(!sending)write();
    }
    private synchronized void write() {
        if(closed||queue.isEmpty()){sending=false;return;}
        sending=true;
        session.sendText(queue.peek(),Callback.from(()->{
            synchronized(this){queue.poll();write();}
        },error->close(1011,"CONNECTION_LOST")));
    }
    @Override public synchronized void close(int code,String reason) {
        if(closed)return;closed=true;queue.clear();session.close(code,reason,Callback.NOOP);
    }
}
