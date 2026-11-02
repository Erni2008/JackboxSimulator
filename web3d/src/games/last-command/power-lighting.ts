import * as T from 'three';
const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;
/** Rejection stutter: relative lamp level per 55 ms step. */
const FLICKER=[1,.15,.9,.1,.7,.25,1,.6];
type PowerMode='idle'|'observe'|'accepted'|'error'|'paused'|'won';
/**
 * Power lamps and local spill. Short envelopes follow server events; otherwise steady (no perpetual animation).
 * Glow is local, not a fullscreen bloom pass: wide additive sprites track lamp power, so it costs a few quads and keeps
 * the direct render's colour pipeline (a composer re-tone-maps unlit CRT/background and needed per-material fixes).
 */
export class PowerLighting {
 readonly group=new T.Group();readonly lampColor={value:new T.Color(0xffc58b)};readonly lampPower={value:2.1};
 readonly lights:T.PointLight[]=[];readonly halos:T.Sprite[]=[];readonly glows:T.Sprite[]=[];readonly pilot:T.Mesh<T.SphereGeometry,T.MeshBasicMaterial>;readonly texture:T.CanvasTexture;
 mode:PowerMode='idle';private key='';private disposed=false;
 constructor(parent:T.Group,quality:string){
  this.group.name='terminal-power-lighting';parent.add(this.group);
  const canvas=document.createElement('canvas');canvas.width=canvas.height=64;const ctx=canvas.getContext('2d')!,g=ctx.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,.45)');g.addColorStop(.3,'rgba(255,255,255,.18)');g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.fillRect(0,0,64,64);this.texture=new T.CanvasTexture(canvas);
  for(const x of [-.264,.253]){
   const halo=new T.Sprite(new T.SpriteMaterial({map:this.texture,color:0xffc58b,transparent:true,opacity:.38,blending:T.AdditiveBlending,depthWrite:false,depthTest:true,toneMapped:false}));halo.position.set(x,.493,.185);halo.scale.set(.070,.165,1);halo.raycast=()=>{};this.group.add(halo);this.halos.push(halo);
   // Wide, faint bloom lobe around each tube; follows the same envelopes as the lamp.
   const glow=new T.Sprite(new T.SpriteMaterial({map:this.texture,color:0xffc58b,transparent:true,opacity:.3,blending:T.AdditiveBlending,depthWrite:false,depthTest:true,toneMapped:false}));glow.position.set(x,.493,.19);glow.scale.set(.27,.44,1);glow.raycast=()=>{};this.group.add(glow);this.glows.push(glow);
   if(quality!=='LOW'){const light=new T.PointLight(0xffc58b,.03,.55,2);light.position.set(x,.49,.27);light.castShadow=false;this.group.add(light);this.lights.push(light);}
  }
  this.pilot=new T.Mesh(new T.SphereGeometry(.0025,8,6),new T.MeshBasicMaterial({color:0x9bdbc1,toneMapped:false}));this.pilot.position.set(.078,.645,.153);this.pilot.raycast=()=>{};this.group.add(this.pilot);
  const pilotHalo=new T.Sprite(new T.SpriteMaterial({map:this.texture,color:0x9bdbc1,transparent:true,opacity:.55,blending:T.AdditiveBlending,depthWrite:false,depthTest:true,toneMapped:false}));pilotHalo.position.copy(this.pilot.position);pilotHalo.position.z+=.001;pilotHalo.scale.set(.022,.022,1);pilotHalo.raycast=()=>{};this.group.add(pilotHalo);this.halos.push(pilotHalo);this.update(undefined,0);
 }
 /** Unit envelope of the machine's response to authoritative events; 0 = steady. Exposed for the warning lamp and body jolt. */
 alarm=0;
 update(round:any,now:number){
  const observing=round?.status==='PLAYING'&&round?.signals?.length&&now<round.inputAt;
  const mode:PowerMode=round?.status==='WON'?'won':round?.status==='LOST'?'error':round?.paused&&round?.status==='PLAYING'?'paused':observing?'observe':round?.nextAt>now&&round?.feedback==='COMMAND ACCEPTED'?'accepted':round?.nextAt>now&&round?.feedback==='WRONG COMMAND'?'error':'idle';
  this.mode=mode;
  const color=mode==='accepted'||mode==='won'?0x9bdfb8:mode==='error'?0xff7650:0xffc58b;let level=mode==='observe'?.22:mode==='paused'?.4:mode==='won'?1.05:1,alarm=0;
  if(!REDUCED){
   const verdict=now-((round?.nextAt||0)-700);
   if(mode==='accepted')level*=verdict<70?1+.9*verdict/70:1+.9*Math.exp(-(verdict-70)/180);
   else if(mode==='error'&&round?.status!=='LOST'){const step=Math.floor(verdict/55);level*=step<FLICKER.length?FLICKER[step]:.85;alarm=step<FLICKER.length?1-FLICKER[step]*.6:0;}
   else if(mode==='won'){const t=now-(round.finishedAt||now);alarm=t<3000?Math.max(0,Math.sin(t*.006)):0;level=t<250?.12:.75+.45*alarm;}
   else if(mode==='idle'&&round?.status==='PLAYING'){
    // Module swap draws current: a short brown-out ending just after the task becomes interactive.
    const swap=(now-((round.readyAt||0)-220))/340;if(swap>=0&&swap<1)level*=.35+.65*swap*swap*(3-2*swap);
    if((round.localScore||0)>=15)level*=.9+.1*Math.sin(now*.0025);
   }
  }
  const key=`${mode}|${level.toFixed(3)}|${alarm.toFixed(2)}`;if(key===this.key)return false;this.key=key;this.alarm=alarm;
  this.lampColor.value.set(mode==='won'&&alarm>.5?0xff6a45:color);this.lampPower.value=2.1*level;this.pilot.material.color.set(mode==='error'?0xff7650:mode==='paused'?0xd9ad62:0x9bdbc1);
  for(let i=0;i<this.halos.length;i++){const m=this.halos[i].material as T.SpriteMaterial;m.color.copy(i===2?this.pilot.material.color:this.lampColor.value);m.opacity=Math.min(1,(i===2?.55:.38)*level);}
  for(const glow of this.glows){const m=glow.material as T.SpriteMaterial;m.color.copy(this.lampColor.value);m.opacity=Math.min(.75,.3*level*level);}
  for(const light of this.lights){light.color.copy(this.lampColor.value);light.intensity=.03*level;}return true;
 }
 dispose(){if(this.disposed)return;this.disposed=true;this.group.removeFromParent();this.pilot.geometry.dispose();this.pilot.material.dispose();for(const halo of [...this.halos,...this.glows])(halo.material as T.SpriteMaterial).dispose();for(const light of this.lights)light.dispose();this.texture.dispose();this.group.clear();}
}
