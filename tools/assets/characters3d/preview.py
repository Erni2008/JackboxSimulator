"""blender -b -P preview.py -- <dir with name.obj/.glb> <out.png> [names]: front + back turntable sheet."""
import bpy,sys,math,os
a=sys.argv[sys.argv.index('--')+1:];D,OUT=a[0],a[1];names=a[2:] or ['skeleton','dracula','pumpkin','voodoo','ghost','zombie','plague_doctor','puppeteer']
tiles=[]
for n in names:
    for ang in (0,):
        bpy.ops.wm.read_factory_settings(use_empty=True);sc=bpy.context.scene
        p=f'{D}/{n}.glb'
        if os.path.exists(p):bpy.ops.import_scene.gltf(filepath=p)
        else:
            bpy.ops.wm.obj_import(filepath=f'{D}/{n}.obj')
            o=bpy.context.selected_objects[0];m=bpy.data.materials.new('m');m.use_nodes=True;t=m.node_tree.nodes.new('ShaderNodeTexImage');t.image=bpy.data.images.load(f'{D}/{n}.png')
            m.node_tree.links.new(t.outputs[0],m.node_tree.nodes['Principled BSDF'].inputs[0]);o.data.materials.clear();o.data.materials.append(m)
        objs=[o for o in sc.objects if o.type=='MESH']
        import mathutils
        pts=[o.matrix_world@mathutils.Vector(c) for o in objs for c in o.bound_box];mn=[min(p[i] for p in pts) for i in range(3)];mx=[max(p[i] for p in pts) for i in range(3)]
        c=[(mn[i]+mx[i])/2 for i in range(3)];h=max(mx[i]-mn[i] for i in range(3))
        cam=bpy.data.objects.new('c',bpy.data.cameras.new('c'));sc.collection.objects.link(cam);sc.camera=cam
        r=h*2.2;th=math.radians(ang);cam.location=(c[0]+r*math.sin(th),c[1]-r*math.cos(th),c[2]+h*.1)
        cam.rotation_euler=(math.radians(88),0,th)
        L=bpy.data.objects.new('l',bpy.data.lights.new('l','SUN'));L.data.energy=3;L.rotation_euler=(.8,.2,.6+th);sc.collection.objects.link(L)
        w=bpy.data.worlds.new('w');sc.world=w;w.use_nodes=True;w.node_tree.nodes['Background'].inputs[0].default_value=(.35,.35,.38,1)
        sc.render.engine='BLENDER_EEVEE_NEXT' if 'BLENDER_EEVEE_NEXT' in [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items] else 'BLENDER_EEVEE'
        sc.render.resolution_x=sc.render.resolution_y=int(os.environ.get("RES","320"));f=f'/tmp/_pv_{n}_{ang}.png';sc.render.filepath=f;bpy.ops.render.render(write_still=True);tiles.append(f)
open("/tmp/_pv_list.txt","w").write("\n".join(tiles))
