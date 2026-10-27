"""Build the 10,000-rule agent rulebook.

Layers
  1. Core v1 rules (parsed from the Part 1 rulebook, 303 entries, legacy IDs kept)
  2. Core v2 agent-operations rules (core_new.py)
  3. Derived rules: one principle applied to one concrete combination, computed
     from tables.py. Every derived rule carries a verdict, a reason built from
     the table facts, a prompt fragment and a check.
Lowest-relevance derived rules are trimmed so the total is exactly TARGET.
"""
import json, re, hashlib, itertools, pathlib, collections
from tables import *
from core_new import CORE_NEW

ROOT = pathlib.Path(__file__).resolve().parent.parent
TARGET = 10000
V1 = pathlib.Path("/home/user/workspace/video-production-rulebook.md")

SOURCES = {
    "veo": ("Google Veo 3.1 Gemini API docs", "https://ai.google.dev/gemini-api/docs/veo"),
    "sora": ("OpenAI Sora 2 Prompting Guide", "https://developers.openai.com/cookbook/examples/sora/sora2_prompting_guide"),
    "guide": ("Toolchain video production guide", "skills/media/video-production/GUIDE.md"),
    "media": ("Toolchain media skill", "skills/media/SKILL.md"),
    "models": ("Toolchain video model docs (verified Oct 2026)", "skills/media/models/video-models*.md"),
    "speech": ("Toolchain speech guide", "skills/media/speech/guide.md"),
    "trust": ("Toolchain trust-boundaries policy", "skills/media/images/trust-boundaries.md"),
    "team": ("Team convention (heuristic; amend from post-mortems)", ""),
    "derived": ("Derived from rule tables (build/tables.py); verify on first use", ""),
    "v1": ("Rulebook Part 1 v1.1", "video-production-rulebook.md"),
}

rules = []
def add(cat, family, typ, sev, instr, check="", frag="", src="derived", applies=None, relevance=1.0, legacy=None):
    rules.append(dict(category=cat, family=family, type=typ, severity=sev, instruction=instr.strip(),
                      prompt_fragment=frag, check=check, source=src, applies_to=applies or {},
                      relevance=relevance, legacy_id=legacy))

# ---------------------------------------------------------------- layer 1
cur = None
for line in V1.read_text().splitlines():
    h = re.match(r"^##+\s+(?:[\d.]+\s+)?(.+)", line)
    if h: cur = re.sub(r"\s*\((LOCK|RULE|COND)\)\s*$", "", h.group(1)).strip()
    m = re.match(r"^- \*\*((?:L|R)-\d+)\*\*\s+(.*)", line)
    if m:
        lid, txt = m.groups()
        typ = "LOCK" if lid.startswith("L") else "RULE"
        sev = "block" if any(w in txt for w in ("Never", "never", "Do not", "No ", "must")) else "major"
        add(cur, "core-v1", typ, sev, txt, src="v1", legacy=lid, relevance=99)
assert sum(r["legacy_id"] is not None for r in rules) == 303, "v1 parse count changed"

# ---------------------------------------------------------------- layer 2
for cat, typ, sev, instr, chk, src in CORE_NEW:
    add(cat, "core-v2", typ, sev, instr, check=chk, src=src, relevance=99)

# ---------------------------------------------------------------- helpers
def arts_for(tags, extra=()):
    out = [(n, a) for n, a in ARTIFACTS.items() if a["tags"] & tags]
    out.sort(key=lambda x: (-len(x[1]["tags"] & tags), x[0]))
    return out
def top_art(tags, prefer=()):
    for p in prefer:
        if p in ARTIFACTS and ARTIFACTS[p]["tags"] & tags: return p, ARTIFACTS[p]
    a = arts_for(tags)
    return a[0] if a else ("end-of-clip collapse", ARTIFACTS["end-of-clip collapse"])
DET = {n: d["detail"] for n, d in FRAMINGS.items()}
def art(w): return ("an " if w[0].lower() in "aeiou" else "a ") + w
OBJ_FRAG = {"medium wide": "medium wide shot, subject and nearby surroundings in frame", "medium": "medium shot, subject filling about half the frame",
            "medium close-up": "medium close-up, subject filling most of the frame with a little context", "wide": "wide shot, whole subject and surroundings visible"}
def ffrag(fn, s): return OBJ_FRAG.get(fn, FRAMINGS[fn]["frag"]) if s["group"] not in ("people",) else FRAMINGS[fn]["frag"]
def sev_of(v): return {"AVOID": "major", "BLOCK": "block", "CAUTION": "major", "PREFERRED": "minor", "ACCEPTABLE": "minor"}[v]

# ---------------------------------------------------------------- F1 subject x move
for (sn, s), (mn, m) in itertools.product(SUBJECTS.items(), MOVES.items()):
    reasons, v = [], "ACCEPTABLE"
    t = s["tags"]
    if sn == "app or website UI":
        v = "BLOCK"; reasons.append("existing interfaces must be shown with real screenshots, not generated footage")
    elif "text" in t and s["group"] == "graphics" and m["space"] >= 1:
        v = "AVOID"; reasons.append("moves that reveal new area force the model to invent more glyphs")
    elif s["risk"] == 3 and m["energy"] == 3:
        v = "AVOID"; reasons.append(f"a high-risk subject ({s['fails']}) combined with a high-energy move compounds artifacts")
    elif "speech" in t and m["energy"] >= 2:
        v = "AVOID"; reasons.append("camera travel during speech makes lip-sync errors more visible and pulls attention off the face")
    elif "fine" in t and m["blur"] >= 2:
        v = "CAUTION"; reasons.append("fine detail smears under fast or blurring moves")
    elif "rigid" in t and m["space"] == 2:
        v = "CAUTION"; reasons.append("this move reveals unseen sides, so rigid shapes may warp or be redesigned")
    elif "brand" in t and m["space"] == 2:
        v = "CAUTION"; reasons.append("revealing unseen sides of a branded item invites label and shape invention")
    if v == "ACCEPTABLE":
        if set(m["good"]) & set(s["best"]) and (s["risk"] < 3 or m["energy"] == 1):
            v = "PREFERRED"; reasons.append(f"it suits the subject's best framings ({', '.join(sorted(set(m['good']) & set(s['best'])))}) and {m['note']}")
        else:
            reasons.append(f"usable as deliberate variety; the move's typical framings ({', '.join(m['good'][:2])}) differ from this subject's best ({', '.join(s['best'][:2])})")
    an, a = top_art(t, prefer=(["face identity drift"] if m["space"] == 2 and "face" in t else []) +
                    (["morphing rigid objects"] if m["space"] >= 1 and "rigid" in t else []) +
                    (["flicker / strobing"] if m["blur"] == 3 else []) +
                    (["extra or missing limbs"] if m["energy"] == 3 else []))
    frag = f"{m['frag']}; {s['motion']}" + ("; moving left to right" if m["parallax"] and "fast" in t else "")
    instr = (f"{sn.capitalize()} with {art(mn)} move: {v}. Reason: {reasons[0]}." +
             ("" if v == "BLOCK" else f" Prompt fragment: \"{frag}\". After generation, check for {an}: {a['detect']}."))
    rel = {"BLOCK": 9, "AVOID": 8, "CAUTION": 6, "PREFERRED": 7, "ACCEPTABLE": 2}[v]
    add("Derived: Subject x Camera Move", "subject-move", "COND", sev_of(v), instr,
        check=f"if shot.subject=='{sn}' and shot.move=='{mn}' -> {v}", frag="" if v == "BLOCK" else frag,
        applies=dict(subject=sn, move=mn, verdict=v), relevance=rel)

# ---------------------------------------------------------------- F2 subject x lighting
for (sn, s), (ln, l) in itertools.product(SUBJECTS.items(), LIGHTS.items()):
    t, notes, v = s["tags"], [], "ACCEPTABLE"
    if l["flicker"] == 2 and t & {"fire", "flicker", "fine", "particles"}:
        v = "AVOID"; notes.append("a flickering source on an already flicker-prone subject risks strobing, a photosensitivity hard fail")
    elif l["flicker"] >= 1 and t & {"fine", "fur", "hair"}:
        v = "CAUTION"; notes.append("moving light on fine strands or texture tends to boil; ask for steady light")
    elif l["contrast"] == 2 and t & {"face", "speech"}:
        v = "CAUTION"; notes.append("hard contrast can hide the eyes and mouth; add a fill so both eyes stay readable")
    elif "reflective" in t and ln in ("neon practicals", "hard midday sun", "stage spotlight"):
        v = "CAUTION"; notes.append("strong point sources make reflections swim on glossy surfaces")
    elif "text" in t or "screen" in t:
        v = "CAUTION"; notes.append("lighting cannot fix generated text; keep surfaces blank and composite text in post")
    if v == "ACCEPTABLE":
        if s["group"] in ("products",) and ln in ("high-key studio", "rim backlight", "soft window light"):
            v = "PREFERRED"; notes.append(f"it shows shape and material clearly ({l['mood']})")
        elif s["group"] in ("nature", "places") and ln in ("golden hour", "blue hour", "overcast diffuse", "dappled forest", "volumetric haze", "moonlight", "overcast rain"):
            v = "PREFERRED"; notes.append(f"natural light suits environments ({l['mood']})")
        elif s["group"] == "people" and ln in ("soft window light", "three-point interview", "golden hour", "overcast diffuse"):
            v = "PREFERRED"; notes.append(f"soft key light flatters faces ({l['mood']})")
        elif s["group"] == "food" and ln in ("soft window light", "golden hour", "high-key studio"):
            v = "PREFERRED"; notes.append("soft directional light brings out texture and steam")
        else:
            notes.append(f"it reads as {l['mood']}; use it when that mood is the brief's intent")
    skin = f" Skin note: {l['skin']}." if s["group"] == "people" else ""
    frag = l["frag"] + (", steady light without flicker" if l["flicker"] else "")
    instr = f"{sn.capitalize()} under {ln}: {v}. {notes[0][0].upper() + notes[0][1:]}.{skin} Prompt fragment: \"{frag}\"."
    add("Derived: Subject x Lighting", "subject-light", "COND", sev_of(v), instr,
        check=f"if shot.subject=='{sn}' and shot.lighting=='{ln}' -> {v}", frag=frag,
        applies=dict(subject=sn, lighting=ln, verdict=v), relevance={"AVOID": 8, "CAUTION": 6, "PREFERRED": 7, "ACCEPTABLE": 2}[v])

# ---------------------------------------------------------------- F3 subject x framing
for (sn, s), (fn, f) in itertools.product(SUBJECTS.items(), FRAMINGS.items()):
    best = [DET[b] for b in s["best"]]
    dist = min(abs(f["detail"] - b) for b in best)
    if fn in s["best"]: v, why = "PREFERRED", f"it is one of this subject's strongest framings, good to {f['purpose']}"
    elif fn == "over-the-shoulder" and "multi" not in s["tags"] and s["group"] != "people":
        v, why = "AVOID", "over-the-shoulder needs a second person whose shoulder frames the shot"
    elif dist >= 2: v, why = "AVOID", ("this is too close: the model must invent detail it cannot hold" if f["detail"] > max(best) else "this is too far: the subject becomes small and loses its defining detail")
    else: v, why = "ACCEPTABLE", f"one step from the subject's best framing; use it to {f['purpose']}"
    risk = ""
    if f["detail"] >= 3 and "hands" in s["tags"]: risk = " At this distance hands dominate; keep them in one simple pose."
    if f["detail"] >= 3 and "face" in s["tags"]: risk += " Close framings magnify identity drift; compare against the character sheet."
    if f["detail"] == 0 and "face" in s["tags"]: risk += " Faces at this distance tend to melt; accept them as silhouettes or keep them out of focus."
    instr = f"{sn.capitalize()} framed as {fn}: {v}. Reason: {why}.{risk} Prompt fragment: \"{ffrag(fn, s)}\"."
    add("Derived: Subject x Framing", "subject-framing", "COND", sev_of(v), instr,
        check=f"if shot.subject=='{sn}' and shot.framing=='{fn}' -> {v}", frag=ffrag(fn, s),
        applies=dict(subject=sn, framing=fn, verdict=v), relevance={"AVOID": 7, "PREFERRED": 6, "ACCEPTABLE": 3}[v])

# ---------------------------------------------------------------- F4 subject x artifact
for (sn, s) in SUBJECTS.items():
    for an, a in arts_for(s["tags"]):
        ov = len(a["tags"] & s["tags"])
        instr = (f"Shooting {sn}: guard against {an} (severity {a['sev']}). Prevent in the prompt: {a['prevent']}. "
                 f"Detect in review: {a['detect']}. If it appears: {a['fix']}.")
        add("Derived: Subject x Failure Mode", "subject-artifact", "CHECK", a["sev"] if a["sev"] == "block" else "major", instr,
            check=f"review({sn}) includes '{an}'", applies=dict(subject=sn, artifact=an), relevance=4 + ov + (3 if a["sev"] == "block" else 0))

# ---------------------------------------------------------------- F5 model x subject
for (mk, M), (sn, s) in itertools.product(MODELS.items(), SUBJECTS.items()):
    t, v, why = s["tags"], "ACCEPTABLE", ""
    if sn == "app or website UI": v, why = "BLOCK", "no generation model can reproduce a real interface; use screenshots stitched in ffmpeg"
    elif "speech" in t and mk.startswith("veo"): v, why = "PREFERRED", "Veo is the starting choice for dialogue; still verify words and lip sync"
    elif "speech" in t: v, why = "CAUTION", "dialogue starts on Veo in this toolchain; verify words, lip sync and unwanted sound if you use this model"
    elif "minor" in t and mk: v, why = "CAUTION", "any model: keep the design clearly stylized and the context benign; review for realism creep"
    elif "fast" in t and mk == "seedance_2_0": v, why = "PREFERRED", "lower-cost choice for motion-heavy landscape drafts; check limbs and identity"
    elif s["group"] == "products" and mk == "minimax_h3": v, why = "PREFERRED", "2K output and opening/final frame pairs suit precise product reveals"
    elif s["group"] in ("nature", "places") and mk == "seedance_2_5": v, why = "PREFERRED", "a continuous take up to 30s suits slow environmental shots; check drift"
    elif M["default"]: v, why = "PREFERRED", "default model for short cinematic shots and image-to-video"
    else: why = f"usable; strengths: {M['strengths']}"
    plans = " or ".join(p[0] for p in TEN_SECOND_PLANS[mk])
    extra = f" Aspect limits: {', '.join(M['aspects'])}. Watch: {M['watch']}." if v != "BLOCK" else ""
    instr = f"{sn.capitalize()} on {M['label']}: {v}. {why[0].upper()+why[1:]}. 10-second plan options: {plans}.{extra}"
    add("Derived: Model x Subject", "model-subject", "COND", sev_of(v), instr,
        check=f"if shot.model=='{mk}' and shot.subject=='{sn}' -> {v}", applies=dict(model=mk, subject=sn, verdict=v),
        relevance={"BLOCK": 9, "CAUTION": 6, "PREFERRED": 6, "ACCEPTABLE": 3}[v])

# ---------------------------------------------------------------- F6 model x move
for (mk, M), (mn, m) in itertools.product(MODELS.items(), MOVES.items()):
    if m["energy"] == 3 and mk == "seedance_2_0": v, why = "PREFERRED", "a lower-cost route for motion-heavy drafts"
    elif m["energy"] == 3 and mk.startswith("veo"): v, why = "CAUTION", "fast moves are possible but inspect object deformation closely"
    elif m["space"] == 2 and mk == "seedance_2_5": v, why = "CAUTION", "long reveals in 30s takes drift; check identity and lost actions at the end"
    elif m["energy"] == 1 and mk.startswith("veo"): v, why = "PREFERRED", "short slow cinematic moves are Veo's strongest case"
    elif mk == "minimax_h3" and mn in ("slow push-in", "slow orbit", "slow pull-back", "arc dolly"): v, why = "PREFERRED", "pair an opening and a final frame to pin the move's start and end"
    else: v, why = "ACCEPTABLE", f"no specific interaction known; still watch {M['watch']}"
    chain = " This route supports last-frame chaining for a continuation shot." if M["chain"] else " Do not chain from this route; give shot 2 its own keyframe."
    instr = f"{mn.capitalize()} on {M['label']}: {v}. {why[0].upper()+why[1:]}.{chain}"
    add("Derived: Model x Camera Move", "model-move", "COND", sev_of(v), instr,
        check=f"if shot.model=='{mk}' and shot.move=='{mn}' -> {v}", applies=dict(model=mk, move=mn, verdict=v),
        relevance={"CAUTION": 5, "PREFERRED": 5, "ACCEPTABLE": 2}[v])

# ---------------------------------------------------------------- F7 genre x phase
PH = {
 "brief": lambda g, G: f"In the brief for {art(g)}, state the purpose as '{G['purpose']}' and the primary format as {G['platform']}.",
 "research": lambda g, G: f"Research for {art(g)} must specifically clear the genre's main risk: {G['risk']}.",
 "script": lambda g, G: f"Script {art(g)} so scene 1 delivers the hook ({G['hook']}) and the last scene delivers the CTA ({G['cta']}).",
 "lock sheet": lambda g, G: f"Default lock-sheet lighting for {art(g)} is {G['light']}; deviate only with a logged reason.",
 "storyboard": lambda g, G: f"Storyboard {art(g)} at {G['pacing']}; inside each 10-second scene that means splitting shots to match that rhythm.",
 "keyframe image prompt": lambda g, G: f"Keyframes for {art(g)} use the {G['light']} lighting fragment and compose for {G['camera']} moves that follow.",
 "video prompt": lambda g, G: f"Video prompts for {art(g)} draw camera moves from: {G['camera']}. Other moves need a reason in the rationale field.",
 "generation": lambda g, G: f"Generate {art(g)} on Veo 3.1 Fast by default" + ("; dialogue shots stay on Veo." if "dialogue" in G['audio'] else "; choose another model only for a logged shot need."),
 "clip QA": lambda g, G: f"Clip QA for {art(g)} adds a genre-specific check: {G['risk']}.",
 "audio": lambda g, G: f"Audio design for {art(g)}: {G['audio']}. Define it in every shot's audio line.",
 "edit": lambda g, G: f"Edit {art(g)} at {G['pacing']}; trim generated heads and tails before judging pacing.",
 "captions & text": lambda g, G: f"Captions and text for {art(g)} are added in post; the CTA text is '{G['cta']}'.",
 "export": lambda g, G: f"Export {art(g)} for {G['platform']}, yuv420p, with platform loudness checked.",
 "delivery": lambda g, G: f"Deliver {art(g)} with the lock-sheet deliverables and a final check that the CTA ({G['cta']}) is visible and correct.",
 "post-mortem": lambda g, G: f"Post-mortem for {art(g)}: record whether '{G['risk']}' occurred and which rule IDs prevented or failed to prevent it.",
}
for (gn, G), ph in itertools.product(GENRES.items(), PHASES):
    add(f"Derived: Genre Playbook - {ph}", "genre-phase", "COND", "major" if ph in ("research", "clip QA") else "minor",
        PH[ph](gn, G), check=f"genre=='{gn}' and phase=='{ph}'", applies=dict(genre=gn, phase=ph), relevance=5)

# ---------------------------------------------------------------- F8 genre x move
for (gn, G), (mn, m) in itertools.product(GENRES.items(), MOVES.items()):
    cam = G["camera"].lower()
    key = mn.split()[0].lower().replace("locked-off", "static")
    hit = key in cam or (mn.startswith("static") and "static" in cam) or (mn.startswith("handheld") and "handheld" in cam) or (mn.startswith("drone") and "drone" in cam)
    fast = any(x in G["pacing"] for x in ("1-3", "1-4", "2-3", "2-4", "beat"))
    if hit: v, why = "PREFERRED", f"it is part of the genre's camera language ({G['camera']})"
    elif m["energy"] == 3 and not fast: v, why = "AVOID", f"its energy clashes with the genre's {G['pacing']} pacing"
    elif m["energy"] == 1 and fast and mn != "static locked-off": v, why = "CAUTION", f"a slow move can drag at {G['pacing']}; keep it to the 4-second shot"
    else: continue  # neutral pairs carry no specific guidance
    add("Derived: Genre x Camera Move", "genre-move", "COND", sev_of(v),
        f"{gn.capitalize()} using {art(mn)}: {v}. Reason: {why}.", check=f"genre=='{gn}' and move=='{mn}' -> {v}",
        frag=m["frag"], applies=dict(genre=gn, move=mn, verdict=v), relevance={"AVOID": 6, "CAUTION": 4, "PREFERRED": 5}[v])

# ---------------------------------------------------------------- F9 genre x lighting
for (gn, G), (ln, l) in itertools.product(GENRES.items(), LIGHTS.items()):
    base = gn.split()[0].replace("/", "")
    hit = ln == G["light"] or any(base in x or x in gn for x in l["genres"])
    if hit: v, why = "PREFERRED", f"its mood ({l['mood']}) fits the genre's purpose: {G['purpose']}"
    elif l["contrast"] == 2 and gn in ("e-commerce listing", "education lesson", "explainer", "training / onboarding", "kids storybook (stylized)", "real estate"):
        v, why = "AVOID", "hard, high-contrast light hides the information this genre must show clearly"
    elif l["flicker"] == 2 and gn in ("e-commerce listing", "tech / SaaS demo", "training / onboarding"):
        v, why = "AVOID", "flickering light distracts from accurate demonstration"
    else: continue
    add("Derived: Genre x Lighting", "genre-light", "COND", sev_of(v),
        f"{gn.capitalize()} lit with {ln}: {v}. Reason: {why}. Fragment: \"{l['frag']}\".",
        check=f"genre=='{gn}' and lighting=='{ln}' -> {v}", frag=l["frag"], applies=dict(genre=gn, lighting=ln, verdict=v), relevance=5)

# ---------------------------------------------------------------- F10 genre x platform
for (gn, G), (pn, P) in itertools.product(GENRES.items(), PLATFORMS.items()):
    native = P["ratio"].split()[0] in G["platform"]
    instr = (f"{gn.capitalize()} for {pn}: aspect {P['ratio']}, length {P['length']}, hook within {P['hook']} using '{G['hook']}'. "
             f"Safe zones: {P['safe']}. Captions: {P['captions']}." +
             ("" if native else f" This is not the genre's primary platform ({G['platform']}); lock the aspect ratio before generating instead of cropping later."))
    add("Derived: Genre x Platform", "genre-platform", "COND", "minor", instr, check=f"genre=='{gn}' and platform=='{pn}'",
        applies=dict(genre=gn, platform=pn), relevance=4 if native else 2)

# ---------------------------------------------------------------- F11 move x lighting
for (mn, m), (ln, l) in itertools.product(MOVES.items(), LIGHTS.items()):
    if l["flicker"] >= 1 and m["blur"] >= 2: v, why = "AVOID" if l["flicker"] == 2 or m["blur"] == 3 else "CAUTION", "motion blur plus moving light compounds into flicker"
    elif l["contrast"] == 2 and m["parallax"]: v, why = "CAUTION", "parallax under hard light makes shadows swim across surfaces"
    elif l["contrast"] == 0 and m["energy"] == 1: v, why = "PREFERRED", "even light keeps slow moves clean and artifact-light"
    elif ln == "volumetric haze" and m["parallax"]: v, why = "PREFERRED", "parallax through light beams gives strong depth"
    else: continue
    add("Derived: Camera Move x Lighting", "move-light", "COND", sev_of(v),
        f"{mn.capitalize()} under {ln}: {v}. Reason: {why}.", check=f"move=='{mn}' and lighting=='{ln}' -> {v}",
        frag=f"{m['frag']}, {l['frag']}", applies=dict(move=mn, lighting=ln, verdict=v), relevance=5)

# ---------------------------------------------------------------- F12 move x framing
for (mn, m), (fn, f) in itertools.product(MOVES.items(), FRAMINGS.items()):
    if fn in m["good"]: v, why = "PREFERRED", f"{m['note']}"
    elif f["detail"] >= 3 and m["space"] == 2: v, why = "AVOID", "large travel at close distance produces disorienting, artifact-heavy motion"
    elif f["detail"] == 0 and mn in ("rack focus", "crash zoom", "handheld subtle"): v, why = "AVOID", "the effect is invisible or meaningless at extreme distance"
    else: v, why = "ACCEPTABLE", f"workable but not this move's natural scale ({', '.join(m['good'][:2])})"
    add("Derived: Camera Move x Framing", "move-framing", "COND", sev_of(v),
        f"{mn.capitalize()} on {art(fn)}: {v}. Reason: {why}.", check=f"move=='{mn}' and framing=='{fn}' -> {v}",
        applies=dict(move=mn, framing=fn, verdict=v), relevance={"AVOID": 5, "PREFERRED": 4, "ACCEPTABLE": 1}[v])

# ---------------------------------------------------------------- F13 subject x phase
def sound_for(s):
    t = s["tags"]
    if "speech" in t: return "the exact spoken line in quotes plus quiet room tone"
    if s["group"] == "animals": return "natural sounds of the animal and its environment; no music unless locked"
    if s["group"] == "vehicles": return "engine or motion sound and environment ambience"
    if s["group"] == "elements": return "the element's own sound (crackle, hiss, rumble) at a natural level"
    if s["group"] == "food": return "sizzle, pour or crunch sounds close-miked"
    if s["group"] == "nature": return "environmental ambience (wind, water, birds)"
    if s["group"] in ("products", "graphics"): return "subtle whoosh or tactile sound; music bed in post"
    return "location ambience matched to the setting"
SP = {
 "brief": lambda n, s: f"If the brief includes {n}, flag its risk level ({s['risk']}/3)" + (f" and the sensitivity '{s['sensitive']}' for trust-boundary review." if s["sensitive"] else "."),
 "research": lambda n, s: f"Before featuring {n}, gather references that pin down: {s['anchors']}.",
 "storyboard": lambda n, s: f"Storyboard {n} in its strongest framings: {', '.join(s['best'])}.",
 "keyframe image prompt": lambda n, s: f"Keyframe prompts for {n} must state: {s['anchors']}.",
 "video prompt": lambda n, s: f"Video prompts for {n} describe motion as: {s['motion']}.",
 "generation": lambda n, s: f"Generating {n}: " + ("use real screenshots, not generation." if n == "app or website UI" else "start on Veo 3.1 Fast" + (" and verify lip sync." if "speech" in s["tags"] else "; switch model only for a logged need.")),
 "clip QA": lambda n, s: f"QA for {n} looks first for its known failures: {s['fails']}.",
 "audio": lambda n, s: f"Audio line for {n}: {sound_for(s)}.",
 "edit": lambda n, s: f"When editing {n}, cut away before the clip's final second if {s['fails'].split(',')[0]} appears there.",
 "post-mortem": lambda n, s: f"Post-mortem for {n}: log which of these failures occurred ({s['fails']}) and the prompt change that fixed it.",
}
for (sn, s), ph in itertools.product(SUBJECTS.items(), SP):
    add(f"Derived: Subject Playbook - {ph}", "subject-phase", "COND", "major" if ph in ("brief", "clip QA") and s["risk"] == 3 else "minor",
        SP[ph](sn, s), check=f"subject=='{sn}' and phase=='{ph}'", applies=dict(subject=sn, phase=ph), relevance=4 + s["risk"] / 3)

# ---------------------------------------------------------------- F14 subject x platform
for (sn, s), (pn, P) in itertools.product(SUBJECTS.items(), PLATFORMS.items()):
    vert = P["ratio"].startswith("9:16")
    tall = s["group"] in ("people", "products", "food") or sn in ("building architecture", "waterfall / river")
    wide = s["group"] in ("nature", "vehicles") or sn in ("crowd", "city street", "train")
    if vert and wide: note = f"wide subjects lose context in 9:16; frame {sn} from a higher or further angle and keep the key element in the center third"
    elif vert and "multi" in s["tags"]: note = f"{sn} is hard to fit in 9:16; stage subjects in depth (one near, one far) rather than side by side"
    elif vert and tall: note = f"{sn} fits vertical framing well; place the focal point in the upper-middle third, clear of the caption zone"
    elif not vert and tall: note = f"in {P['ratio']} leave negative space beside {sn} for text, using rule-of-thirds placement"
    else: note = f"{P['ratio']} suits {sn}; use horizontal layering for depth"
    add("Derived: Subject x Platform", "subject-platform", "COND", "minor",
        f"{sn.capitalize()} for {pn}: {note}. Safe zones: {P['safe']}.", check=f"subject=='{sn}' and platform=='{pn}'",
        applies=dict(subject=sn, platform=pn), relevance=3 if (vert and wide) else 2)

# ---------------------------------------------------------------- F15 model x genre
for (mk, M), (gn, G) in itertools.product(MODELS.items(), GENRES.items()):
    probs = []
    if "9:16" in G["platform"] and "9:16" not in M["aspects"]: probs.append("cannot output 9:16 for this genre's vertical platform")
    if "dialogue" in G["audio"] and not mk.startswith("veo"): probs.append("dialogue should start on Veo")
    if ("silent" in G["audio"] or "VO" in G["audio"] or "narration" in G["audio"]) and not M["audio_off"]: probs.append("forced native audio must be stripped for VO-only scenes (no cost saving)")
    v = "CAUTION" if probs else ("PREFERRED" if M["default"] else "ACCEPTABLE")
    instr = f"{M['label']} for {art(gn)}: {v}." + (" Issues: " + "; ".join(probs) + "." if probs else f" Strengths for this genre: {M['strengths']}.")
    add("Derived: Model x Genre", "model-genre", "COND", sev_of(v), instr, check=f"model=='{mk}' and genre=='{gn}' -> {v}",
        applies=dict(model=mk, genre=gn, verdict=v), relevance=5 if probs else 2)

# ---------------------------------------------------------------- F16 artifact x stage
for an, a in ARTIFACTS.items():
    for stage, text_ in [("script", f"While scripting, avoid actions that invite {an}; {a['cause']} is the usual cause."),
                         ("prompt", f"In prompts, prevent {an}: {a['prevent']}."),
                         ("review", f"In review, detect {an}: {a['detect']}."),
                         ("fix", f"To fix {an}: {a['fix']}. Log the rule IDs involved.")]:
        add(f"Derived: Failure Mode - {stage}", "artifact-stage", "CHECK", "block" if a["sev"] == "block" else "major", text_,
            applies=dict(artifact=an, stage=stage), relevance=8)

# ---------------------------------------------------------------- F17 10-second recipes: subject x scene pattern
PATTERNS = {
 "establish then detail": ("wide", "close-up", "the place, then the telling detail"),
 "detail then reveal": ("close-up", "wide", "a mystery detail, then context"),
 "action then reaction": ("medium", "medium close-up", "something happens, then a response"),
 "approach then arrival": ("wide", "medium", "the subject travels, then arrives"),
 "continuous take": ("medium wide", "medium wide", "one unbroken action chained across both shots"),
 "slow build": ("medium", "close-up", "calm, then intensity rises"),
 "hero moment": ("medium", "wide", "focus, then the triumphant scale"),
 "question then answer": ("medium close-up", "medium", "a problem shown, then the solution"),
}
for (sn, s), (pn, (f1, f2, idea)) in itertools.product(SUBJECTS.items(), PATTERNS.items()):
    if sn == "app or website UI": continue
    def pick(fr, slow_only):
        cands = [(n, m) for n, m in MOVES.items() if fr in m["good"] and (m["energy"] == 1 or not slow_only)]
        cands.sort(key=lambda x: (x[1]["energy"], x[0]))
        return cands[0][0] if cands else "static locked-off"
    slow = s["risk"] == 3
    m1 = pick(f1, True); m2 = pick(f2, slow)
    if m2 == m1: m2 = "static locked-off" if m1 != "static locked-off" else "slow push-in"
    chain = pn == "continuous take"
    fit = DET[f1] in [DET[b] for b in s["best"]] or DET[f2] in [DET[b] for b in s["best"]]
    if "speech" in s["tags"]: m1, m2 = "static locked-off", "slow push-in"
    instr = (f"10-second recipe '{pn}' for {sn} ({idea}): shot 1 = 4s {f1}, {m1}; shot 2 = 6s {f2}, {m2}" +
             (", chained from shot 1's last frame (Veo only)" if chain else ", new keyframe generated with shot 1's keyframe as reference") +
             f". Main beat goes in shot 2. Motion: {s['motion']}." + ("" if fit else f" Note: neither framing is this subject's best ({', '.join(s['best'])}); use only if the story needs it."))
    add("Derived: 10-Second Scene Recipes", "scene-recipe", "COND", "minor", instr,
        frag=f"SH1: {FRAMINGS[f1]['frag']}, {MOVES[m1]['frag']} | SH2: {FRAMINGS[f2]['frag']}, {MOVES[m2]['frag']}",
        applies=dict(subject=sn, pattern=pn), relevance=6 if fit else 3)

# ---------------------------------------------------------------- F18 lighting x framing
for (ln, l), (fn, f) in itertools.product(LIGHTS.items(), FRAMINGS.items()):
    if f["detail"] >= 3 and l["contrast"] == 2: note = "at close distance hard contrast exaggerates texture and can lose an eye in shadow; add fill or rotate the key"
    elif f["detail"] == 0 and l["contrast"] == 0: note = "flat light at extreme distance flattens depth; add atmosphere or a backlit edge"
    elif f["detail"] >= 3 and l["flicker"] >= 1: note = "flicker is most visible in close framings; insist on steady light"
    else: continue
    add("Derived: Lighting x Framing", "light-framing", "COND", "minor", f"{ln.capitalize()} in {art(fn)}: {note}.",
        applies=dict(lighting=ln, framing=fn), relevance=4)


# ---------------------------------------------------------------- F19 shot1 move -> shot2 move across the scene's internal cut
DIRS = {"pan left": "L", "pan right": "R", "lateral truck": "R", "tilt up": "U", "tilt down": "D", "crane up": "U", "crane down": "D",
        "slow push-in": "IN", "dolly in": "IN", "crash zoom": "IN", "slow pull-back": "OUT", "dolly out": "OUT", "slow zoom out": "OUT"}
OPP = {("L", "R"), ("R", "L"), ("U", "D"), ("D", "U"), ("IN", "OUT"), ("OUT", "IN")}
for (a, A_), (b, B_) in itertools.product(MOVES.items(), MOVES.items()):
    da, db = DIRS.get(a), DIRS.get(b)
    if a == b: v, why = ("CAUTION", "repeating the same move on both sides of the cut reads as a jump cut unless the framing changes by at least two steps")
    elif da and db and (da, db) in OPP: v, why = ("AVOID", "opposite directions across the cut feel like the camera changed its mind")
    elif da and da == db: v, why = ("PREFERRED", "matching direction carries momentum across the cut (motion match)")
    elif abs(A_["energy"] - B_["energy"]) == 2: v, why = ("CAUTION", "a two-level energy jump inside one 10-second scene is jarring; use it only for a deliberate shock or punchline")
    elif B_["energy"] > A_["energy"]: v, why = ("PREFERRED", "energy rising from shot 1 to shot 2 builds toward the scene's beat")
    elif a.startswith("static") or b.startswith("static"): v, why = ("PREFERRED", "pairing a static shot with a moving one gives the cut clear contrast")
    else: v, why = ("ACCEPTABLE", "no conflict; check that screen direction of the subject still matches")
    add("Derived: Internal Cut - Camera Move Pairs", "cut-move", "COND", sev_of(v),
        f"Shot 1 {a} cutting to shot 2 {b}: {v}. Reason: {why}.", check=f"scene.shot1.move=='{a}' and scene.shot2.move=='{b}' -> {v}",
        applies=dict(move1=a, move2=b, verdict=v), relevance={"AVOID": 7, "CAUTION": 5, "PREFERRED": 5, "ACCEPTABLE": 1}[v])

# ---------------------------------------------------------------- F20 framing -> framing across the cut
for (a, A_), (b, B_) in itertools.product(FRAMINGS.items(), FRAMINGS.items()):
    d = abs(A_["detail"] - B_["detail"])
    if a == b: v, why = "AVOID", "same framing on the same subject across a cut is a jump cut; change size by at least one step or change angle"
    elif d == 0: v, why = "ACCEPTABLE", "same scale but a different angle; keep the 180-degree line"
    elif d == 1: v, why = "PREFERRED", "a one-step size change is the smoothest cut"
    elif d >= 3: v, why = "CAUTION", "a big jump in scale is a deliberate punch; make sure the subject stays in the same screen position"
    else: v, why = "PREFERRED", "a clear two-step change gives the cut purpose"
    add("Derived: Internal Cut - Framing Pairs", "cut-framing", "COND", sev_of(v),
        f"Cutting from {a} to {b}: {v}. Reason: {why}.", check=f"shot1.framing=='{a}' and shot2.framing=='{b}' -> {v}",
        applies=dict(framing1=a, framing2=b, verdict=v), relevance=6)

# ---------------------------------------------------------------- F21 lighting continuity across the cut
LFAM = {"day": ["soft window light", "overcast diffuse", "hard midday sun", "dappled forest", "overcast rain", "golden hour"],
        "night": ["moonlight", "neon practicals", "candlelight", "firelight", "screen glow", "blue hour"],
        "studio": ["high-key studio", "low-key noir", "rim backlight", "stage spotlight", "three-point interview", "fluorescent office"],
        "special": ["underwater caustics", "volumetric haze"]}
fam = {l: f for f, ls in LFAM.items() for l in ls}
for (a, A_), (b, B_) in itertools.product(LIGHTS.items(), LIGHTS.items()):
    if a == b: v, why = "PREFERRED", "identical lighting logic keeps the scene continuous"
    elif fam[a] == fam[b] and abs(A_["contrast"] - B_["contrast"]) <= 1: v, why = "CAUTION", "same lighting family but a different setup; allowed only if the shot moves to a new spot inside the location"
    else: v, why = "AVOID", f"switching from {fam[a]} to {fam[b]} lighting inside one 10-second scene breaks continuity; make it a new scene"
    add("Derived: Internal Cut - Lighting Continuity", "cut-light", "COND", sev_of(v),
        f"Shot 1 lit with {a}, shot 2 lit with {b}: {v}. Reason: {why}.", check=f"shot1.lighting=='{a}' and shot2.lighting=='{b}' -> {v}",
        applies=dict(lighting1=a, lighting2=b, verdict=v), relevance={"AVOID": 6, "CAUTION": 4, "PREFERRED": 6}[v])

# ---------------------------------------------------------------- F22 two subjects in one frame
PAIR_GROUPS = [("people", g) for g in ("animals", "vehicles", "products", "food", "places", "nature", "elements", "stylized", "graphics")] + \
              [("animals", "nature"), ("animals", "places"), ("vehicles", "places"), ("vehicles", "nature"), ("products", "food"), ("stylized", "places"), ("stylized", "nature"), ("elements", "places")]
for g1, g2 in PAIR_GROUPS:
    for (n1, s1), (n2, s2) in itertools.product([x for x in SUBJECTS.items() if x[1]["group"] == g1], [x for x in SUBJECTS.items() if x[1]["group"] == g2]):
        if "app or website UI" in (n1, n2): continue
        union = s1["tags"] | s2["tags"]
        new = [n for n, a in ARTIFACTS.items() if (a["tags"] & union) and not (a["tags"] & s1["tags"]) or (a["tags"] & union and not (a["tags"] & s2["tags"]))]
        inter = "object pass-through" if ({"hands", "object", "rigid"} & union) else (new[0] if new else "duplicate subject")
        risk = max(s1["risk"], s2["risk"]) + (1 if s1["risk"] == 3 and s2["risk"] >= 2 else 0)
        v = "AVOID" if risk >= 4 else ("CAUTION" if risk == 3 else "ACCEPTABLE")
        sens = [x["sensitive"] for x in (s1, s2) if x["sensitive"]]
        instr = (f"{n1.capitalize()} together with {n2} in one shot: {v}. State the exact count of each, give each its own anchors "
                 f"({s1['anchors']} / {s2['anchors']}), and describe any contact explicitly. Main interaction risk: {inter}." +
                 (" Combined risk is high: split into separate shots and cut between them." if v == "AVOID" else "") +
                 (f" Sensitivity: {', '.join(sens)} - apply trust-boundary rules." if sens else ""))
        add("Derived: Two Subjects In Frame", "subject-pair", "COND", sev_of(v), instr,
            check=f"shot.subjects ⊇ {{'{n1}','{n2}'}} -> {v}", applies=dict(subject1=n1, subject2=n2, verdict=v),
            relevance={"AVOID": 6, "CAUTION": 4, "ACCEPTABLE": 2}[v])

# ---------------------------------------------------------------- F23 genre x subject (relevant pairs only)
GENRE_GROUPS = {
 "product ad": ["products", "people", "food"], "e-commerce listing": ["products"], "explainer": ["people", "graphics", "stylized", "nature", "places"],
 "education lesson": ["people", "stylized", "nature", "graphics"], "documentary": ["people", "animals", "nature", "places"], "news explainer": ["places", "people", "graphics"],
 "interview": ["people"], "corporate brand film": ["people", "places", "products"], "recruitment": ["people", "places"], "training / onboarding": ["people", "products", "graphics"],
 "social short": ["people", "food", "animals", "products"], "music video": ["people", "elements", "stylized", "places"], "short drama": ["people", "places"],
 "comedy sketch": ["people", "animals"], "horror": ["people", "places", "elements"], "thriller": ["people", "vehicles", "places"], "fantasy": ["stylized", "nature", "elements", "animals"],
 "sci-fi": ["stylized", "places", "vehicles"], "kids storybook (stylized)": ["stylized", "animals", "nature"], "travel / tourism": ["nature", "places", "food", "people"],
 "real estate": ["places"], "food / recipe": ["food", "people"], "fitness": ["people"], "fashion": ["people", "products"], "automotive": ["vehicles", "places"],
 "tech / SaaS demo": ["products", "graphics", "people"], "event promo": ["people", "places", "elements"], "nonprofit appeal": ["people", "places", "nature"],
 "gaming trailer": ["stylized", "elements", "places"], "sports highlight": ["people"],
}
for gn, groups in GENRE_GROUPS.items():
    G_ = GENRES[gn]
    for sn, s in SUBJECTS.items():
        if s["group"] not in groups: continue
        if sn == "child character (stylized)" and gn not in ("kids storybook (stylized)", "education lesson", "explainer", "fantasy"): continue
        ok_moves = [m for m in MOVES if m.split()[0] in G_["camera"] and (s["risk"] < 3 or MOVES[m]["energy"] < 3)][:2] or ["static locked-off"]
        instr = (f"{sn.capitalize()} in {art(gn)}: frame as {s['best'][0]}, move with {' or '.join(ok_moves)}, light with {G_['light']}. "
                 f"Genre risk to clear: {G_['risk']}. Subject failures to check: {s['fails']}.")
        add("Derived: Genre x Subject Recipes", "genre-subject", "COND", "minor", instr, applies=dict(genre=gn, subject=sn), relevance=4)

# ---------------------------------------------------------------- F24 genre 10-second recipes
for (gn, G_), (pn, (f1, f2, idea)) in itertools.product(GENRES.items(), PATTERNS.items()):
    fast = any(x in G_["pacing"] for x in ("1-3", "1-4", "2-3", "2-4", "beat"))
    split = "4s + 6s" if not fast else "4s + 6s, with an optional editorial cut inside the 6s shot to hit the genre's faster rhythm"
    instr = (f"{gn.capitalize()} 10-second recipe '{pn}' ({idea}): {split}; shot 1 {f1}, shot 2 {f2}; lighting {G_['light']}; "
             f"camera from {G_['camera']}; audio {G_['audio']}." + (f" If this is scene 1, the hook is: {G_['hook']}." if pn in ("detail then reveal", "establish then detail", "hero moment") else ""))
    add("Derived: Genre 10-Second Recipes", "genre-recipe", "COND", "minor", instr, applies=dict(genre=gn, pattern=pn), relevance=4)

# ---------------------------------------------------------------- F25 move-specific failure checks
for (mn, m), (an, a) in itertools.product(MOVES.items(), ARTIFACTS.items()):
    hit = (m["blur"] >= 2 and an in ("flicker / strobing", "texture boiling", "fur / hair swimming", "cloth pattern swimming")) or \
          (m["space"] >= 1 and an in ("geometry swimming in camera moves", "morphing rigid objects", "face identity drift", "label / logo distortion")) or \
          (m["energy"] == 3 and an in ("extra or missing limbs", "foot sliding", "direction reversal", "end-of-clip collapse")) or \
          (m["parallax"] and an in ("background people melting", "scale inconsistency")) or \
          (mn.startswith("static") and an == "frozen / static output")
    if not hit: continue
    add("Derived: Camera Move x Failure Mode", "move-artifact", "CHECK", "major",
        f"After any {mn} shot, check specifically for {an}: {a['detect']}. Prevention for this move: {a['prevent']}.",
        applies=dict(move=mn, artifact=an), relevance=5)

# ---------------------------------------------------------------- F26 model x framing / platform
for (mk, M), (pn, P) in itertools.product(MODELS.items(), PLATFORMS.items()):
    r = P["ratio"].split()[0]
    if r in M["aspects"]: v, why = "ACCEPTABLE", f"the model outputs {r} natively"
    elif r == "1:1" or r == "4:5" or r.startswith("1:1"): v, why = "CAUTION", f"no native {r}; generate 16:9 or 9:16 with the subject centered and crop in post, checking the crop"
    else: v, why = "AVOID", f"this route cannot output {r}"
    add("Derived: Model x Platform", "model-platform", "COND", sev_of(v), f"{M['label']} for {pn}: {v}. {why[0].upper()+why[1:]}.",
        applies=dict(model=mk, platform=pn, verdict=v), relevance=6)

# ---------------------------------------------------------------- dedupe + trim to TARGET
seen, uniq = set(), []
for r in rules:
    k = re.sub(r"\W+", " ", r["instruction"].lower()).strip()
    if k in seen: continue
    seen.add(k); uniq.append(r)
dups = len(rules) - len(uniq)
core = [r for r in uniq if r["family"].startswith("core")]
derived = [r for r in uniq if not r["family"].startswith("core")]
assert len(uniq) >= TARGET, f"only {len(uniq)} unique rules"
order = sorted(range(len(derived)), key=lambda i: (-derived[i]["relevance"], i))
keep_idx = set(order[:TARGET - len(core)])
trimmed = [derived[i] for i in range(len(derived)) if i not in keep_idx]
final = core + [derived[i] for i in range(len(derived)) if i in keep_idx]
assert len(final) == TARGET

for i, r in enumerate(final, 1):
    r["id"] = f"VR-{i:05d}"
    name, url = SOURCES[r["source"]]
    r["source_name"], r["source_url"] = name, url
    del r["relevance"]

out = ROOT / "rules"
with open(out / "rules.jsonl", "w") as fh:
    for r in final: fh.write(json.dumps(r, ensure_ascii=False) + "\n")

stats = dict(total=len(final), generated_before_dedupe=len(rules), duplicates_removed=dups,
             low_relevance_trimmed=len(trimmed), by_family=collections.Counter(r["family"] for r in final),
             by_severity=collections.Counter(r["severity"] for r in final), by_type=collections.Counter(r["type"] for r in final),
             trimmed_by_family=collections.Counter(r["family"] for r in trimmed))
(out / "stats.json").write_text(json.dumps(stats, indent=2))
print(json.dumps(stats, indent=2))
