"""Summarize the native serialized GL diagnostic without claiming presentation FPS."""
import json, statistics
from pathlib import Path
root=next(p for p in Path(__file__).resolve().parents if (p / 'settings.gradle').is_file())
folder=root/'generated/cursed-boxes'
reports={key:json.loads((folder/f'{key}-profile.json').read_text()) for key in ('before','after')}
def percentile(values,p):
    values=sorted(values)
    return values[min(len(values)-1,int(len(values)*p))]
def row(r):
    samples=r['samples']; values=[s['totalMs']for s in samples]
    first=[s['totalMs'] for s in samples if s['cycle']==0 and s['frame']<60]
    return [len(samples),max(first),statistics.median(values),percentile(values,.95),max(values),sum(s['compiles']for s in samples),max(s['draws']for s in samples)]
before,after=(row(reports[key])for key in ('before','after'))
lines=['# Cursed Boxes native profiling','',f"Device: {reports['after']['renderer']}; GL: {reports['after']['version']}; framebuffer: {reports['after']['resolution']}.",'',
       'CPU submission + GPU completion wait, serialized with diagnostic glFinish. Vsync/presentation excluded. Baseline: 3 resets; final: 20 resets / 40 shots. Final uses the original BOX3 and immediate GHOST3.', '',
       '| Metric | Before | Final |','| --- | ---: | ---: |']
labels=['Measured frames','First-shot window max (ms)','Full run median (ms)','Full run p95 (ms)','Full run max (ms)','Shader stage compilations in gameplay','Max draw calls']
for label,b,a in zip(labels,before,after):
    lines.append(f'| {label} | {b:.3f} | {a:.3f} |' if isinstance(b,float) else f'| {label} | {b} | {a} |')
r=reports['after'];s=r['samples']
lines+=['',f"Final counters: {sum(x['uploads'] for x in s)} texture uploads, {sum(x['staticBuffers'] for x in s)} static mesh uploads, {r['gcCount']} GC collections / {r['gcMs']} ms GC. Loaded model counts: {sorted(set(x['models'] for x in s))}; managed texture counts: {sorted(set(x['textures'] for x in s))}.",
        f"Peak active debris: {max(x['debris'] for x in s)}; sprite particles: {max(x['particles'] for x in s)}. Heap range: {min(x['heap']for x in s)/1048576:.2f}–{max(x['heap']for x in s)/1048576:.2f} MiB. Median allocation measured inside render: {statistics.median(x['allocated']for x in s):.0f} bytes/frame.",'',
        'The baseline did not reproduce a severe freeze on this machine. It did show lazy shader compilation and first-use work during firing. Driver caches may already have been populated. Full-run before/after medians are not controlled throughput comparisons: runs have different lengths and continuously unthrottled GPU work changes clock/thermal/background conditions. Zero new shader/texture/static-mesh work and bounded resource counts are the reliable warmup/leak checks. All managed textures were released at shutdown. No universal 60 FPS guarantee is claimed.', '',
        '| Final cycle | Median ms | Maximum ms |','| --- | ---: | ---: |']
for cycle in [0,1,5,10,19]:
    v=[x['totalMs']for x in s if x['cycle']==cycle]
    lines.append(f'| {cycle+1} | {statistics.median(v):.3f} | {max(v):.3f} |')
(folder/'performance-summary.md').write_text('\n'.join(lines)+'\n')
print('\n'.join(lines))
