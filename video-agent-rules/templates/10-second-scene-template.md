# 10-Second Scene Template (Both Prompts)

Every 10-second scene = **two shots** (4s + 6s or 6s + 4s on Veo), or one 12s shot cut to 10s on Seedance or MiniMax.
Each shot that starts from a keyframe needs **two prompts**:

| Prompt | What it describes | What it must NOT describe |
|---|---|---|
| **Prompt 1: Keyframe image** | The still first frame: style, subject + anchors, pose, setting, framing, lighting, colors, aspect | Motion, time passing, on-screen text, quality slogans |
| **Prompt 2: Video motion** | One subject action in 1-3 beats, one camera move with a speed word, the end state, the audio line | Anything already visible in the image, durations, resolution, aspect ratio |

---

## Scene header (fill first)

```
Scene ID:        P##_S##
Beat (1 line):   ...
Genre/platform:  ... / ...
Plan:            4+6 | 6+4 | 12 cut to 10 | 6+6 cut to 10
Audio strategy:  native | tts | layered      Narration (<=25 words): ...
Transition out:  cut | dissolve 0.5s | fade
```

## Shot block (repeat for SH1 and SH2)

```
Shot ID / duration / model:   P##_S##_SH1 / 4s / veo_3_1_fast
Start:                         keyframe | chain (Veo, shot 2 only) | text
Subject / framing / move / lighting: (exact names from tools/lookup.py --list ...)
Viewer notices first:          ...

PROMPT 1 — KEYFRAME IMAGE
[LOCKED STYLE STRING, verbatim]. [Framing] of [exact count] [subject + verbatim anchors],
[still pose], in [setting], [light direction + quality], [3-5 locked color anchors],
[depth of field], [room left for the coming motion], vertical 9:16 | horizontal 16:9 frame.

PROMPT 2 — VIDEO MOTION
[One camera move + speed word]. [Beat 1], [beat 2], then [beat 3].
Ends with [end state]. [Audio: ambience + effects + "quoted dialogue" or "no music"].
[If speech: no subtitles, no on-screen text.]
```

## Rules the checker enforces on this template

- Scene totals exactly 10.0s after the planned cut; no time-stretching ever.
- The duration must be one the model allows; Seedance 2.0 cannot do 9:16; chaining only on Veo.
- Prompt 1 starts with the locked style string, names at least 3 color anchors, uses exact counts, has no slogans and requests no text.
- Prompt 2 names exactly one camera move and a speed word, repeats under 50% of Prompt 1's words, has no parameters in prose and no fine-motor tasks, includes an audio line, and stays within the dialogue budget (2.5 words/second).
- The two shots differ in framing or move; the derived AVOID rules for subject, move, lighting, framing, model, genre and the internal cut are all clear.

## Worked example (passes the checker: `examples/scene_good.json`)

**SH1 — 4s, Veo 3.1 Fast, close-up, static, soft window light**

Prompt 1: `Photorealistic cinematic lifestyle footage, natural film look. Close-up of one white ceramic cup on a charcoal stone counter, a steel milk pitcher tilted above it about to pour, soft natural window light from the left, warm amber and deep teal tones with off-white highlights, shallow depth of field, blank background wall, vertical 9:16 frame.`

Prompt 2: `Static locked-off camera. Milk pours in one slow steady stream, a heart pattern forms on the surface, the pitcher lifts away. Ends with the finished heart still and centered.`
Audio: `Soft pouring sound and quiet cafe ambience, no music.`

**SH2 — 6s, Veo 3.1 Fast, medium, slow push-in, soft window light** (keyframe generated with SH1's keyframe as reference)

Prompt 1: `Photorealistic cinematic lifestyle footage, natural film look. Medium shot of one barista in her thirties with a short black bob, a deep teal apron and rolled off-white sleeves, standing behind a charcoal counter holding one latte cup, soft natural window light from the left, warm amber background tones, shallow depth of field, room in front of her for the cup to slide toward camera, vertical 9:16 frame.`

Prompt 2: `Slow push-in toward her. She smiles, slides the cup forward toward camera with one hand, then rests both hands on the counter. Ends with her still and looking into the lens.`
Audio: `Cup sliding on stone, quiet cafe ambience, no music, no subtitles.`
