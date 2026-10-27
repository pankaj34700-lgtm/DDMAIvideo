import json, csv, collections, pathlib, re
ROOT = pathlib.Path(__file__).resolve().parent.parent
R = [json.loads(l) for l in open(ROOT/"rules/rules.jsonl")]
st = json.load(open(ROOT/"rules/stats.json"))
cats = collections.OrderedDict()
for r in R: cats.setdefault(r["category"], []).append(r)
L = ["# Video Agent Rulebook — 10,000 Rules", "",
 "Version 2.0 · Generated from `build/` · Do not edit by hand (edit tables/core rules and regenerate).", "",
 "## How agents use this book", "",
 "- **Read** the core rules (VR-00001 to VR-00467) at the start of every project.",
 "- **Look up** the derived rules for each exact choice with `tools/lookup.py` before writing prompts.",
 "- **Write** every 10-second scene as JSON (`templates/scene_spec.schema.json`) with both prompts per shot.",
 "- **Lint** every scene with `tools/lint_scene.py`; generation is blocked until it reports zero errors.",
 "- **Severity:** `block` = must never be violated; `major` = violation needs a logged reason; `minor` = guidance.",
 "- **Verdicts** on derived rules: BLOCK / AVOID (do not use), CAUTION (use with the named check), PREFERRED, ACCEPTABLE.",
 "- Rules are guards, not guarantees. Derived rules are computed from audited tables; verify them on first use and amend through post-mortems.", "",
 "## Composition", "",
 f"- Total: **{st['total']}** unique rules (0 duplicates; {st['low_relevance_trimmed']} lowest-relevance neutral rules trimmed to hit the target).",
 f"- Core: {st['by_family']['core-v1']} Part 1 rules (legacy IDs kept) + {st['by_family']['core-v2']} agent-operation and 10-second scene rules.",
 f"- Severity: {st['by_severity'].get('block',0)} block · {st['by_severity'].get('major',0)} major · {st['by_severity'].get('minor',0)} minor.", "",
 "## Contents", ""]
for c, rs in cats.items():
    L.append(f"- [{c}](#{re.sub(r'[^a-z0-9 -]','',c.lower()).replace(' ','-')}) — {len(rs)} rules ({rs[0]['id']}–{rs[-1]['id']})")
L.append("")
for c, rs in cats.items():
    L += [f"## {c}", ""]
    for r in rs:
        leg = f" (was {r['legacy_id']})" if r["legacy_id"] else ""
        src = f" — source: [{r['source_name']}]({r['source_url']})" if r["source_url"].startswith("http") else (f" — source: {r['source_name']}" if r["family"].startswith("core") else "")
        chk = f" · check: `{r['check']}`" if r["check"] and r["family"].startswith("core") else ""
        L.append(f"- **{r['id']}** `{r['severity']}`{leg} {r['instruction']}{chk}{src}")
    L.append("")
(ROOT/"rules/RULEBOOK_10000.md").write_text("\n".join(L))
with open(ROOT/"rules/rules.csv","w",newline="") as fh:
    w = csv.writer(fh); w.writerow(["id","category","family","type","severity","instruction","prompt_fragment","check","applies_to","source_name","source_url","legacy_id"])
    for r in R: w.writerow([r["id"],r["category"],r["family"],r["type"],r["severity"],r["instruction"],r["prompt_fragment"],r["check"],json.dumps(r["applies_to"]),r["source_name"],r["source_url"],r["legacy_id"] or ""])
print("ok", len(R), len(cats))
