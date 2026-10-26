"""Browser-only mobile LOD. Never overwrites native profiles or original models.
GLTFPACK=/path/to/gltfpack python3 tools/assets/prepare_last_command_mobile.py
"""
from pathlib import Path
import os,subprocess,json,hashlib
from optimize_last_command import stats
ROOT=Path(__file__).resolve().parents[2]
ASSETS=ROOT/'assets/models/last_command'
FILES=['box_final','hole_final','button','adjuster','light','level_handler','lever','secret_hole','door','code_display']
def main():
    out=ASSETS/'mobile';out.mkdir(exist_ok=True);report=[]
    for name in FILES:
        source=ASSETS/'low'/(name+'.glb');target=out/(name+'.glb');digest=hashlib.sha256(source.read_bytes()).hexdigest()
        subprocess.run([os.environ['GLTFPACK'],'-i',str(source),'-o',str(target),'-noq','-kn','-km','-si','0.28' if name=='box_final' else '0.35','-se','0.002','-sp','-slb'],check=True)
        assert hashlib.sha256(source.read_bytes()).hexdigest()==digest
        info=stats(target);assert not info['extensions'],info
        report.append({'name':name,'source':'low/'+name+'.glb','sourceSha256':digest,'runtimeSha256':hashlib.sha256(target.read_bytes()).hexdigest(),'before':stats(source),'after':info,'relativeErrorLimit':.002,'lockedBorders':True})
    (ASSETS/'mobile-optimization.json').write_text(json.dumps(report,indent=2)+'\n')
    print('TOTAL_TRIANGLES',sum(r['before']['triangles'] for r in report),'->',sum(r['after']['triangles'] for r in report))
    print('TOTAL_BYTES',sum(r['before']['bytes'] for r in report),'->',sum(r['after']['bytes'] for r in report))
if __name__=='__main__':main()
