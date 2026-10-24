"""Measure the exact intro; create a review-only listening reel, never a runtime monolithic clip."""
import json
from pathlib import Path
import sqlite3
import sys
import soundfile as sf
import numpy as np

ROOT=Path(__file__).resolve().parents[3]
sys.path.insert(0,str(Path(__file__).parent))
from narration import atomic_json


def main():
    definition=json.loads((ROOT/'shared/src/main/resources/cinematics/intro_ru.json').read_text())
    manifest=json.loads((ROOT/'assets/audio/host/ru/manifest.json').read_text())
    db=sqlite3.connect(ROOT/'tools/host-tts/output/jobs.sqlite');db.row_factory=sqlite3.Row
    cursor=0;lines=[];scenes=[];speech=0
    for scene in definition['scenes']:
        start=max(cursor,scene['start']);cursor=start
        for line in scene['lines']:
            entry=manifest['intro'][line['id']]
            lines.append(dict(id=line['id'],text=line.get('subtitleText') or line['text'],file=entry['file'],start=round(cursor,6),duration=entry['duration'],status=entry['status']))
            cursor+=entry['duration']+line['pauseAfter'];speech+=entry['duration']
        scenes.append(dict(id=scene['id'],targetStart=scene['start'],actualStart=round(start,6),end=round(cursor,6),
                           budgetOverrun=round(max(0,cursor-scene['end']),6)))
    duration=max(definition['targetDurationSeconds'],cursor+definition['exitFade'])
    for index,scene in enumerate(scenes):
        scene['speechEnd']=scene['end']
        scene['end']=scenes[index+1]['actualStart'] if index+1<len(scenes) else round(duration,6)
    missing=sorted({cue['file'] for cue in definition['cues'] if not (ROOT/'assets'/cue['file']).exists()}|
                   {d['file'] for scene in definition['scenes'] for d in scene['directions'] if not (ROOT/'assets'/d['file']).exists()})
    report=dict(introId=definition['introId'],durationSeconds=round(duration,6),speechSeconds=round(speech,6),
                fitsMaximum=duration<=definition['maximumDurationSeconds'],scenes=scenes,lines=lines,missingAudio=missing)
    atomic_json(ROOT/'assets/cinematics/intro_timing.json',report)
    reel=np.zeros(int(np.ceil(duration*24000)),dtype='float32')
    for line in lines:
        row=db.execute("SELECT * FROM jobs WHERE kind='intro' AND id=?",(line['id'],)).fetchone()
        source=row['processed_wav'] if 'processed_wav' in row.keys() and row['processed_wav'] else row['wav']
        audio,rate=sf.read(source,dtype='float32')
        if rate!=24000 or audio.ndim!=1:raise ValueError('Review sources must be mono 24 kHz PCM')
        start=round(line['start']*rate);reel[start:start+len(audio)]+=audio
    target=ROOT/'tools/host-tts/output/intro-review.wav';sf.write(target,reel,24000,subtype='PCM_16')
    db.close();print(json.dumps({k:v for k,v in report.items() if k not in ('lines','scenes')},ensure_ascii=False,indent=2))
    print('Review-only reel:',target)


if __name__=='__main__':main()
