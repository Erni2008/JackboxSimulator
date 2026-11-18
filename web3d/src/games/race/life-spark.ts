import * as THREE from 'three';

/** Worn iron reliquary. Shared art for the film and the collectible; animation never affects pickup rules. */
export class LifeSpark extends THREE.Group {
  private body=new THREE.Group();
  private fissures: THREE.MeshBasicMaterial;
  private ember: THREE.Sprite;
  private dust: THREE.Points;
  constructor(){
    super();this.name='LifeSpark';this.userData.keep=true;this.add(this.body);
    // A small, deterministic surface map gives the metal abrasion and uneven roughness without external assets.
    const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const ctx=canvas.getContext('2d')!;
    const pixels=ctx.createImageData(128,128);let seed=812;
    for(let i=0;i<pixels.data.length;i+=4){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const v=105+(seed>>>25);pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=v;pixels.data[i+3]=255;}ctx.putImageData(pixels,0,0);
    ctx.strokeStyle='#cccccc';ctx.lineWidth=.4;for(let i=0;i<45;i++){const x=(i*73)%128,y=(i*41)%128;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+2+(i%9),y-1-i%4);ctx.stroke();}
    const patina=new THREE.CanvasTexture(canvas);patina.wrapS=patina.wrapT=THREE.RepeatWrapping;
    const iron=new THREE.MeshStandardMaterial({color:0x454944,metalness:.78,roughness:.65,bumpMap:patina,bumpScale:.012,roughnessMap:patina});
    const bronze=new THREE.MeshStandardMaterial({color:0x76634a,metalness:.82,roughness:.52,bumpMap:patina,bumpScale:.008});
    const dark=new THREE.MeshStandardMaterial({color:0x252a29,metalness:.12,roughness:.57,bumpMap:patina,bumpScale:.026});
    const rim=new THREE.Mesh(new THREE.TorusGeometry(.43,.054,10,72),iron);rim.scale.set(.73,1.12,.8);this.body.add(rim);
    for(const z of [-.025,.025]){const lip=new THREE.Mesh(new THREE.TorusGeometry(.438,.009,5,72),bronze);lip.position.z=z;lip.scale.set(.73,1.12,1);this.body.add(lip);}
    const rivets=new THREE.InstancedMesh(new THREE.SphereGeometry(.022,8,6),bronze,10),matrix=new THREE.Matrix4();
    for(let i=0;i<10;i++){const a=i/10*Math.PI*2;matrix.compose(new THREE.Vector3(Math.cos(a)*.315,Math.sin(a)*.482,.045),new THREE.Quaternion(),new THREE.Vector3(1,1,.5));rivets.setMatrixAt(i,matrix);}this.body.add(rivets);
    const eye=new THREE.Mesh(new THREE.TorusGeometry(.057,.016,6,24),iron);eye.position.y=.57;this.body.add(eye);
    // Dark fractured stone is held by three metal claws. Only the narrow fractures emit light.
    const slab=new THREE.Mesh(new THREE.IcosahedronGeometry(.3,1),dark);slab.scale.set(.82,1.38,.38);this.body.add(slab);
    for(const [x,y,a] of [[-.255,.02,-.3],[.255,.02,.3],[0,-.4,0]]){const claw=new THREE.Mesh(new THREE.BoxGeometry(.045,.14,.14),bronze);claw.position.set(x,y,.025);claw.rotation.z=a;this.body.add(claw);}
    this.fissures=new THREE.MeshBasicMaterial({color:0xc8b995});
    const branches=[[[.01,-.34,.1],[-.03,-.18,.12],[.02,-.04,.14],[-.02,.12,.12],[.035,.29,.09]],[[.01,-.06,.14],[-.12,.01,.1],[-.18,.14,.07]],[[0,.1,.12],[.12,.16,.09],[.17,.26,.06]]];
    for(const branch of branches){const curve=new THREE.CatmullRomCurve3(branch.map(p=>new THREE.Vector3(...p as [number,number,number])));this.body.add(new THREE.Mesh(new THREE.TubeGeometry(curve,16,.0055,4,false),this.fissures));}
    const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=64;const g=glowCanvas.getContext('2d')!,gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(222,214,187,.7)');gr.addColorStop(.2,'rgba(180,159,115,.12)');gr.addColorStop(1,'rgba(160,139,100,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);const glow=new THREE.CanvasTexture(glowCanvas);
    this.ember=new THREE.Sprite(new THREE.SpriteMaterial({map:glow,transparent:true,opacity:.25,depthWrite:false,blending:THREE.AdditiveBlending}));this.ember.position.z=.16;this.ember.scale.set(.44,.68,1);this.body.add(this.ember);
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(8*3),3));this.dust=new THREE.Points(geo,new THREE.PointsMaterial({color:0xc6baa2,map:glow,size:.022,transparent:true,opacity:.3,depthWrite:false,blending:THREE.AdditiveBlending}));this.add(this.dust);
    this.animate(0);
  }
  animate(t:number,near=0){
    this.body.rotation.y=-.18+Math.sin(t*.28)*.12;this.body.rotation.z=Math.sin(t*.21)*.025;
    const breath=.5+.5*Math.sin(t*1.4);this.ember.material.opacity=.18+breath*.09+near*.15;
    this.fissures.color.setRGB(.23+breath*.07+near*.18,.2+breath*.055+near*.13,.14+breath*.04);
    const p=this.dust.geometry.getAttribute('position') as THREE.BufferAttribute;
    for(let i=0;i<p.count;i++){const f=(t*.08+i*.618)%1;p.setXYZ(i,Math.sin(i*4.1+t*.13)*.26,-.4+f*.95,Math.cos(i*2.1)*.16);}p.needsUpdate=true;
  }
}
