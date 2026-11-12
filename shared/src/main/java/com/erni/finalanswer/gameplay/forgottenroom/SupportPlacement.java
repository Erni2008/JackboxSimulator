package com.erni.finalanswer.gameplay.forgottenroom;

import java.util.*;

/** Closest supported base centre inside a convex horizontal support polygon. */
public final class SupportPlacement {
    private SupportPlacement(){}
    public record Fit(float x,float z,float scale){}
    public static Fit fit(float[][] support,float x,float z,float minX,float maxX,float minZ,float maxZ){
        if(support==null||support.length<3)return new Fit(x,z,1);
        float area=0;for(int i=0;i<support.length;i++){float[] a=support[i],b=support[(i+1)%support.length];area+=a[0]*b[1]-b[0]*a[1];}
        float sign=area>=0?1:-1;
        for(float scale=1;scale>=.29f;scale-=.04f){
            List<float[]> poly=new ArrayList<>();for(float[] p:support)poly.add(p.clone());
            for(int i=0;i<support.length&&!poly.isEmpty();i++){
                float[] a=support[i],b=support[(i+1)%support.length];float nx=-(b[1]-a[1])*sign,nz=(b[0]-a[0])*sign;
                float extent=Math.min(nx*minX,nx*maxX)*scale+Math.min(nz*minZ,nz*maxZ)*scale;
                float boundary=nx*a[0]+nz*a[1]-extent+.001f*(float)Math.hypot(nx,nz);
                List<float[]> clipped=new ArrayList<>();
                for(int j=0;j<poly.size();j++){
                    float[] p=poly.get(j),q=poly.get((j+1)%poly.size());float dp=nx*p[0]+nz*p[1]-boundary,dq=nx*q[0]+nz*q[1]-boundary;
                    if(dp>=0)clipped.add(p);
                    if((dp>=0)!=(dq>=0)){float t=dp/(dp-dq);clipped.add(new float[]{p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t});}
                }
                poly=clipped;
            }
            if(poly.isEmpty())continue;
            boolean inside=true;float winding=0;
            for(int i=0;i<poly.size();i++){float[] a=poly.get(i),b=poly.get((i+1)%poly.size());float cross=(b[0]-a[0])*(z-a[1])-(b[1]-a[1])*(x-a[0]);if(Math.abs(cross)>.00001f){if(winding==0)winding=Math.signum(cross);else if(cross*winding<0)inside=false;}}
            if(inside)return new Fit(x,z,scale);
            float best=Float.POSITIVE_INFINITY,bx=x,bz=z;
            for(int i=0;i<poly.size();i++){float[] a=poly.get(i),b=poly.get((i+1)%poly.size());float dx=b[0]-a[0],dz=b[1]-a[1],len=dx*dx+dz*dz;float t=len==0?0:Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/len));float px=a[0]+dx*t,pz=a[1]+dz*t,d=(px-x)*(px-x)+(pz-z)*(pz-z);if(d<best){best=d;bx=px;bz=pz;}}
            return new Fit(bx,bz,scale);
        }
        throw new IllegalArgumentException("Object base cannot fit support");
    }
}
