package com.finalanswer.server.validation;

/**
 * Sound-alike keys for answer matching: what a hurried player types often differs from the verified spelling only in
 * how a sound is written ("dolfin" / dolphin, "sinderella" / cinderella, "triler" / thriller, "щётка" / щетка), or is
 * Russian typed in Latin letters ("shchuka" / щука). {@link #sound} folds those spellings together; {@link #cyrillic}
 * turns common transliteration back into Russian letters.
 */
final class Phonetic {
    private Phonetic(){}
    /** A coarse sound key (Latin or Cyrillic): spelling variants of the same sounds give the same key. */
    static String sound(String key){
        String s=key.toLowerCase(java.util.Locale.ROOT).replace(" ","");
        if(s.matches(".*[\\u0400-\\u04FF].*")){
            s=s.replace('ё','е').replace('й','и').replace('ъ','ь').replace("ь","").replace('э','е').replace("тся","ца").replace("ться","ца");
        }else{
            s=s.replace("ph","f").replace("th","t").replace("ck","k").replace("qu","kw").replace("wh","w").replace("kn","n")
               .replaceAll("c(?=[eiy])","s").replace('c','k').replace('y','i').replace('z','s').replace("ee","i").replace("ea","i").replace("oo","u");
            s=s.replaceAll("h(?![aeiou])","");
        }
        StringBuilder b=new StringBuilder();char prev=0;
        for(char ch:s.toCharArray()){if(ch==prev)continue;b.append(ch);prev=ch;}
        return b.toString();
    }
    private static final String[][] TR={{"shch","щ"},{"sch","щ"},{"yo","ё"},{"yu","ю"},{"ya","я"},{"ye","е"},{"zh","ж"},{"kh","х"},{"ts","ц"},{"ch","ч"},{"sh","ш"},
        {"a","а"},{"b","б"},{"v","в"},{"g","г"},{"d","д"},{"e","е"},{"z","з"},{"i","и"},{"y","ы"},{"k","к"},{"l","л"},{"m","м"},{"n","н"},{"o","о"},{"p","п"},{"r","р"},
        {"s","с"},{"t","т"},{"u","у"},{"f","ф"},{"h","х"},{"c","к"},{"j","й"},{"w","в"},{"x","кс"},{"q","к"},{"'",""}};
    /** Russian typed in Latin letters back to Cyrillic ("shchuka" -> "щука"); null when the key has no Latin letters. */
    static String cyrillic(String key){
        if(!key.matches(".*[a-z].*")||key.matches(".*[\\u0400-\\u04FF].*"))return null;
        StringBuilder b=new StringBuilder();int i=0;
        outer:while(i<key.length()){for(String[] t:TR)if(key.startsWith(t[0],i)){b.append(t[1]);i+=t[0].length();continue outer;}b.append(key.charAt(i));i++;}
        return b.toString();
    }
}
