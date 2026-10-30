import * as T from 'three';
/** Static presentation set. One floor map, one contact map; no postprocessing. */
export function industrialStage(scene:T.Scene){
 const objects:T.Mesh[]=[],textures:T.Texture[]=[];
 const add=(mesh:T.Mesh)=>{objects.push(mesh);scene.add(mesh);return mesh;};
 const canvas=document.createElement('canvas');canvas.width=canvas.height=512;
 const ctx=canvas.getContext('2d')!;ctx.fillStyle='#252e30';ctx.fillRect(0,0,512,512);
 // Fine deterministic brushed grain, with widely spaced floor joints.
 for(let i=0;i<1500;i++){const x=(i*71.37)%512,y=(i*i*7.31)%512;ctx.strokeStyle=i%3?'#c6d6d407':'#00000018';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(i%12)+2,y+.3);ctx.stroke();}
 ctx.strokeStyle='#111b1c';ctx.lineWidth=2;ctx.strokeRect(0,0,512,512);ctx.strokeStyle='#72918a10';ctx.lineWidth=1;ctx.strokeRect(3,3,506,506);
 const texture=new T.CanvasTexture(canvas);textures.push(texture);texture.colorSpace=T.SRGBColorSpace;texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(8,8);
 const floor=add(new T.Mesh(new T.PlaneGeometry(12,12),new T.MeshStandardMaterial({map:texture,color:0x829092,roughness:.86,metalness:.12})));floor.rotation.x=-Math.PI/2;floor.position.y=-.077;floor.receiveShadow=true;
 // A bolted rectangular skid replaces the showroom pedestal.
 const plinth=add(new T.Mesh(new T.BoxGeometry(.96,.046,.76),new T.MeshStandardMaterial({color:0x202b2b,roughness:.72,metalness:.55})));plinth.position.y=-.052;plinth.receiveShadow=true;
 const stripeCanvas=document.createElement('canvas');stripeCanvas.width=512;stripeCanvas.height=32;const stripe=stripeCanvas.getContext('2d')!;stripe.fillStyle='#b49a51';stripe.fillRect(0,0,512,32);stripe.fillStyle='#202723';for(let x=-32;x<544;x+=48){stripe.beginPath();stripe.moveTo(x,0);stripe.lineTo(x+24,0);stripe.lineTo(x-8,32);stripe.lineTo(x-32,32);stripe.fill();}
 const stripeTexture=new T.CanvasTexture(stripeCanvas);stripeTexture.colorSpace=T.SRGBColorSpace;textures.push(stripeTexture);const warning=add(new T.Mesh(new T.PlaneGeometry(.90,.018),new T.MeshStandardMaterial({map:stripeTexture,roughness:.8,metalness:.05})));warning.position.set(0,-.049,.381);
 const fasteners=new T.InstancedMesh(new T.CylinderGeometry(.007,.007,.003,6),new T.MeshStandardMaterial({color:0x75837b,metalness:.8,roughness:.5}),8),matrix=new T.Matrix4();
 const anchors=[[-.44,-.34],[.44,-.34],[-.44,.34],[.44,.34],[-.44,0],[.44,0],[0,-.34],[0,.34]];anchors.forEach(([x,z],i)=>{matrix.makeTranslation(x,-.027,z);fasteners.setMatrixAt(i,matrix);});fasteners.instanceMatrix.needsUpdate=true;add(fasteners);
 const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=128;const sc=shadowCanvas.getContext('2d')!,gradient=sc.createRadialGradient(64,64,10,64,64,64);gradient.addColorStop(0,'#000000b8');gradient.addColorStop(.48,'#00000080');gradient.addColorStop(1,'#00000000');sc.fillStyle=gradient;sc.fillRect(0,0,128,128);
 const shadowTexture=new T.CanvasTexture(shadowCanvas);textures.push(shadowTexture);const shadow=add(new T.Mesh(new T.PlaneGeometry(1.1,.96),new T.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false,opacity:.85})));shadow.rotation.x=-Math.PI/2;shadow.position.set(0,-.0275,0);
 // Presentation geometry never participates in mechanism picking.
 for(const mesh of objects)mesh.raycast=()=>{};
 return{floor,dispose(){for(const mesh of objects){scene.remove(mesh);mesh.geometry.dispose();for(const material of Array.isArray(mesh.material)?mesh.material:[mesh.material])material.dispose();if((mesh as T.InstancedMesh).isInstancedMesh)(mesh as T.InstancedMesh).dispose();}for(const texture of textures)texture.dispose();}};
}
