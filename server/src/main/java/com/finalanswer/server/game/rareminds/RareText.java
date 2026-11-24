package com.finalanswer.server.game.rareminds;

import java.text.Normalizer;
import java.util.Locale;

/**
 * RARE MINDS text rules. {@link #clean} is what a player may submit (shown back on screens); {@link #key} is the
 * comparison form every alias and every typed answer is reduced to before validation and collision checks.
 */
public final class RareText {
    /** Longest answer a phone may send; longer input is rejected, never truncated silently. */
    public static final int MAX_ANSWER=40;
    private RareText(){}

    /** Display form: Unicode NFC, control characters removed, whitespace collapsed, trimmed. Null for unusable input. */
    public static String clean(String raw){
        if(raw==null)return null;
        String s=Normalizer.normalize(raw,Normalizer.Form.NFKC);
        StringBuilder b=new StringBuilder(s.length());boolean space=false;
        for(int i=0;i<s.length();){
            int cp=s.codePointAt(i);i+=Character.charCount(cp);
            if(Character.isWhitespace(cp)||Character.isSpaceChar(cp)){space=b.length()>0;continue;}
            if(Character.isISOControl(cp)||Character.getType(cp)==Character.FORMAT||Character.getType(cp)==Character.PRIVATE_USE||Character.getType(cp)==Character.SURROGATE)continue;
            if(space){b.append(' ');space=false;}
            b.appendCodePoint(cp);
        }
        return b.toString();
    }

    /**
     * Comparison key: lower case, ё→е, Latin diacritics stripped (é→e), apostrophes, hyphens, dots and other
     * punctuation dropped (only + and # survive, for C++ / C#), spaces removed. "Tyrannosaurus Rex", "tyrannosaurus-rex" and "TYRANNOSAURUS  REX" share a key.
     */
    public static String key(String raw){
        String s=clean(raw);if(s==null)return "";
        s=s.toLowerCase(Locale.ROOT).replace('ё','е');
        // strip combining marks (accents) but keep Cyrillic й as one letter: recompose it after decomposition
        String d=Normalizer.normalize(s,Normalizer.Form.NFD);
        StringBuilder b=new StringBuilder(d.length());
        for(int i=0;i<d.length();i++){
            char c=d.charAt(i);
            if(Character.getType(c)==Character.NON_SPACING_MARK){
                if(c=='̆'&&b.length()>0&&(b.charAt(b.length()-1)=='и'))b.setCharAt(b.length()-1,'й');
                continue;
            }
            if(Character.isLetterOrDigit(c)||c=='+'||c=='#')b.append(c); // C++, C#, F# stay distinct from C
        }
        return b.toString();
    }

    /** Restricted Damerau–Levenshtein (adjacent swaps count as one edit), stopped early beyond {@code limit}. */
    public static int distance(String a,String b,int limit){
        int n=a.length(),m=b.length();if(Math.abs(n-m)>limit)return limit+1;
        int[][] d=new int[n+1][m+1];
        for(int i=0;i<=n;i++)d[i][0]=i;for(int j=0;j<=m;j++)d[0][j]=j;
        for(int i=1;i<=n;i++){int best=Integer.MAX_VALUE;
            for(int j=1;j<=m;j++){
                int cost=a.charAt(i-1)==b.charAt(j-1)?0:1;
                int v=Math.min(Math.min(d[i-1][j]+1,d[i][j-1]+1),d[i-1][j-1]+cost);
                if(i>1&&j>1&&a.charAt(i-1)==b.charAt(j-2)&&a.charAt(i-2)==b.charAt(j-1))v=Math.min(v,d[i-2][j-2]+1);
                d[i][j]=v;best=Math.min(best,v);
            }
            if(best>limit)return limit+1;
        }
        return d[n][m];
    }
}
