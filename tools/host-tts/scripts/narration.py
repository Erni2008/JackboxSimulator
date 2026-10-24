"""Resumable local host narration jobs. No generation is performed during gameplay."""
import argparse
import fcntl
import hashlib
import json
from pathlib import Path
import selectors
import shutil
import sqlite3
import subprocess
import sys
import time

from audio_export import export_vorbis, probe

ROOT = Path(__file__).resolve().parents[3]
TOOL = ROOT/'tools/host-tts'
EMOTIONS = {'NEUTRAL','EXCITED','SARCASTIC','DRAMATIC','SINISTER','ANGRY','SURPRISED','WHISPERING'}


def sha(path):
    digest = hashlib.sha256()
    with Path(path).open('rb') as source:
        for block in iter(lambda: source.read(1024*1024), b''):
            digest.update(block)
    return digest.hexdigest()


def atomic_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix('.json.tmp')
    temporary.write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n')
    temporary.replace(path)


def catalog():
    questions = json.loads((ROOT/'shared/src/main/resources/questions/ru.json').read_text())['questions']
    events = json.loads((TOOL/'config/events.json').read_text())['events']
    definition=json.loads((ROOT/'shared/src/main/resources/cinematics/intro_ru.json').read_text())
    # Presentation pauses do not change synthesized words; retiming must not regenerate the voice.
    intro=[]
    for scene in definition['scenes']:
        for line in scene['lines']:
            entry=dict(id=line['id'],text=line['text'],emotion=line.get('emotion',scene.get('emotion','NEUTRAL')))
            for optional in ('spokenText','generation'):
                if line.get(optional):entry[optional]=line[optional]
            intro.append(entry)
    result = []
    import re
    for kind, entries in [('questions', questions), ('events', events),('intro',intro)]:
        seen = set()
        for entry in entries:
            entry = dict(entry, kind=kind)
            if not re.fullmatch('[A-Za-z0-9_-]+', entry['id']) or entry['id'] in seen:
                raise ValueError('Invalid or duplicate stable narration ID')
            seen.add(entry['id'])
            entry['spokenText'] = entry.get('spokenText') or entry['text']
            entry['emotion'] = entry.get('emotion', 'NEUTRAL')
            if not entry['spokenText'].strip() or entry['emotion'] not in EMOTIONS:
                raise ValueError('Invalid spoken text/emotion')
            result.append(entry)
    return result


def profile_hash(config):
    model = Path(config['model']).resolve(strict=True)
    # The existing checkpoint is versioned by config hash and local weight size/mtime.
    weights = [(p.name, p.stat().st_size, p.stat().st_mtime_ns) for p in sorted(model.rglob('*.safetensors'))]
    if not weights:
        raise ValueError('No installed model weights; downloading is not allowed')
    profile = dict(config, reference=sha(config['reference']), transcript=sha(config['transcript']),
                   model={'config': sha(model/'config.json'), 'weights': weights})
    return hashlib.sha256(json.dumps(profile, sort_keys=True).encode()).hexdigest()


def content_hash(entry, profile):
    return hashlib.sha256(json.dumps(dict(entry, profile=profile), sort_keys=True,
                                     ensure_ascii=False).encode()).hexdigest()


def validate(path, text=None):
    stream, duration = probe(path)
    if stream['channels'] != 1 or not .4 <= duration <= max(15, len(text or '')/3):
        raise ValueError(f'Unexpected channels/duration: {path} ({duration}s)')
    import soundfile as sf
    import numpy as np
    audio, _ = sf.read(path, dtype='float32')
    if not np.isfinite(audio).all() or np.max(np.abs(audio)) < .0001:
        raise ValueError('Empty, silent or invalid audio')
    clipped = int(np.count_nonzero(np.abs(audio) >= .999))
    if clipped:
        raise ValueError(f'Clipping requires manual review: {clipped} samples')
    return duration


class LocalWorker:
    def __init__(self, config_path, log):
        self.process = subprocess.Popen([sys.executable, str(TOOL/'scripts/mlx_worker.py'), str(config_path)],
                                        stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=log,
                                        text=True, bufsize=1)
        self.selector = selectors.DefaultSelector()
        self.selector.register(self.process.stdout, selectors.EVENT_READ)
        try:
            if not self.receive().get('ready'):
                raise RuntimeError('Local Qwen worker did not become ready')
        except BaseException:
            self.close()
            raise

    def receive(self):
        deadline = time.monotonic()+300
        while time.monotonic() < deadline:
            if self.selector.select(timeout=1):
                line = self.process.stdout.readline()
                if not line:
                    raise RuntimeError('Local Qwen worker exited; inspect worker.log')
                try:
                    return json.loads(line)
                except json.JSONDecodeError:
                    continue
            if self.process.poll() is not None:
                raise RuntimeError('Local Qwen worker failed; inspect worker.log')
        raise TimeoutError('Qwen generation exceeded five minutes')

    def generate(self, text, output, **generation):
        if set(generation)-{'seed','temperature'}:raise ValueError('Unsupported generation setting')
        self.process.stdin.write(json.dumps({'text': text, 'output': str(output),'generation':generation}, ensure_ascii=False)+'\n')
        self.process.stdin.flush()
        response = self.receive()
        if not response.get('ok'):
            raise RuntimeError(response.get('error', 'Invalid worker response'))

    def close(self):
        try:
            self.process.stdin.close()
        except BrokenPipeError:
            pass
        try:
            self.process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            self.process.terminate()
            try:
                self.process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.process.kill()
                self.process.wait()
        self.selector.close()


def database():
    output = TOOL/'output'
    output.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(output/'jobs.sqlite')
    db.row_factory = sqlite3.Row
    db.execute('''CREATE TABLE IF NOT EXISTS jobs (
        kind TEXT, id TEXT, hash TEXT, status TEXT, attempts INTEGER DEFAULT 0,
        file TEXT, wav TEXT, audio_sha TEXT, duration REAL, error TEXT,
        PRIMARY KEY(kind,id))''')
    columns={row['name'] for row in db.execute('PRAGMA table_info(jobs)')}
    for name in ('processed_wav','processing_hash'):
        if name not in columns:db.execute(f'ALTER TABLE jobs ADD COLUMN {name} TEXT')
    if 'reviewed' not in columns:db.execute('ALTER TABLE jobs ADD COLUMN reviewed INTEGER NOT NULL DEFAULT 0')
    return db


def export_manifest(db, config, profile):
    locale = config.get('locale', 'ru')
    if locale != 'ru':
        raise ValueError('Only Russian generation is enabled; other languages require their own approved profile')
    manifest = dict(version=1, language=locale, voiceId=config['voiceId'], profileHash=profile,
                    questions={}, events={},intro={})
    for row in db.execute("SELECT * FROM jobs WHERE status='ready' OR (kind='intro' AND status='review' AND file IS NOT NULL) ORDER BY kind,id"):
        manifest[row['kind']][row['id']] = dict(file=row['file'], status=row['status'], hash=row['hash'],
                                              duration=row['duration'], manualReview='approved_by_user' if row['reviewed'] else 'not_yet_reviewed',processingHash=row['processing_hash'])
    atomic_json(ROOT/f'assets/audio/host/{locale}/manifest.json', manifest)


def progress(db, total):
    counts = dict(db.execute('SELECT status,count(*) FROM jobs GROUP BY status').fetchall())
    completed = counts.get('ready', 0)
    return dict(total=total, completed=completed, remaining=max(0,total-completed),
                failed=counts.get('failed',0), flagged=counts.get('review',0))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--config', type=Path, default=TOOL/'config/local.json')
    parser.add_argument('command', choices=['generate','retry','validate','progress','export','flag','approve'])
    parser.add_argument('--kind', choices=['questions','events','intro','all'], default='questions')
    parser.add_argument('--all-reviewed',action='store_true',help='Explicit confirmation that every selected clip was listened to and approved')
    parser.add_argument('--id', help='Exact stable question/event ID')
    parser.add_argument('--range', help='One-based inclusive catalog range, e.g. 1:20')
    parser.add_argument('--limit', type=int, default=50)
    parser.add_argument('--allow-large', action='store_true', help='Explicitly allow more than 50 jobs')
    parser.add_argument('--force', action='store_true', help='Regenerate selected jobs; preserve old lossless WAVs')
    parser.add_argument('--attempts', type=int, default=3)
    parser.add_argument('--reason', default='Manual audio review requested')
    args = parser.parse_args()
    if args.command=='approve' and not args.id and not args.all_reviewed:
        parser.error('Approve one --id, or explicitly confirm --all-reviewed after listening')
    if args.limit < 1 or args.attempts < 1 or args.attempts > 5:
        parser.error('Positive limit and 1–5 attempts required')
    if args.command == 'progress':
        # Read-only inspection remains available while a batch holds the GPU generation lock.
        state = TOOL/'output/jobs.sqlite'
        if state.exists():
            with sqlite3.connect(f'file:{state}?mode=ro',uri=True) as db:
                print(json.dumps(progress(db,len(catalog()))))
        else:
            print(json.dumps(dict(total=len(catalog()),completed=0,remaining=len(catalog()),failed=0)))
        return
    config = json.loads(args.config.read_text())
    if not config.get('voiceApproved'):
        parser.error('The voice profile must first be approved by its owner')
    if config.get('locale','ru') != 'ru':
        parser.error('Only the approved Russian profile is enabled')
    if config.get('bitrate',96) not in (64,96,128):
        parser.error('Supported Vorbis bitrates: 64, 96, 128')
    for executable in ('ffmpeg','ffprobe','oggenc'):
        if shutil.which(executable) is None:
            parser.error(f'Missing required audio tool: {executable}')
    profile = profile_hash(config)
    lock_path = TOOL/'config/generation.lock'
    with lock_path.open('a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        db = database()
        entries = catalog()
        active={(entry['kind'],entry['id']) for entry in entries}
        for row in db.execute('SELECT kind,id FROM jobs').fetchall():
            if (row['kind'],row['id']) not in active:db.execute("UPDATE jobs SET status='archived' WHERE kind=? AND id=?",(row['kind'],row['id']))
        for entry in entries:
            digest = content_hash(entry, profile)
            previous = db.execute('SELECT hash FROM jobs WHERE kind=? AND id=?', (entry['kind'],entry['id'])).fetchone()
            if previous is None or previous['hash'] != digest:
                db.execute('INSERT OR REPLACE INTO jobs(kind,id,hash,status) VALUES(?,?,?,?)',
                           (entry['kind'],entry['id'],digest,'pending'))
        db.execute("UPDATE jobs SET status='failed',error='Interrupted previous generation' WHERE status='running'")
        db.commit()
        selected = [e for e in entries if args.kind == 'all' or args.kind == e['kind']]
        if args.id:
            selected = [e for e in selected if e['id'] == args.id]
            if not selected:
                parser.error('No matching stable ID in the selected catalog')
        if args.range:
            first,last = map(int,args.range.split(':'))
            if first < 1 or last < first:
                parser.error('Invalid one-based range')
            selected = selected[first-1:last]
        by_key = {(e['kind'],e['id']):e for e in selected}
        asset_root = ROOT/f"assets/audio/host/{config.get('locale','ru')}"
        if args.command in ('validate','flag','approve'):
            for row in db.execute('SELECT * FROM jobs').fetchall():
                if (row['kind'],row['id']) not in by_key:
                    continue
                try:
                    if args.command == 'flag':
                        db.execute("UPDATE jobs SET status='review',reviewed=0,error=? WHERE kind=? AND id=?",(args.reason,row['kind'],row['id']))
                    elif row['file']:
                        validate(asset_root/row['file'],by_key[(row['kind'],row['id'])]['spokenText'])
                        if sha(asset_root/row['file']) != row['audio_sha']:
                            raise ValueError('Audio content hash changed')
                        if args.command == 'approve':
                            db.execute("UPDATE jobs SET status='ready',reviewed=1,error=NULL WHERE kind=? AND id=?",(row['kind'],row['id']))
                except Exception as error:
                    db.execute("UPDATE jobs SET status='failed',error=? WHERE kind=? AND id=?",(str(error),row['kind'],row['id']))
                    print(f"FAIL {row['id']}: {error}",file=sys.stderr)
            db.commit()
        if args.command in ('generate','retry'):
            jobs = []
            for entry in selected:
                row = db.execute('SELECT * FROM jobs WHERE kind=? AND id=?',(entry['kind'],entry['id'])).fetchone()
                if args.command == 'retry' and row['status'] != 'failed':
                    continue
                if not args.force and row['status'] in ('ready','review') and row['file']:
                    try:
                        validate(asset_root/row['file'],entry['spokenText'])
                        if sha(asset_root/row['file']) == row['audio_sha']:
                            continue
                    except Exception:
                        pass
                jobs.append((entry,row))
            jobs = jobs[:args.limit]
            if len(jobs)>50 and not args.allow_large:
                parser.error('Large batch requires --allow-large; start with a small quality check')
            worker = None
            started = time.monotonic()
            size=sum(p.stat().st_size for p in asset_root.rglob('*.ogg'))
            log = (TOOL/'output/worker.log').open('a')
            try:
                if jobs:
                    worker = LocalWorker(args.config.resolve(),log)
                for index,(entry,row) in enumerate(jobs):
                    key = (entry['kind'],entry['id'])
                    db.execute("UPDATE jobs SET status='running',error=NULL WHERE kind=? AND id=?",key);db.commit()
                    for attempt in range(args.attempts):
                        try:
                            if worker is None:
                                worker=LocalWorker(args.config.resolve(),log)
                            wav = TOOL/f"output/lossless/{entry['kind']}/{entry['id']}_{row['hash'][:12]}_{time.time_ns()}.wav"
                            wav.parent.mkdir(parents=True,exist_ok=True)
                            filename = f"{entry['kind']}/{entry['id']}_{row['hash'][:12]}.ogg"
                            ogg = asset_root/filename;ogg.parent.mkdir(parents=True,exist_ok=True)
                            worker.generate(entry['spokenText'],wav,**entry.get('generation',{}))
                            validate(wav,entry['spokenText'])
                            # A retry can reuse its lossless source; final replacement is atomic.
                            candidate=ogg.with_name(ogg.stem+f'_{time.time_ns()}.ogg')
                            export_vorbis(wav,candidate,config.get('bitrate',96))
                            duration=validate(candidate,entry['spokenText'])
                            previous_size=ogg.stat().st_size if ogg.exists() else 0
                            candidate.replace(ogg);size+=ogg.stat().st_size-previous_size
                            status='review' if entry['kind']=='intro' else 'ready'
                            db.execute("UPDATE jobs SET status=?,attempts=coalesce(attempts,0)+1,file=?,wav=?,audio_sha=?,duration=?,error=NULL,processed_wav=NULL,processing_hash=NULL,reviewed=0 WHERE kind=? AND id=?",
                                       (status,filename,str(wav),sha(ogg),duration,*key));db.commit();break
                        except Exception as error:
                            db.execute("UPDATE jobs SET status='failed',attempts=coalesce(attempts,0)+1,error=? WHERE kind=? AND id=?",(str(error),*key));db.commit()
                            print(f"FAIL {entry['id']} attempt {attempt+1}: {error}",file=sys.stderr,flush=True)
                            if worker is not None and (isinstance(error,TimeoutError) or worker.process.poll() is not None):
                                worker.close();worker=None
                    if (index+1)%50==0 or index+1==len(jobs):
                        export_manifest(db,config,profile)
                    elapsed=time.monotonic()-started
                    print(json.dumps(dict(progress(db,len(entries)),current=entry['id'],jobsPerMinute=(index+1)*60/elapsed,
                                          etaSeconds=(len(jobs)-index-1)*elapsed/(index+1),outputBytes=size)),flush=True)
            finally:
                if worker is not None:
                    worker.close()
                log.close()
                export_manifest(db,config,profile)
        export_manifest(db,config,profile)
        print(json.dumps(progress(db,len(entries))),flush=True)
        db.close()


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Interrupted safely; completed jobs retained. Run generate/retry to resume.',file=sys.stderr)
        sys.exit(130)
