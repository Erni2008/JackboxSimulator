#!/usr/bin/env python3
"""RARE MINDS — review answers the game did not recognise, and grow the bank.

The server counts every answer it could not match (per question) in rare_minds_unrecognized.json next to the
rarity stats file (default ~/.finalanswer/). This tool shows the most frequent ones and adds them to
server/src/main/resources/rare_minds/questions.json — as a spelling/synonym of an existing answer, or as a new answer.

    python3 tools/dev/rare_minds_review.py                       # top unrecognised answers for every question
    python3 tools/dev/rare_minds_review.py --question medicine   # one question, with its existing answer ids
    python3 tools/dev/rare_minds_review.py --alias medicine paracetamol "парацетомол"      # add a synonym/spelling
    python3 tools/dev/rare_minds_review.py --add medicine nurofen_plus "Nurofen Plus|Нурофен Плюс" 3   # new answer
    python3 tools/dev/rare_minds_review.py --file path/to/rare_minds_unrecognized.json

Restart the server afterwards; the correction and false-positive tests (./gradlew :server:test) check the new data.
"""
import argparse, json, os, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
BANK = os.path.join(ROOT, 'server/src/main/resources/rare_minds/questions.json')

def load_bank(): return json.load(open(BANK, encoding='utf-8'))
def save_bank(d):
    s = json.dumps(d, ensure_ascii=False, separators=(',', ':')).replace(',{"id"', ',\n{"id"').replace('"questions":[{', '"questions":[\n{')
    open(BANK, 'w', encoding='utf-8').write(s)

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--file', default=os.path.expanduser('~/.finalanswer/rare_minds_unrecognized.json'))
    ap.add_argument('--question'); ap.add_argument('--top', type=int, default=15)
    ap.add_argument('--alias', nargs=3, metavar=('QUESTION', 'ANSWER_ID', 'TEXT'))
    ap.add_argument('--add', nargs=4, metavar=('QUESTION', 'NEW_ID', 'EN|RU', 'POPULARITY'))
    a = ap.parse_args()
    bank = load_bank(); qs = {q['id']: q for q in bank['questions']}
    if a.alias:
        qid, aid, text = a.alias; q = qs.get(qid) or sys.exit(f'no question {qid}')
        ans = next((x for x in q['answers'] if x[0] == aid), None) or sys.exit(f'no answer {aid} in {qid}')
        extra = [t for t in (ans[3].split('|') if len(ans) > 3 and ans[3] else []) if t]
        if text.lower() in (t.lower() for t in extra + ans[2].split('|')): sys.exit('already there')
        extra.append(text)
        if len(ans) > 3: ans[3] = '|'.join(extra)
        else: ans.append('|'.join(extra))
        save_bank(bank); print(f'added "{text}" to {qid}/{aid}'); return
    if a.add:
        qid, nid, labels, pop = a.add; q = qs.get(qid) or sys.exit(f'no question {qid}')
        if any(x[0] == nid for x in q['answers']): sys.exit(f'{nid} exists')
        pop = int(pop); assert 1 <= pop <= 100, 'popularity 1..100'
        q['answers'].append([nid, pop, labels, '']); save_bank(bank); print(f'new answer {qid}/{nid}: {labels}'); return
    if not os.path.exists(a.file): sys.exit(f'nothing recorded yet ({a.file})')
    unknown = json.load(open(a.file, encoding='utf-8')).get('unknown', {})
    for qid, counts in sorted(unknown.items()):
        if a.question and qid != a.question: continue
        top = sorted(counts.items(), key=lambda kv: -kv[1])[:a.top]
        if not top: continue
        q = qs.get(qid); print(f'\n{qid} — {q["en"] if q else "?"}')
        for text, n in top: print(f'  {n:4}×  {text}')
        if a.question and q: print('  answer ids:', ', '.join(x[0] for x in q['answers']))

if __name__ == '__main__': main()
