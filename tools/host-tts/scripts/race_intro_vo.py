"""Generate the race flyover using the project's approved local host voice; no external service."""
import json, subprocess
from pathlib import Path
import race_rules_vo as generator
from narration import ROOT, TOOL

script = json.loads((ROOT/'web3d/src/games/race/intro-script.json').read_text())
beats = [b for b in script['beats'] if b['clip'] != 'format'] + [dict(b, at=31) for b in script['formats'].values()]
generator.LINES = [b['text'] for b in beats]
generator.PFX = 'intro_'
generator.WORK = TOOL/'output/race-intro'
generator.OUT = generator.WORK/'wav'
generator.main()
web = ROOT/'web/race/audio'
report = []
for i, beat in enumerate(beats):
    src = generator.OUT/f'intro_{i}.wav'
    duration = float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(src)]))
    n = next((k for k,b in enumerate(script['beats']) if b['clip'] == beat['clip']), -1)
    end = 38 if n < 0 else script['beats'][n+1]['at'] if n+1 < len(script['beats']) else script['duration']
    if duration > end-beat['at']-.15:
        raise RuntimeError(f"{src.name}: {duration:.2f}s exceeds narration slot ({end-beat['at']:.2f}s). Adjust timeline; never truncate speech.")
    subprocess.run(['ffmpeg','-v','error','-y','-i',str(src),'-c:a','aac','-b:a','112k',str(web/f"{beat['clip']}.m4a")],check=True)
    report.append({'clip':beat['clip'],'duration':duration,'at':beat['at'],'text':beat['text']})
(generator.WORK/'timing.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print('Exported verified intro clips', flush=True)
