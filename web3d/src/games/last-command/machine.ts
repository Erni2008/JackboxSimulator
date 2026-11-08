import {PowerLighting} from './power-lighting';
import {createCrtGlass} from './crt-glass';
import {calibrateBody} from './body-material';
import {buildComputer} from './computer-body';
import {buildControlPart} from './controls-parts';
import {drawStandby} from './standby';
import '../../../../web/command-ru.js';
import '../../../../web/command-touch.js';
import {Mechanisms} from './mechanisms';
import {translateGameText} from './labels';
import {drawSelection,drawSignalPlate,screenGlyph} from './panel-art';
import weatherSource from '../../../../assets/shaders/last_command/weathering.glsl';
import * as T from 'three';
import type {InteractiveSceneModule} from '../../runtime/module';
import {AssetStore} from '../../runtime/assets';
const files=['computer','hole_final','button','adjuster','light','level_handler','lever','secret_hole','door','code_display','animal_panel'];
const MEMORY_INPUT='Повторите последовательность цветными кнопками';
const colors=['#bb2420','#309552','#2865b5','#c4a22c'];
const palette:any={OFF:'#080706',RED:'#c83b26',GREEN:'#38985a',YELLOW:'#e8c438',BLUE:'#2c79e0'};
const vec=(p:any)=>new T.Vector3(p?.x||0,p?.y||0,p?.z||0);
function quaternion(p:any){return new T.Quaternion().setFromEuler(new T.Euler(T.MathUtils.degToRad(p?.x||0),T.MathUtils.degToRad(p?.y||0),T.MathUtils.degToRad(p?.z||0),'YXZ'));}
function matrix(m:any){return new T.Matrix4().compose(vec(m.position),quaternion(m.rotation),m.scale?vec(m.scale):new T.Vector3(1,1,1));}
export class Machine implements InteractiveSceneModule {
  readonly id="last-command";readonly reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;readonly coarse=matchMedia('(pointer: coarse)').matches;
  deployment:Mechanisms; private disposed=false;root=new T.Group(); assets=new AssetStore(); controls=new Map<string,any>(); instances:any[]=[]; clonedMaterials=new Set<any>(); detailGeometries=new Set<T.BufferGeometry>(); canvases:any[]=[];
  power:PowerLighting;
  circuitRotations:Record<number,{mask:number;at:number}>={};displayGauge=NaN;numericPreview:string|null=null;terminalKey='';terminalKeyUntil=0;
  steam:T.Sprite[]=[];steamTexture:T.CanvasTexture;arcs:T.Points;warning=new T.PointLight(0xd94824,0,.8,2);art:any={}; state:any={held:[],locked:[],code:'0000',lever:'UP',adjuster:0,light:'OFF',hatch:false}; config:any; placement='right';hatchFrame:any; loaded=false; crtGlass:T.Mesh;adjusterReadout:any;nameplate:any;questionCanvas:any; codeCanvas:any; clueCanvas:any; animalCanvas:any; symbolCanvas:any; signalCanvas:any; timeOffset=0; lastSignal=-2; oldCode='0000'; digitProgress=1;
  constructor(public scene:T.Scene,public quality:string,public changed:(id:string,action:string,value?:string)=>void,public baseline=false){scene.add(this.root);this.power=new PowerLighting(this.root,this.quality);this.warning.position.set(.2,.58,.2);this.root.add(this.warning);
    const fog=document.createElement('canvas');fog.width=fog.height=64;const fc=fog.getContext('2d')!,gradient=fc.createRadialGradient(32,32,0,32,32,32);gradient.addColorStop(0,'#ced7cb66');gradient.addColorStop(1,'#ced7cb00');fc.fillStyle=gradient;fc.fillRect(0,0,64,64);this.steamTexture=new T.CanvasTexture(fog);
    for(let i=0;i<6;i++){const material=new T.SpriteMaterial({map:this.steamTexture,transparent:true,opacity:0,depthWrite:false});this.clonedMaterials.add(material);const sprite=new T.Sprite(material);sprite.visible=false;sprite.raycast=()=>{};this.root.add(sprite);this.steam.push(sprite);}
    const sparkGeometry=new T.BufferGeometry();sparkGeometry.setAttribute('position',new T.BufferAttribute(new Float32Array(24*3),3));this.detailGeometries.add(sparkGeometry);const sparkMaterial=new T.PointsMaterial({color:0xffba62,size:.004,transparent:true,opacity:0,depthWrite:false,blending:T.AdditiveBlending});this.clonedMaterials.add(sparkMaterial);this.arcs=new T.Points(sparkGeometry,sparkMaterial);this.arcs.visible=false;this.arcs.raycast=()=>{};this.root.add(this.arcs);this.deployment=new Mechanisms(this.root);}
  async load(placement:string){
    this.placement=placement;await Promise.all(['panel_lamps.png','hole1.png'].map(name=>new Promise<void>((resolve,reject)=>{const image=new Image();image.onload=()=>{this.art[name]=image;resolve();};image.onerror=()=>reject(Error('Missing plate artwork: '+name));image.src='/last-command-3d/art/'+name;})));const cfg=await Promise.all(['assembly','panel','mechanisms','surface'].map(n=>fetch(`/last-command-3d/config/${n}.json`).then(r=>{if(!r.ok)throw Error(`Нет конфигурации ${n}`);return r.json();})));
    const [a,p,m,style]=cfg;this.config=m;
    // The supplied 'back' mount sinks the recess behind the louvred back panel (panel ≈ z −.254, recess wall ≈ −.215),
    // so nothing inside it could be seen. Mount it as a surface-fixed armoured box: push it out along its normal.
    for(const h of m.hatches||[])if(h.id==='back')h.position={x:h.position.x+h.normal.x*BACK_HATCH_OUTSET,y:h.position.y+h.normal.y*BACK_HATCH_OUTSET,z:h.position.z+h.normal.z*BACK_HATCH_OUTSET};
    // Two concurrent decodes limit transient memory while retaining one load per GLB.
    // Nothing is downloaded: the cabinet and every control part are built in code, in the frames of the models they replaced.
    const sources:any[]=files.map(name=>name==='computer'?this.cabinet(a.body):buildControlPart(name,this.quality));
    const create=(source:number,mount:any,id?:string)=>{
      const group=new T.Group(),content=sources[source].clone(true);group.add(content);group.position.copy(vec(mount.position));group.quaternion.copy(quaternion(mount.rotation));group.scale.copy(mount.scale?vec(mount.scale):new T.Vector3(1,1,1));content.position.sub(vec(mount.pivot));
      const c:any={id,group,content,pivot:vec(mount.pivot),mount,restPosition:group.position.clone(),restQuaternion:group.quaternion.clone(),amount:0,target:0,motionTarget:0,start:0,elapsed:1,duration:.2,uniforms:[]};
      content.traverse((o:any)=>{if(!o.isMesh)return;o.castShadow=true;o.receiveShadow=true;o.frustumCulled=true;o.userData.control=c;if((Array.isArray(o.material)?o.material[0]:o.material).userData?.lcCustom){for(const material of Array.isArray(o.material)?o.material:[o.material])this.clonedMaterials.add(material);return;}o.material=Array.isArray(o.material)?o.material.map((x:any)=>x.clone()):o.material.clone();for(const material of Array.isArray(o.material)?o.material:[o.material]){for(const key of ["map","normalMap","roughnessMap","metalnessMap"]){const texture=material[key];if(texture)texture.anisotropy=8;}this.clonedMaterials.add(material);if(material.specularColor)for(const channel of ["r","g","b"])material.specularColor[channel]=T.MathUtils.clamp(material.specularColor[channel],0,1);if(material.roughness!==undefined)material.roughness=T.MathUtils.clamp(material.roughness,.24,.9);if(material.normalScale)material.normalScale.multiplyScalar(source===0?.18:.08);if(material.bumpScale!==undefined)material.bumpScale*=.2;if(source===0)calibrateBody(material,this.power);if(source>0&&source<5)this.weather(material,source===0?0:source===2?2:1,style);}});
      this.root.add(group);this.instances.push(c);if(id)this.controls.set(id,c);return c;
    };
    create(0,a.body);const buttonBase=create(1,a.base);const big=create(2,a.cap,'BIG_BUTTON');big.press=true;big.axis=vec(a.pressAxis).applyQuaternion(big.restQuaternion).multiplyScalar(a.travel*a.cap.scale.y);big.pickMin=a.capPickMinY;
    p.buttons.forEach((mount:any,i:number)=>{const c=create(2,mount,mount.id);c.press=true;c.axis=new T.Vector3(0,-1,0).applyQuaternion(c.restQuaternion).multiplyScalar(mount.travel*mount.scale.y);c.pickMin=mount.pickMinY;this.tint(c,colors[i],false);});
    const dial=create(3,p.adjuster,'ADJUSTER');dial.axis=vec(p.adjuster.axis);dial.rotation=true;dial.duration=.18;dial.pickMin=p.adjuster.pickMinY;
    const lamp=create(4,p.light,'LIGHT_MODULE');this.tint(lamp,'#000000',true);
    const leverBase=create(5,m.leverBase);const lever=create(6,m.leverHandle,'LEVER_MODULE');lever.axis=vec(m.leverAxis);lever.rotation=true;lever.duration=m.leverSeconds;
    const place=m.hatches.find((h:any)=>h.id===placement);if(!place)throw Error('Неизвестная серверная точка люка');const frame=create(7,place);this.hatchFrame=frame;
    const doorMatrix=matrix(place).multiply(new T.Matrix4().makeTranslation(-place.pivot.x,-place.pivot.y,-place.pivot.z)).multiply(new T.Matrix4().makeTranslation(m.doorOffset.x,m.doorOffset.y,m.doorOffset.z)).multiply(new T.Matrix4().makeScale(m.doorScale.x,m.doorScale.y,m.doorScale.z));
    const hinge=vec(m.doorPivot).applyMatrix4(doorMatrix),scale=new T.Vector3(),q=new T.Quaternion(),pos=new T.Vector3();doorMatrix.decompose(pos,q,scale);
    const door=create(8,{position:{x:hinge.x,y:hinge.y,z:hinge.z},scale:{x:scale.x,y:scale.y,z:scale.z},pivot:m.doorPivot},'HIDDEN_HATCH');door.group.quaternion.copy(q);door.restQuaternion.copy(q);door.rotation=true;door.axis=new T.Vector3(0,1,0);door.duration=m.hatchSeconds;
    const code=create(9,m.code,'CODE_PANEL');this.codeCanvas=this.surface(code.content,.0,.255,.270,.8932,.208,1024,256);
    // The note lives INSIDE the recess (frame-local: opening x −.36….24, y .16….48, back wall z −.091, face ≈ .05).
    this.clueCanvas=this.surface(frame.content,NOTE.x,NOTE.y,NOTE.z,NOTE.w,NOTE.h,768,420);this.shapeNote(this.clueCanvas.mesh);this.hatchInterior(frame.content);
    // Card artwork is a live texture over the supplied metal tray.
    // Back-panel footprint stays below the high/back hatch, clear of its opening sweep.
    const back=new T.Group();back.position.set(0,.25,-.265);back.rotation.y=Math.PI;this.root.add(back);
    this.animalCanvas=this.surface(back,0,0,0,.28,.105,1024,384);this.animalCanvas.mesh.userData.region='ANIMAL_PANEL';
    this.symbolCanvas=this.surface(back,0,0,0,.28,.105,1024,384);this.symbolCanvas.mesh.userData.region='SYMBOL_PANEL';
    this.signalCanvas=this.surface(back,0,-.125,0,.28,.075,768,192);this.signalCanvas.mesh.userData.region='SIGNAL_PANEL';
    this.nameplate=this.surface(this.root,-.003,.661,.1495,.203,.047,1024,240);this.nameplate.mesh.raycast=()=>{};
    {const {ctx,texture}=this.nameplate;ctx.fillStyle='#17201f';ctx.fillRect(0,0,1024,240);ctx.strokeStyle='#8b9688';ctx.lineWidth=5;ctx.strokeRect(7,7,1010,226);ctx.fillStyle='#d1d5c8';ctx.font='600 58px monospace';ctx.textAlign='left';ctx.fillText('LC—03 / CONTROL UNIT',35,82);ctx.fillStyle='#a5b1a4';ctx.font='30px monospace';ctx.fillText('FINAL ANSWER  •  SERIES 2026',35,140);ctx.fillStyle='#b6a15a';ctx.fillRect(35,168,954,3);ctx.font='25px monospace';ctx.fillText('24V DC    /    SERVICE ACCESS ONLY',35,207);texture.needsUpdate=true;const old=this.nameplate.mesh.material;this.nameplate.mesh.material=new T.MeshStandardMaterial({map:texture,roughness:.65,metalness:.25});old.dispose();}
    this.questionCanvas=this.surface(this.root,-.003,.495,.116,.278,.165,1536,896);this.questionCanvas.mesh.userData.region='TOUCH_PANEL';this.crtSignal(this.questionCanvas.mesh.material as T.MeshBasicMaterial);
    this.crtGlass=createCrtGlass();this.root.add(this.crtGlass);this.detailGeometries.add(this.crtGlass.geometry);this.clonedMaterials.add(this.crtGlass.material as T.Material);
    // The authored computer already includes its bezel, gasket and fasteners.
    for(const surface of [this.animalCanvas,this.symbolCanvas,this.signalCanvas]){const previous=surface.mesh.material;surface.mesh.material=new T.MeshStandardMaterial({map:surface.texture,roughness:.8,metalness:.2,emissive:0xffffff,emissiveMap:surface.texture,emissiveIntensity:.48,side:T.DoubleSide});previous.dispose();}
    // Supplied metal card tray, reused for both card tasks. Normalize authored bounds only on the instance.
    const tray=create(10,{position:{x:0,y:0,z:0}});const bounds=new T.Box3().setFromObject(tray.content),size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3());
    tray.content.position.sub(center);tray.group.scale.set(.29/size.x,.12/size.y,.025/size.z);tray.group.rotation.y=Math.PI;tray.group.position.set(0,.25,-.26);
    const n=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);
    this.deployment.add('BIG_BUTTON',[buttonBase.group,big.group],n(0,0,1));
    for(const id of ['SMALL_BUTTON_1','SMALL_BUTTON_2','SMALL_BUTTON_3','SMALL_BUTTON_4','ADJUSTER','LIGHT_MODULE','CODE_PANEL'])this.deployment.add(id,[this.controls.get(id).group],n(0,0,1));
    this.adjusterReadout=this.surface(dial.group.parent!,-.16913938,.31899233,.202,.036,.014,512,192);this.adjusterReadout.mesh.raycast=()=>{};Object.assign(this.adjusterReadout.mesh.material,{transparent:true,depthWrite:false});
    {const legend=this.surface(dial.group.parent!,-.169,.372,.181,.088,.013,704,104);legend.mesh.raycast=()=>{};const material=legend.mesh.material as T.MeshBasicMaterial;material.transparent=true;material.depthWrite=false;legend.ctx.fillStyle='#c8c9b7';legend.ctx.textAlign='center';legend.ctx.textBaseline='middle';legend.ctx.font='500 43px monospace';legend.ctx.fillText('R—01 / ADJUSTER',352,52);legend.texture.needsUpdate=true;}
    this.deployment.add('LEVER_MODULE',[leverBase.group,lever.group],n(-1,0,0));
    this.deployment.add('HIDDEN_HATCH',[frame.group,door.group],placement==='right'?n(1,0,0):n(0,0,-1));
    this.deployment.add('CARD_TRAY',[tray.group],n(0,0,-1));
    for(const [id,surface] of [['ANIMAL_PANEL',this.animalCanvas],['SYMBOL_PANEL',this.symbolCanvas],['SIGNAL_PANEL',this.signalCanvas]] as any){back.remove(surface.mesh);surface.mesh.position.applyMatrix4(back.matrixWorld);this.root.add(surface.mesh);surface.mesh.position.set(0,id==='SIGNAL_PANEL'?.125:.25,-.28);surface.mesh.rotation.y=Math.PI;this.deployment.add(id,[surface.mesh],n(0,0,-1));}
    this.signalCanvas.art=this.art['panel_lamps.png'];this.clueCanvas.art=this.art['hole1.png'];this.loaded=true;this.root.updateMatrixWorld(true);this.apply(this.state);this.drawPanels();return this;
  }
  /** the cabinet built in code, wrapped so the body mount's scale/offset land it in machine space */
  cabinet(mount:any){const wrap=new T.Group(),s=mount.scale?.x||1,t=vec(mount.position);wrap.scale.setScalar(1/s);wrap.position.copy(t).multiplyScalar(-1/s);const body=buildComputer(this.power,this.quality);wrap.add(body);
    body.traverse((o:any)=>{if(o.geometry)this.detailGeometries.add(o.geometry);});
    // hero lighting: two rim lights from behind draw the silhouette and put highlights on every bevel
    if(!this.root.getObjectByName('lc-rim')){const cool=new T.DirectionalLight(0x9fc2ff,1.6);cool.name='lc-rim';cool.position.set(-1.6,2.2,-2.4);const warm=new T.DirectionalLight(0xffcf98,1.1);warm.position.set(1.8,1.4,-2.2);const top=new T.SpotLight(0xfff1dc,6,3,.5,.6,2);top.position.set(.2,1.8,.9);top.target.position.set(0,.4,0);this.root.add(cool,warm,top,top.target);}
    return wrap;}
  weather(material:any,part:number,style:any){const surface=part===0?style.body:part===2?style.cap:style.base;material.onBeforeCompile=(shader:any)=>{
    shader.uniforms.u_weather={value:new T.Vector4(surface.coverage*.35,surface.relief*.3,Math.min(surface.roughness,.65),part)};
    shader.vertexShader='varying vec3 v_weatherPosition;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nv_weatherPosition=(modelMatrix*vec4(position,0.0)).xyz;');
    shader.fragmentShader='#define weatheredMetalFlag\n#define TLC_REFINED_MATERIALS\n#define TLC_EXPOSURE 1.0\n'+(this.quality==='HIGH'?'':'#define TLC_FAST_WEATHER\n')+weatherSource+'\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <metalnessmap_fragment>','#include <metalnessmap_fragment>\nTlcSurface lcWear=tlcWeather(v_weatherPosition,diffuseColor.rgb,metalnessFactor,roughnessFactor);diffuseColor.rgb=lcWear.color;metalnessFactor=lcWear.metallic;roughnessFactor=lcWear.roughness;\n// LC_WEAR_END');
    shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>','#include <normal_fragment_maps>\nvec3 lcGradient=mat3(viewMatrix)*lcWear.gradient;normal=normalize(normal-(lcGradient-normal*dot(normal,lcGradient))*u_weather.y);');
  };material.customProgramCacheKey=()=>`lc-wear-${part}-${this.quality}`;}
  hoverId='';glowing=new Map<string,number>();
  setHover(id:string){this.hoverId=id;for(const c of this.instances)this.emission(c);}
  /** Single writer for cap emission: hover tint plus the big button's press glow (coloured caps glow through their enamel uniform). */
  emission(c:any){const glow=c.id==='BIG_BUTTON'?this.glowing.get(c.id)||0:0;c.content.traverse((o:any)=>{if(!o.isMesh)return;for(const m of Array.isArray(o.material)?o.material:[o.material]){if(!m.emissive)continue;if(!m.userData.lcOriginalEmission)m.userData.lcOriginalEmission=m.emissive.clone();m.emissive.copy(m.userData.lcOriginalEmission);if(c.id&&c.id===this.hoverId)m.emissive.add(_color.setRGB(.035,.027,.014));if(glow)m.emissive.add(_color.setRGB(.42,.06,.025).multiplyScalar(glow));}});}
  crtUniforms={lcGlitch:{value:0},lcSweep:{value:-1},lcTime:{value:0}};
  /** CRT signal stage on the existing canvas texture: tearing/chroma/static on rejection, a scan sweep on acceptance. Neutral at rest. */
  crtSignal(material:T.MeshBasicMaterial){material.onBeforeCompile=s=>{Object.assign(s.uniforms,this.crtUniforms);s.fragmentShader='uniform float lcGlitch;uniform float lcSweep;uniform float lcTime;\n'+s.fragmentShader.replace('#include <map_fragment>',`
#ifdef USE_MAP
  vec2 lcUv=vMapUv;
  float lcRow=floor(lcUv.y*42.0+floor(lcTime*24.0)*7.0);
  float lcTear=step(0.72,fract(sin(lcRow*91.7)*437.5));
  lcUv.x+=lcGlitch*(lcTear*0.022*sin(lcTime*41.0+lcRow)+0.003*sin(lcUv.y*620.0+lcTime*70.0));
  vec4 sampledDiffuseColor=texture2D(map,lcUv);
  float lcShift=lcGlitch*0.007;
  sampledDiffuseColor.r=texture2D(map,lcUv+vec2(lcShift,0.0)).r;
  sampledDiffuseColor.b=texture2D(map,lcUv-vec2(lcShift,0.0)).b;
  float lcNoise=fract(sin(dot(floor(lcUv*vec2(320.0,180.0))+floor(lcTime*30.0),vec2(12.9898,78.233)))*43758.5453);
  sampledDiffuseColor.rgb=mix(sampledDiffuseColor.rgb,sampledDiffuseColor.rgb*vec3(1.3,0.6,0.55)+lcNoise*0.05,lcGlitch*0.7);
  float lcBar=lcSweep<0.0?0.0:exp(-pow((lcUv.y-(1.0-lcSweep))*28.0,2.0));
  sampledDiffuseColor.rgb+=vec3(0.55,1.0,0.75)*lcBar*0.35*(1.0-lcSweep*0.6);
  diffuseColor*=sampledDiffuseColor;
#endif`);};material.customProgramCacheKey=()=>'lc-crt-signal-v2';material.needsUpdate=true;}
  /** Drives the CRT stage from authoritative timestamps (same on every client). */
  crtUpdate(now:number,reduced:boolean){const u=this.crtUniforms,r=this.state.testRound;let glitch=0,sweep=-1;
    if(r?.expanded&&!reduced){const verdict=now-((r.nextAt||0)-700);
      if(r.status==='WON'){const t=now-(r.finishedAt||0);if(t>=0&&t<420)glitch=.9*(1-t/420);}
      else if(r.nextAt>now&&r.feedback==='WRONG COMMAND'&&verdict<420)glitch=(1-verdict/420)*(Math.floor(verdict/60)%2?.45:1);
      else if(r.nextAt>now&&r.feedback==='COMMAND ACCEPTED'&&verdict<340)sweep=verdict/340;
      else if(r.status==='PLAYING'){const swap=now-((r.readyAt||0)-220);if(swap>=0&&swap<200)glitch=.35*(1-swap/200);}}
    u.lcGlitch.value=glitch;u.lcSweep.value=sweep;u.lcTime.value=(now%100000)/1000;}
  tint(c:any,color:string,lens:boolean){const uniforms={tint:{value:new T.Color(color)},emission:{value:0}};c.uniforms.push(uniforms);c.content.traverse((o:any)=>{if(!o.isMesh)return;for(const material of Array.isArray(o.material)?o.material:[o.material]){for(const key of ["map","normalMap","roughnessMap","metalnessMap"]){const texture=material[key];if(texture)texture.anisotropy=8;}
    const previous=material.onBeforeCompile;material.onBeforeCompile=(s:any)=>{previous?.(s);Object.assign(s.uniforms,{lcTint:uniforms.tint,lcEmission:uniforms.emission});s.vertexShader='varying vec3 lcPosition;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nlcPosition=position;');s.fragmentShader='varying vec3 lcPosition;uniform vec3 lcTint;uniform float lcEmission;\n'+s.fragmentShader;
    const mask=lens?'smoothstep(.265,.285,dot(lcPosition,vec3(.819152,0.,-.573576)))':'smoothstep(1.7,3.0,diffuseColor.r/(diffuseColor.g+.003))';
    const anchor=lens?'#include <color_fragment>':'// LC_WEAR_END';
    s.fragmentShader=s.fragmentShader.replace(anchor,anchor+`\nfloat lcMask=clamp(${mask},0.,1.);float lcValue=dot(diffuseColor.rgb,vec3(.55,.3,.15));diffuseColor.rgb=mix(diffuseColor.rgb,lcTint*lcValue*1.8,lcMask);`);
    s.fragmentShader=s.fragmentShader.replace('#include <lights_physical_fragment>','metalnessFactor=mix(metalnessFactor,'+(lens?'0.0':'.05')+',lcMask);\n#include <lights_physical_fragment>\nmaterial.roughness=mix(material.roughness,'+(lens?'.17':'.40')+',lcMask);');
    s.fragmentShader=s.fragmentShader.replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\ntotalEmissiveRadiance+=lcTint*lcEmission*lcMask'+(lens?'':'*.55')+';');};material.customProgramCacheKey=()=>lens?`lc-lens-glass-v2-${this.quality}`:`lc-cap-enamel-v3-${this.quality}`;material.needsUpdate=true;
  }});}
  surface(parent:T.Object3D,x:number,y:number,z:number,w:number,h:number,cw:number,ch:number,rotation?:T.Euler){const canvas=document.createElement('canvas');canvas.width=cw;canvas.height=ch;const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.minFilter=T.LinearFilter;texture.generateMipmaps=false;const material=new T.MeshBasicMaterial({map:texture,side:T.DoubleSide});const mesh=new T.Mesh(new T.PlaneGeometry(w,h),material);mesh.position.set(x,y,z);if(rotation)mesh.rotation.copy(rotation);parent.add(mesh);const result={canvas,ctx:canvas.getContext('2d')!,texture,mesh};this.canvases.push(result);return result;}
  draw(surface:any,title:string,items:string[],selected=''){if(!surface)return;const {ctx,canvas,texture}=surface;ctx.fillStyle='#151512';ctx.fillRect(0,0,canvas.width,canvas.height);if(surface.art){ctx.globalAlpha=.25;ctx.drawImage(surface.art,0,0,canvas.width,canvas.height);ctx.globalAlpha=1;}ctx.strokeStyle='#766449';ctx.lineWidth=12;ctx.strokeRect(6,6,canvas.width-12,canvas.height-12);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`${canvas.height*.12}px sans-serif`;ctx.fillStyle='#b8ac83';ctx.fillText(title,canvas.width/2,canvas.height*.14);items.forEach((s,i)=>{const x=(i+.5)*canvas.width/items.length;ctx.fillStyle=selected===s?'#dbc77d':'#b1a98e';ctx.font=`${canvas.height*.25}px sans-serif`;const glyphs:any={CAT:'🐈',OWL:'🦉',WOLF:'🐺',DEER:'🦌',SUN:'☀',MOON:'☾',STAR:'★',KEY:'⚿'};ctx.fillText(glyphs[s]||s,x,canvas.height*.51);if(glyphs[s]){ctx.font=`${canvas.height*.10}px sans-serif`;ctx.fillText(s,x,canvas.height*.83);}});texture.needsUpdate=true;}
  /** Paper sheet leaning on the back wall: slight backward lean, a few degrees of twist, curled edges. */
  shapeNote(mesh:T.Mesh){const g=new T.PlaneGeometry(NOTE.w,NOTE.h,16,4),pos=g.getAttribute('position') as T.BufferAttribute;
    for(let i=0;i<pos.count;i++){const u=pos.getX(i)/(NOTE.w/2),v=pos.getY(i)/(NOTE.h/2);pos.setZ(i,.006*u*u+.004*Math.max(0,u)*Math.max(0,-v));}
    g.computeVertexNormals();mesh.geometry.dispose();mesh.geometry=g;mesh.rotation.set(-.1,0,.03);mesh.userData.restY=NOTE.y;
    // Paper is lit by the scene (and the compartment lamp), not self-illuminated like a screen.
    const old=mesh.material as T.Material;mesh.material=new T.MeshStandardMaterial({map:this.clueCanvas.texture,roughness:.92,metalness:0,emissive:0xffe2b0,emissiveMap:this.clueCanvas.texture,emissiveIntensity:.22,alphaTest:.5,side:T.DoubleSide});old.dispose();}
  /** Dark oiled-steel liner and a warm lamp strip hide the model's bare interior and frame the note. */
  hatchInterior(parent:T.Object3D){const canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;const x=canvas.getContext('2d')!;
    const base=x.createLinearGradient(0,0,0,256);base.addColorStop(0,'#3a2f22');base.addColorStop(.35,'#1c1916');base.addColorStop(1,'#0d0c0b');x.fillStyle=base;x.fillRect(0,0,256,256);
    for(let i=0;i<900;i++){x.fillStyle=i%3?'#00000022':'#d8c3a00b';x.fillRect((i*97)%256,(i*i*13)%256,1+(i%4),1);}
    for(let i=0;i<14;i++){x.strokeStyle='#5a4a3618';x.beginPath();x.moveTo((i*41)%256,0);x.lineTo((i*41)%256+((i*13)%9)-4,256);x.stroke();}
    const tex=new T.CanvasTexture(canvas);tex.colorSpace=T.SRGBColorSpace;
    const liner=new T.MeshStandardMaterial({map:tex,roughness:.78,metalness:.55,envMapIntensity:.35,side:T.DoubleSide});
    const lamp=new T.MeshBasicMaterial({color:0xffc98a,toneMapped:false});this.noteLamp={liner,lamp,texture:tex};
    const {x0,x1,y0,y1,back,face}=RECESS,w=x1-x0,h=y1-y0,d=face-back,cx=(x0+x1)/2,cy=(y0+y1)/2,cz=(back+face)/2;
    const plane=(pw:number,ph:number,px:number,py:number,pz:number,rx:number,ry:number,mat:T.Material=liner)=>{const m=new T.Mesh(new T.PlaneGeometry(pw,ph),mat);m.position.set(px,py,pz);m.rotation.set(rx,ry,0);m.raycast=()=>{};parent.add(m);this.detailGeometries.add(m.geometry);return m;};
    plane(w,h,cx,cy,back+.002,0,0);plane(w,d,cx,y0+.002,cz,-Math.PI/2,0);plane(w,d,cx,y1-.002,cz,Math.PI/2,0);plane(d,h,x0+.002,cy,cz,0,Math.PI/2);plane(d,h,x1-.002,cy,cz,0,-Math.PI/2);
    plane(w*.8,.012,cx,y1-.006,face-.012,Math.PI/2,0,lamp);
    this.clonedMaterials.add(liner);this.clonedMaterials.add(lamp);}
  /** Lamp warms up with the door; the note fades in in place once the door is mostly open. */
  noteUpdate(now:number){if(!this.noteLamp)return false;const d=this.controls.get('HIDDEN_HATCH'),open=Math.min(1,Math.abs(d?.amount||0)/Math.abs(this.config.hatchAngle||1));
    const level=open*open;this.noteLamp.lamp.color.setRGB(1*level+.05,.79*level+.04,.54*level+.03);(this.clueCanvas.mesh.material as T.MeshStandardMaterial).emissiveIntensity=.08+.3*level;
    const visible=this.hatchNoteVisible();if(visible&&!this.noteShownAt)this.noteShownAt=now;if(!visible)this.noteShownAt=0;
    const t=this.reducedMotion?1:!this.noteShownAt?0:Math.min(1,(now-this.noteShownAt)/150),fade=t*t*(3-2*t),m=this.clueCanvas.mesh.material as T.MeshStandardMaterial;
    m.transparent=true;m.opacity=fade;m.alphaTest=Math.max(.01,.5*fade);this.clueCanvas.mesh.position.y=NOTE.y;return visible&&t<1||open>0&&open<1;}
  noteLamp:any;noteShownAt=0;
  drawNote(value:string){const {ctx,canvas,texture}=this.clueCanvas,w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);
    // Aged paper with a torn top edge; transparent outside the sheet so the recess shows around it.
    ctx.save();ctx.beginPath();ctx.moveTo(10,30);for(let x=10;x<=w-10;x+=18)ctx.lineTo(x,22+((x*37)%11));ctx.lineTo(w-8,h-14);ctx.lineTo(12,h-8);ctx.closePath();ctx.clip();
    const paper=ctx.createRadialGradient(w*.45,h*.4,20,w*.5,h*.5,w*.7);paper.addColorStop(0,'#efe2bf');paper.addColorStop(.7,'#d9c391');paper.addColorStop(1,'#a88a57');ctx.fillStyle=paper;ctx.fillRect(0,0,w,h);
    for(let i=0;i<420;i++){ctx.fillStyle=i%2?'#5a3f2012':'#fff8e012';ctx.fillRect((i*73)%w,(i*47)%h,2+(i%3),1);}
    ctx.fillStyle='#7a5a3022';ctx.beginPath();ctx.ellipse(w*.82,h*.74,70,44,.4,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#8d79553a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(w*.5,24);ctx.lineTo(w*.505,h-10);ctx.stroke();
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#5b4329';ctx.font='600 30px ui-monospace,Menlo,Consolas,monospace';ctx.fillText('КОД  ДОСТУПА',w/2,h*.2);
    ctx.fillStyle='#5b432955';ctx.fillRect(w*.22,h*.28,w*.56,2);
    // Typed digits: heavy, slightly uneven like a worn typewriter ribbon. Readability first.
    ctx.font='700 150px ui-monospace,Menlo,Consolas,monospace';const step=w*.17,start=w/2-step*(value.length-1)/2;
    for(let i=0;i<value.length;i++){const jitter=((i*7+3)%5-2);ctx.fillStyle='#1f1a14';ctx.fillText(value[i],start+i*step,h*.6+jitter);ctx.fillStyle='#1f1a1422';ctx.fillText(value[i],start+i*step+2,h*.6+jitter+1);}
    ctx.save();ctx.translate(w*.8,h*.86);ctx.rotate(-.12);ctx.strokeStyle='#9b2b22aa';ctx.lineWidth=4;ctx.strokeRect(-92,-24,184,48);ctx.fillStyle='#9b2b22bb';ctx.font='700 26px ui-monospace,Menlo,Consolas,monospace';ctx.fillText('СЕКРЕТНО',0,2);ctx.restore();
    ctx.restore();texture.needsUpdate=true;
  }
  drawPanels(){if(this.animalCanvas&&this.animalCanvas.key!==this.state.animal){this.animalCanvas.key=this.state.animal;drawSelection(this.animalCanvas,'ВЫБОР ЖИВОТНОГО',['CAT','OWL','WOLF','DEER'],this.state.animal);}if(this.symbolCanvas&&this.symbolCanvas.key!==this.state.symbol){this.symbolCanvas.key=this.state.symbol;drawSelection(this.symbolCanvas,'ВЫБОР СИМВОЛА',['SUN','MOON','STAR','KEY'],this.state.symbol);}if(this.clueCanvas&&this.clueCanvas.key!==this.state.hint){this.clueCanvas.key=this.state.hint;if(this.state.testRound?.taskType==='HATCH')this.drawNote(this.state.hint||'');else this.draw(this.clueCanvas,'СЕКРЕТНЫЙ КОД',[this.state.testRound?.campaign?'—':this.state.hint||'?']);}this.drawQuestion();}
  previewNumber(value:string){if(this.numericPreview===value)return;this.numericPreview=value;this.drawQuestion();}
  previewTerminal(action:string,value:string){this.terminalKey=action==='KEY'?value:action==='CONFIRM'?'CONFIRM':'';this.terminalKeyUntil=Date.now()+this.timeOffset+110;this.drawQuestion();}
  drawQuestion(override?:string){const s=this.questionCanvas;if(!s)return;const r=this.state.testRound,now=Date.now()+this.timeOffset;
    if(r?.expanded&&r.status==='READY'){if(s.key!=='standby'){s.key='standby';drawStandby(s.ctx,s.canvas.width,s.canvas.height);s.texture.needsUpdate=true;}return;}
    if(r?.expanded){r.spatialClient=true;r.touchscreen.rotations=this.circuitRotations;r.touchscreen.visualValue=this.displayGauge;const dynamic=this.visualMotion(now)||(r.touchscreen?.flashes?.length||r.taskType==='FIND_CHANGE')&&now<(r.touchscreen?.revealUntil||0)+200||r.taskType==='CIRCUIT'&&(r.nextAt>now||(window as any).CommandTouch.circuitPower(r.touchscreen?.board).connected)||['timing','silence','delayed'].includes(r.touchscreen?.kind)||r.status==='WON'&&now<r.finishedAt+3000;const face=r.touchscreen?.kind==='number'?{...r,touchscreen:{...r.touchscreen,input:this.numericPreview??r.touchscreen.input,pressedKey:now<this.terminalKeyUntil?this.terminalKey:''}}:r;const key=JSON.stringify([face,now<r.readyAt,now<(r.touchscreen?.revealUntil||0),dynamic?Math.floor(now/16):0]);if(s.key===key)return;s.key=key;(window as any).CommandTouch.draw(s.ctx,face,now);s.texture.needsUpdate=true;return;}
    const instruction=override??r?.instruction??'THE LAST COMMAND';const input=r?.campaign&&r.taskType==='LIGHT_SEQUENCE'&&now>=r.inputAt?'REPEAT THE LIGHT SEQUENCE':instruction;
    const progress=r?.campaign?`${String(r.localScore??r.step).padStart(2,'0')} / 20`:'';
    const value=r?.campaign&&['LEVER','ADJUSTER','COLOR'].includes(r.taskType)?String(this.state[({LEVER:'lever',ADJUSTER:'adjuster',COLOR:'light'} as any)[r.taskType]]):'';
    let screenSignal=-1;if(r?.campaign&&r.signals?.length&&now<r.inputAt){const elapsed=now-r.signalStartedAt,step=Math.floor(elapsed/850);if(step>=0&&step<r.signals.length&&elapsed%850<600)screenSignal=Number(r.signals[step].slice(-1))-1;}
    const key=[input,progress,value,r?.feedback,screenSignal].join('|');if(s.key===key)return;s.key=key;
    const {ctx,canvas,texture}=s,w=canvas.width,h=canvas.height;
    const accent=r?.feedback==='WRONG COMMAND'?'#ffb39b':'#bcf5d5';
    const background=ctx.createLinearGradient(0,0,0,h);background.addColorStop(0,'#102a25');background.addColorStop(1,'#04110f');ctx.fillStyle=background;ctx.fillRect(0,0,w,h);
    ctx.strokeStyle='#497565';ctx.lineWidth=2;ctx.strokeRect(16,16,w-32,h-32);
    ctx.textBaseline='alphabetic';ctx.textAlign='left';ctx.fillStyle='#87b9a6';ctx.font=`600 ${Math.round(w*.023)}px Arial, sans-serif`;ctx.fillText('● ТЕРМИНАЛ КОМАНД',w*.05,h*.085);
    ctx.textAlign='right';ctx.fillStyle=accent;ctx.fillText(progress,w*.95,h*.085);
    ctx.fillStyle='#34594c';ctx.fillRect(w*.05,h*.12,w*.90,2);
    const text=r?.campaign?input:translateGameText(input);let lines:string[]=[],size=Math.round(w*.055);
    for(;size>=28;size-=2){ctx.font=`600 ${size}px Arial, sans-serif`;lines=[];let line='';for(const word of text.split(/\s+/)){const next=line?line+' '+word:word;if(line&&ctx.measureText(next).width>w*.86){lines.push(line);line=word;}else line=next;}if(line)lines.push(line);if(lines.length*(size*1.22)<=h*.37)break;}
    ctx.textAlign='center';ctx.fillStyle=accent;ctx.shadowColor='#60dca0';ctx.shadowBlur=2;
    const textTop=h*.20+Math.max(0,(h*.37-lines.length*size*1.22)/2);lines.forEach((line,i)=>ctx.fillText(line,w/2,textTop+size+i*size*1.22));ctx.shadowBlur=0;
    const icon=r?.campaign&&input.match(/(?:ANIMAL|SYMBOL): (CAT|OWL|WOLF|DEER|SUN|MOON|STAR|KEY)/);if(icon){ctx.fillStyle=ctx.strokeStyle='#a8d997';screenGlyph(ctx,icon[1],w/2,h*.68,h*.15);}
    if(r?.campaign&&r.signals?.length){for(let i=0;i<4;i++){ctx.fillStyle=screenSignal===i?colors[i]:'#1c3024';ctx.beginPath();ctx.arc(canvas.width*(i+.5)/4,h*.68,h*.04,0,Math.PI*2);ctx.fill();ctx.strokeStyle=colors[i];ctx.lineWidth=3;ctx.stroke();}}const swatch=r?.campaign&&input.match(/COLOR: (RED|GREEN|BLUE|YELLOW)/);if(swatch){ctx.fillStyle=palette[swatch[1]];ctx.fillRect(w/2-h*.05,h*.62,h*.10,h*.09);}
    ctx.font=`500 ${Math.round(w*.028)}px Arial, sans-serif`;if(value)ctx.fillText('СЕЙЧАС: '+translateGameText(value),w/2,h*.80);if(r?.campaign&&r.requiredMechanisms?.includes('BIG_BUTTON')){ctx.fillStyle='#91b7a5';ctx.font=`600 ${Math.round(w*.022)}px Arial, sans-serif`;ctx.fillText('КРАСНАЯ КНОПКА = ПОДТВЕРДИТЬ',w/2,h*.91);}
    ctx.fillStyle='#00000020';for(let y=0;y<canvas.height;y+=4)ctx.fillRect(0,y,canvas.width,1);texture.needsUpdate=true;}

  placeHatch(id:string){if(id===this.placement)return;const place=this.config.hatches.find((h:any)=>h.id===id);if(!place)return;const f=this.hatchFrame,d=this.controls.get('HIDDEN_HATCH'),m=this.config;
    f.group.position.copy(vec(place.position));f.group.quaternion.copy(quaternion(place.rotation));f.group.scale.copy(vec(place.scale));f.restPosition.copy(f.group.position);f.restQuaternion.copy(f.group.quaternion);
    const transform=matrix(place).multiply(new T.Matrix4().makeTranslation(-place.pivot.x,-place.pivot.y,-place.pivot.z)).multiply(new T.Matrix4().makeTranslation(m.doorOffset.x,m.doorOffset.y,m.doorOffset.z)).multiply(new T.Matrix4().makeScale(m.doorScale.x,m.doorScale.y,m.doorScale.z));const hinge=vec(m.doorPivot).applyMatrix4(transform),q=new T.Quaternion(),scale=new T.Vector3(),pos=new T.Vector3();transform.decompose(pos,q,scale);d.group.position.copy(hinge);d.restPosition.copy(hinge);d.group.quaternion.copy(q);d.restQuaternion.copy(q);d.group.scale.copy(scale);d.amount=d.target=d.start=0;d.elapsed=d.duration;
    const mount=this.deployment.mounts.get('HIDDEN_HATCH');mount.pivot.copy(f.group.position).add(d.group.position).multiplyScalar(.5);mount.normal.copy(vec(place.normal));mount.amount=0;mount.state='HIDDEN';mount.group.visible=false;this.clueCanvas.mesh.visible=false;this.placement=id;this.root.updateMatrixWorld(true);
  }
  hatchNoteVisible(){const d=this.controls.get('HIDDEN_HATCH');return !!this.state.hatch&&!!this.state.hint&&Math.abs(d?.amount||0)>=Math.abs(this.config.hatchAngle)*.8&&!!d?.group.parent?.visible;}
  apply(s:any){if(!s)return;const prev=this.state;if(prev.testRound?.taskId!==s.testRound?.taskId){this.terminalKey='';this.terminalKeyUntil=0;this.circuitRotations={};this.displayGauge=Number(s.testRound?.touchscreen?.value??0);}this.state=s;this.power.update(s.testRound,Date.now()+this.timeOffset);if(!this.loaded)return;if(s.placementId)this.placeHatch(s.placementId);
    for(const [id,c] of this.controls){let target=0;if(c.press){const authoritative=s.held?.includes(id)?1:0;if(c.localPress===authoritative)c.localPress=undefined;target=c.localPress??authoritative;}else if(id==='ADJUSTER')target=s.adjuster||0;else if(id==='LEVER_MODULE')target=this.config.leverAngles[['UP','MIDDLE','DOWN'].indexOf(s.lever)]||0;else if(id==='HIDDEN_HATCH')target=s.hatch?this.config.hatchAngle:0;
      if(c.target!==target){if(id==='ADJUSTER'){let delta=target-c.target;if(delta>90)delta-=180;else if(delta< -90)delta+=180;c.motionTarget+=delta;}c.start=c.amount;c.target=target;c.elapsed=0;if(c.press)c.duration=target?.1:.15;}}
    if(prev.code!==s.code){this.oldCode=prev.code||'0000';this.digitProgress=0;}this.drawPanels();
    const r=s.testRound;this.adjusterReadout.mesh.userData.taskVisible=!r?.campaign||['ADJUSTER','LEVER_SEQUENCE','SHUTDOWN'].includes(r.taskType);const needsCode=!r?.campaign||r.requiredMechanisms?.includes('CODE_PANEL');this.nameplate.mesh.userData.taskVisible=!needsCode;this.codeCanvas.mesh.userData.taskVisible=!!needsCode;this.clueCanvas.mesh.userData.taskVisible=!r?.campaign||r.requiredMechanisms?.includes('HIDDEN_HATCH');if(r?.campaign){const ids=[...new Set(["BIG_BUTTON",...(r.requiredMechanisms||[])])];if(ids.includes('ANIMAL_PANEL')||ids.includes('SYMBOL_PANEL'))ids.push('CARD_TRAY');this.deployment.apply(ids,r.status==='PLAYING'&&!r.paused&&!r.nextAt&&Date.now()+this.timeOffset>=r.readyAt);}
    else this.deployment.apply([...this.deployment.mounts.keys()].filter(id=>id!=='CARD_TRAY'),true);
    for(const [surface,x] of [[this.animalCanvas,.075],[this.symbolCanvas,-.075]] as any){surface.mesh.scale.x=r?.campaign?1:.5;surface.mesh.position.x=r?.campaign?0:x;}
  }
  update(dt:number,now:number){if(!this.loaded)return;this.power.update(this.state.testRound,now);const target=Number(this.state.testRound?.touchscreen?.value??0);if(!Number.isFinite(this.displayGauge))this.displayGauge=target;this.displayGauge+=(target-this.displayGauge)*(1-Math.exp(-22*dt));if(Math.abs(target-this.displayGauge)<.015)this.displayGauge=target;const progress=this.state.testRound?.localScore||0;const degradation=Math.floor(progress/5);const reduced=this.reducedMotion;for(let i=0;i<this.steam.length;i++){const sprite=this.steam[i],phase=(now/2400+i/3)%1;sprite.visible=degradation>0&&!reduced;sprite.position.set(i<3?-.31:.31,.66+phase*.18,-.04);sprite.scale.setScalar(.035+phase*.08);(sprite.material as T.SpriteMaterial).opacity=(1-phase)*.17*Math.min(2,degradation);}
    this.arcs.visible=degradation>=2&&!reduced&&Math.sin(now*.009)>.92;if(this.arcs.visible){const positions=this.arcs.geometry.attributes.position as T.BufferAttribute;for(let i=0;i<24;i++){const phase=(now/180+i/24)%1;positions.setXYZ(i,(i%2?-.26:.26)+Math.sin(i*7.1)*phase*.04,.67-phase*phase*.09,.03+Math.cos(i*4.7)*phase*.03);}positions.needsUpdate=true;(this.arcs.material as T.PointsMaterial).opacity=.8;}
    this.warning.intensity=Math.max(degradation>=2?(.04+Math.max(0,Math.sin(now*.004))*.1)*(degradation-1):0,this.power.alarm*.35);
    this.root.position.copy(reduced?_zero:this.jolt(now));this.crtUpdate(now,reduced);this.noteMoving=this.noteUpdate(now);
    for(const [id,c] of this.controls){if(!c.press)continue;// Lit immediately while pressed, then cools over ~250 ms so even a quick tap reads.
    const glow=c.target===1?1:Math.max(0,(this.glowing.get(id)||0)-dt*4);if(Math.abs(glow-(this.glowing.get(id)||0))<.01)continue;this.glowing.set(id,glow);if(c.uniforms.length)for(const u of c.uniforms)u.emission.value=glow*2.4;else this.emission(c);}const r=this.state.testRound;if(r?.campaign){const active=r.status==='PLAYING'&&!r.paused&&!r.nextAt&&now>=r.readyAt;this.deployment.enabled=active;this.deployment.disabled=new Set(['LIGHT_SEQUENCE','LIGHT_MEMORY'].includes(r.taskType)?['LIGHT_MODULE','SIGNAL_PANEL',...(now<r.inputAt?['SMALL_BUTTON_1','SMALL_BUTTON_2','SMALL_BUTTON_3','SMALL_BUTTON_4']:[])]:r.taskType==='REMEMBER'||r.touchscreen?.kind==='store'?(r.requiredMechanisms||[]):[]);if(!r.requiredMechanisms?.includes("BIG_BUTTON"))this.deployment.disabled.add("BIG_BUTTON");}else this.deployment.disabled.clear();this.deployment.update(dt);for(const c of this.instances){if(!c.group.parent?.visible)continue;if(!c.press&&!c.rotation)continue;c.elapsed=Math.min(c.duration,c.elapsed+dt);const t=Math.min(1,c.elapsed/c.duration),smooth=this.reducedMotion||c.press?t*t*(3-2*t):motionCurve(c.id,t,c.target===0);c.amount=c.start+((c.id==='ADJUSTER'?c.motionTarget:c.target)-c.start)*smooth;if(c.press)c.group.position.copy(c.restPosition).addScaledVector(c.axis,c.amount);else c.group.quaternion.copy(c.restQuaternion).multiply(_q.setFromAxisAngle(c.axis,T.MathUtils.degToRad(c.amount)));}
    const lamp=this.controls.get('LIGHT_MODULE');if(lamp.group.parent?.visible)for(const u of lamp.uniforms){u.tint.value.lerp(_color.set(palette[this.state.light]||palette.OFF),Math.min(1,dt*14));u.emission.value=T.MathUtils.damp(u.emission.value,this.state.light==='OFF'?0:1.7,14,dt);}
    if(this.digitProgress<1||this.codeCanvas.last!==this.state.code){this.digitProgress=Math.min(1,this.digitProgress+dt/.16);this.drawDigits();this.codeCanvas.last=this.state.code;}
    const round=this.state.testRound;if(round?.campaign)this.drawQuestion();if(round?.scenario==='memory'&&round.status==='PLAYING'&&now>=round.inputAt)this.drawQuestion(MEMORY_INPUT);let signal=-1;if((round?.scenario==='memory'||round?.campaign&&round.signals?.length)&&round.status==='PLAYING'&&now<round.inputAt){const step=Math.floor((now-(round.signalStartedAt??round.startedAt))/850);if(step>=0&&step<round.signals.length&&(now-(round.signalStartedAt??round.startedAt))%850<600)signal=Number(round.signals[step].slice(-1))-1;}
    if(signal!==this.lastSignal){this.lastSignal=signal;this.drawSignals(signal);}if((round?.scenario==='memory'||round?.campaign&&round.signals?.length)&&round.status==='PLAYING'&&now<round.inputAt)for(const u of lamp.uniforms){u.tint.value.set(signal>=0?colors[signal]:'#080706');u.emission.value=signal>=0?2.1:0;}
  }
  drawAdjusterAngle(){const s=this.adjusterReadout;if(!s||s.mesh.userData.taskVisible===false)return;const angle=Math.round(((this.controls.get('ADJUSTER')?.amount||0)%180+180)%180);if(s.angle===angle)return;s.angle=angle;const {ctx,canvas,texture}=s;ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#e5d8b5';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='600 152px monospace';ctx.fillText(angle+'°',256,100);texture.needsUpdate=true;}
  drawDigits(){const s=this.codeCanvas,{ctx,canvas,texture}=s;ctx.fillStyle='#080706';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.font='180px monospace';ctx.textAlign='center';ctx.textBaseline='middle';const p=this.digitProgress*pEase(this.digitProgress);for(let i=0;i<4;i++){const x=(i+.5)*256;ctx.save();ctx.beginPath();ctx.rect(i*256,0,256,256);ctx.clip();ctx.fillStyle='#e43720';if(this.digitProgress<1){ctx.fillText(this.oldCode[i],x,128-p*256);ctx.fillText(this.state.code[i],x,384-p*256);}else ctx.fillText(this.state.code[i],x,128);ctx.restore();}texture.needsUpdate=true;}
  drawSignals(active:number){if(this.signalCanvas)drawSignalPlate(this.signalCanvas,active,colors);}
  pick(ray:T.Raycaster){this.root.updateMatrixWorld(true);const code=this.controls.get('CODE_PANEL');if(code&&this.deployment.active('CODE_PANEL')){const local=ray.ray.clone().applyMatrix4(new T.Matrix4().copy(code.group.matrixWorld).invert());local.origin.add(code.pivot);if(local.direction.z<-.001){const point=local.intersectPlane(new T.Plane(new T.Vector3(0,0,1),-.275),new T.Vector3());if(point){const index=Math.round((point.x+.335)/.2233);if(index>=0&&index<4&&Math.abs(point.x-(-.335+index*.2233))<.105){if(Math.abs(point.y-.447)<.078)return{id:'CODE_PANEL',value:index+':+1'};if(Math.abs(point.y-.066)<.078)return{id:'CODE_PANEL',value:index+':-1'};}}}}const hits=ray.intersectObjects(this.root.children.filter(object=>object.visible),true);for(const hit of hits){let visible=true;for(let o:T.Object3D|null=hit.object;o;o=o.parent)if(!o.visible){visible=false;break;}if(!visible)continue;const region=hit.object.userData.region;if(region==='TOUCH_PANEL'){const r=this.state.testRound;if(!r?.expanded)continue;const b=(window as any).CommandTouch.hit(r,hit.uv?.x||0,hit.uv?.y||0,Date.now()+this.timeOffset);return b?{id:'TOUCH_PANEL',value:b.action+':'+b.value}:null;}if(region){if(!this.deployment.active(region))return null;if(region==='SIGNAL_PANEL')return {id:'SIGNAL_PANEL',value:''};const i=Math.min(3,Math.floor((hit.uv?.x||0)*4));return {id:region,value:(region==='ANIMAL_PANEL'?['CAT','OWL','WOLF','DEER']:['SUN','MOON','STAR','KEY'])[i]};}
      const c=hit.object.userData.control;if(!c)return null;const p=_v.copy(hit.point);c.group.worldToLocal(p);p.add(c.pivot);if(!c.id)return null;if(!this.deployment.active(c.id))return null;if((c.press||c.id==='ADJUSTER')&&p.y<c.pickMin)return null;
      if(c.id==='CODE_PANEL'){const i=Math.round((p.x+.335)/.2233);if(i<0||i>3||Math.abs(p.x-(-.335+i*.2233))>(this.coarse?.095:.072)||p.z<.17)return null;if(Math.abs(p.y-.447)<(this.coarse?.075:.045))return {id:c.id,value:`${i}:+1`};if(Math.abs(p.y-.066)<(this.coarse?.075:.045))return {id:c.id,value:`${i}:-1`};return null;}if(c.id==='ADJUSTER'){const side=hit.point.clone();c.group.parent.worldToLocal(side);side.sub(c.restPosition).applyQuaternion(c.restQuaternion.clone().invert());return{id:c.id,value:side.x<0?'-1':'+1'};}return{id:c.id,value:''};}return null;}
  interact(hit:any){if(hit?.id==='TOUCH_PANEL'){const i=hit.value.indexOf(':'),action=hit.value.slice(0,i),value=hit.value.slice(i+1),r=this.state.testRound,t=r?.touchscreen,now=Date.now()+this.timeOffset;if(action==='ROTATE'&&t?.kind==='circuit'&&now>=r.readyAt&&!r.paused&&!r.nextAt){const index=Number(value),mask=t.board[index];this.circuitRotations[index]={mask,at:now};this.state={...this.state,testRound:{...r,touchscreen:{...t,board:t.board.map((m:number,j:number)=>j===index?((m<<1)&15)|(m>>3):m)}}};this.drawQuestion();}this.changed(hit.id,action,value);return;}if(!hit||!this.deployment.active(hit.id)||this.state.locked?.includes(hit.id))return;if(hit.id==='SIGNAL_PANEL')return;if(hit.id==='CODE_PANEL')this.changed(hit.id,'STEP',hit.value);else if(hit.id.endsWith('_PANEL'))this.changed(hit.id,'SELECT',hit.value);else if(hit.id.includes('BUTTON'))this.changed(hit.id,'PRESS');else if(hit.id==='LEVER_MODULE')this.changed(hit.id,'SET',['UP','MIDDLE','DOWN'][(['UP','MIDDLE','DOWN'].indexOf(this.state.lever)+1)%3]);else if(hit.id==='ADJUSTER'){const angle=((this.state.adjuster||0)+(hit.value==='-1'?135:45))%180;this.apply({...this.state,adjuster:angle,testRound:{...this.state.testRound,touchscreen:{...this.state.testRound?.touchscreen,adjusterAngle:angle}}});this.changed(hit.id,'STEP',hit.value==='-1'?'-1':'+1');}else if(hit.id==='LIGHT_MODULE')this.changed(hit.id,'SET',['OFF','RED','GREEN','YELLOW','BLUE'][(['OFF','RED','GREEN','YELLOW','BLUE'].indexOf(this.state.light)+1)%5]);else if(hit.id==='HIDDEN_HATCH')this.changed(hit.id,'SET',this.state.hatch?'CLOSED':'OPEN');}
  visualMotion(now:number){return Object.values(this.circuitRotations).some(t=>now-t.at<140)||Math.abs(this.displayGauge-Number(this.state.testRound?.touchscreen?.value??0))>.015;}
  /** Body reaction to the authoritative verdict: a millimetre-scale thunk on accept, a rattle on rejection, a heavy drop on victory. */
  jolt(now:number){const r=this.state.testRound;_jolt.set(0,0,0);if(!r?.expanded)return _jolt;
    if(r.status==='WON'){const t=now-(r.finishedAt||0);if(t>=0&&t<520)_jolt.y=-.0026*Math.sin(Math.PI*Math.min(1,t/140))*Math.exp(-t/260);return _jolt;}
    if(!r.nextAt||now>=r.nextAt)return _jolt;const t=now-(r.nextAt-700);
    if(r.feedback==='WRONG COMMAND'&&t<260){const decay=1-t/260;_jolt.x=Math.sin(t*.09)*.0016*decay;_jolt.z=Math.cos(t*.13)*.0007*decay;}
    else if(r.feedback==='COMMAND ACCEPTED'&&t<160)_jolt.y=-.0012*Math.sin(Math.PI*t/160);
    return _jolt;}
  continuous(now:number){const r=this.state.testRound;if(r?.expanded)return now<this.terminalKeyUntil||this.visualMotion(now)||r.status==='WON'&&now<r.finishedAt+900||this.deployment.moving()||r.status==='PLAYING'&&(now<r.nextAt||now<r.readyAt+200||now<(r.touchscreen?.revealUntil||0)+200||['timing','silence','delayed'].includes(r.touchscreen?.kind)||r.taskType==='CIRCUIT'&&(window as any).CommandTouch.circuitPower(r.touchscreen?.board).connected||(r.localScore||0)>=5);if(r?.campaign)return this.deployment.moving()||r.status==='PLAYING'&&(now<r.readyAt+200||r.signals?.length&&now<r.inputAt+200);return r?.scenario==='memory'&&r.status==='PLAYING'&&(now<r.inputAt+180||(now>=r.inputAt&&this.questionCanvas?.key!==MEMORY_INPUT));}
  previewButton(id:string,down:boolean){const c=this.controls.get(id);if(!c?.press)return;const target=down?1:0;c.localPress=target;if(c.target===target)return;c.start=c.amount;c.target=target;c.elapsed=0;c.duration=down?.1:.15;}
  hatchClosed(){const h=this.controls.get("HIDDEN_HATCH");return !!h?.group.parent?.visible&&h.target===0&&h.elapsed>=h.duration;}
  noteMoving=false;
  moving(){if(this.deployment.moving()||this.noteMoving)return true;for(const v of this.glowing.values())if(v>0)return true;for(const c of this.instances)if(c.group.parent?.visible&&(c.press||c.rotation)&&c.elapsed<c.duration)return true;return false;}
  cullDisplays(camera:T.Camera){this.drawAdjusterAngle();for(const surface of this.canvases){surface.mesh.getWorldPosition(_surfacePosition);surface.mesh.getWorldQuaternion(_surfaceQuaternion);_surfaceNormal.set(0,0,1).applyQuaternion(_surfaceQuaternion);_surfaceView.copy(camera.position).sub(_surfacePosition);surface.mesh.visible=(surface!==this.clueCanvas||this.hatchNoteVisible())&&surface.mesh.userData.taskVisible!==false&&_surfaceNormal.dot(_surfaceView)>0;}if(this.crtGlass)this.crtGlass.visible=this.questionCanvas.mesh.visible;}
  memoryEstimate(){if(!this.loaded)return null;if((this as any)._memory)return (this as any)._memory;const buffers=new Set<any>(),textures=new Set<any>(),textureStorage=new Set<string>(),imageIds=new Map<any,number>();let meshBytes=0,textureBytes=0;this.root.traverse((o:any)=>{if(!o.isMesh)return;for(const a of Object.values(o.geometry.attributes) as any[]){const array=a.isInterleavedBufferAttribute?a.data.array:a.array;if(array&&!buffers.has(array)){buffers.add(array);meshBytes+=array.byteLength;}}const index=o.geometry.index?.array;if(index&&!buffers.has(index)){buffers.add(index);meshBytes+=index.byteLength;}for(const m of Array.isArray(o.material)?o.material:[o.material])for(const t of Object.values(m) as any[])if(t?.isTexture&&!textures.has(t)){textures.add(t);const image=t.source?.data;if(!imageIds.has(image))imageIds.set(image,imageIds.size);const storageKey=[imageIds.get(image),t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.colorSpace,t.format,t.type].join(':');if(image?.width&&image?.height&&!textureStorage.has(storageKey)){textureStorage.add(storageKey);textureBytes+=image.width*image.height*4*(t.generateMipmaps?4/3:1);}}});return (this as any)._memory={meshBytes,textureBytes,note:'RGBA8+mips estimate; excludes environment/shadows/driver. Not measured VRAM.'};}
  dispose(){if(this.disposed)return Promise.resolve();this.disposed=true;this.loaded=false;this.scene.remove(this.root);this.power.dispose();this.noteLamp?.texture.dispose();for(const c of this.canvases){c.mesh.geometry.dispose();c.mesh.material.dispose();c.texture.dispose();}this.steamTexture.dispose();for(const g of this.detailGeometries)g.dispose();for(const m of this.clonedMaterials)m.dispose();return this.assets.dispose();}
}
const _q=new T.Quaternion(),_v=new T.Vector3(),_color=new T.Color(),_surfacePosition=new T.Vector3(),_surfaceNormal=new T.Vector3(),_surfaceView=new T.Vector3(),_surfaceQuaternion=new T.Quaternion();function pEase(t:number){return t*(3-2*t);}
const _jolt=new T.Vector3(),_zero=new T.Vector3();
/** Mechanical character per control. Every curve starts at 0 and ends exactly at 1; none travels past a closed hatch. */
function motionCurve(id:string,t:number,closing:boolean){
 const back=(s:number)=>{const u=t-1;return 1+(s+1)*u*u*u+s*u*u;};
 if(id==='LEVER_MODULE')return back(1.0);      // small throw past the notch, settles (end stops stay credible)
 if(id==='ADJUSTER')return back(.9);           // detent click
 if(id==='HIDDEN_HATCH')return closing?(t<.8?(t/.8)**2:1-.06*Math.sin(Math.PI*(t-.8)/.2)):back(1.2); // slam with a small rebound / swing open
 return t*t*(3-2*t);
}
/** Hatch recess in frame-local units (measured by ray probes on hole_final) and the note resting inside it. */
const RECESS={x0:-.356,x1:.236,y0:.162,y1:.478,back:-.089,face:.045};
const NOTE={x:-.06,y:.318,z:-.07,w:.5,h:.272,slide:.21};
/** Measured: moves the back recess (wall at frame-local z −.091, scale .21) fully clear of the body panel. */
const BACK_HATCH_OUTSET=.045;
