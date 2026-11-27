#!/usr/bin/env python3
"""Merge the THINK OR DIE category content (cats_a.py ... cats_f.py) into
server/src/main/resources/think_or_die/categories.json.

Rerunnable: categories with the same id are replaced. Every answer of a letter-rule category is checked
against its own rule (same logic as RuleSteps.keeps); answers and aliases that break it are dropped, as are
aliases that collide with another answer and trap words that collide with a real answer.
Usage: python3 tools/think_or_die/build_categories.py
"""
import json, os, re, sys, unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import cats_a  # noqa: E402  (defines C and cat())
import cats_b, cats_c, cats_d, cats_e, cats_f  # noqa: E402,F401
import cats_h, cats_i, cats_j  # noqa: E402,F401  (second list of 100)
import cats_k, cats_l, cats_m, cats_n  # noqa: E402,F401  (third list, Russian first)
import cats_o, cats_p, cats_q  # noqa: E402,F401  (fourth list, 466-560)
import cats_g  # noqa: E402  (answers and traps learned from AI evaluation rounds)
import glob, importlib  # noqa: E402


def load_more():
    """more_*.py files: MORE = {category id: "English|Русский|alias/alias" lines} — hand-written extra answers."""
    more = {}
    for f in sorted(glob.glob(os.path.join(HERE, "more_*.py"))):
        m = importlib.import_module(os.path.basename(f)[:-3])
        for k, v in m.MORE.items():
            more[k] = (more[k] + "\n" + v) if k in more else v
    return more


def extend_old(c, lines, log):
    """Append answers to a hand-made category that lives only in the pack (not in cats_*.py)."""
    ans = c.setdefault("answers", [])
    seen = {akey(n) for a in ans for n in a[1].split("|") + a[2].split("|") if n}
    used = {a[0] for a in ans}
    seen |= {akey(w) for w in c.get("invalid", [])}  # never turn a known trap into an answer
    en_only = c.get("langs") == ["en"]
    for i, line in enumerate(l.strip() for l in lines.split("\n")):
        if not line: continue
        f = line.split("|")
        if en_only: en, ru, al = f[0], f[0], (f[1] if len(f) > 1 else "")
        else: en, ru, al = f[0], (f[1] if len(f) > 1 else f[0]), (f[2] if len(f) > 2 else "")
        if akey(en) in seen or akey(ru) in seen:
            continue
        names = [n for n in dict.fromkeys([en, ru] + al.split("/")) if n.strip() and akey(n) not in seen]
        seen.update(akey(n) for n in names)
        aliases = [n for n in names if n not in (en, ru)]
        ans.append([slug(en, used, len(ans)), f"{en}|{ru}", "|".join(aliases)])

PACK = os.path.join(HERE, "..", "..", "server", "src", "main", "resources", "think_or_die", "categories.json")
VOWELS = "aeiouаеёиоуыэюя"


def key(s):
    """Same idea as RareText.key: lower case, ё→е, accents dropped, letters and digits only."""
    s = unicodedata.normalize("NFD", s.lower().replace("ё", "е").replace("й", "\0"))
    s = "".join(c for c in s if unicodedata.category(c) != "Mn").replace("\0", "й")
    return "".join(c for c in s if c.isalnum() or c in "+#")


def akey(s):
    """key() without a leading English article, as the engine matches aliases."""
    return key(re.sub(r"^(the|a|an)\s+", "", s.strip(), flags=re.I)) or key(s)


def letters(s):
    return "".join(c for c in key(s) if c.isalpha())


def keeps(rule, k):
    kind, v, n = rule["kind"], key(rule.get("value", "")), rule.get("n", 0)
    if kind == "CONTAINS": return v in k and k != v
    if kind == "NOT_CONTAINS": return v not in k
    if kind == "STARTS_ENDS":
        a, b = (key(x) for x in rule["value"].split("|"))
        return len(k) > len(a) + len(b) - 1 and k.startswith(a) and k.endswith(b)
    if kind == "COUNT_LETTER": return k.count(v[0]) == n
    if kind == "STARTS_TWO_VOWELS": return len(k) >= 3 and k[0] in VOWELS and k[1] in VOWELS
    if kind == "STARTS_WITH": return k.startswith(v) and len(k) > len(v)
    if kind == "ENDS_WITH": return k.endswith(v) and len(k) > len(v)
    if kind == "LENGTH": return len(k) == n
    if kind == "PALINDROME": return len(k) >= 3 and k == k[::-1]
    if kind == "DOUBLE_LETTER": return any(k[i] == k[i - 1] for i in range(1, len(k)))
    if kind == "REPEAT_LETTER": return any(k.count(c) >= n for c in k)
    if kind == "SAME_ENDS": return len(k) >= 2 and k[0] == k[-1]
    if kind == "STARTS_VOWEL": return bool(k) and k[0] in VOWELS
    if kind == "STARTS_CONSONANT": return bool(k) and k[0].isalpha() and k[0] not in VOWELS and k[0] not in "ъьй"
    raise ValueError(kind)


def in_script(rule, k):
    return bool(re.fullmatch("[а-яё]+" if rule["lang"] == "ru" else "[a-z]+", k))


def slug(s, used, i):
    b = re.sub(r"[^a-z0-9]+", "_", unicodedata.normalize("NFKD", s.lower()).encode("ascii", "ignore").decode()).strip("_") or f"a{i}"
    out, n = b, 2
    while out in used: out, n = f"{b}_{n}", n + 1
    used.add(out)
    return out


def build(c, log):
    langs = c.get("langs") or ["en", "ru"]
    rule = c.get("rule")
    checked = rule and c["type"] not in ("WORD_RULE", "NUMERIC_RULE")
    answers, seen, used = [], {}, set()
    for i, line in enumerate(l.strip() for l in c["answers"].split("\n")):
        if not line: continue
        f = line.split("|")
        if langs == ["en"]:  # English only: "Label|alias/alias"
            en, ru, al = f[0], f[0], (f[1] if len(f) > 1 else "")
        else:
            en, ru, al = f[0], (f[1] if len(f) > 1 else f[0]), (f[2] if len(f) > 2 else "")
        if re.search(r"[A-Za-zА-Яа-яЁё]\d$", ru) or re.search(r"[A-Za-zА-Яа-яЁё]\d$", en):  # draft marker like "Ванна2"
            log.append(f"  {c['id']}: dropped draft entry '{line}'"); continue
        if checked and langs == ["ru"]: en = ru  # a Russian letter category does not accept the English name as a list answer
        names = [en, ru] + [a for a in al.split("/") if a.strip()]
        if checked:
            main = ru if rule["lang"] == "ru" else en
            if re.search(r"\d", main) or not (in_script(rule, letters(main)) and keeps(rule, letters(main))):
                log.append(f"  {c['id']}: dropped '{main}' (breaks {rule['kind']})"); continue
            # aliases in the rule's alphabet must keep the rule too; the other alphabet is refused by the engine anyway
            names = [n for n in names if not in_script(rule, letters(n)) or keeps(rule, letters(n))]
        keep = []
        for n in names:
            k = akey(n)
            if not k: continue
            if k in seen and seen[k] != i:
                if n in (en, ru) and not keep:
                    log.append(f"  {c['id']}: '{n}' already answered by another entry")
                continue
            seen[k] = i
            if n not in keep: keep.append(n)
        if not keep: continue
        en_l = en if key(en) in {key(x) for x in keep} else keep[0]
        ru_l = ru if key(ru) in {key(x) for x in keep} else en_l
        aliases = [n for n in keep if n not in (en_l, ru_l)]
        answers.append([slug(en, used, i), f"{en_l}|{ru_l}", "|".join(aliases)])
    invalid = []
    for w in (x.strip() for x in c["invalid"].split("/")):
        if not w or re.search(r"[A-Za-zА-Яа-яЁё]\d$", w): continue
        if key(w) in seen: log.append(f"  {c['id']}: trap '{w}' is a real answer, dropped"); continue
        if key(w) not in {key(x) for x in invalid}: invalid.append(w)
    o = {"id": c["id"], "v": 1, "type": c["type"], "group": c["group"]}
    if c.get("langs"): o["langs"] = c["langs"]
    o.update(en=c["en"], ru=c["ru"])
    if c.get("criteriaEn"): o["criteriaEn"] = c["criteriaEn"]
    if c.get("criteriaRu"): o["criteriaRu"] = c["criteriaRu"]
    if rule: o["rule"] = rule
    for f in ("allowUnknown", "exhaustive"):
        if f in c: o[f] = c[f]
    if invalid: o["invalid"] = invalid
    if answers: o["answers"] = answers
    return o


# Labels shown to the player when the first Enter writes an answer out in full: abbreviations become the full name
# (the short form stays an accepted spelling).
FULL = {
    "United States": "United States of America", "USA": "United States of America", "US": "United States of America",
    "США": "Соединённые Штаты Америки", "Соединённые Штаты": "Соединённые Штаты Америки",
    "UK": "United Kingdom", "UAE": "United Arab Emirates", "ОАЭ": "Объединённые Арабские Эмираты",
    "ЮАР": "Южно Африканская Республика", "ЦАР": "Центральноафриканская Республика", "CAR": "Central African Republic",
    "ДР Конго": "Демократическая Республика Конго", "DR Congo": "Democratic Republic of the Congo", "DRC": "Democratic Republic of the Congo",
    "КНДР": "Корейская Народно Демократическая Республика", "СССР": "Союз Советских Социалистических Республик",
    "USSR": "Union of Soviet Socialist Republics", "ООН": "Организация Объединённых Наций", "UN": "United Nations",
    "ISS": "International Space Station", "МКС": "Международная космическая станция",
    "ПТУ": "Профессионально техническое училище", "ОБЖ": "Основы безопасности жизнедеятельности",
    "ИЗО": "Изобразительное искусство", "МХК": "Мировая художественная культура",
    "ОРКСЭ": "Основы религиозных культур и светской этики", "ЛОР": "Оториноларинголог",
    "ДОТ": "Долговременная огневая точка", "АЗС": "Автозаправочная станция", "ФАП": "Фельдшерско акушерский пункт",
    "МЦК": "Московское центральное кольцо", "MMA": "Mixed martial arts", "ММА": "Смешанные единоборства",
    "MSG": "Monosodium glutamate", "DNA": "Deoxyribonucleic acid",
    "ATM": "Automated teller machine", "UPS": "Uninterruptible power supply",
    "ALU": "Arithmetic logic unit", "ECU": "European Currency Unit", "VCR": "Video cassette recorder",
    "DSLR": "Digital single lens reflex camera",
    "NYC": "New York City", "LA": "Los Angeles", "СПб": "Санкт Петербург", "Питер": "Санкт Петербург",
}


def full_labels(cats):
    for c in cats:
        if c.get("rule") or "two_word" in c["id"] or "letter" in c["id"]: continue  # the name itself is judged there
        for a in c.get("answers", []):
            labels = a[1].split("|")
            new = [FULL.get(l, l) for l in labels]
            if new == labels: continue
            have = {key(x) for x in new + (a[2].split("|") if a[2] else [])}
            extra = [l for l in labels if key(l) not in have and not have.add(key(l))]
            a[1] = "|".join(new); a[2] = "|".join(x for x in ([a[2]] if a[2] else []) + extra)


def check_unique_keys():
    import ast
    tree = ast.parse(open(os.path.join(HERE, "cats_g.py"), encoding="utf-8").read())
    for n in tree.body:
        if isinstance(n, ast.Assign) and isinstance(n.value, ast.Dict):
            keys = [k.value for k in n.value.keys]
            dup = {k for k in keys if keys.count(k) > 1}
            if dup: sys.exit(f"cats_g.{n.targets[0].id}: repeated keys {dup} (the later one would replace the earlier)")


def main():
    check_unique_keys()
    pack = json.load(open(PACK, encoding="utf-8"))
    new, log = [], []
    extra_more = load_more()
    for c in cats_a.C:
        if c["id"] in extra_more: c["answers"] += "\n" + extra_more[c["id"]]
        if c["id"] in cats_g.EXTRA:
            for x in cats_g.EXTRA[c["id"]].split("\n"):
                if x.startswith("+"):  # "+English label|alias/alias": more aliases for an existing answer
                    lab, more = x[1:].split("|", 1)
                    lines = c["answers"].split("\n")
                    i = next((n for n, l in enumerate(lines) if l.split("|")[0] == lab), None)
                    if i is None: sys.exit(f"{c['id']}: no answer '{lab}' to extend")
                    f = lines[i].split("|")
                    while len(f) < 3: f.append(f[0] if len(f) == 1 else "")
                    f[2] = "/".join(a for a in (f[2], more) if a)
                    lines[i] = "|".join(f); c["answers"] = "\n".join(lines)
                else:
                    c["answers"] += "\n" + x
        if c["id"] in cats_g.INVALID: c["invalid"] += "/" + cats_g.INVALID[c["id"]]
        new.append(build(c, log))
    ids = [c["id"] for c in new]
    dup = {i for i in ids if ids.count(i) > 1}
    if dup: sys.exit(f"duplicate ids: {dup}")
    old = [c for c in pack["categories"] if c["id"] not in set(ids)]
    for c in old:
        if c["id"] in extra_more: extend_old(c, extra_more[c["id"]], log)
    unknown = set(extra_more) - {c["id"] for c in pack["categories"]} - set(ids)
    if unknown: sys.exit(f"more_*.py: unknown category ids {unknown}")
    clash = [c["id"] for c in pack["categories"] if c["id"] in set(ids)]
    pack["categories"] = old + new
    full_labels(pack["categories"])
    pack["contentVersion"] = pack.get("contentVersion", 1) + 1
    with open(PACK, "w", encoding="utf-8") as f:
        f.write('{"contentVersion":%d,"categories":[\n' % pack["contentVersion"])
        f.write(",\n".join(json.dumps(c, ensure_ascii=False, separators=(",", ":")) for c in pack["categories"]))
        f.write("\n]}\n")
    print("\n".join(log))
    print(f"{len(new)} categories built ({len(clash)} replaced), pack now {len(pack['categories'])} categories, "
          f"{sum(len(c.get('answers', [])) for c in pack['categories'])} verified answers, contentVersion {pack['contentVersion']}")


if __name__ == "__main__":
    main()
