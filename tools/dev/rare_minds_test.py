#!/usr/bin/env python3
"""RARE MINDS — live test: three full rounds you can watch on the real host screen.

Starts the local QA room server (if it is not already running), creates a room, opens the real host screen
(:lwjgl3:rareMindsLiveHost) as the room's host, and joins six bot players over the real WebSocket protocol.
Every bot TYPES its answer at about 35 WPM (one character every ~343 ms, sometimes a typo fixed with backspace),
so you see the letters appear live on the host screen, then locks in. The plan produces collisions, a death zone,
rare answers and the jackpot. After the last round the script closes the window and the server it started.

    python3 tools/dev/rare_minds_test.py              # 3 rounds, Russian questions on screen
    python3 tools/dev/rare_minds_test.py --rounds 5 --lang en --wpm 35
    python3 tools/dev/rare_minds_test.py --duels      # the 1-on-1 DUELS format

Needs: Java 21 (Gradle), python package `websockets`.
"""
import argparse, asyncio, json, os, random, signal, subprocess, sys, time, urllib.parse, urllib.request

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
BANK = json.load(open(os.path.join(ROOT, 'server/src/main/resources/rare_minds/questions.json'), encoding='utf-8'))
NAMES = ['Alex', 'Max', 'Kate', 'Luna', 'Nick', 'Mira']
# per round: popularity rank of each bot's answer (equal numbers in one round collide)
PLAN = [[0, 0, 6, 14, 3, 22], [1, 9, 1, 17, 24, 5], [2, 12, 20, 2, 8, 27], [4, 4, 11, 19, 25, 7], [3, 15, 3, 10, 21, 26]]

def post(base, path, data):
    req = urllib.request.Request(base + path, data=urllib.parse.urlencode(data).encode(), method='POST',
                                 headers={'Content-Type': 'application/x-www-form-urlencoded'})
    with urllib.request.urlopen(req, timeout=10) as r: return json.load(r)

def healthy(base):
    try:
        with urllib.request.urlopen(base + '/health', timeout=1): return True
    except Exception: return False

def ranked(qid, lang):
    q = next(x for x in BANK['questions'] if x['id'] == qid)
    labels = [a[2].split('|') for a in sorted(q['answers'], key=lambda a: -a[1])]
    return [l[1] if lang == 'ru' and len(l) > 1 else l[0] for l in labels]

class Bot:
    def __init__(self, name, seat, code, ws_url, char_ms):
        self.name, self.seat, self.code, self.ws_url, self.char_ms = name, seat, code, ws_url, char_ms
        self.state, self.ws = None, None

    async def cmd(self, type_, **payload):
        payload['roomCode'] = self.code
        await self.ws.send(json.dumps({'type': type_, 'requestId': os.urandom(6).hex(), 'payload': payload}))

    async def type_answer(self, s, text):
        """type at ~35 WPM, now and then a wrong key corrected with backspace"""
        cur = ''
        for ch in text:
            if cur and random.random() < .07:
                cur += random.choice('qwertyuiopasdfghjkl')
                await self.cmd('RM_DRAFT', sessionId=s['sessionId'], question=s['question'], text=cur, risk=False)
                await asyncio.sleep(self.char_ms * random.uniform(1.3, 2.2) / 1000)
                cur = cur[:-1]
                await self.cmd('RM_DRAFT', sessionId=s['sessionId'], question=s['question'], text=cur, risk=False)
                await asyncio.sleep(self.char_ms / 1000)
            cur += ch
            await self.cmd('RM_DRAFT', sessionId=s['sessionId'], question=s['question'], text=cur, risk=False)
            await asyncio.sleep(self.char_ms * random.uniform(.75, 1.25) / 1000)

async def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--url', default='http://localhost:18330'); ap.add_argument('--rounds', type=int, default=3)
    ap.add_argument('--wpm', type=float, default=35); ap.add_argument('--duels', action='store_true', help='force the 1-on-1 DUELS format (normally 15%% with an even table)'); ap.add_argument('--lang', choices=['ru', 'en'], default='ru')
    a = ap.parse_args()
    import websockets
    char_ms = 60000 / (a.wpm * 5)
    procs = []
    port = urllib.parse.urlparse(a.url).port or 80
    if not healthy(a.url):
        print('starting the local QA server on port', port, '…')
        procs.append(subprocess.Popen(['./gradlew', '-q', ':server:raceQa', f'-Prace.port={port}'], cwd=ROOT, start_new_session=True))
        for _ in range(120):
            if healthy(a.url): break
            time.sleep(1)
        else: sys.exit('server did not start')
    host = post(a.url, '/rooms', {'name': 'RARE MINDS TEST', 'maxPlayers': '8'})
    code = host['code']
    print('room', code, '— opening the host screen …')
    procs.append(subprocess.Popen(['./gradlew', '-q', ':lwjgl3:rareMindsLiveHost', f'-Prm.url={a.url}', f'-Prm.code={code}',
                                   f'-Prm.token={host["token"]}', f'-Prm.players={len(NAMES)}', f'-Prm.lang={a.lang}', f'-Prm.format={"DUELS" if a.duels else ""}'], cwd=ROOT, start_new_session=True))
    ws_url = a.url.replace('http', 'ws', 1) + '/ws'
    bots = []
    for i, n in enumerate(NAMES):
        ident = post(a.url, f'/rooms/{code}/join', {'name': n})
        b = Bot(n, i, code, ws_url, char_ms); b.token = ident['token']; bots.append(b)

    done = asyncio.Event()
    async def run(b):
        async with websockets.connect(ws_url, max_size=4_000_000) as ws:
            b.ws = ws
            await ws.send(json.dumps({'type': 'AUTH', 'requestId': 'auth', 'payload': {'roomCode': code, 'token': b.token}}))
            seen = 0
            async for raw in ws:
                ev = json.loads(raw); p = ev.get('payload') or {}
                if ev['type'] == 'RARE_MINDS_REJECTED': print(f'  {b.name}: rejected {p.get("code")}')
                s = p.get('rareMinds')
                if not s: continue
                if s['phase'] == 'QUESTION_ACTIVE' and s['question'] != seen:
                    seen = s['question']
                    if seen > a.rounds: done.set(); return
                    asyncio.create_task(play(b, s))
                if done.is_set(): return

    async def play(b, s):
        q = s['question']; answers = ranked(s['questionId'], a.lang)
        text = answers[PLAN[(q - 1) % len(PLAN)][b.seat] % len(answers)]
        if b.seat == 0: print(f'round {q}: {s["textRu"] if a.lang == "ru" else s["textEn"]}')
        await asyncio.sleep(random.uniform(1.0, 5.5))           # read the question, think
        await b.type_answer(s, text)
        await asyncio.sleep(random.uniform(.4, 1.6))            # hesitate, then lock in
        await b.cmd('RM_SUBMIT', sessionId=s['sessionId'], question=q, text=text, risk=False)
        print(f'  {b.name:5} → {text}')

    try:
        await asyncio.gather(*(run(b) for b in bots))
        print(f'{a.rounds} rounds played. Closing in 4 s …'); await asyncio.sleep(4)
    finally:
        for p in reversed(procs):
            try: os.killpg(p.pid, signal.SIGTERM)
            except ProcessLookupError: pass

if __name__ == '__main__':
    try: asyncio.run(main())
    except KeyboardInterrupt: pass
