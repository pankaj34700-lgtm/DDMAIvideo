"""Knowledge tables that the derived rules are computed from.

Every derived rule is an instantiation of a core principle for one specific
combination (subject x camera move, subject x lighting, ...). The facts that
make each combination different live here, so a reviewer can audit or correct
one table entry and regenerate all affected rules.
"""

# ---------------------------------------------------------------------------
# MODELS — facts as exposed by THIS team's generation tool (verified Oct 2026
# against skills/media/models/*.md). Vendor APIs may expose more controls.
# ---------------------------------------------------------------------------
MODELS = {
    "veo_3_1_fast": dict(label="Veo 3.1 Fast", durations=[4, 6, 8], aspects=["16:9", "9:16"],
        refs=1, audio_off=True, resolution="provider default", chain=True, default=True,
        strengths="short cinematic shots, image-to-video, dialogue drafts with native audio",
        watch="lip sync, object deformation, identity through the full clip"),
    "veo_3_1": dict(label="Veo 3.1", durations=[4, 6, 8], aspects=["16:9", "9:16"],
        refs=1, audio_off=True, resolution="provider default", chain=True, default=False,
        strengths="retry after a specific Fast quality miss in lighting, texture or detail",
        watch="dialogue timing, rigid objects, identity; costs more than Fast, better result not guaranteed"),
    "seedance_2_0": dict(label="Seedance 2.0", durations=[4, 6, 8, 12], aspects=["16:9"],
        refs=1, audio_off=False, resolution="720p default, 1080p optional", chain=False, default=False,
        strengths="lower-cost landscape drafts and motion-heavy scenes",
        watch="limb motion, camera-angle changes, identity distortion; 9:16 request is ignored"),
    "seedance_2_5": dict(label="Seedance 2.5", durations=[4, 6, 8, 12, 30], aspects=["16:9", "9:16"],
        refs=30, audio_off=True, resolution="720p default, 1080p optional", chain=False, default=False,
        strengths="long continuous takes up to 30s, many image references",
        watch="identity drift, lost actions and unwanted music in long takes; several times 2.0's price"),
    "minimax_h3": dict(label="MiniMax H3", durations=[6, 8, 12], aspects=["16:9", "9:16"],
        refs=2, audio_off=False, resolution="2K", chain=False, default=False,
        strengths="2K output, opening/final frame pair interpolation",
        watch="identity, motion and audio through the clip; aspect follows opening image; audio always generated"),
}

# Valid ways to fill an exact 10-second scene per model. "trim" = editorial
# cut of a longer clip (allowed); time-stretching is never allowed.
TEN_SECOND_PLANS = {
    "veo_3_1_fast": [("4+6", [4, 6], 0), ("6+4", [6, 4], 0)],
    "veo_3_1": [("4+6", [4, 6], 0), ("6+4", [6, 4], 0)],
    "seedance_2_0": [("4+6", [4, 6], 0), ("6+4", [6, 4], 0), ("12 cut to 10", [12], 2)],
    "seedance_2_5": [("4+6", [4, 6], 0), ("6+4", [6, 4], 0), ("12 cut to 10", [12], 2)],
    "minimax_h3": [("12 cut to 10", [12], 2), ("6+6 cut to 10", [6, 6], 2)],
}

# ---------------------------------------------------------------------------
# FRAMINGS
# ---------------------------------------------------------------------------
FRAMINGS = {
    "extreme wide": dict(frag="extreme wide shot, subject small in a vast environment", detail=0, purpose="establish scale and place"),
    "wide": dict(frag="wide shot, full body and surroundings visible", detail=1, purpose="establish where things are and what is happening"),
    "medium wide": dict(frag="medium wide shot, framed from the knees up", detail=1, purpose="show the subject with its immediate context"),
    "medium": dict(frag="medium shot, framed from the waist up", detail=2, purpose="show the subject clearly, with gesture or use"),
    "medium close-up": dict(frag="medium close-up, framed from the chest up", detail=2, purpose="show emotion or detail with a little context"),
    "close-up": dict(frag="close-up, face or object filling most of the frame", detail=3, purpose="show emotion, texture or a reveal"),
    "extreme close-up": dict(frag="extreme close-up on a single detail", detail=4, purpose="isolate one key detail or texture"),
    "over-the-shoulder": dict(frag="over-the-shoulder shot from behind the listener", detail=2, purpose="show who is speaking to whom"),
}

# ---------------------------------------------------------------------------
# CAMERA MOVES  energy 1-3, space = room needed around subject 0-2,
# blur = motion-blur / smear risk 1-3
# ---------------------------------------------------------------------------
MOVES = {
    "static locked-off": dict(frag="static locked-off camera, no camera movement", energy=1, space=0, blur=1, parallax=False, good=["medium", "close-up", "medium close-up", "wide"], note="most robust; lets subject motion carry the shot"),
    "slow push-in": dict(frag="slow push-in toward the subject", energy=1, space=0, blur=1, parallax=False, good=["medium", "medium close-up", "close-up"], note="builds intensity or focus"),
    "slow pull-back": dict(frag="slow pull-back revealing the surroundings", energy=1, space=1, blur=1, parallax=False, good=["close-up", "medium", "wide"], note="reveal of context; model must invent revealed area"),
    "dolly in": dict(frag="smooth dolly in", energy=2, space=1, blur=1, parallax=True, good=["wide", "medium wide", "medium"], note="physical approach with parallax"),
    "dolly out": dict(frag="smooth dolly out", energy=2, space=1, blur=1, parallax=True, good=["medium", "medium wide"], note="withdrawal, ending beats"),
    "tracking shot": dict(frag="tracking shot moving alongside the subject", energy=2, space=2, blur=2, parallax=True, good=["medium wide", "wide", "medium"], note="follows moving subject; needs clear travel path"),
    "lateral truck": dict(frag="slow lateral truck from left to right", energy=1, space=1, blur=1, parallax=True, good=["wide", "medium wide", "extreme wide"], note="strong parallax depth"),
    "slow orbit": dict(frag="slow orbit around the subject", energy=2, space=2, blur=2, parallax=True, good=["medium", "medium wide"], note="shows dimensionality; model must invent unseen sides"),
    "crane up": dict(frag="crane up rising above the scene", energy=2, space=2, blur=1, parallax=True, good=["wide", "medium wide", "extreme wide"], note="grand reveal, ending"),
    "crane down": dict(frag="crane down descending into the scene", energy=2, space=2, blur=1, parallax=True, good=["wide", "extreme wide"], note="arrival, opening"),
    "tilt up": dict(frag="slow tilt up", energy=1, space=1, blur=1, parallax=False, good=["wide", "medium wide"], note="scale reveal of tall subject"),
    "tilt down": dict(frag="slow tilt down", energy=1, space=1, blur=1, parallax=False, good=["wide", "medium"], note="discovery downward"),
    "pan left": dict(frag="slow pan left", energy=1, space=1, blur=2, parallax=False, good=["wide", "extreme wide"], note="scan environment"),
    "pan right": dict(frag="slow pan right", energy=1, space=1, blur=2, parallax=False, good=["wide", "extreme wide"], note="scan environment"),
    "whip pan": dict(frag="fast whip pan", energy=3, space=1, blur=3, parallax=False, good=["medium", "wide"], note="energy/comedy transition; heavy smear"),
    "handheld subtle": dict(frag="subtle handheld camera movement", energy=1, space=0, blur=1, parallax=False, good=["medium", "medium close-up", "close-up"], note="documentary intimacy"),
    "handheld intense": dict(frag="intense shaky handheld camera", energy=3, space=1, blur=3, parallax=False, good=["medium", "medium wide"], note="chaos, action; raises artifact risk"),
    "drone aerial": dict(frag="aerial drone shot gliding forward high above", energy=2, space=2, blur=1, parallax=True, good=["extreme wide", "wide"], note="landscape scale"),
    "fpv drone": dict(frag="fast FPV drone flythrough", energy=3, space=2, blur=3, parallax=True, good=["wide", "extreme wide"], note="speed; heavy geometry invention"),
    "rack focus": dict(frag="rack focus shifting from foreground to background", energy=1, space=0, blur=1, parallax=False, good=["close-up", "medium close-up", "medium"], note="name both focal planes"),
    "crash zoom": dict(frag="sudden crash zoom in", energy=3, space=0, blur=2, parallax=False, good=["medium", "close-up"], note="comedy or shock emphasis"),
    "slow zoom out": dict(frag="slow optical zoom out", energy=1, space=1, blur=1, parallax=False, good=["close-up", "medium"], note="reveal without parallax"),
    "POV walk": dict(frag="first-person POV walking forward", energy=2, space=2, blur=2, parallax=True, good=["wide", "medium wide"], note="describe hands/body at frame edges"),
    "arc dolly": dict(frag="slow arcing dolly half-circle around the subject", energy=2, space=2, blur=2, parallax=True, good=["medium", "medium wide"], note="dramatic emphasis"),
}

# ---------------------------------------------------------------------------
# LIGHTING SETUPS  flicker risk 0-2
# ---------------------------------------------------------------------------
LIGHTS = {
    "soft window light": dict(frag="soft natural window light from the side", mood="calm, intimate", flicker=0, contrast=1, skin="flattering, gentle falloff", genres=["documentary", "lifestyle", "drama", "corporate"]),
    "golden hour": dict(frag="warm low golden-hour sunlight, long soft shadows", mood="warm, nostalgic, hopeful", flicker=0, contrast=1, skin="warm glow; watch orange skin cast", genres=["travel", "romance", "brand", "real estate"]),
    "blue hour": dict(frag="cool blue-hour twilight with warm practical lights", mood="quiet, reflective", flicker=0, contrast=1, skin="cool cast; add warm practical fill", genres=["travel", "drama", "music video"]),
    "overcast diffuse": dict(frag="overcast diffuse daylight, soft even shadows", mood="neutral, honest", flicker=0, contrast=0, skin="even, low contrast", genres=["documentary", "news", "education"]),
    "hard midday sun": dict(frag="hard midday sunlight, crisp short shadows", mood="harsh, energetic", flicker=0, contrast=2, skin="hot highlights, squinting", genres=["sports", "action", "automotive"]),
    "high-key studio": dict(frag="bright high-key studio lighting, soft fill, minimal shadows", mood="clean, optimistic", flicker=0, contrast=0, skin="clean, even", genres=["product", "corporate", "education", "e-commerce"]),
    "low-key noir": dict(frag="low-key lighting, single hard key light, deep shadows", mood="mystery, tension", flicker=0, contrast=2, skin="sculpted, half in shadow", genres=["thriller", "drama", "horror"]),
    "rim backlight": dict(frag="strong rim backlight outlining the subject, soft front fill", mood="heroic, premium", flicker=0, contrast=2, skin="glowing edges; face may go dark without fill", genres=["product", "sports", "music video", "brand"]),
    "neon practicals": dict(frag="pink and cyan neon practical lights, reflections on wet surfaces", mood="urban, nocturnal, stylish", flicker=1, contrast=2, skin="color cast; specify which color hits the face", genres=["music video", "fashion", "gaming", "thriller"]),
    "candlelight": dict(frag="steady warm candlelight glow", mood="intimate, historical", flicker=2, contrast=2, skin="warm, deep shadows", genres=["drama", "romance", "historical"]),
    "firelight": dict(frag="steady warm firelight from below and side", mood="primal, cozy or ominous", flicker=2, contrast=2, skin="underlit, dramatic", genres=["fantasy", "horror", "survival"]),
    "moonlight": dict(frag="cool soft moonlight, deep blue shadows", mood="mysterious, quiet", flicker=0, contrast=2, skin="cool, low detail", genres=["horror", "fantasy", "drama"]),
    "fluorescent office": dict(frag="flat overhead fluorescent lighting", mood="mundane, institutional", flicker=1, contrast=0, skin="slightly green, flat", genres=["comedy", "corporate satire", "thriller"]),
    "stage spotlight": dict(frag="single hard stage spotlight from above, dark surroundings", mood="performance, isolation", flicker=0, contrast=2, skin="hot top light, eye sockets dark", genres=["music video", "event", "drama"]),
    "dappled forest": dict(frag="dappled sunlight filtering through leaves", mood="natural, magical", flicker=1, contrast=1, skin="moving light patches", genres=["nature", "fantasy", "travel"]),
    "underwater caustics": dict(frag="underwater light with shimmering caustic patterns", mood="dreamy, immersive", flicker=1, contrast=1, skin="blue-green shift", genres=["nature", "music video", "fantasy"]),
    "screen glow": dict(frag="face lit by the cool glow of a screen in a dark room", mood="isolated, modern", flicker=1, contrast=2, skin="cool, one-sided", genres=["tech", "thriller", "drama"]),
    "overcast rain": dict(frag="grey rainy daylight, wet reflective surfaces", mood="melancholy, cinematic", flicker=0, contrast=1, skin="soft, cool", genres=["drama", "music video", "automotive"]),
    "volumetric haze": dict(frag="volumetric light beams through atmospheric haze", mood="epic, spiritual", flicker=0, contrast=2, skin="soft glow, lifted blacks", genres=["fantasy", "brand", "music video", "sci-fi"]),
    "three-point interview": dict(frag="soft key light at 45 degrees, gentle fill, subtle hair light", mood="professional, trustworthy", flicker=0, contrast=1, skin="flattering, controlled", genres=["interview", "corporate", "education", "news"]),
}

# ---------------------------------------------------------------------------
# SUBJECTS
#  risk: 3 high / 2 medium / 1 low      tags drive artifact relevance
# ---------------------------------------------------------------------------
def S(name, group, risk, tags, anchors, motion, fails, best, sensitive=None):
    return name, dict(group=group, risk=risk, tags=set(tags), anchors=anchors, motion=motion,
                      fails=fails, best=best, sensitive=sensitive)

SUBJECTS = dict([
    S("adult person walking", "people", 2, ["face", "hands", "limbs", "body", "cloth", "hair"], "age range, build, hair, 2-4 wardrobe anchors", "steady walking pace with natural arm swing", "foot sliding, leg crossing, face drift", ["wide", "medium wide", "medium"]),
    S("adult person talking to camera", "people", 3, ["face", "mouth", "speech", "hands", "hair"], "face shape, hair, wardrobe, voice description", "small head movements, natural blinks, light hand gestures", "lip-sync drift, dead eyes, morphing teeth", ["medium", "medium close-up"]),
    S("two people in conversation", "people", 3, ["face", "mouth", "speech", "hands", "multi"], "distinct anchors per person so they never blend", "alternating turns, listener reacts", "faces blending, wrong speaker lip-moving, eyeline mismatch", ["over-the-shoulder", "medium", "medium wide"]),
    S("person running", "people", 2, ["limbs", "body", "cloth", "hair", "fast"], "athletic build, shoe color, wardrobe", "rhythmic stride, arms pumping", "extra legs mid-stride, gait glitches", ["wide", "medium wide"]),
    S("person dancing", "people", 3, ["limbs", "hands", "body", "cloth", "fast", "hair"], "style of dance, costume anchors", "one named dance move per beat", "limb tangles, impossible joints, rhythm loss", ["wide", "medium wide"]),
    S("hands close-up", "people", 3, ["hands", "fine"], "skin tone, rings, sleeves, nail detail", "one slow deliberate hand action", "extra or fused fingers, melting grip", ["close-up", "extreme close-up"]),
    S("face close-up emotion", "people", 3, ["face", "eyes"], "eye color, skin texture, distinguishing marks", "one micro-expression change", "expression snapping, asymmetry drift, uncanny eyes", ["close-up", "medium close-up"]),
    S("elderly person", "people", 2, ["face", "hands", "body"], "age markers, posture, wardrobe", "slow careful movement", "age shifting across frames", ["medium", "medium close-up"]),
    S("child character (stylized)", "people", 3, ["face", "limbs", "minor"], "clearly stylized, non-photoreal design", "benign play or storybook action", "age ambiguity, realism creep", ["medium wide", "medium"], sensitive="minor"),
    S("crowd", "people", 3, ["multi", "face", "background", "body"], "density, behavior, clothing palette", "uniform ambient motion (milling, cheering)", "melting faces at distance, duplicates, teleporting extras", ["wide", "extreme wide"]),
    S("athlete in action", "people", 3, ["limbs", "body", "fast", "object"], "sport, kit colors, equipment", "one sport action broken into beats", "ball/equipment physics, limb errors", ["wide", "medium wide"]),
    S("presenter with product", "people", 3, ["face", "hands", "object", "speech", "brand"], "presenter anchors + product reference image", "holds product steady, small gesture", "product redesign, hand-object merge", ["medium", "medium close-up"]),
    S("dog", "animals", 2, ["fur", "limbs", "animal", "face"], "breed, coat color, collar", "natural trot or sit, tail motion", "leg count, breed drift", ["wide", "medium"]),
    S("cat", "animals", 2, ["fur", "limbs", "animal", "face"], "breed, coat pattern, eye color", "slow stretch, blink, tail flick", "pattern drift, liquid-body morphing", ["medium", "close-up"]),
    S("horse", "animals", 2, ["limbs", "animal", "fast"], "coat color, tack, mane", "walk/trot/gallop named explicitly", "gait errors, leg count", ["wide", "medium wide"]),
    S("bird in flight", "animals", 2, ["wings", "animal", "fast", "sky"], "species, plumage", "wingbeat rhythm, glide", "wing count, flapping incoherence", ["wide", "medium"]),
    S("fish / marine life", "animals", 1, ["animal", "water"], "species, color", "slow swimming, schooling", "fin errors, schooling chaos", ["medium", "wide"]),
    S("insect macro", "animals", 2, ["fine", "animal", "legs"], "species, color, texture", "slow crawl or still with antennae twitch", "leg count, wing artifacts", ["extreme close-up", "close-up"]),
    S("wild animal (large)", "animals", 2, ["limbs", "animal", "fur"], "species, environment", "natural behavior named precisely", "anatomy errors, scale errors", ["wide", "medium wide"]),
    S("car driving", "vehicles", 2, ["rigid", "wheels", "reflective", "fast"], "body style, color, era (no real badges)", "steady travel direction, wheels rotating", "wheel spin mismatch, body warping, direction flips", ["wide", "medium wide"]),
    S("car parked (product)", "vehicles", 2, ["rigid", "reflective", "brand"], "exact reference image, paint finish", "static vehicle, camera moves", "panel warping, reflections swimming", ["wide", "medium"]),
    S("motorcycle", "vehicles", 2, ["rigid", "wheels", "fast", "limbs"], "style, color, rider gear", "lean into turn, steady line", "rider-bike merge, wheel errors", ["wide", "medium wide"]),
    S("aircraft", "vehicles", 1, ["rigid", "sky", "fast"], "type, livery (fictional)", "steady flight path", "wing geometry warping", ["wide", "extreme wide"]),
    S("boat / ship", "vehicles", 1, ["rigid", "water"], "type, size, color", "bobbing, wake trail", "hull warping, wake errors", ["wide", "extreme wide"]),
    S("train", "vehicles", 1, ["rigid", "fast", "multi"], "type, era, color", "constant speed along track", "carriage count change, track misalignment", ["wide", "extreme wide"]),
    S("product on pedestal", "products", 2, ["rigid", "brand", "text", "reflective"], "reference image of the real product, materials", "product static or slow turntable rotation", "shape/label redesign, logo distortion", ["medium", "close-up"]),
    S("bottle / liquid product", "products", 3, ["rigid", "liquid", "text", "brand", "reflective"], "reference image, liquid color, label from post", "single pour or condensation drip", "liquid physics, label warping", ["close-up", "medium"]),
    S("cosmetics / skincare", "products", 2, ["fine", "brand", "texture", "text"], "reference image, texture (cream, gel)", "single swatch or dab", "texture inconsistency, packaging redesign", ["close-up", "extreme close-up"]),
    S("electronic device", "products", 3, ["rigid", "screen", "text", "brand"], "reference image, finish; screens composited in post", "slow rotation, button press", "screen gibberish, port/button drift", ["medium", "close-up"]),
    S("app or website UI", "products", 3, ["screen", "text"], "real screenshots only", "use screenshot stitching, not generation", "invented UI, unreadable text", ["medium"]),
    S("jewelry", "products", 2, ["fine", "reflective", "rigid"], "metal, stone, setting", "slow rotation catching light", "facet sparkle flicker, shape drift", ["extreme close-up", "close-up"]),
    S("clothing / fashion garment", "products", 2, ["cloth", "body", "brand"], "fabric, cut, color, reference image", "fabric sway with model walk", "pattern swimming, garment changing", ["medium wide", "medium"]),
    S("food plated dish", "food", 2, ["texture", "steam", "fine"], "ingredients, plating, garnish", "steam rising, slow sauce drizzle", "ingredient morphing, plate geometry", ["close-up", "medium close-up"]),
    S("drink being poured", "food", 3, ["liquid", "rigid", "reflective"], "glass shape, liquid color, ice", "one continuous pour", "liquid passing through glass, volume errors", ["close-up", "medium close-up"]),
    S("cooking action", "food", 3, ["hands", "fire", "steam", "object"], "utensils, ingredients, hands", "one cooking action (stir, flip, chop) in beats", "knife-hand merge, food teleporting", ["close-up", "medium"]),
    S("mountain landscape", "nature", 1, ["landscape", "sky"], "range shape, snow line, season", "clouds drifting, light shifting", "geometry swimming during moves", ["extreme wide", "wide"]),
    S("ocean / waves", "nature", 2, ["water", "fluid", "landscape"], "sea state, color, coastline", "rhythmic breaking waves", "wave direction reversal, foam noise", ["wide", "extreme wide"]),
    S("waterfall / river", "nature", 2, ["water", "fluid"], "flow volume, rock type", "continuous downward flow", "flow freezing or reversing", ["wide", "medium wide"]),
    S("forest", "nature", 1, ["landscape", "fine", "background"], "tree species, season, density", "leaves swaying, light shafts", "branch flicker, texture boiling", ["wide", "medium wide"]),
    S("sky / clouds timelapse", "nature", 1, ["sky", "fluid"], "cloud type, time of day", "clouds streaming in one direction", "direction inconsistency", ["extreme wide", "wide"]),
    S("fire / flames", "elements", 3, ["fire", "fluid", "flicker"], "fuel source, flame color, scale", "steady flickering upward", "strobing, flames detaching", ["medium", "close-up"]),
    S("smoke / fog", "elements", 2, ["fluid", "background"], "density, color, direction", "slow drifting in one direction", "smoke popping in/out", ["medium", "wide"]),
    S("rain / snow weather", "elements", 2, ["particles", "background", "flicker"], "intensity, direction", "constant fall direction", "particles reversing, inconsistency", ["wide", "medium"]),
    S("explosion / VFX", "elements", 3, ["fire", "fast", "particles"], "scale, color, debris type", "single blast then settle", "physics chaos, scale errors", ["wide", "medium wide"]),
    S("city street", "places", 2, ["multi", "background", "text", "rigid"], "era, region, signage policy", "ambient traffic and pedestrians", "gibberish signs, melting pedestrians", ["wide", "medium wide"]),
    S("interior room", "places", 1, ["rigid", "background"], "style, furniture, materials", "static room, camera reveals", "furniture shifting between frames", ["wide", "medium wide"]),
    S("building architecture", "places", 1, ["rigid", "landscape"], "era, material, floors", "static, camera moves", "window counts changing, geometry warping", ["wide", "extreme wide"]),
    S("real-estate interior tour", "places", 2, ["rigid", "background", "fine"], "real photos as references; never invent features", "smooth walkthrough move", "invented rooms or fixtures (misrepresentation)", ["wide", "medium wide"]),
    S("sign or written text in scene", "graphics", 3, ["text"], "avoid; add text in post", "none; composite in post", "misspelling, gibberish glyphs", ["medium"]),
    S("logo / title animation", "graphics", 3, ["text", "brand", "rigid"], "generate title image first then animate", "subtle reveal motion", "letter distortion", ["medium", "close-up"]),
    S("3D animated character", "stylized", 2, ["face", "limbs", "stylized"], "character sheet reference, style term", "expressive but simple action", "style drift to photoreal, proportion drift", ["medium", "medium wide"]),
    S("2D cartoon scene", "stylized", 2, ["stylized", "limbs"], "line style, palette, character sheet", "snappy single action", "line boiling, off-model frames", ["medium", "wide"]),
    S("robot / mech", "stylized", 2, ["rigid", "limbs", "reflective"], "design sheet, materials", "mechanical deliberate motion", "part count changes, joint errors", ["medium wide", "wide"]),
    S("fantasy creature", "stylized", 2, ["limbs", "animal", "wings"], "design sheet: limbs, wings, color", "one signature action", "limb count drift, design drift", ["wide", "medium wide"]),
    S("abstract motion graphics", "stylized", 1, ["fluid", "stylized"], "shapes, palette, rhythm", "looping fluid motion", "noise, unwanted text", ["medium"]),
    S("historical scene", "places", 2, ["multi", "cloth", "background"], "era, costume, verified period details", "period-appropriate action", "anachronisms, invented history", ["wide", "medium"]),
])

# ---------------------------------------------------------------------------
# ARTIFACTS (failure modes) — tags say which subjects are exposed
# ---------------------------------------------------------------------------
def A(name, tags, detect, cause, prevent, fix, sev="major"):
    return name, dict(tags=set(tags), detect=detect, cause=cause, prevent=prevent, fix=fix, sev=sev)

ARTIFACTS = dict([
    A("extra or fused fingers", ["hands"], "step frame-by-frame through every hand gesture", "complex hand poses and fast hand motion", "one slow hand action; keep hands still or partly out of frame", "regenerate with simpler hand action or reframe tighter on face"),
    A("extra or missing limbs", ["limbs", "legs"], "count limbs at peak motion frames", "fast or overlapping limb motion", "name one action, slow speed, avoid crossing limbs", "regenerate from the keyframe with slower beats"),
    A("face identity drift", ["face"], "compare first, middle and last frame against the reference", "long takes, head turns, lighting changes", "repeat verbatim identity anchors; keep shots short; start from reference keyframe", "regenerate from reference; shorten shot"),
    A("lip-sync mismatch", ["mouth", "speech"], "watch with sound on at full speed and at slow speed", "too many words for the shot length", "keep lines under the word budget; static or slow camera", "shorten the line, regenerate; or move speech to off-screen VO"),
    A("wrong speaker animation", ["multi", "speech"], "check whose mouth moves on each line", "unlabeled or ambiguous speakers", "label each speaker with distinct anchors and alternate turns", "split into single-speaker shots"),
    A("morphing rigid objects", ["rigid"], "watch edges and silhouettes of rigid objects", "camera moves that reveal unseen sides", "simpler camera move; reference image; fewer objects", "regenerate with static camera"),
    A("label / logo distortion", ["brand", "text"], "freeze-frame every visible label", "models cannot hold exact glyphs", "keep labels out of the generation; composite in post", "mask and composite real artwork in post"),
    A("gibberish text", ["text", "screen"], "read every glyph on signs, screens and packaging", "models hallucinate text", "request blank signs/screens; add text in post", "regenerate with blank surfaces"),
    A("liquid physics errors", ["liquid", "water"], "watch the liquid path and volume", "complex pours and container interaction", "one continuous pour, simple container, slow speed", "regenerate with simpler pour or cut away"),
    A("flicker / strobing", ["flicker", "fire", "fine", "particles"], "watch at full speed on a large screen", "flickering sources, fine textures, conflicting motion", "request steady light; reduce fine patterns; one motion", "regenerate; never ship strobing (photosensitivity)", "block"),
    A("texture boiling", ["fine", "fur", "background", "texture"], "watch static areas for crawling texture", "high-frequency detail", "simplify background; use shallow depth of field", "regenerate with blurred background"),
    A("background people melting", ["multi", "background"], "inspect every background figure", "distant small faces", "reduce crowd density or blur background", "regenerate or crop"),
    A("duplicate subject", ["multi", "animal", "face"], "count subjects in every frame", "ambiguous subject count", "state exact count: 'one dog'", "regenerate with explicit count"),
    A("object pass-through", ["object", "hands", "rigid"], "watch every contact point", "interaction between objects", "minimize contact; describe contact explicitly", "regenerate with simpler interaction"),
    A("foot sliding", ["limbs", "body"], "watch feet against the ground", "walk speed vs camera speed mismatch", "match tracking speed to walking pace", "regenerate or crop above feet"),
    A("direction reversal", ["fast", "water", "sky", "particles", "wheels"], "check motion direction start to end", "underspecified direction", "state direction: 'moving left to right'", "regenerate with explicit direction"),
    A("scale inconsistency", ["animal", "landscape", "rigid"], "compare subject size to known objects", "no scale reference", "include a scale reference object", "regenerate with scale cue"),
    A("hallucinated audio", ["speech", "background", "multi"], "listen for laughter, music or voices not asked for", "undefined soundscape", "always define ambience; say 'no music' when needed", "regenerate or replace audio track in post"),
    A("burned-in subtitles", ["speech"], "check the lower frame for text", "dialogue prompts", "state 'no subtitles, no on-screen text'", "regenerate; never crop text off the frame as a fix if it removes key content"),
    A("style drift", ["stylized", "face"], "compare medium/style against lock sheet", "missing style string", "repeat the locked style string first in every prompt", "regenerate with style string first"),
    A("color / palette drift", ["landscape", "background", "cloth"], "compare to lock-sheet color anchors", "missing color anchors", "name 3-5 color anchors every shot", "light grade in post or regenerate"),
    A("wheel / rotation mismatch", ["wheels"], "check wheels rotate with travel", "rotation physics", "medium-wide framing, steady speed", "regenerate or frame wheels out"),
    A("wing / flap incoherence", ["wings"], "count wings and follow wingbeat", "fast wing motion", "glide or slow wingbeat", "regenerate with gliding"),
    A("fur / hair swimming", ["fur", "hair"], "watch hair edges", "fine strands in motion", "light breeze only; shallow DOF", "regenerate with calmer motion"),
    A("cloth pattern swimming", ["cloth"], "watch patterned fabric", "fine patterns", "solid colors or large patterns", "regenerate with solid fabric"),
    A("reflection errors", ["reflective"], "check reflections match the scene", "mirrors and glossy surfaces", "matte finishes or soft reflections", "regenerate or reframe"),
    A("eye uncanniness", ["eyes", "face"], "watch blinks and gaze", "close-ups without gaze direction", "state gaze target and natural blinking", "regenerate with gaze target"),
    A("age ambiguity / realism creep", ["minor"], "check apparent age and realism", "photoreal style on child characters", "clearly stylized non-photoreal design; benign context", "regenerate stylized or drop the shot", "block"),
    A("brand/IP infringement", ["brand"], "check for third-party logos, mascots, trade dress", "named brands in prompt", "use only user-supplied authorized assets or fictional brands", "regenerate with generic design", "block"),
    A("invented product features", ["brand", "screen"], "compare to the real product sheet", "model fills unknown details", "use real reference image; describe only verified features", "regenerate or composite real asset", "block"),
    A("geometry swimming in camera moves", ["landscape", "rigid", "background"], "watch horizons and verticals during the move", "large camera moves inventing geometry", "slower move; less travel distance", "regenerate with smaller move"),
    A("particle chaos", ["particles", "fire"], "watch particle direction and density", "underspecified particle behavior", "specify density and fall direction", "regenerate"),
    A("frozen / static output", ["stylized", "landscape", "rigid"], "check that something moves in every second", "weak video prompt on i2v", "describe motion and camera, not the image", "regenerate with stronger motion verbs"),
    A("end-of-clip collapse", ["face", "limbs", "rigid"], "inspect the last 1 second closely", "no end state described", "describe the final pose / end state", "trim tail editorially or regenerate"),
    A("anachronism", ["cloth", "background", "multi"], "check period details", "model mixes eras", "name era and verified period details", "regenerate"),
    A("misrepresentation of real place", ["landscape", "rigid", "fine"], "compare with real current photos", "stale training data", "use real photos as references; label as illustrative", "replace with real footage or label", "block"),
])

# ---------------------------------------------------------------------------
# GENRES
# ---------------------------------------------------------------------------
def G(name, purpose, pacing, camera, audio, risk, hook, cta, light, platform):
    return name, dict(purpose=purpose, pacing=pacing, camera=camera, audio=audio, risk=risk, hook=hook, cta=cta, light=light, platform=platform)

GENRES = dict([
    G("product ad", "sell one product benefit", "2-4s shots", "orbit, push-in, macro", "music bed + product sound effects", "product redesign, invented claims", "hero product reveal in first 2s", "price/offer/where to buy, added in post", "rim backlight", "9:16 and 1:1 social"),
    G("e-commerce listing", "show product accurately", "3-5s shots", "turntable, static", "light music or silent", "misrepresentation vs real product", "product fully visible at frame 1", "add-to-cart message in post", "high-key studio", "1:1 and 9:16"),
    G("explainer", "teach one concept", "3-6s shots", "static and slow push-in", "TTS narration + soft bed", "factual errors, unsourced stats", "question or surprising fact", "next step or learn more", "high-key studio", "16:9 YouTube"),
    G("education lesson", "build understanding step by step", "4-6s shots", "static, slow moves", "clear narration, minimal music", "accuracy, pacing too fast", "learning objective stated", "recap + practice prompt", "overcast diffuse", "16:9"),
    G("documentary", "inform truthfully", "6-12s shots", "handheld subtle, slow pans", "ambient + narration", "fabricating real events or people", "striking real-world image", "reflection or source pointer", "overcast diffuse", "16:9"),
    G("news explainer", "explain a current event", "3-5s shots", "static", "narration", "presenting AI imagery as real footage", "headline fact", "source citation on screen", "three-point interview", "16:9 and 9:16"),
    G("interview", "let a person speak", "long takes", "static, slow push-in", "clean dialogue", "synthetic real-person likeness", "strongest quote first", "lower-third + follow", "three-point interview", "16:9"),
    G("corporate brand film", "build trust in a company", "4-8s shots", "gimbal-smooth dolly", "uplifting score + VO", "unverified claims, compliance", "human moment", "brand line + URL in post", "soft window light", "16:9"),
    G("recruitment", "attract applicants", "3-5s shots", "handheld subtle, dolly", "upbeat music + voices", "misrepresenting workplace", "employee moment", "apply link", "soft window light", "9:16 and 16:9"),
    G("training / onboarding", "teach a procedure", "4-8s shots", "static", "narration", "procedure errors, safety", "what you will learn", "checklist", "high-key studio", "16:9"),
    G("social short", "stop the scroll", "1-3s shots", "push-in, whip pan, crash zoom", "trending-style music (licensed) + SFX", "slow open, no captions", "visual surprise in first second", "follow / comment prompt", "neon practicals", "9:16"),
    G("music video", "visualize a track", "cut on beat", "drone, orbit, handheld", "the licensed track only", "unlicensed music, repetition", "strongest image on first downbeat", "artist/track card", "volumetric haze", "16:9 and 9:16"),
    G("short drama", "tell a story with emotion", "4-8s shots", "static, slow push-in, OTS", "dialogue + ambient + score", "lip sync, continuity", "conflict in first shot", "resolution or cliffhanger", "low-key noir", "16:9"),
    G("comedy sketch", "make people laugh", "timing-driven", "static wide, crash zoom", "dialogue + SFX", "timing, lip sync", "absurd premise immediately", "punchline then cut", "fluorescent office", "9:16 and 16:9"),
    G("horror", "build dread", "slow then fast", "slow push-in, static negative space", "low drones, silence, sharp SFX", "photosensitive strobing, gore policy", "wrongness in a normal frame", "final scare or sting", "moonlight", "16:9"),
    G("thriller", "build tension", "4-6s shots", "tracking, handheld", "pulsing score + SFX", "continuity in chases", "threat or ticking clock", "cliffhanger", "low-key noir", "16:9"),
    G("fantasy", "transport to another world", "6-10s shots", "crane, drone, orbit", "orchestral ambience", "creature design drift", "world reveal", "title reveal", "volumetric haze", "16:9"),
    G("sci-fi", "show a future world", "6-10s shots", "slow dolly, crane", "synth ambience", "geometry/tech consistency", "technology reveal", "title reveal", "neon practicals", "16:9"),
    G("kids storybook (stylized)", "delight young viewers safely", "4-6s shots", "gentle slow moves", "warm narration + soft music", "realism with minors, unsafe content", "friendly character intro", "gentle moral or goodbye", "golden hour", "16:9"),
    G("travel / tourism", "inspire a visit", "3-6s shots", "drone, lateral truck", "ambient + music", "misrepresenting real places", "iconic vista", "plan your trip", "golden hour", "9:16 and 16:9"),
    G("real estate", "show a property honestly", "5-8s shots", "slow dolly walkthrough", "soft music", "invented features (misrepresentation)", "best room first", "contact agent", "soft window light", "16:9"),
    G("food / recipe", "make food irresistible and teach", "2-5s shots", "macro push-in, top-down static", "sizzle SFX + light music", "food morphing, unsafe steps", "money shot of the finished dish", "recipe link", "soft window light", "9:16"),
    G("fitness", "motivate and instruct", "2-4s shots", "tracking, static", "energetic music + coaching VO", "unsafe form shown", "transformation-free energetic hook", "join / follow", "hard midday sun", "9:16"),
    G("fashion", "show garments and attitude", "2-4s shots", "tracking, slow orbit", "fashion beat", "garment redesign", "silhouette hero shot", "shop link", "neon practicals", "9:16"),
    G("automotive", "make a vehicle desirable", "3-6s shots", "tracking, drone, low angle", "engine SFX + score", "real brand badges, unsafe driving", "vehicle reveal", "test drive CTA", "overcast rain", "16:9"),
    G("tech / SaaS demo", "show a real product working", "3-6s shots", "screenshot motion in post", "VO + light music", "invented UI", "the problem in one line", "free trial", "screen glow", "16:9"),
    G("event promo", "drive attendance", "1-3s shots", "handheld, crane", "high-energy music", "real attendee likeness", "date + vibe", "tickets", "stage spotlight", "9:16"),
    G("nonprofit appeal", "move people to act", "4-8s shots", "handheld subtle, static", "piano + VO", "exploiting real people, consent", "one human story", "donate", "soft window light", "16:9 and 9:16"),
    G("gaming trailer", "excite players", "1-4s shots", "fpv drone, whip pan", "punchy score + SFX", "IP infringement, misrepresenting gameplay", "action peak", "wishlist / play now", "neon practicals", "16:9"),
    G("sports highlight", "relive peak moments", "1-3s shots", "tracking, slow motion", "crowd ambience + score", "real athlete likeness", "peak action", "follow team", "hard midday sun", "9:16 and 16:9"),
])

PLATFORMS = {
    "YouTube long-form": dict(ratio="16:9", length="3-20 min", safe="avoid bottom-right end-screen zone in last 20s", captions="upload caption file", hook="first 15s"),
    "YouTube Shorts": dict(ratio="9:16", length="15-60s", safe="keep text out of bottom ~20% and right-edge buttons", captions="burned-in captions in post", hook="first 1-3s"),
    "Instagram Reels": dict(ratio="9:16", length="15-90s", safe="keep text out of top ~14% and bottom ~20%", captions="burned-in captions in post", hook="first 1-3s"),
    "TikTok": dict(ratio="9:16", length="15-60s", safe="keep text out of right-edge buttons and bottom caption area", captions="burned-in captions in post", hook="first 1-2s"),
    "Instagram / Facebook feed": dict(ratio="1:1 or 4:5", length="15-60s", safe="center-weighted composition", captions="burned-in captions", hook="first 2s"),
    "LinkedIn": dict(ratio="1:1 or 16:9", length="30-90s", safe="center-weighted", captions="burned-in captions (muted autoplay)", hook="first 3s"),
    "Website hero loop": dict(ratio="16:9", length="6-20s loop", safe="leave space for headline overlay", captions="none if silent", hook="seamless loop"),
    "Broadcast / presentation": dict(ratio="16:9", length="any", safe="title-safe central 90%", captions="caption file", hook="n/a"),
}

PHASES = ["brief", "research", "script", "lock sheet", "storyboard", "keyframe image prompt", "video prompt",
          "generation", "clip QA", "audio", "edit", "captions & text", "export", "delivery", "post-mortem"]
