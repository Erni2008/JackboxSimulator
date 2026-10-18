package com.erni.finalanswer.network;

import java.util.List;
import java.util.concurrent.CompletableFuture;

/** Platform boundary. Core never imports or starts a server implementation. */
public interface HostingAccess extends AutoCloseable {
    record Address(String url,String label) { @Override public String toString(){return label+" — "+url;} }
    CompletableFuture<String> ensureReady();
    String apiUrl();
    default List<Address> addresses(){return List.of();}
    default void select(String url){}
    default void refresh(){}
    default String diagnostics(){return "External server: "+apiUrl();}
    @Override default void close(){}
    static HostingAccess external(String url){return new HostingAccess(){
        public CompletableFuture<String> ensureReady(){return CompletableFuture.completedFuture(url);}
        public String apiUrl(){return url;}
        public List<Address> addresses(){
            var uri=java.net.URI.create(url);
            return java.util.Set.of("localhost","127.0.0.1","0.0.0.0","::1","[::1]","::","[::]").contains(uri.getHost())?List.of():List.of(new Address(url,"External server"));
        }
    };}
}
