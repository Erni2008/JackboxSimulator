// Merge every plain mesh of a built part that shares a material into one mesh (instanced meshes stay as they are):
// one draw call per material instead of one per bolt and bar. Geometry is baked in the part's own frame.
import * as T from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
export function bakeByMaterial(root: T.Object3D): T.Group {
  root.updateMatrixWorld(true); const inv = new T.Matrix4().copy(root.matrixWorld).invert(), groups = new Map<T.Material, T.BufferGeometry[]>(), out = new T.Group(), keep: T.Object3D[] = [];
  root.traverse(o => { const m = o as T.Mesh; if (!m.isMesh) return; if ((m as any).isInstancedMesh) { keep.push(m); return; }
    const g = (m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone()); for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
    if (!g.attributes.uv) g.setAttribute('uv', new T.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
    g.applyMatrix4(new T.Matrix4().multiplyMatrices(inv, m.matrixWorld)); const mat = m.material as T.Material; (groups.get(mat) ?? groups.set(mat, []).get(mat)!).push(g); m.geometry.dispose(); });
  for (const [mat, list] of groups) { const merged = mergeGeometries(list, false); list.forEach(g => g.dispose()); if (!merged) continue; const mesh = new T.Mesh(merged, mat); mesh.castShadow = mesh.receiveShadow = true; out.add(mesh); }
  for (const k of keep) { k.updateMatrixWorld(true); const m = new T.Matrix4().multiplyMatrices(inv, k.matrixWorld); k.removeFromParent(); m.decompose(k.position, k.quaternion, k.scale); k.castShadow = k.receiveShadow = true; out.add(k); }
  out.userData = root.userData; return out;
}
