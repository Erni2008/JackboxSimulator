package com.erni.finalanswer.lwjgl3.hosting;

import java.nio.file.*;
import java.util.Locale;

/** Bundled resources stay read-only; preferences/logs use a per-user directory. */
public final class DesktopPaths {
    private DesktopPaths(){}
    public static Path dataDirectory(){
        String override=System.getProperty("finalanswer.dataDir");if(override!=null&&!override.isBlank())return Path.of(override).toAbsolutePath();
        Path home=Path.of(System.getProperty("user.home"));String os=System.getProperty("os.name").toLowerCase(Locale.ROOT);
        if(os.contains("mac"))return home.resolve("Library").resolve("Application Support").resolve("FinalAnswer");
        if(os.contains("win")){String local=System.getenv("LOCALAPPDATA");return (local==null?home.resolve("AppData").resolve("Local"):Path.of(local)).resolve("FinalAnswer");}
        String xdg=System.getenv("XDG_DATA_HOME");return (xdg==null?home.resolve(".local").resolve("share"):Path.of(xdg)).resolve("FinalAnswer");
    }
    public static void logging(){
        if(!Boolean.getBoolean("finalanswer.logToFile"))return;
        try{
            Path directory=dataDirectory().resolve("logs");Files.createDirectories(directory);
            Path log=directory.resolve("desktop.log");if(Files.exists(log)&&Files.size(log)>4*1024*1024)Files.move(log,directory.resolve("desktop.previous.log"),StandardCopyOption.REPLACE_EXISTING);
            var stream=new java.io.PrintStream(Files.newOutputStream(log,StandardOpenOption.CREATE,StandardOpenOption.APPEND),true,java.nio.charset.StandardCharsets.UTF_8);
            System.setErr(stream);System.setOut(stream);
        }catch(java.io.IOException failure){System.err.println("Cannot open application log: "+failure.getMessage());}
    }
}
