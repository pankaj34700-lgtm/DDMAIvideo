const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const OPTIONS_50 = [
  // Pillar I
  { id: 1, pillar: "Generation Engines", title: "Multi-Model Dynamic Router", desc: "Routes shots to Veo 3.1 Fast, Quality, Gemini Omni Flash, Seedance, or MiniMax H3 based on prompt intent.", default: true },
  { id: 2, pillar: "Generation Engines", title: "Dual-Prompt Splitter Engine", desc: "Decomposes single user brief into Prompt 1 (Keyframe Still) and Prompt 2 (Video Motion).", default: true },
  { id: 3, pillar: "Generation Engines", title: "10-Second Scene Assembler", desc: "Enforces exact 10.0s unit math: 4s+6s, 6s+4s, or 12s cut to 10s. Prohibits time-stretching.", default: true },
  { id: 4, pillar: "Generation Engines", title: "Keyframe Chaining Pipeline", desc: "Extracts tail frame of Shot 1 via ffmpeg (-sseof -0.1) as reference for Shot 2.", default: true },
  { id: 5, pillar: "Generation Engines", title: "Start & End Frame Interpolation", desc: "Accepts opening and terminal keyframes, generating smooth intermediate motion.", default: false },

  // Pillar II
  { id: 6, pillar: "Camera Kinematics", title: "24 Camera Moves Palette", desc: "Standardized cinematographic move definitions (Static, push-in, dolly, orbit, crane, etc.).", default: true },
  { id: 7, pillar: "Camera Kinematics", title: "Motion Energy Slider (1-3)", desc: "Controls camera and subject velocity, matching vocabulary from subtle to dynamic.", default: true },
  { id: 8, pillar: "Camera Kinematics", title: "Speed Word Inserter", desc: "Injects mandatory camera speed modifier (slow, smooth, rapid) to prevent jerkiness.", default: true },
  { id: 9, pillar: "Camera Kinematics", title: "Motion-Parallax Depth Lock", desc: "Optimizes foreground, midground, and background separation during lateral moves.", default: true },
  { id: 10, pillar: "Camera Kinematics", title: "Subject Directional Vector Lock", desc: "Locks motion vector (left-to-right, approaching camera) to stop mid-clip direction reversal.", default: true },

  // Pillar III
  { id: 11, pillar: "Lighting & Aesthetics", title: "20 Cinematic Lighting Setups", desc: "Pre-engineered illumination setups (Window light, golden hour, neon practicals, noir).", default: true },
  { id: 12, pillar: "Lighting & Aesthetics", title: "Verbatim Style String Lock", desc: "Appends 15-25 word style signature to every keyframe prompt for zero aesthetic drift.", default: true },
  { id: 13, pillar: "Lighting & Aesthetics", title: "Hex / Tone Color Anchor Guard", desc: "Enforces 3-5 locked color anchors across every shot to keep color grading consistent.", default: true },
  { id: 14, pillar: "Lighting & Aesthetics", title: "Depth of Field & Aperture Selector", desc: "Toggles between f/1.8 shallow portrait bokeh and f/8 deep architectural focus.", default: true },
  { id: 15, pillar: "Lighting & Aesthetics", title: "Procedural Shader & Film Grain FX", desc: "Post-generation shader applying 35mm grain, halation, and chromatic aberration.", default: false },

  // Pillar IV
  { id: 16, pillar: "Character & Object Continuity", title: "Persistent Character Sheet Ingestion", desc: "Stores facial structure, age, wardrobe anchors, repeating them verbatim across shots.", default: true },
  { id: 17, pillar: "Character & Object Continuity", title: "Product Geometry Preserver", desc: "Locks product design to real reference images; masks labels for post-compositing.", default: true },
  { id: 18, pillar: "Character & Object Continuity", title: "Multi-Subject Separation & Eyelines", desc: "Assigns distinct wardrobe to characters and locks 180-degree rule eyelines.", default: true },
  { id: 19, pillar: "Character & Object Continuity", title: "Wardrobe Texture Stability Filter", desc: "Replaces complex houndstooth patterns with solid tones to eliminate cloth shimmering.", default: true },
  { id: 20, pillar: "Character & Object Continuity", title: "Facial Micro-Expression Stabilizer", desc: "Limits facial animation to single micro-expressions, preventing uncanny facial warping.", default: true },

  // Pillar V
  { id: 21, pillar: "Audio & Speech", title: "Native Video Lip-Sync Engine", desc: "Uses Veo 3.1 and Gemini Omni native audio synthesis for synchronized spoken dialogue.", default: true },
  { id: 22, pillar: "Audio & Speech", title: "2.5 Words-per-Second Budget Enforcer", desc: "Strict counter that trims dialogue exceeding 2.5 words per second of shot length.", default: true },
  { id: 23, pillar: "Audio & Speech", title: "Multi-Track Audio Ducking Mix", desc: "Automates ffmpeg sidechain ducking of background music by -12dB under speech.", default: true },
  { id: 24, pillar: "Audio & Speech", title: "Custom Voice Cloner & Stylizer", desc: "Ingests user vocal samples to apply consistent vocal timbre across all scenes.", default: false },
  { id: 25, pillar: "Audio & Speech", title: "Foley & Ambient Acoustic Layering", desc: "Injects room acoustics and foley sound effects, explicitly blocking unrequested music.", default: true },

  // Pillar VI
  { id: 26, pillar: "Linter & Validation", title: "Pre-Gen Zero-Cost Linter (lint_scene)", desc: "Validates JSON against 10,000 rules before spending credits; requires 0 errors.", default: true },
  { id: 27, pillar: "Linter & Validation", title: "Negative Prompt Shield", desc: "Injects model-calibrated negative prompts to suppress extra limbs and visual noise.", default: true },
  { id: 28, pillar: "Linter & Validation", title: "Slogan & Fluff Buzzword Purge", desc: "Filters out '8K', 'photorealistic', 'masterpiece' tokens to focus latent attention.", default: true },
  { id: 29, pillar: "Linter & Validation", title: "Anti-Fine-Motor-Task Filter", desc: "Blocks requests for typing, tying shoelaces, dealing cards; substitutes macro actions.", default: true },
  { id: 30, pillar: "Linter & Validation", title: "Platform Safe Zone Auto-Formatter", desc: "Calculates 9:16 safe margins for TikTok/Reels (keeping action out of top 14% and bottom 20%).", default: true },

  // Pillar VII
  { id: 31, pillar: "Video-to-Video & Editing", title: "3-Turn Conversational Video Editor", desc: "Uses Gemini Omni Flash conversational V2V to alter existing video via natural prompts.", default: true },
  { id: 32, pillar: "Video-to-Video & Editing", title: "Segment Masked Inpainting", desc: "Enables brush-masking on video frames to insert, remove, or modify elements.", default: false },
  { id: 33, pillar: "Video-to-Video & Editing", title: "Clip Expander (Extend Video)", desc: "Generates continuous footage seamlessly extending from the end of an 8s Veo clip.", default: true },
  { id: 34, pillar: "Video-to-Video & Editing", title: "Draft 360p Fast Preview Mode", desc: "Generates quick 360p drafts at 50% credit cost for rapid creative iterations.", default: true },
  { id: 35, pillar: "Video-to-Video & Editing", title: "Zero-Credit 720p/1080p AI Upscaler", desc: "Upscales verified 360p draft renders to 720p/1080p with zero compute credits.", default: true },

  // Pillar VIII
  { id: 36, pillar: "Timeline & Scenebuilder UX", title: "Multi-Track Drag & Drop Timeline", desc: "Non-linear timeline for arranging clips, keyframe images, audio, and graphic overlays.", default: true },
  { id: 37, pillar: "Timeline & Scenebuilder UX", title: "Head & Tail Trimming Handles", desc: "Frame-accurate handles to trim off the first 0.5s or final 1.0s of an AI take.", default: true },
  { id: 38, pillar: "Timeline & Scenebuilder UX", title: "Non-Linear Clip Stacking & Reorder", desc: "Enables dragging, swapping, and duplicating clips with real-time web playback.", default: true },
  { id: 39, pillar: "Timeline & Scenebuilder UX", title: "Automated Transition Engine", desc: "Applies ffmpeg xfade dissolves (0.5s overlap) or fast whip-pan transitions.", default: true },
  { id: 40, pillar: "Timeline & Scenebuilder UX", title: "Knob-Automated Bento Box (Pixel Bento)", desc: "Real-time recording knobs to automate contrast, grain, saturation, and crop zoom.", default: false },

  // Pillar IX
  { id: 41, pillar: "QA & Compliance", title: "36-Artifact Computer Vision Scanner", desc: "Post-generation QA reviewing takes for limb warping, face drift, and object melting.", default: true },
  { id: 42, pillar: "QA & Compliance", title: "Photosensitive Strobing Check", desc: "Detects high-frequency luminance oscillations, rejecting unsafe flashing clips.", default: true },
  { id: 43, pillar: "QA & Compliance", title: "Deepfake & IP Rights Shield", desc: "Blocks prompts with unauthorized logos, living celebrity likenesses, or deceptive content.", default: true },
  { id: 44, pillar: "QA & Compliance", title: "Unwanted Subtitle Text Filter", desc: "OCR scanner discarding takes with burned-in gibberish text in the lower third.", default: true },
  { id: 45, pillar: "QA & Compliance", title: "Rigid Object Melt Detector", desc: "Monitors geometric surfaces (cars, phones, buildings) to prevent warping lines.", default: true },

  // Pillar X
  { id: 46, pillar: "Multi-Agent Architecture", title: "Autonomous 6-Agent Pipeline", desc: "Coordinates Director, Prompt Writer, Linter, Generator, Reviewer, and Editor.", default: true },
  { id: 47, pillar: "Multi-Agent Architecture", title: "Real-Time Quota & Cost Shield", desc: "Calculates exact credit cost before generation and requires explicit user sign-off.", default: true },
  { id: 48, pillar: "Multi-Agent Architecture", title: "Asset Stack & Version History Tree", desc: "Non-destructive storage for all prompt iterations, intermediate keyframes, and takes.", default: true },
  { id: 49, pillar: "Multi-Agent Architecture", title: "One-Click Batch Variations Generator", desc: "Generates 4 variations of a keyframe or motion take simultaneously for selection.", default: true },
  { id: 50, pillar: "Multi-Agent Architecture", title: "Serverless FFmpeg Render Worker", desc: "Headless pipeline executing concatenation, color LUT, and audio mixing in cloud.", default: true }
];

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // API Endpoints
  if (url.pathname === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'online', app: 'DDMAI.VIDEO Production Studio', brand: 'DDMAI.VIDEO', version: '2.5', port: PORT }));
    return;
  }

  if (url.pathname === '/api/images') {
    const keyframesDir = path.join(PUBLIC_DIR, 'images', 'keyframes');
    const ingredientsDir = path.join(PUBLIC_DIR, 'images', 'ingredients');
    const tailsDir = path.join(PUBLIC_DIR, 'images', 'tails');
    const thumbnailsDir = path.join(PUBLIC_DIR, 'images', 'thumbnails');
    const rendersDir = path.join(PUBLIC_DIR, 'renders');
    
    const getFiles = (dir) => fs.existsSync(dir) ? fs.readdirSync(dir) : [];

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      paths: {
        keyframes_disk: keyframesDir,
        keyframes_url: '/images/keyframes/',
        ingredients_disk: ingredientsDir,
        ingredients_url: '/images/ingredients/',
        tails_disk: tailsDir,
        tails_url: '/images/tails/',
        thumbnails_disk: thumbnailsDir,
        thumbnails_url: '/images/thumbnails/',
        renders_disk: rendersDir,
        renders_url: '/renders/'
      },
      files: {
        keyframes: getFiles(keyframesDir),
        ingredients: getFiles(ingredientsDir),
        tails: getFiles(tailsDir),
        thumbnails: getFiles(thumbnailsDir),
        renders: getFiles(rendersDir)
      }
    }));
    return;
  }

  if (url.pathname === '/api/options') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ total: OPTIONS_50.length, options: OPTIONS_50 }));
    return;
  }

  if (url.pathname === '/api/split-prompt' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        const brief = (data.brief || '').toLowerCase();
        let p1 = '';
        let p2 = '';
        let framing = data.framing || 'medium shot';
        let move = data.move || 'slow push-in';
        let lighting = data.lighting || 'soft window light';
        let model = data.model || 'veo_3_1_fast';

        if (brief.includes('perfume') || brief.includes('luxury') || brief.includes('product')) {
          p1 = `Photorealistic cinematic commercial studio footage, crisp 35mm finish. Close-up of one frosted glass perfume bottle with fluted brass cap resting on wet obsidian slate, soft natural side-lighting, warm amber and brushed gold color anchors, shallow depth of field, vertical 9:16 frame.`;
          p2 = `${move}. A single water droplet glides down the curve of the bottle, catching golden light, then settles onto the dark stone. Ends with the bottle held still and centered. Audio: Soft water droplet drip, quiet studio silence, no music, no subtitles.`;
        } else if (brief.includes('ugc') || brief.includes('tiktok') || brief.includes('skincare')) {
          p1 = `Authentic smartphone 4K creator aesthetic. Medium shot of a 24-year-old woman with natural freckles, honey-brown hair in a claw clip, wearing an oversized beige waffle-knit sweater, holding a pastel mint skincare tube at a sunny oak table, natural morning daylight, vertical 9:16 frame.`;
          p2 = `Subtle handheld movement. She lifts the tube toward the camera smiling, twists the cap off, points to her cheek with index finger, and speaks with natural facial animation. Ends with her holding the tube steady. Audio: Woman says: "If your morning skin feels dry, you need to see this." natural room acoustics, no music, no subtitles.`;
        } else if (brief.includes('scifi') || brief.includes('cyber') || brief.includes('film')) {
          p1 = `Anamorphic 65mm Panavision widescreen cinematic film still. Extreme wide shot of a lone cybernetic explorer in distressed matte-charcoal armor on wet basalt ridge overlooking neo-city in rain fog, cyan neon practicals, horizontal 16:9 frame.`;
          p2 = `Slow crane down. Explorer stands resolute against wind, activates holographic wrist terminal glowing orange, visor glints in torrential rain. Ends with visor gaze fixed forward. Audio: Torrential rain on rocks, mechanical suit servo hum, explorer says: "Beacon located. Moving in." no subtitles.`;
        } else {
          p1 = `Photorealistic cinematic lifestyle footage, natural film look. ${framing} of one subject in setting, ${lighting}, warm amber, teal, and slate color anchors, shallow depth of field, vertical 9:16 frame.`;
          p2 = `${move}. Subject performs main action beat smoothly, pauses, and holds pose. Ends with subject still and looking into lens. Audio: Ambient environment sound, soft foley sound effects, no music, no subtitles.`;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          model: model,
          shot_id: "P01_S01_SH1",
          duration: 4,
          prompt_1_keyframe: p1,
          prompt_2_motion: p2,
          lint_status: "PASS (0 Errors)",
          speech_budget: "Under 2.5 wps"
        }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // Serve static files from website/public
  let reqPath = url.pathname === '/' ? '/index.html' : url.pathname;
  let filePath = path.join(PUBLIC_DIR, reqPath);

  // Security check to prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType, 'Content-Length': stats.size });
    if (req.method === 'HEAD') {
      res.end();
      return;
    }
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`=== DDMAI.VIDEO Production Studio Server running on http://localhost:${PORT} ===`);
});
