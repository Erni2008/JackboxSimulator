package com.erni.finalanswer.lwjgl3.hosting;

import com.erni.finalanswer.network.HostingAccess;
import com.finalanswer.server.*;
import java.net.*;
import java.net.http.*;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.*;

/** Owns exactly one embedded existing RoomServer, or probes an explicitly external server. */
public final class LocalServerManager implements HostingAccess {
    private final ScheduledExecutorService worker=Executors.newSingleThreadScheduledExecutor(r->{Thread t=new Thread(r,"FinalAnswer-hosting");t.setDaemon(true);return t;});
    private final HttpClient http=HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(2)).build();
    private final String external;
    private final int configuredPort;
    private RoomServer owned;
    private CompletableFuture<String> starting;
    private volatile String api,selected="",status;
    private volatile List<Address> addresses=List.of();
    private boolean closed;
    private final Thread shutdown=new Thread(this::close,"FinalAnswer-owned-server-shutdown");
    public LocalServerManager(int port,String external){
        if(port<0||port>65535)throw new IllegalArgumentException("Invalid local port");
        this.configuredPort=port;this.external=external==null?"":external.replaceAll("/+$","");
        if(!this.external.isEmpty()){
            URI uri=URI.create(this.external);if(!Set.of("http","https").contains(uri.getScheme())||uri.getHost()==null||uri.getUserInfo()!=null||uri.getQuery()!=null||uri.getFragment()!=null)throw new IllegalArgumentException("Invalid external server URL");
        }
        api=this.external.isEmpty()?"http://127.0.0.1:"+port:this.external;status=this.external.isEmpty()?"Local server not started":"External server selected";
        Runtime.getRuntime().addShutdownHook(shutdown);
        worker.scheduleWithFixedDelay(this::monitor,5,5,TimeUnit.SECONDS);
    }
    public static LocalServerManager configured(){
        String url=System.getProperty("finalanswer.server",System.getenv().getOrDefault("FINALANSWER_SERVER_URL",""));
        String mode=System.getProperty("finalanswer.hosting",url.isBlank()?"local":"external");
        if(!Set.of("local","external").contains(mode))throw new IllegalArgumentException("finalanswer.hosting must be local or external");
        if(mode.equals("external")&&url.isBlank())throw new IllegalArgumentException("External hosting requires FINALANSWER_SERVER_URL");
        return new LocalServerManager(Integer.parseInt(System.getProperty("finalanswer.localPort","8080")),mode.equals("local")?"":url);
    }
    @Override public synchronized CompletableFuture<String> ensureReady(){
        if(closed)return CompletableFuture.failedFuture(new IllegalStateException("Hosting has been stopped."));
        if(starting!=null&&!starting.isCompletedExceptionally())return starting;
        starting=new CompletableFuture<>();status="Starting multiplayer server...";
        worker.execute(()->start(starting));return starting;
    }
    private void start(CompletableFuture<String> result){
        RoomServer candidate=null;
        try{
            if(external.isEmpty()){
                // Binding is the only reliable ownership/conflict check. Never reuse an unknown listener.
                candidate=new RoomServer(new ServerConfig("0.0.0.0",configuredPort,"",Set.of(),"",20));
                candidate.start();
                synchronized(this){if(closed)throw new IllegalStateException("Hosting has been stopped.");owned=candidate;api="http://127.0.0.1:"+candidate.port();}
            }
            long deadline=System.nanoTime()+TimeUnit.SECONDS.toNanos(8);
            boolean ready=false;
            do{if(healthy()){ready=true;break;}if(Thread.currentThread().isInterrupted())break;Thread.sleep(120);}while(System.nanoTime()<deadline);
            if(!ready)throw new IllegalStateException("Server did not become ready. Check the configured address and network.");
            refreshAddresses();status=external.isEmpty()?"Local server running · port "+URI.create(api).getPort():"External server ready";result.complete(api);
        }catch(Exception error){
            System.err.println("Final Answer server startup: "+error);
            if(candidate!=null)candidate.close();
            synchronized(this){owned=null;}
            status=external.isEmpty()?"Local server failed. Port "+configuredPort+" may be in use. Change finalanswer.localPort or close the other application yourself.":"External server unavailable. Check its address and network.";
            result.completeExceptionally(new IllegalStateException(status));
        }
    }
    private boolean healthy(){
        try{var response=http.send(HttpRequest.newBuilder(URI.create(api+"/health")).timeout(Duration.ofSeconds(2)).GET().build(),HttpResponse.BodyHandlers.ofString());return response.statusCode()==200&&response.body().contains("\"status\":\"ok\"");}catch(Exception error){return false;}
    }
    private void monitor(){
        synchronized(this){if(closed||starting==null||!starting.isDone()||starting.isCompletedExceptionally())return;}
        if(!healthy()){status="Server unavailable. Connections may have been lost; return to room creation to retry.";synchronized(this){if(owned!=null){owned.close();owned=null;}starting=null;}}
        else refreshAddresses();
    }
    private void refreshAddresses(){
        List<Address> found;
        if(external.isEmpty())found=LanDiscovery.discover(URI.create(api).getPort());
        else{String host=URI.create(external).getHost();found=Set.of("localhost","127.0.0.1","0.0.0.0","::1","[::1]","::","[::]").contains(host)?List.of():List.of(new Address(external,"External server"));}
        addresses=found;if(found.stream().noneMatch(a->a.url().equals(selected)))selected=found.isEmpty()?"":found.getFirst().url();
    }
    @Override public String apiUrl(){return api;}
    @Override public List<Address> addresses(){return addresses;}
    @Override public void select(String url){if(addresses.stream().anyMatch(a->a.url().equals(url)))selected=url;}
    public String selected(){return selected;}
    @Override public void refresh(){if(!worker.isShutdown())worker.execute(this::refreshAddresses);}
    @Override public String diagnostics(){return status+(addresses.isEmpty()?"\nNo phone-reachable address found. Connect to Wi-Fi/Ethernet and refresh.":"\nSame network required. Allow incoming Final Answer connections in the firewall.");}
    @Override public synchronized void close(){
        if(closed)return;closed=true;status="Server stopped";
        if(owned!=null){owned.close();owned=null;}
        if(starting!=null&&!starting.isDone())starting.completeExceptionally(new IllegalStateException("Hosting has been stopped."));
        worker.shutdownNow();http.shutdown();
        if(Thread.currentThread()!=shutdown)try{Runtime.getRuntime().removeShutdownHook(shutdown);}catch(IllegalStateException ignored){}
    }
}
