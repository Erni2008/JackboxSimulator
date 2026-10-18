package com.erni.finalanswer.lwjgl3.hosting;

import com.erni.finalanswer.network.HostingAccess.Address;
import java.net.*;
import java.util.*;

/** No interface-name assumption; unsuitable interfaces are excluded, choices remain explicit. */
public final class LanDiscovery {
    private LanDiscovery(){}
    public static List<Address> discover(int port){
        List<Address> result=new ArrayList<>();
        try{
            var interfaces=NetworkInterface.getNetworkInterfaces();if(interfaces==null)return List.of();
            for(var network:Collections.list(interfaces)){
                if(!network.isUp()||network.isLoopback()||network.isVirtual()||network.isPointToPoint())continue;
                String name=(network.getName()+" "+network.getDisplayName()).toLowerCase(Locale.ROOT);
                if(name.matches(".*(docker|veth|vmnet|vbox|utun|tailscale|zerotier|wireguard|vpn|tunnel|bridge).*"))continue;
                for(var address:Collections.list(network.getInetAddresses()))if(address instanceof Inet4Address&&suitable(address))
                    result.add(new Address("http://"+address.getHostAddress()+":"+port,network.getDisplayName()));
            }
        }catch(SocketException|SecurityException ignored){}
        result.sort(Comparator.comparing((Address a)->!privateAddress(URI.create(a.url()).getHost())).thenComparing(Address::url));
        return result.stream().distinct().toList();
    }
    public static boolean suitable(InetAddress address){return address instanceof Inet4Address&&!address.isLoopbackAddress()&&!address.isAnyLocalAddress()&&!address.isLinkLocalAddress()&&!address.isMulticastAddress();}
    private static boolean privateAddress(String host){try{return InetAddress.getByName(host).isSiteLocalAddress();}catch(Exception e){return false;}}
}
