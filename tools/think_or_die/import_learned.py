"""Turn the answers players settled by vote (~/.finalanswer/think_or_die_learned.json) into verified content.

Accepted answers are written to more_zz_learned.py (merged by build_categories.py); rejected ones are printed as
traps to paste into cats_g.INVALID. Look the list over before committing: a room can vote wrong.
Usage: python3 tools/think_or_die/import_learned.py [path/to/think_or_die_learned.json]
"""
import json, os, sys
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
src = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser("~/.finalanswer/think_or_die_learned.json")
entries = json.load(open(src, encoding="utf-8"))["entries"] if os.path.exists(src) else []
ok, bad = defaultdict(list), defaultdict(list)
for e in entries:
    (ok if e["accepted"] else bad)[e["categoryId"]].append(e["text"].replace("|", " ").strip())
out = os.path.join(HERE, "more_zz_learned.py")
old = {}
if os.path.exists(out):
    ns = {}; exec(open(out, encoding="utf-8").read(), ns); old = ns.get("MORE", {})
for cid, texts in ok.items():
    have = set(old.get(cid, "").split("\n"))
    old[cid] = "\n".join(sorted(have | {f"{t}|{t}" for t in texts} - {""}))
with open(out, "w", encoding="utf-8") as f:
    f.write("# THINK OR DIE: answers players accepted by vote (tools/think_or_die/import_learned.py).\nMORE = {\n")
    for cid in sorted(old): f.write(f"    {cid!r}: {old[cid]!r},\n")
    f.write("}\n")
print(f"{sum(map(len, ok.values()))} accepted answers in {len(ok)} categories -> {out}")
for cid, texts in bad.items(): print(f"trap for cats_g.INVALID  {cid!r}: {'/'.join(texts)!r}")
