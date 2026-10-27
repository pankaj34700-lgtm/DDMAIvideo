#!/usr/bin/env python3
"""Find the rules an agent must read before writing a shot.

usage examples
  python3 tools/lookup.py --subject "dog" --move "tracking shot" --lighting "golden hour" --framing wide --model veo_3_1_fast
  python3 tools/lookup.py --genre "product ad" --phase "video prompt"
  python3 tools/lookup.py --text "lip sync"          # free-text search
  python3 tools/lookup.py --id VR-00512
  python3 tools/lookup.py --subject "dog" --family subject-artifact --loose   # all failure checks for a subject
  python3 tools/lookup.py --move "slow orbit" --family move-artifact --loose  # failure checks for a move
  python3 tools/lookup.py --list subjects|moves|lighting|framings|genres|models|platforms
Always add the core rules: python3 tools/lookup.py --core
"""
import json, sys, argparse, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "build"))
import tables as T
RULES = [json.loads(l) for l in open(ROOT / "rules" / "rules.jsonl")]

p = argparse.ArgumentParser()
for k in ("subject", "move", "lighting", "framing", "model", "genre", "platform", "phase", "artifact", "text", "id", "list"):
    p.add_argument("--" + k)
p.add_argument("--core", action="store_true"); p.add_argument("--loose", action="store_true", help="match rules that mention any queried key (agreeing on shared keys)"); p.add_argument("--family"); p.add_argument("--max", type=int, default=200)
a = p.parse_args()

if a.list:
    m = {"subjects": T.SUBJECTS, "moves": T.MOVES, "lighting": T.LIGHTS, "framings": T.FRAMINGS, "genres": T.GENRES, "models": T.MODELS, "platforms": T.PLATFORMS}[a.list]
    print("\n".join(m)); sys.exit()
out = []
for r in RULES:
    at = r["applies_to"]
    if a.id: ok = r["id"] == a.id
    elif a.core: ok = r["family"].startswith("core")
    elif a.text: ok = a.text.lower() in r["instruction"].lower()
    else:
        want = {k: v for k, v in vars(a).items() if k in ("subject", "move", "lighting", "framing", "model", "genre", "platform", "phase", "artifact") and v}
        if not want or not at: continue
        vals = {k: v for k, v in at.items() if k != "verdict"}
        # a rule matches if all its keys are satisfied by the query (pair keys like move1 match --move too)
        def sat(k, v):
            base = k.rstrip("12")
            return want.get(base) == v
        if a.loose:
            shared = [k for k in vals if k.rstrip("12") in want]
            ok = bool(shared) and all(sat(k, vals[k]) for k in shared)
        else:
            ok = all(sat(k, v) for k, v in vals.items())
    if ok and a.family: ok = r["family"] == a.family
    if ok: out.append(r)
for r in out[: a.max]:
    print(f"{r['id']} [{r['severity']}] ({r['category']}) {r['instruction']}")
print(f"\n{len(out)} rule(s)" + (f", showing {a.max}" if len(out) > a.max else ""))
