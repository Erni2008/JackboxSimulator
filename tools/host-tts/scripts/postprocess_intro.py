"""Apply the reviewed subtle timbre treatment from lossless sources, without generating or approving dialogue."""
import argparse
import fcntl
import hashlib
import json
from pathlib import Path
import subprocess
from narration import ROOT,TOOL,database,profile_hash,export_manifest,sha,validate
from audio_export import export_vorbis,probe


def process(source,target,settings):
    ratio=settings['pitchRatio']
    if not .97<=ratio<=1 or not 0<=settings['bassGainDb']<=3:raise ValueError('Timbre treatment exceeds reviewed bounds')
    padding=settings.get('tailPaddingSeconds',0)
    if not 0<=padding<=.5:raise ValueError('Invalid speech release padding')
    filters=((f'apad=pad_dur={padding},' if padding else '')+f'asetrate={round(24000*ratio)},aresample=24000,atempo={1/ratio:.8f},'
             f"equalizer=f={settings['bassHz']}:t=q:w=0.8:g={settings['bassGainDb']},"
             f"equalizer=f={settings['presenceHz']}:t=q:w=0.7:g={settings['presenceGainDb']},"
             f"acompressor=threshold={settings['compressorThreshold']}:ratio={settings['compressorRatio']}:attack=12:release=100:makeup={settings['makeup']}")
    subprocess.run(['ffmpeg','-v','error','-nostdin','-n','-i',str(source),'-af',filters,'-c:a','pcm_s16le',str(target)],check=True)
    validate(target)
    source_duration=probe(source)[1];target_duration=probe(target)[1]
    if abs(source_duration+padding-target_duration)>.08:raise ValueError('Treatment must preserve natural speech duration')


def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--id');args=parser.parse_args()
    config=json.loads((TOOL/'config/local.json').read_text());settings=json.loads((TOOL/'config/intro-treatment.json').read_text())
    definition=json.loads((ROOT/'shared/src/main/resources/cinematics/intro_ru.json').read_text())
    tails={line['id']:line.get('audioTailSeconds',0) for scene in definition['scenes'] for line in scene['lines']}
    if not settings.get('approvedByUser'):raise ValueError('Timbre sample must be reviewed first')
    with (TOOL/'config/generation.lock').open('a') as lock:
        fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB);db=database()
        for row in db.execute("SELECT * FROM jobs WHERE kind='intro' AND status IN ('ready','review')").fetchall():
            if args.id and row['id']!=args.id:continue
            treatment=dict(settings)
            if tails.get(row['id']):treatment['tailPaddingSeconds']=tails[row['id']]
            fingerprint=hashlib.sha256((sha(row['wav'])+json.dumps(treatment,sort_keys=True)).encode()).hexdigest()
            target=ROOT/'assets/audio/host/ru'/row['file']
            if row['processing_hash']==fingerprint and row['processed_wav'] and Path(row['processed_wav']).exists() and sha(target)==row['audio_sha']:continue
            treated=TOOL/f"output/intro-treated/{row['id']}_{fingerprint[:12]}.wav";treated.parent.mkdir(parents=True,exist_ok=True)
            if not treated.exists():process(row['wav'],treated,treatment)
            candidate=treated.with_suffix('.ogg')
            if not candidate.exists():export_vorbis(treated,candidate,config.get('bitrate',96))
            # Atomic replacement; original approved/generated WAV remains untouched.
            temporary=target.with_suffix('.ogg.tmp');temporary.write_bytes(candidate.read_bytes());temporary.replace(target)
            db.execute("UPDATE jobs SET processed_wav=?,processing_hash=?,audio_sha=?,duration=?,status='review',reviewed=0 WHERE kind='intro' AND id=?",(str(treated),fingerprint,sha(target),probe(target)[1],row['id']));db.commit()
            print('Treated',row['id'],flush=True)
        export_manifest(db,config,profile_hash(config));db.close()


if __name__=='__main__':main()
