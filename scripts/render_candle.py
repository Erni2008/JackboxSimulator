import bpy, math
from pathlib import Path
from mathutils import Vector
root=Path(__file__).resolve().parents[1]
scene=bpy.context.scene
for obj in scene.objects:
    if obj.type not in {'LIGHT','CAMERA'}:
        obj.hide_render=not (obj.name.startswith('Candle 1 |') or obj.name.startswith('Holder 1 |'))
    if obj.type=='LIGHT' and not obj.name.startswith(('Candle 1 |','Softbox')):
        obj.hide_render=True
scene.frame_set(1)
points=[o.matrix_world @ Vector(c) for o in scene.objects if o.type in {'MESH','CURVE'} and not o.hide_render for c in o.bound_box]
lo=Vector(tuple(min(p[i] for p in points) for i in range(3)))
hi=Vector(tuple(max(p[i] for p in points) for i in range(3)))
center=(lo+hi)*.5
cam=scene.camera
cam.location=center+Vector((2,-7,2.1))
cam.rotation_euler=(center-cam.location).to_track_quat('-Z','Y').to_euler()
cam.data.type='ORTHO'
cam.data.ortho_scale=(hi.z-lo.z)*1.18
scene.render.engine='CYCLES'
scene.cycles.device='CPU'
scene.cycles.samples=24
scene.cycles.use_denoising=True
scene.render.resolution_x=320
scene.render.resolution_y=768
scene.render.resolution_percentage=100
scene.render.film_transparent=True
scene.render.image_settings.file_format='PNG'
scene.render.image_settings.color_mode='RGBA'
scene.world.color=(.025,.018,.04)
scene.render.filepath=str(root/'assets/models/candle/candle.png')
print('CANDLE_BOUNDS',list(lo),list(hi),flush=True)
flame=bpy.data.objects.get('Candle 1 | FLAME ANIMATION')
base_scale=flame.scale.copy() if flame else None
for i in range(12):
    phase=i*math.tau/12
    if flame:
        flame.scale=(base_scale.x*(1+.065*math.sin(phase)),
                     base_scale.y*(1+.045*math.cos(phase*2)),
                     base_scale.z*(1+.055*math.sin(phase+0.6)))
        flame.rotation_euler.y=.035*math.sin(phase)
    scene.render.filepath=str(root/f'assets/models/candle/candle_{i:02d}.png')
    bpy.ops.render.render(write_still=True)
