# Video Agent Rulebook v2.0: 10,000 Rules + Operational Module

This is an operating system for AI video-making agents. Agents use it to read the rules, write both prompts for every 10-second scene, check their own work automatically, and get every clip reviewed before it is used.

## What's inside

| Path | What it is |
|---|---|
| `rules/RULEBOOK_10000.md` | All 10,000 rules (VR-00001 to VR-10000) in 92 categories, readable by people |
| `rules/rules.jsonl` / `rules.csv` | The same rules in a format agents can read: severity, applies_to, check, prompt fragment, source |
| `agents/AGENT_PROMPTS.md` | System prompts for the Director, Prompt Writer, Generator, Reviewer and Editor agents, plus the Team Head checklist |
| `templates/10-second-scene-template.md` | The 10-second scene template with both prompts (keyframe image + video motion) and a worked example |
| `templates/scene_spec.schema.json` | The only output format the Prompt Writer agent may hand off |
| `tools/lint_scene.py` | Blocks generation until a scene has zero errors, and cites the rule ID behind each finding |
| `tools/lookup.py` | Finds the rules for an exact subject, camera move, lighting, framing, model, genre or platform |
| `examples/scene_good.json` / `scene_bad.json` | A scene that passes (0 errors) and one that fails (18 errors, 10 warnings) |
| `build/` | The sources: `tables.py` (facts), `core_new.py` (hand-written rules), `generate.py`, `render.py` |

## Quick start

```bash
python3 tools/lookup.py --core                       # 467 core rules every agent reads first
python3 tools/lookup.py --list subjects              # valid names for subjects, moves, lighting...
python3 tools/lookup.py --subject "dog" --move "tracking shot" --lighting "golden hour" --framing wide --model veo_3_1_fast
python3 tools/lint_scene.py examples/scene_good.json # 0 errors -> may generate
python3 tools/lint_scene.py examples/scene_bad.json  # 18 errors -> blocked
```

## How a 10-second scene works

None of the models in this toolchain can generate exactly 10 seconds in one clip, so every scene is made from valid parts:

- **Veo 3.1 Fast / Veo 3.1:** 4s + 6s or 6s + 4s (default: Veo 3.1 Fast, 4s + 6s)
- **Seedance 2.0 / 2.5:** 4s + 6s, 6s + 4s, or a 12s clip cut to 10s (Seedance 2.0 is 16:9 only)
- **MiniMax H3:** a 12s clip cut to 10s, or 6s + 6s cut to 10s

Clips are never time-stretched or sped up. Each shot gets **Prompt 1 (keyframe image)**, which describes the still first frame, and **Prompt 2 (video motion)**, which covers only the motion: one camera move, 1-3 action beats, the end state, and the audio.

## Where the rules come from

- **467 core rules, written by hand:** the 303 rules from Part 1 (their old IDs are kept) plus 164 new rules for the 10-second scene protocol, writing both prompts, agent read/write discipline, mistake-prevention self-checks, audio, ffmpeg commands, reviewer QA and cost control. Sources are the [Google Veo docs](https://ai.google.dev/gemini-api/docs/veo), the [OpenAI Sora 2 prompting guide](https://developers.openai.com/cookbook/examples/sora/sora2_prompting_guide), and this toolchain's own model, production and trust-boundary docs.
- **9,533 derived rules:** each applies one core principle to one specific combination, such as subject × camera move, subject × lighting, model × subject, the camera moves, framings and lighting on either side of the internal cut, two subjects in one frame, genre × phase, and 10-second recipes. They are computed from audited fact tables (56 subjects, 24 camera moves, 20 lighting setups, 8 framings, 5 models, 30 genres, 8 platforms, 36 failure modes). Each one has a verdict, a reason, a prompt fragment and/or a check. The count is exactly 10,000 with no duplicates; the 219 most neutral rules were trimmed to hit it.

## Honest limits

- No rulebook can guarantee an agent never makes a mistake. AI video models are random, and some failures can only be seen by watching the clip. That's why the pipeline has three layers: the checker catches prompt mistakes before any credits are spent, the Reviewer agent catches output mistakes, and the Team Head signs off.
- Derived rules are reasoned guidance, not lab-tested results. Check them on first use and correct them through post-mortems.
- Model facts were verified in October 2026 for this toolchain. Vendor APIs may offer more controls, and models change, so re-check `build/tables.py` (MODELS) before each new project.
- To change a rule, edit `build/tables.py` or `build/core_new.py`, then run `python3 build/generate.py && python3 build/render.py`. Never edit `rules.jsonl` by hand.
