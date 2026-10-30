"""Build only computer.glb runtime profiles. Original and all other GLBs remain untouched.
Run: Blender -b -t 4 --python tools/assets/prepare_last_command_computer.py
The shared partitioner keeps native meshes within the existing 16-bit index limit.
"""
from pathlib import Path
import bpy,sys,json,hashlib,tempfile,struct
ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT/'tools/assets'))
import prepare_last_command as partition
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
source=ROOT/'computer.glb';digest=hashlib.sha256(source.read_bytes()).hexdigest()
bpy.ops.import_scene.gltf(filepath=str(source));objects=[o for o in bpy.context.scene.objects if o.type=='MESH']
for obj in bpy.context.scene.objects:obj.select_set(obj in objects)
for obj in objects:
 for mat in obj.data.materials:
  if mat and mat.use_nodes:
   for node in mat.node_tree.nodes:
    if node.type=='BSDF_PRINCIPLED' and 'Specular IOR Level' in node.inputs:node.inputs['Specular IOR Level'].default_value=min(.5,node.inputs['Specular IOR Level'].default_value)
images={node.image for obj in objects for mat in obj.data.materials if mat and mat.use_nodes for node in mat.node_tree.nodes if node.type=='TEX_IMAGE' and node.image}
manifest=[]
with tempfile.TemporaryDirectory(prefix='lc-computer-') as folder:
 folder=Path(folder)
 for profile,ratio,limit in [('high',.45,4096),('medium',.22,2048),('low',.10,1024),('mobile',.06,1024)]:
  for image in images:
   if max(image.size)>limit:
    factor=limit/max(image.size);image.scale(max(1,round(image.size[0]*factor)),max(1,round(image.size[1]*factor)))
  for obj in objects:
   obj.modifiers.clear();modifier=obj.modifiers.new('Runtime LOD','DECIMATE');modifier.ratio=ratio;modifier.use_collapse_triangulate=True
  bpy.context.view_layer.objects.active=objects[0]
  target=folder/'computer.glb'
  bpy.ops.export_scene.gltf(filepath=str(target),export_format='GLB',use_selection=True,export_apply=True,export_tangents=True,export_image_format='AUTO',export_animations=False)
  partition.ROOT=folder;partition.OUT=ROOT/'assets/models/last_command'/profile;partition.OUT.mkdir(parents=True,exist_ok=True)
  entry=partition.prepare('computer.glb');entry.update(profile=profile,source='computer.glb',sourceSha256=digest,ratio=ratio,textureLimit=limit);manifest.append(entry)
  print('COMPUTER_PROFILE_READY',profile,flush=True)
(ROOT/'assets/models/last_command/computer-optimization.json').write_text(json.dumps(manifest,indent=2)+'\n')
assert hashlib.sha256(source.read_bytes()).hexdigest()==digest
