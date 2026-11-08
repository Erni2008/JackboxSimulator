// Merge every plain mesh of a built part that shares a material into one mesh (instanced meshes and decals stay as
// they are): one draw call per material instead of one per bolt and bar. UVs are box-projected from the baked
// positions (`density` texture tiles per unit), so the procedural materials have the same texel density on every face.
import * as T from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
function boxUV(g: T.BufferGeometry, density: number) {
  const p = g.attributes.position as T.BufferAttribute, n = g.attributes.normal as T.BufferAttribute, uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) { const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i)), x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const [u, v] = ax >= ay && ax >= az ? [z, y] : ay >= az ? [x, z] : [x, y]; uv[i * 2] = u * density; uv[i * 2 + 1] = v * density; }
  g.setAttribute('uv', new T.BufferAttribute(uv, 2));
}
export function bakeByMaterial(root: T.Object3D, density = 2.5): T.Group {
  root.updateMatrixWorld(true); const inv = new T.Matrix4().copy(root.matrixWorld).invert(), groups = new Map<T.Material, T.BufferGeometry[]>(), out = new T.Group(), keep: T.Object3D[] = [];
  root.traverse(o => { const m = o as T.Mesh; if (!m.isMesh) return; if ((m as any).isInstancedMesh || m.userData.keep) { keep.push(m); return; }
    const g = (m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone()); for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
    g.applyMatrix4(new T.Matrix4().multiplyMatrices(inv, m.matrixWorld)); boxUV(g, density); const mat = m.material as T.Material; (groups.get(mat) ?? groups.set(mat, []).get(mat)!).push(g); m.geometry.dispose(); });
  for (const [mat, list] of groups) { const merged = mergeGeometries(list, false); list.forEach(g => g.dispose()); if (!merged) continue; const mesh = new T.Mesh(merged, mat); mesh.castShadow = mesh.receiveShadow = true; out.add(mesh); }
  for (const k of keep) { k.updateMatrixWorld(true); const m = new T.Matrix4().multiplyMatrices(inv, k.matrixWorld); k.removeFromParent(); m.decompose(k.position, k.quaternion, k.scale); k.castShadow = k.receiveShadow = !k.userData.keep; out.add(k); }
  out.userData = root.userData; return out;
}
