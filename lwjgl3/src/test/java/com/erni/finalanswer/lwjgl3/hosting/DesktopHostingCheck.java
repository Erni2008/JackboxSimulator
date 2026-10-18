package com.erni.finalanswer.lwjgl3.hosting;

import com.erni.finalanswer.network.ConnectionQr;
import com.google.zxing.*;
import com.google.zxing.common.HybridBinarizer;
import java.net.*;
import java.net.http.*;
import java.time.Duration;
import java.util.concurrent.*;
import java.util.*;

/** Real existing server, isolated ports; no GL or physical-network claims. */
public final class DesktopHostingCheck {
    static void check(boolean value,String message){if(!value)throw new AssertionError(message);}
    static HttpResponse<String> get(HttpClient http,String url)throws Exception{return http.send(HttpRequest.newBuilder(URI.create(url)).timeout(Duration.ofSeconds(3)).GET().build(),HttpResponse.BodyHandlers.ofString());}
    public static void main(String[] args)throws Exception {
        int port;String oldRoom;
        try(HttpClient http=HttpClient.newHttpClient()){
            var local=new LocalServerManager(0,"");
            try{
                var first=local.ensureReady();check(first==local.ensureReady(),"Duplicate startup shares a future");String url=first.get(12,TimeUnit.SECONDS);port=URI.create(url).getPort();check(port>0,"Actual bound port");
                check(get(http,url+"/health").statusCode()==200,"Server readiness");check(local.ensureReady().get().equals(url),"Owned server reused");
                check(get(http,url+"/").body().contains("final-answer-button.js"),"Packaged controller route");check(get(http,url+"/controller-theme.css").statusCode()==200,"Stage 9 styling");check(get(http,url+"/art/ui/buttons/player_count/button_up.png").statusCode()==200,"Shared button asset served");check(get(http,url+"/art/server/src/main/java/RoomServer.java").statusCode()==404,"No filesystem exposure");
                var response=http.send(HttpRequest.newBuilder(URI.create(url+"/rooms")).header("Content-Type","application/x-www-form-urlencoded").POST(HttpRequest.BodyPublishers.ofString("name=DesktopTest&maxPlayers=8")).build(),HttpResponse.BodyHandlers.ofString());
                check(response.statusCode()==200||response.statusCode()==201,"Room created only on ready server");oldRoom=com.google.gson.JsonParser.parseString(response.body()).getAsJsonObject().get("code").getAsString();
                try(var external=new LocalServerManager(0,url)){external.ensureReady().get(12,TimeUnit.SECONDS);external.close();check(get(http,url+"/health").statusCode()==200,"External server never stopped by a client");}
                try(var conflict=new LocalServerManager(port,"")){try{conflict.ensureReady().get(12,TimeUnit.SECONDS);throw new AssertionError("Port conflict must fail");}catch(ExecutionException expected){check(expected.getCause().getMessage().contains("Port"),"Readable conflict message");}check(get(http,url+"/health").statusCode()==200,"Occupied server left untouched");}
                for(var address:local.addresses())check(!address.url().contains("0.0.0.0")&&!address.url().contains("127.0.0.1"),"Phone address cannot be wildcard/loopback");
            }finally{local.close();local.close();}
            try(ServerSocket released=new ServerSocket()){released.setReuseAddress(true);released.bind(new InetSocketAddress("0.0.0.0",port));}
            try(var restarted=new LocalServerManager(port,"")){String url=restarted.ensureReady().get(12,TimeUnit.SECONDS);check(get(http,url+"/rooms/"+oldRoom).statusCode()==404,"No false restart persistence");}
            try(ServerSocket unrelated=new ServerSocket(0)){try(var conflict=new LocalServerManager(unrelated.getLocalPort(),"")){try{conflict.ensureReady().get(12,TimeUnit.SECONDS);throw new AssertionError("Unrelated listener must not be adopted");}catch(ExecutionException expected){}check(!unrelated.isClosed(),"Unrelated process untouched");}}
            try(var external=new LocalServerManager(0,"http://127.0.0.1:1")){try{external.ensureReady().get(12,TimeUnit.SECONDS);throw new AssertionError("Unavailable external should fail");}catch(ExecutionException expected){}}
            try(var monitored=new LocalServerManager(0,"")){
                monitored.ensureReady().get(12,TimeUnit.SECONDS);var field=LocalServerManager.class.getDeclaredField("owned");field.setAccessible(true);((com.finalanswer.server.RoomServer)field.get(monitored)).close();
                Thread.sleep(5600);check(monitored.diagnostics().contains("unavailable"),"Unexpected termination is detected");check(get(http,monitored.ensureReady().get(12,TimeUnit.SECONDS)+"/health").statusCode()==200,"Stopped owned server can restart");
            }
            for(int i=0;i<4;i++){var cancelled=new LocalServerManager(0,"");cancelled.ensureReady();cancelled.close();}
        }
        for(String address:List.of("127.0.0.1","0.0.0.0","169.254.1.2","224.0.0.1","::1"))check(!LanDiscovery.suitable(InetAddress.getByName(address)),"Exclude inappropriate address");check(LanDiscovery.suitable(InetAddress.getByName("192.168.1.4")),"Accept LAN IPv4");
        for(int size:new int[]{126,252,336}){
            String url="http://192.168.1.42:18347/?room=ABCDEF";var matrix=ConnectionQr.encode(url,size);int[] pixels=new int[size*size];for(int y=0;y<size;y++)for(int x=0;x<size;x++)pixels[y*size+x]=matrix.get(x,y)?0xff000000:0xffffffff;
            var decoded=new MultiFormatReader().decode(new BinaryBitmap(new HybridBinarizer(new RGBLuminanceSource(size,size,pixels))));check(url.equals(decoded.getText()),"QR exact URL decodes at "+size);
        }
        System.out.println("PASS: async/reused server, health, room/static routes, owned shutdown, conflict isolation, external mode, restart/cleanup, LAN filtering and QR decoding");
    }
}
