package com.finalanswer.server;

import java.net.URI;
import java.util.*;

public record ServerConfig(String host,int port,String publicUrl,Set<String> origins,String trustedProxy,int maxRooms) {
    public ServerConfig {
        if(host==null || host.isBlank() || port<0 || port>65535 || maxRooms<1 || maxRooms>10000)
            throw new IllegalArgumentException("Invalid server host, port or room limit");
        origins=Set.copyOf(origins);
    }
    public static ServerConfig load(String[] args) {
        String host=value("server.host","SERVER_HOST","0.0.0.0");
        int port=Integer.parseInt(args.length>0?args[0]:value("server.port","SERVER_PORT","8080"));
        String url=value("server.publicUrl","SERVER_PUBLIC_URL","").replaceAll("/+$","");
        if(!url.isEmpty()) {
            URI uri=URI.create(url);
            if(!Set.of("http","https").contains(uri.getScheme()) || uri.getHost()==null || uri.getUserInfo()!=null) throw new IllegalArgumentException("Invalid server.publicUrl");
        }
        if(value("server.environment","SERVER_ENV","development").equals("production") && !url.startsWith("https://"))
            throw new IllegalArgumentException("Production requires an https server.publicUrl behind a TLS proxy");
        Set<String> origins=new HashSet<>();
        if(!url.isEmpty()) origins.add(origin(url));
        for(String item:value("server.allowedOrigins","SERVER_ALLOWED_ORIGINS","").split(",")) if(!item.isBlank()) origins.add(origin(item.strip()));
        return new ServerConfig(host,port,url,Set.copyOf(origins),value("server.trustedProxy","SERVER_TRUSTED_PROXY",""),
            Integer.parseInt(value("server.maxRooms","SERVER_MAX_ROOMS","1000")));
    }
    public boolean allowsOrigin(String origin,String hostHeader) {
        if(origin==null) return true; // Native host has no browser Origin; it still needs a private token.
        if(origins.contains(origin)) return true;
        if(!origins.isEmpty()) return false;
        return origin.equals("http://"+hostHeader)||origin.equals("https://"+hostHeader);
    }
    private static String origin(String url) {URI uri=URI.create(url);return uri.getScheme()+"://"+uri.getRawAuthority();}
    private static String value(String property,String env,String fallback) {return System.getProperty(property,System.getenv().getOrDefault(env,fallback));}
}
