// Draw-call diet for the suitcase (Poco X3 class phones): inside each parent, static meshes that share a material
// are baked into one mesh in that parent's space. Parents keep their own motion (lid, latches, levers, mirrors), so
// animation is untouched; meshes that carry userData (tap targets, wires, contacts) or are instanced stay as they are.
import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

const sig = (g: T.BufferGeometry) => Object.keys(g.attributes).sort().join(',');
/** merges static siblings; returns the new geometries (the caller owns and disposes them) */
export function mergeStatic(root: T.Object3D): T.BufferGeometry[] {
  const made: T.BufferGeometry[] = []; const parents = new Set<T.Object3D>(); root.traverse(o => { if (o.children.length) parents.add(o); });
  for (const parent of parents) {
    const buckets = new Map<string, T.Mesh[]>();
    for (const c of parent.children) { const m = c as T.Mesh;
      if (!m.isMesh || (m as any).isInstancedMesh || c.children.length || Object.keys(c.userData).length || Array.isArray(m.material) || !(m.material as T.Material).visible || m.morphTargetInfluences) continue;
      const key = (m.material as T.Material).uuid + '|' + sig(m.geometry) + '|' + m.castShadow + m.receiveShadow + m.renderOrder; (buckets.get(key) ?? buckets.set(key, []).get(key)!).push(m); }
    for (const list of buckets.values()) { if (list.length < 2) continue;
      const geos = list.map(m => { m.updateMatrix(); const g = (m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone()); g.applyMatrix4(m.matrix); return g; });
      const merged = mergeGeometries(geos, false); for (const g of geos) g.dispose(); if (!merged) continue; made.push(merged);
      const one = new T.Mesh(merged, list[0].material); one.castShadow = list[0].castShadow; one.receiveShadow = list[0].receiveShadow; one.renderOrder = list[0].renderOrder; one.frustumCulled = list.every(m => m.frustumCulled);
      for (const m of list) parent.remove(m); parent.add(one); }
  }
  return made;
}
