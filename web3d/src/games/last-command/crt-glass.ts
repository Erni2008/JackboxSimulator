import * as T from 'three';
/** Thin convex cover: environment reflections, without a transmission render pass. */
export function createCrtGlass(){
 const geometry=new T.PlaneGeometry(.278,.165,24,12),positions=geometry.getAttribute('position') as T.BufferAttribute;
 for(let i=0;i<positions.count;i++){const x=positions.getX(i)/.139,y=positions.getY(i)/.0825;positions.setZ(i,.0014*Math.max(0,1-x*x)*Math.max(0,1-y*y));}
 geometry.computeVertexNormals();
 const material=new T.MeshPhysicalMaterial({color:0xc6d9ce,roughness:.18,metalness:0,clearcoat:.75,clearcoatRoughness:.13,transparent:true,opacity:.085,depthWrite:false,envMapIntensity:.4,side:T.FrontSide});
 const mesh=new T.Mesh(geometry,material);mesh.position.set(-.003,.495,.1175);mesh.renderOrder=3;mesh.raycast=()=>{};
 return mesh;
}
