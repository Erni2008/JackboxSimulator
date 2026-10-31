package com.erni.finalanswer.lastcommand;
import java.util.*;
/** Immediate editing projection only. Answers and progress always come from server snapshots. */
public final class NumberInputPreview {
    private record Edit(String id,String key){}
    private final List<Edit> pending=new ArrayList<>();private String task="",base="",authority="",value="";
    public String value(){return value;}public int count(){return pending.size();}
    public static String edit(String text,String key){if(key.equals("CLEAR"))return "";if(key.equals("DELETE"))return text.isEmpty()?"":text.substring(0,text.length()-1);return key.matches("[0-9-]")&&text.length()<9&&(!key.equals("-")||text.isEmpty())?text+key:text;}
    public void snapshot(String task,String text,String reply,boolean blocked){authority=text;if(!this.task.equals(task)||blocked){this.task=task;pending.clear();base=text;}else if(pending.isEmpty())base=text;else{for(int i=0;i<pending.size();i++)if(pending.get(i).id.equals(reply)){pending.subList(0,i+1).clear();base=text;break;}}rebuild();}
    public void queue(String id,String key){if(id.isEmpty()||pending.size()>=64)return;pending.add(new Edit(id,key));rebuild();}
    public void cancel(){pending.clear();base=authority;rebuild();}
    private void rebuild(){String result=base;for(Edit edit:pending)result=edit(result,edit.key);value=result;}
}
