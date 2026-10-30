import * as T from 'three';
export type MechanismState='HIDDEN'|'APPEARING'|'ACTIVE'|'DISAPPEARING'|'DISABLED';
/** Reusable mounts: deployment is separate from the mechanism's own press/rotation animation. */
export class Mechanisms {
  mounts=new Map<string,{group:T.Group,state:MechanismState,amount:number,wanted:boolean,normal:T.Vector3,pivot:T.Vector3}>();
  wanted=new Set<string>();disabled=new Set<string>();enabled=false;
  constructor(private root:T.Group){}
  add(id:string,objects:T.Object3D[],normal:T.Vector3){const group=new T.Group();this.root.add(group);for(const object of objects)group.add(object);group.visible=false;const pivot=new T.Vector3();for(const object of objects)pivot.add(object.position);pivot.multiplyScalar(1/objects.length);this.mounts.set(id,{group,state:'HIDDEN',amount:0,wanted:false,normal,pivot});}
  apply(ids:string[],enabled:boolean){this.wanted=new Set(ids);this.enabled=enabled;for(const [id,m] of this.mounts){m.wanted=this.wanted.has(id);if(!m.wanted&&m.amount===0){m.state='HIDDEN';m.group.visible=false;}if(m.wanted&&m.state==='HIDDEN'){m.state='APPEARING';m.group.visible=true;}else if(!m.wanted&&m.amount>0)m.state='DISAPPEARING';else if(m.wanted&&m.amount===1)m.state=enabled&&!this.disabled.has(id)?'ACTIVE':'DISABLED';}}
  update(dt:number){const retiring=[...this.mounts.values()].some(m=>!m.wanted&&m.amount>0);for(const [id,m] of this.mounts){
    if(!m.wanted&&m.amount===0)continue;
    if(m.wanted&&retiring&&m.amount===0){m.group.visible=false;continue;}
    const direction=m.wanted?1:-1;m.amount=T.MathUtils.clamp(m.amount+direction*dt/.18,0,1);
    const t=m.amount*m.amount*(3-2*m.amount);
    // A telescopic standoff grows away from the case; it never sweeps through another panel.
    const scale=.04+.96*t;m.group.position.copy(m.pivot).multiplyScalar(1-scale).addScaledVector(m.normal,-(1-t)*.018);m.group.scale.setScalar(scale);m.group.visible=m.amount>0;
    m.state=m.amount===0?'HIDDEN':m.amount===1?(this.enabled&&!this.disabled.has(id)?'ACTIVE':'DISABLED'):m.wanted?'APPEARING':'DISAPPEARING';
  }}
  active(id:string){return this.mounts.get(id)?.state==='ACTIVE';}
  moving(){for(const m of this.mounts.values())if(m.wanted?m.amount<1:m.amount>0)return true;return false;}
}
