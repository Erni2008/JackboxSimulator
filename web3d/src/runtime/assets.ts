import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
/** Source models loaded once per active module; cloned instances share geometry and textures. */
export class AssetStore {
  loader=new GLTFLoader(); sources=new Map<string,Promise<any>>(); bytes=0; started=performance.now(); completed=0;onprogress=(done:number)=>{};
  load(url:string){if(!this.sources.has(url))this.sources.set(url,this.loader.loadAsync(url).then(g=>{this.onprogress(++this.completed);return g;}));return this.sources.get(url)!;}
  async dispose(){const geometries=new Set<any>(),materials=new Set<any>(),textures=new Set<any>(),images=new Set<any>();for(const promise of this.sources.values()){try{const g=await promise;g.scene.traverse((o:any)=>{if(o.geometry)geometries.add(o.geometry);for(const m of (Array.isArray(o.material)?o.material:[o.material]))if(m){materials.add(m);for(const v of Object.values(m))if((v as any)?.isTexture)textures.add(v);}});}catch{}}
    for(const g of geometries)g.dispose();for(const m of materials)m.dispose();for(const t of textures){if(t.source?.data)images.add(t.source.data);t.dispose();}for(const i of images)if(i.close)i.close();this.sources.clear();}
}
