#!/usr/bin/env python3
"""THINK OR DIE — live test you can watch on the real host screen.

Starts the local QA room server (if it is not already running), creates a room, opens the real host screen
(:lwjgl3:thinkOrDieLiveHost) and joins bot players over the real WebSocket protocol. Each bot types answers at about
35 WPM and sends them one after another for the whole 30 seconds: mostly correct answers (popular ones collide),
sometimes a wrong one, sometimes an unknown one that goes to the dispute vote (the bots vote). One bot starts as a
ghost and types faster with rare answers only, so you can watch a resurrection. Everything closes after the match.

    python3 tools/dev/think_or_die_test.py                 # 6 bots, Russian
    python3 tools/dev/think_or_die_test.py --lang en --players 8 --wpm 45
    python3 tools/dev/think_or_die_test.py --no-ghost
    python3 tools/dev/think_or_die_test.py --me --ai     # you play from your phone/browser too, local AI judge on

Needs: Java 21 (Gradle), python package `websockets`.
"""
import argparse, asyncio, json, os, random, signal, subprocess, sys, time, urllib.parse, urllib.request

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
PACK = {c['id']: c for c in json.load(open(os.path.join(ROOT, 'server/src/main/resources/think_or_die/categories.json'), encoding='utf-8'))['categories']}
NAMES = ['Alex', 'Max', 'Kate', 'Luna', 'Nick', 'Mira', 'Oleg', 'Vera']
UNKNOWN = {'ru': ['Что-то странное', 'Не знаю', 'Штука'], 'en': ['Some weird thing', 'Dunno', 'Stuff']}

def post(base, path, data):
    req = urllib.request.Request(base + path, data=urllib.parse.urlencode(data).encode(), method='POST',
                                 headers={'Content-Type': 'application/x-www-form-urlencoded'})
    with urllib.request.urlopen(req, timeout=10) as r: return json.load(r)

def healthy(base):
    try:
        with urllib.request.urlopen(base + '/health', timeout=1): return True
    except Exception: return False

def pool(cat_id, lang):
    """(correct answers in popularity order, wrong answers) for a category"""
    c = PACK[cat_id]
    rule = c.get('rule', {}).get('kind')
    if rule == 'PRIME': good = [str(p) for p in [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]]
    elif rule == 'DIVISIBLE_BY': good = [str(7 * k) for k in range(1, 30)]
    elif rule == 'SQUARE': good = [str(k * k) for k in range(1, 30)]
    elif rule: good = {'CONTAINS': ['antique', 'romantic', 'pantie', 'antibiotic', 'gigantic', 'semantic', 'mantis', 'antidote', 'antiques', 'antic'],
                       'STARTS_WITH': ['undo', 'unit', 'unable', 'uncle', 'under', 'unfair', 'unhappy', 'union', 'unknown', 'unlock'],
                       'ENDS_WITH': ['friendship', 'hardship', 'worship', 'membership', 'leadership', 'township', 'kinship', 'warship', 'airship', 'courtship']}.get(rule, [])
    else:
        idx = 1 if lang == 'ru' else 0
        good = [a[1].split('|')[idx] if len(a[1].split('|')) > idx and a[1].split('|')[idx] else a[1].split('|')[0] for a in c.get('answers', [])]
    bad = [x for x in c.get('invalid', []) if (any('Ѐ' <= ch <= 'ӿ' for ch in x)) == (lang == 'ru')] or ['xyz']
    if rule in ('PRIME', 'DIVISIBLE_BY', 'SQUARE'): bad = ['4', '10', '15', '22']
    return good, bad

class Bot:
    def __init__(self, name, seat, code, char_ms, ghost):
        self.name, self.seat, self.code, self.char_ms, self.ghost = name, seat, code, char_ms, ghost
        self.ws, self.round, self.sent = None, 0, 0

    async def cmd(self, type_, **payload):
        payload['roomCode'] = self.code
        await self.ws.send(json.dumps({'type': type_, 'requestId': os.urandom(6).hex(), 'payload': payload}))

async def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--url', default='http://localhost:18330'); ap.add_argument('--players', type=int, default=6)
    ap.add_argument('--wpm', type=float, default=35); ap.add_argument('--lang', choices=['ru', 'en'], default='ru')
    ap.add_argument('--no-ghost', action='store_true')
    ap.add_argument('--me', action='store_true', help='keep a seat for you: the match waits until you join from a phone or browser')
    ap.add_argument('--ai', action='store_true', help='start the AI judge from the flash drive and connect the server to it')
    a = ap.parse_args()
    import websockets
    names = NAMES[:max(1 if a.me else 2, min(7 if a.me else 8, a.players))]
    ghost = '' if a.no_ghost else names[-1]
    procs = []
    port = urllib.parse.urlparse(a.url).port or 80
    if a.ai and not healthy('http://127.0.0.1:18431'):
        pack = next((os.path.join('/Volumes', v, 'FinalAnswerAIPack') for v in os.listdir('/Volumes') if os.path.isdir(os.path.join('/Volumes', v, 'FinalAnswerAIPack'))), None)
        if not pack: sys.exit('AI pack not found: plug in the flash drive')
        print('starting the AI judge …')
        procs.append(subprocess.Popen([os.path.join(pack, 'Start AI Judge.command')], start_new_session=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL))
        for _ in range(120):
            if healthy('http://127.0.0.1:18431'): break
            time.sleep(1)
        else: sys.exit('AI judge did not start')
    if not healthy(a.url):
        print('starting the local QA server on port', port, '…')
        procs.append(subprocess.Popen(['./gradlew', '-q', ':server:raceQa', f'-Prace.port={port}'] + (['-Ptod.ai=http://127.0.0.1:18431'] if a.ai else []), cwd=ROOT, start_new_session=True))
        for _ in range(150):
            if healthy(a.url): break
            time.sleep(1)
        else: sys.exit('server did not start')
    host = post(a.url, '/rooms', {'name': 'THINK OR DIE TEST', 'maxPlayers': '8'})
    code = host['code']
    print('room', code, '— opening the host screen …')
    procs.append(subprocess.Popen(['./gradlew', '-q', ':lwjgl3:thinkOrDieLiveHost', f'-Ptod.url={a.url}', f'-Ptod.code={code}', f'-Ptod.token={host["token"]}',
                                   f'-Ptod.players={len(names) + (1 if a.me else 0)}', f'-Ptod.lang={a.lang}', f'-Ptod.ghost={ghost}'], cwd=ROOT, start_new_session=True))
    if a.me:
        import socket
        try: s0 = socket.socket(socket.AF_INET, socket.SOCK_DGRAM); s0.connect(('10.255.255.255', 1)); ip = s0.getsockname()[0]; s0.close()
        except Exception: ip = 'localhost'
        print(f"\n  JOIN: open http://{ip}:{port}/ on your phone (same Wi-Fi) or http://localhost:{port}/ here, room code {code}\n  the match starts as soon as you join\n")
    ws_url = a.url.replace('http', 'ws', 1) + '/ws'
    bots = []
    for i, n in enumerate(names):
        ident = post(a.url, f'/rooms/{code}/join', {'name': n})
        b = Bot(n, i, code, 60000 / ((a.wpm * 1.8 if n == ghost else a.wpm) * 5), n == ghost); b.token = ident['token']; bots.append(b)
    finished = asyncio.Event(); stats = {'sent': 0, 'rejected': 0}

    async def answer_round(b, s):
        good, bad = pool(s['categoryId'], a.lang)
        if b.ghost:   # rare tail answers only, distinct from everyone else's popular picks
            picks = good[len(good) // 2:]; random.shuffle(picks)
        else:
            head = good[:max(6, len(good) // 3)]; picks = random.sample(head, min(len(head), 8)) + random.sample(good, min(len(good), 6))
        if b.seat == 0: print(f'round {s["round"]}: {s["textRu"] if a.lang == "ru" else s["textEn"]}')
        await asyncio.sleep(random.uniform(.8, 2.5))
        used = set()
        for k in range(40):
            r = random.random()
            text = random.choice(bad) if (not b.ghost and r < .12) else random.choice(UNKNOWN[a.lang]) if (not b.ghost and r < .17) else (picks[k % len(picks)] if picks else 'x')
            if text in used and not b.ghost and random.random() < .7: continue
            used.add(text)
            await asyncio.sleep(len(text) * b.char_ms * random.uniform(.8, 1.2) / 1000 + random.uniform(.25, .9))
            if b.round != s['round'] or b.phase != 'ANSWERING': return
            await b.cmd('TOD_SUBMIT', sessionId=s['sessionId'], round=s['round'], text=text); stats['sent'] += 1

    async def run(b):
        async with websockets.connect(ws_url, max_size=4_000_000) as ws:
            b.ws = ws; b.phase = ''
            await ws.send(json.dumps({'type': 'AUTH', 'requestId': 'auth', 'payload': {'roomCode': code, 'token': b.token}}))
            voted = set()
            async def ping():
                while True:
                    await asyncio.sleep(8)
                    try: await b.cmd('PING')
                    except Exception: return
            pinger = asyncio.create_task(ping())
            async for raw in ws:
                ev = json.loads(raw); p = ev.get('payload') or {}
                if ev['type'] == 'THINK_OR_DIE_REJECTED': stats['rejected'] += 1
                s = p.get('thinkOrDie')
                if not s: continue
                b.phase = s['phase']
                if s['phase'] == 'ANSWERING' and s['round'] != b.round:
                    b.round = s['round']; asyncio.create_task(answer_round(b, s))
                if s['phase'] == 'DISPUTE':
                    for d in s.get('disputes', []):
                        if not d.get('mine') and d['id'] + str(s['round']) not in voted:
                            voted.add(d['id'] + str(s['round']))
                            await asyncio.sleep(random.uniform(.6, 3)); await b.cmd('TOD_VOTE', sessionId=s['sessionId'], disputeId=d['id'], accept=random.random() < .4)
                if s['phase'] in ('FINAL_RESULTS', 'COMPLETED') and b.seat == 0 and not finished.is_set():
                    finished.set()
                    print('final standings:')
                    for st in s.get('standings', []): print(f"  #{st['rank']}  {st['points']:5} pts  {st['correct']} correct  {st['unique']} unique  {st['incorrect']} wrong  +{st['souls']} souls" + ('  RESURRECTED' if st['resurrected'] else ''))
                if finished.is_set(): await asyncio.sleep(14); return

    try:
        await asyncio.gather(*(run(b) for b in bots))
        print(f"answers sent: {stats['sent']}, rejected by the server: {stats['rejected']}. Closing …")
    finally:
        for p in reversed(procs):
            try: os.killpg(p.pid, signal.SIGTERM)
            except ProcessLookupError: pass

if __name__ == '__main__':
    try: asyncio.run(main())
    except KeyboardInterrupt: pass
