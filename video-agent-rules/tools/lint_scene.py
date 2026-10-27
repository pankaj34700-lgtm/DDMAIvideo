#!/usr/bin/env python3
"""Validate a 10-second scene spec against the rulebook BEFORE any generation.

usage: python3 tools/lint_scene.py scene.json [--json]
exit 0 = no ERROR findings (generation may proceed after human/agent review)
exit 1 = at least one ERROR (fix before generating)

ERROR = rule severity 'block' or a derived AVOID/BLOCK verdict
WARN  = severity 'major' or CAUTION verdict
A clean lint does not mean a good clip. Review is still required (rule in REV).
"""
import json, re, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "build"))
from tables import MODELS, MOVES, SUBJECTS, LIGHTS, FRAMINGS, GENRES, PLATFORMS, TEN_SECOND_PLANS

RULES = [json.loads(l) for l in open(ROOT / "rules" / "rules.jsonl")]
def rid(substr):
    for r in RULES:
        if substr in r["instruction"]: return r["id"]
    return "VR-?????"
# stable lookup of the core rules this linter enforces
R = {k: rid(v) for k, v in {
    "total10": "must total exactly 10.0 seconds", "plans": "No model in this toolchain generates exactly 10 seconds",
    "stretch": "Never reach 10 seconds by time-stretching", "ids": "Scene IDs follow P##_S##",
    "lock": "Every scene spec carries the full lock sheet reference", "aspect_same": "All scenes in a production use the same aspect ratio",
    "chain_veo": "Only use 'chain' for shot 2 on Veo models", "img_required": "Every shot that starts from a keyframe has an image prompt",
    "style_first": "Start every image prompt with the locked style string", "colors": "Name 3-5 locked color anchors in every image prompt",
    "slogans": "No quality slogans in image prompts", "img_text": "No requested on-screen text in keyframes",
    "counts": "State exact subject counts", "i2v_only_motion": "the video prompt describes only motion and change",
    "one_move": "Exactly one camera move per shot", "one_action": "Exactly one primary subject action per shot",
    "speed": "Give every move a speed word", "end_state": "State what is still at the end of the shot",
    "audio_line": "Always include an audio line", "veo_quotes": "On Veo, put dialogue in quotation marks",
    "no_subs": "Add 'no subtitles, no on-screen text'", "no_params": "Do not write parameters in prose",
    "length": "Keep the video prompt under about 80 words", "fine_motor": "Never ask for fine motor tasks",
    "narr": "Narration budget per 10-second scene", "dlg": "On-camera dialogue budget per 10-second scene",
    "duration_ok": "confirm the model accepts the requested duration", "aspect_ok": "confirm the model honors the requested aspect ratio",
    "refs": "reference image count does not exceed the model limit", "audio_ok": "confirm the audio setting will actually be honored",
    "sens": "scan for real-person names, celebrity references", "approval": "Get explicit approval with the cost stated",
    "two_shots_diff": "Never make both shots the same framing and the same camera move", "beat": "Each 10-second scene carries exactly one story beat",
    "seedance916": "do not plan Seedance 2.0 shots", "todo": "Unknown facts are marked TODO_VERIFY",
}.items()}

# derived-rule index: frozenset(applies_to without verdict) -> rule
IDX = {}
for r in RULES:
    a = {k: v for k, v in r["applies_to"].items() if k != "verdict"}
    if a: IDX[(r["family"], tuple(sorted(a.items())))] = r
def derived(family, **kw):
    return IDX.get((family, tuple(sorted(kw.items()))))

SLOGANS = ["masterpiece", "8k", "4k", "best quality", "ultra-detailed", "ultra detailed", "hyper-detailed", "trending on", "award-winning", "highly detailed", "ultra realistic", "ultra-realistic"]
TEXT_REQ = re.compile(r"\b(text (that )?(says|reads)|the words?|caption reading|sign (that )?(says|reads)|logo (that )?(says|reads)|written)\b", re.I)
FINE = re.compile(r"\b(writes?|writing|types?|typing|ties? (his|her|their)? ?(shoe)?laces|deals? cards|plays? (a|the) [a-z]+ chord|signs? (his|her|their) name|threads? a needle)\b", re.I)
PARAMS = re.compile(r"\b(\d+\s?(s|sec|secs|seconds)\b|1080p|720p|2k|4k|16:9|9:16|1:1|aspect ratio|frame ?rate|\d+\s?fps)\b", re.I)
SPEED = re.compile(r"\b(slow(ly)?|gentle|gently|steady|steadily|smooth(ly)?|rapid(ly)?|fast|quick(ly)?|sudden(ly)?|gradual(ly)?|brisk(ly)?|subtle|locked-off|static)\b", re.I)
VAGUE_COUNT = re.compile(r"\b(some|a few|several|many|a group of|a bunch of)\b", re.I)
SENS = re.compile(r"\b(celebrity|famous|lookalike|look-alike|in the style of [A-Z][a-z]+|passport|driver'?s licen[cs]e|id card|receipt|invoice|bank statement|screenshot of|cctv|bodycam|body-cam|before and after|before/after|nike|adidas|coca[- ]cola|pepsi|apple logo|iphone|mcdonald|disney|marvel|pokemon|mickey|starbucks|tesla|bmw|mercedes|ferrari)\b", re.I)
MINOR = re.compile(r"\b(child|children|kid|kids|toddler|baby|boy|girl|teen|teenager|minor|schoolchild)\b", re.I)
STRETCH = re.compile(r"\b(atempo|setpts|asetpts|time-?stretch|speed (it )?up|slow (it )?down the (clip|audio)|minterpolate)\b", re.I)
MOVE_TERMS = {
    "static locked-off": [r"static", r"locked-off", r"locked off", r"no camera movement"], "slow push-in": [r"push-in", r"push in"],
    "slow pull-back": [r"pull-back", r"pull back"], "dolly in": [r"dolly in"], "dolly out": [r"dolly out"], "tracking shot": [r"tracking"],
    "lateral truck": [r"truck"], "slow orbit": [r"orbit"], "crane up": [r"crane up"], "crane down": [r"crane down"], "tilt up": [r"tilt up"],
    "tilt down": [r"tilt down"], "pan left": [r"pan left"], "pan right": [r"pan right"], "whip pan": [r"whip pan"],
    "handheld subtle": [r"handheld"], "handheld intense": [r"handheld"], "drone aerial": [r"aerial", r"drone"], "fpv drone": [r"fpv"],
    "rack focus": [r"rack focus", r"focus shifts", r"focus pull"], "crash zoom": [r"crash zoom"], "slow zoom out": [r"zoom out"],
    "POV walk": [r"\bpov\b", r"first-person"], "arc dolly": [r"arc", r"arcing"],
}
ALL_MOVE_RE = re.compile(r"\b(static|locked-off|push-in|push in|pull-back|pull back|dolly in|dolly out|tracking|truck|orbit|crane up|crane down|tilt up|tilt down|pan left|pan right|whip pan|handheld|aerial|drone|fpv|rack focus|crash zoom|zoom out|zoom in|arcing)\b", re.I)
STOP = set("a an the and or of to in on at with for from by as is are be its it this that his her their into onto over under while then".split())
def words(t): return [w for w in re.findall(r"[a-z']+", (t or "").lower())]
def content(t): return [w for w in words(t) if w not in STOP and len(w) > 2]

F = []
def find(level, rule, where, msg): F.append(dict(level=level, rule=rule, where=where, msg=msg))
def verdict_find(r, where, label):
    if not r: return
    v = r["applies_to"].get("verdict")
    if v in ("AVOID", "BLOCK"): find("ERROR", r["id"], where, f"{label}: {v} - {r['instruction'][:220]}")
    elif v == "CAUTION": find("WARN", r["id"], where, f"{label}: CAUTION - {r['instruction'][:220]}")

def lint(sc):
    shots = sc.get("shots", [])
    if not re.fullmatch(r"P\d{2}_S\d{2}", sc.get("scene_id", "")): find("WARN", R["ids"], "scene", "scene_id must match P##_S##")
    if not sc.get("lock_version"): find("ERROR", R["lock"], "scene", "missing lock_version")
    lock = sc.get("lock", {})
    style, colors, aspect = lock.get("style", ""), lock.get("colors", []), lock.get("aspect", sc.get("aspect"))
    if not sc.get("beat") or len(re.split(r"[.;!?]\s", sc["beat"].strip())) > 1: find("WARN", R["beat"], "scene", "beat must be one sentence")
    if not sc.get("cost_approval_id"): find("ERROR", R["approval"], "scene", "no cost approval id; video is billed per second")
    blob = json.dumps(sc)
    if "TODO_VERIFY" in blob: find("ERROR", R["todo"], "scene", "unverified facts (TODO_VERIFY) present")
    if STRETCH.search(sc.get("post_plan", "")): find("ERROR", R["stretch"], "post_plan", "time-stretch/speed change is forbidden")

    # duration plan
    if not shots: find("ERROR", R["total10"], "scene", "no shots"); return
    models = {s.get("model") for s in shots}
    total = sum(s.get("duration", 0) for s in shots) - sc.get("planned_cut", 0)
    if abs(total - 10) > 0.04: find("ERROR", R["total10"], "scene", f"delivered total is {total}s, must be 10s (durations minus planned_cut)")
    if len(models) == 1:
        mk = models.pop()
        if mk in TEN_SECOND_PLANS:
            ok = any([s.get("duration") for s in shots] == p[1] and sc.get("planned_cut", 0) == p[2] for p in TEN_SECOND_PLANS[mk])
            if not ok: find("ERROR", R["plans"], "scene", f"plan not valid for {mk}; options: {[p[0] for p in TEN_SECOND_PLANS[mk]]}")

    nw = len(words(sc.get("narration", "")))
    if nw > 25: find("WARN", R["narr"], "narration", f"{nw} words; budget about 20-25 per 10s scene")

    for i, s in enumerate(shots):
        w = s.get("shot_id", f"shot{i+1}")
        mk, M = s.get("model"), MODELS.get(s.get("model"))
        if not re.fullmatch(r"P\d{2}_S\d{2}_SH\d", s.get("shot_id", "")): find("WARN", R["ids"], w, "shot_id must match P##_S##_SH#")
        if not M: find("ERROR", R["duration_ok"], w, f"unknown model {mk}"); continue
        if s.get("duration") not in M["durations"]: find("ERROR", R["duration_ok"], w, f"{M['label']} cannot generate {s.get('duration')}s; allowed {M['durations']}")
        if aspect not in M["aspects"]: find("ERROR", R["seedance916"] if mk == "seedance_2_0" else R["aspect_ok"], w, f"{M['label']} cannot output {aspect}")
        if s.get("aspect", aspect) != aspect: find("ERROR", R["aspect_same"], w, "shot aspect differs from lock aspect")
        if len(s.get("refs", [])) > M["refs"]: find("WARN", R["refs"], w, f"{len(s['refs'])} refs; {M['label']} uses {M['refs']} (extras silently dropped)")
        if s.get("audio_off") and not M["audio_off"]: find("WARN", R["audio_ok"], w, f"{M['label']} ignores audio_off; add a strip step in post (no cost saving)")
        start = s.get("start")
        if start not in ("keyframe", "chain", "text"): find("ERROR", R["img_required"], w, "start must be keyframe, chain or text")
        if start == "chain" and i == 0: find("ERROR", R["chain_veo"], w, "shot 1 cannot be chained")
        if start == "chain" and not mk.startswith("veo"): find("ERROR", R["chain_veo"], w, "chaining requires a Veo model")

        ip, vp = s.get("image_prompt", ""), s.get("video_prompt", "")
        if start == "keyframe":
            if not ip: find("ERROR", R["img_required"], w, "keyframe shot has no image_prompt")
            else:
                if style and not ip.strip().lower().startswith(style.strip().lower()): find("ERROR", R["style_first"], w, "image_prompt must start with the locked style string verbatim")
                hits = [c for c in colors if c.lower() in ip.lower()]
                if colors and len(hits) < min(3, len(colors)): find("WARN", R["colors"], w, f"only {len(hits)} locked color anchors in image_prompt")
                if VAGUE_COUNT.search(ip): find("WARN", R["counts"], w, f"vague count '{VAGUE_COUNT.search(ip).group(0)}'; state exact numbers")
        for fld, txt in (("image_prompt", ip), ("video_prompt", vp)):
            for sl in SLOGANS:
                if sl in txt.lower(): find("ERROR", R["slogans"], w, f"{fld}: quality slogan '{sl}'")
            if TEXT_REQ.search(txt): find("ERROR", R["img_text"], w, f"{fld}: on-screen text requested; add text in post")
            if SENS.search(txt): find("ERROR", R["sens"], w, f"{fld}: sensitive reference '{SENS.search(txt).group(0)}' - resolve under trust boundaries")
            if MINOR.search(txt) and s.get("subject") != "child character (stylized)": find("WARN", R["sens"], w, f"{fld}: possible minor '{MINOR.search(txt).group(0)}'; must be clearly stylized and benign")

        if not vp: find("ERROR", R["one_move"], w, "missing video_prompt")
        else:
            moves_found = {m.group(0).lower() for m in ALL_MOVE_RE.finditer(vp)}
            if "static" in moves_found and moves_found & {"locked-off"}: moves_found.discard("locked-off")
            if len(moves_found) == 0: find("ERROR", R["one_move"], w, "no camera move named in video_prompt")
            elif len(moves_found) > 1 and not (moves_found <= {"aerial", "drone"} or moves_found <= {"static", "locked-off"}):
                find("ERROR", R["one_move"], w, f"more than one camera move named: {sorted(moves_found)}")
            mv = s.get("move")
            if mv in MOVE_TERMS and not any(re.search(p, vp, re.I) for p in MOVE_TERMS[mv]): find("WARN", R["one_move"], w, f"declared move '{mv}' not found in video_prompt")
            if not SPEED.search(vp): find("WARN", R["speed"], w, "no speed word (slow, steady, rapid...)")
            if PARAMS.search(vp): find("WARN", R["no_params"], w, f"parameter in prose: '{PARAMS.search(vp).group(0)}' - set it as a parameter instead")
            if FINE.search(vp): find("ERROR", R["fine_motor"], w, f"fine-motor task '{FINE.search(vp).group(0)}'")
            lim = 80 if start in ("keyframe", "chain") else 150
            if len(words(vp)) > lim: find("WARN", R["length"], w, f"video_prompt {len(words(vp))} words; limit about {lim}")
            if start == "keyframe" and ip:
                ipw, vpc = set(content(ip)), content(vp)
                ov = sum(1 for x in vpc if x in ipw) / max(1, len(vpc))
                if ov >= 0.5: find("ERROR", R["i2v_only_motion"], w, f"{ov:.0%} of video_prompt words repeat the image; describe motion and change only")
            beats = [b for b in re.split(r",\s*then\s|\bthen\b|;", vp) if b.strip()]
        if not s.get("end_state"): find("WARN", R["end_state"], w, "missing end_state")
        if not s.get("audio"): find("ERROR", R["audio_line"], w, "missing audio line")
        dlg = s.get("dialogue", [])
        if dlg:
            dw = sum(len(words(d.get("line", ""))) for d in dlg)
            if dw > 2.5 * s.get("duration", 0): find("ERROR", R["dlg"], w, f"{dw} dialogue words for {s.get('duration')}s; budget {int(2.5 * s.get('duration', 0))}")
            if "subtitle" not in (vp + s.get("audio", "")).lower(): find("WARN", R["no_subs"], w, "add 'no subtitles, no on-screen text'")
            if mk.startswith("veo") and not all('"' in vp and d.get("line", "")[:12].lower() in vp.lower() for d in dlg):
                find("WARN", R["veo_quotes"], w, "put each dialogue line in quotes, attributed, inside video_prompt")

        sub, mv, li, fr = s.get("subject"), s.get("move"), s.get("lighting"), s.get("framing")
        if sub and sub not in SUBJECTS: find("WARN", "VR-?????", w, f"subject '{sub}' not in rule tables; no derived checks applied")
        if sub in SUBJECTS:
            if mv: verdict_find(derived("subject-move", subject=sub, move=mv), w, "subject x move")
            if li: verdict_find(derived("subject-light", subject=sub, lighting=li), w, "subject x lighting")
            if fr: verdict_find(derived("subject-framing", subject=sub, framing=fr), w, "subject x framing")
            verdict_find(derived("model-subject", model=mk, subject=sub), w, "model x subject")
        if mv: verdict_find(derived("model-move", model=mk, move=mv), w, "model x move")
        g = sc.get("genre")
        if g in GENRES and mv: verdict_find(derived("genre-move", genre=g, move=mv), w, "genre x move")
        if g in GENRES and li: verdict_find(derived("genre-light", genre=g, lighting=li), w, "genre x lighting")
        if mv and li: verdict_find(derived("move-light", move=mv, lighting=li), w, "move x lighting")
        if mv and fr: verdict_find(derived("move-framing", move=mv, framing=fr), w, "move x framing")
        others = [x for x in s.get("subjects", []) if x != sub]
        for o in others:
            verdict_find(derived("subject-pair", subject1=sub, subject2=o) or derived("subject-pair", subject1=o, subject2=sub), w, "two subjects")

    if len(shots) >= 2:
        a, b = shots[0], shots[1]
        if a.get("framing") == b.get("framing") and a.get("move") == b.get("move"): find("ERROR", R["two_shots_diff"], "cut", "both shots have same framing and move")
        verdict_find(derived("cut-move", move1=a.get("move"), move2=b.get("move")), "cut", "internal cut move pair")
        verdict_find(derived("cut-framing", framing1=a.get("framing"), framing2=b.get("framing")), "cut", "internal cut framing pair")
        verdict_find(derived("cut-light", lighting1=a.get("lighting"), lighting2=b.get("lighting")), "cut", "internal cut lighting")

def main():
    if len(sys.argv) < 2: print(__doc__); sys.exit(2)
    sc = json.load(open(sys.argv[1]))
    lint(sc)
    order = {"ERROR": 0, "WARN": 1}
    F.sort(key=lambda f: order[f["level"]])
    if "--json" in sys.argv: print(json.dumps(F, indent=2))
    else:
        for f in F: print(f"{f['level']:5} {f['rule']}  [{f['where']}] {f['msg']}")
        e = sum(f["level"] == "ERROR" for f in F); wn = sum(f["level"] == "WARN" for f in F)
        print(f"\n{e} error(s), {wn} warning(s). " + ("BLOCKED: fix errors before generating." if e else "No blocking errors. Review warnings, then generate."))
    sys.exit(1 if any(f["level"] == "ERROR" for f in F) else 0)

if __name__ == "__main__": main()
