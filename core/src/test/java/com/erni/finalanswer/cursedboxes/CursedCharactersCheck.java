package com.erni.finalanswer.cursedboxes;

import javax.imageio.ImageIO;
import java.nio.file.*;
import java.util.*;

/** Native-free validation of the actual artwork and the same fitting/alpha code used by loading. */
public final class CursedCharactersCheck {
    private static void check(boolean ok,String message){if(!ok)throw new AssertionError(message);}
    public static void main(String[] args)throws Exception{
        Path assets=Path.of(args[0]);var types=CursedCharacterType.values();
        check(types.length==8,"Exactly eight identities");Set<String> paths=new HashSet<>();
        for(var type:types){
            check(paths.add(type.path),"Exactly one unique PNG per identity");Path path=assets.resolve(type.path);
            check(Files.isRegularFile(path),type.diagnostic("missing required asset"));
            try{type.requireAsset(false);throw new AssertionError("Missing asset not rejected");}
            catch(IllegalStateException expected){check(expected.getMessage().contains(type.name())&&expected.getMessage().contains(type.path),"Missing asset diagnostic");}
            var image=ImageIO.read(path.toFile());check(image!=null,type.diagnostic("cannot decode PNG"));
            check(image.getColorModel().hasAlpha(),type.diagnostic("missing alpha channel"));
            var info=CursedCharacterImage.inspect(type,image.getWidth(),image.getHeight(),(x,y)->image.getRGB(x,y)>>>24);
            for(float desired:new float[]{.5f,1.18f,3f}){
                var fit=CursedCharacterFit.calculate(type,info.width(),info.height(),desired);
                check(Math.abs(fit.width()/fit.height()-info.width()/(float)info.height())<.00001,"Preserve PNG proportions: "+type);
                double angle=Math.toRadians(CursedCharacterFit.MAX_ROLL),c=Math.cos(angle),s=Math.sin(angle);
                double width=(fit.width()*c+fit.height()*s)*(1+CursedCharacterFit.BREATH)+.01;
                double height=(fit.height()*c+fit.width()*s)*(1+CursedCharacterFit.BREATH)+2*(CursedCharacterFit.HOVER+Math.abs(fit.centerY()));
                check(width<=1.82&&height<=1.24001,"Animated silhouette exceeds compartment: "+type);
            }
            System.out.printf("%s: %dx%d, enclosed %s hole %d pixels at %.3f, %.3f%n",type,info.width(),info.height(),type==CursedCharacterType.VOODOO?"head":"torso",info.holePixels(),info.holeX(),info.holeY());
            // External alpha is not a hole; opaque/checkerboard backgrounds cannot pass this test.
            try{CursedCharacterImage.inspect(type,64,64,(x,y)->x>10&&x<54&&y>10&&y<54?255:0);throw new AssertionError("Accepted exterior-only alpha");}
            catch(IllegalArgumentException expected){check(expected.getMessage().contains(type.path),"Diagnostic includes exact path");}
            try{CursedCharacterImage.inspect(type,64,64,(x,y)->255);throw new AssertionError("Accepted opaque PNG");}
            catch(IllegalArgumentException expected){check(expected.getMessage().contains(type.name()),"Diagnostic includes identity");}
        }
        Set<CursedCharacterType> assigned=EnumSet.noneOf(CursedCharacterType.class);
        for(long seed=-8;seed<16;seed++){
            int occupied=0;
            for(int slot=0;slot<16;slot++){
                var type=CursedCharacterAssignment.at(slot,5,seed);
                if(type!=null){occupied++;assigned.add(type);check(slot==5,"Preserve occupied box");}
                check(type==CursedCharacterAssignment.at(slot,5,seed),"Deterministic scenario");
            }
            check(occupied==1,"Preserve empty boxes/outcomes");
        }
        check(assigned.size()==8,"Every identity available in normal scenarios");
        var distribution=new CursedCharacterTestLayout(0);var duplicate=new CursedCharacterTestLayout(0);int previousFirst=-1;
        for(int reset=0;reset<20;reset++){
            distribution.next();duplicate.next();Set<Integer> testSlots=new HashSet<>();
            var developerTurn=new CursedBoxesTurn("character-test",9);
            for(int i=0;i<9;i++){
                int slot=distribution.slot(i);check(slot==duplicate.slot(i),"Seeded test distribution");
                check(slot>=0&&slot<16&&testSlots.add(slot),"Eight separate occupants plus one empty target");
                check(developerTurn.select(slot)&&developerTurn.begin(),"Developer shot "+i);
                check(!developerTurn.select(slot)&&!developerTurn.begin(),"No overlap in developer mode");
                developerTurn.complete();check(!developerTurn.select(slot),"One shot per developer box");
            }
            check(distribution.slot(0)!=previousFirst,"Explicit reset generates a new distribution");previousFirst=distribution.slot(0);
            check(developerTurn.ended()&&developerTurn.shotsRemaining()==0&&!developerTurn.select(1)&&!developerTurn.begin(),"Tenth developer shot rejected");
            developerTurn.reset();check(developerTurn.shotsRemaining()==9,"Developer reset restores nine cartridges");
        }
        CursedBoxesTurnCheck.main(new String[0]);
        System.out.println("PASS: eight real PNGs, alpha/internal holes, bounded proportional fitting, diagnostics, deterministic assignments, eight separate named test slots + empty ninth shot, unchanged normal two-shot rules");
    }
}
