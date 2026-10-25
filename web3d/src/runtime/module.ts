import type * as T from 'three';
/** Shared scene lifecycle. Each minigame owns its models, picking, animation and server-state view. */
export interface InteractiveSceneModule {
  readonly id:string; loaded:boolean; state:any; timeOffset:number; assets:any; quality:string;
  load(layoutId:string):Promise<any>; apply(state:any):void; update(delta:number,serverTime:number):void;
  pick(ray:T.Raycaster):any; interact(hit:any):void; setHover(id:string):void;
  moving():boolean; continuous(serverTime:number):boolean; cullDisplays(camera:T.Camera):void;
  memoryEstimate():any; dispose():Promise<any>;
}
export type ModuleFactory=(scene:T.Scene,quality:string,send:(id:string,action:string,value?:string)=>void)=>InteractiveSceneModule;
