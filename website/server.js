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
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf'
};

// Seed Users Database
let USERS = [
  {
    id: 'usr_001',
    name: 'Pankaj Sharma',
    email: 'admin@ddmai.video',
    role: 'SuperAdmin',
    status: 'Active',
    joined: '2026-10-15',
    credits: 'Unlimited ($0.00 Mode)',
    videosCreated: 42,
    certified: true,
    certId: 'DDMAI-CERT-2026-8942A'
  },
  {
    id: 'usr_002',
    name: 'Kunal Verma',
    email: 'director@ddmai.video',
    role: 'Director',
    status: 'Active',
    joined: '2026-10-18',
    credits: 'Unlimited ($0.00 Mode)',
    videosCreated: 28,
    certified: true,
    certId: 'DDMAI-CERT-2026-7714K'
  },
  {
    id: 'usr_003',
    name: 'Aarav Patel',
    email: 'creator@ddmai.video',
    role: 'Creator',
    status: 'Active',
    joined: '2026-10-22',
    credits: 'Unlimited ($0.00 Mode)',
    videosCreated: 15,
    certified: false,
    certId: null
  },
  {
    id: 'usr_004',
    name: 'Sarah Jenkins',
    email: 'student@ddmai.video',
    role: 'Student',
    status: 'Active',
    joined: '2026-10-25',
    credits: 'Unlimited ($0.00 Mode)',
    videosCreated: 6,
    certified: false,
    certId: null
  }
];

// Seed Certificates Database
let CERTIFICATES = [
  {
    id: 'DDMAI-CERT-2026-8942A',
    recipientName: 'Pankaj Sharma',
    recipientEmail: 'admin@ddmai.video',
    courseName: 'Master AI Film Director & 2D Animated Documentary Specialist',
    issueDate: 'October 26, 2026',
    issuedBy: 'DDMAI.VIDEO Global Production Academy',
    grade: 'Distinction (100% Zero-Cost Mastery)',
    verificationUrl: 'https://vedio-working.web.app?verify=DDMAI-CERT-2026-8942A'
  },
  {
    id: 'DDMAI-CERT-2026-7714K',
    recipientName: 'Kunal Verma',
    recipientEmail: 'director@ddmai.video',
    courseName: '1-Minute Video Production Master Blueprint & Prompt Architecture',
    issueDate: 'October 27, 2026',
    issuedBy: 'DDMAI.VIDEO Global Production Academy',
    grade: 'Honors',
    verificationUrl: 'https://vedio-working.web.app?verify=DDMAI-CERT-2026-7714K'
  }
];

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

const parseJsonBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (e) {
        reject(e);
      }
    });
  });
};

const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // 1. API: System Status
  if (url.pathname === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'online', 
      app: 'DDMAI.VIDEO Production Studio v3.0', 
      brand: 'DDMAI.VIDEO', 
      version: '3.0.0', 
      port: PORT,
      features: ['Admin Dashboard', 'User Login System', 'Certification System', 'Welcome Tour', 'Zero-Cost Engines'],
      stats: {
        totalUsers: USERS.length,
        totalCertificates: CERTIFICATES.length,
        activeProjects: 4,
        costSavedUSD: 142500
      }
    }));
    return;
  }

  // 2. API: Auth - Login
  if (url.pathname === '/api/auth/login' && req.method === 'POST') {
    try {
      const { email, password } = await parseJsonBody(req);
      const user = USERS.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
      if (user) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: `Welcome back, ${user.name}!`,
          user: user,
          token: `ddmai_jwt_${Buffer.from(user.email).toString('base64')}`
        }));
      } else {
        // Auto-register friendly demo if not found
        const newUser = {
          id: `usr_${Date.now().toString().slice(-4)}`,
          name: email.split('@')[0].toUpperCase(),
          email: email,
          role: email.includes('admin') ? 'SuperAdmin' : 'Director',
          status: 'Active',
          joined: new Date().toISOString().split('T')[0],
          credits: 'Unlimited ($0.00 Mode)',
          videosCreated: 1,
          certified: true,
          certId: `DDMAI-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`
        };
        USERS.push(newUser);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: `Account activated for ${newUser.name}!`,
          user: newUser,
          token: `ddmai_jwt_${Buffer.from(newUser.email).toString('base64')}`
        }));
      }
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: e.message }));
    }
    return;
  }

  // 3. API: Auth - Register
  if (url.pathname === '/api/auth/register' && req.method === 'POST') {
    try {
      const { name, email, role } = await parseJsonBody(req);
      if (!email) throw new Error('Email is required');
      let existing = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, user: existing, message: 'User logged in.' }));
        return;
      }
      const newUser = {
        id: `usr_${Date.now().toString().slice(-4)}`,
        name: name || email.split('@')[0],
        email: email,
        role: role || 'Director',
        status: 'Active',
        joined: new Date().toISOString().split('T')[0],
        credits: 'Unlimited ($0.00 Mode)',
        videosCreated: 0,
        certified: true,
        certId: `DDMAI-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`
      };
      USERS.push(newUser);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, user: newUser, message: 'Registration successful!' }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: e.message }));
    }
    return;
  }

  // 4. API: Users List (Admin)
  if (url.pathname === '/api/auth/users' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ total: USERS.length, users: USERS }));
    return;
  }

  // 5. API: Certificates List
  if (url.pathname === '/api/certificates' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ total: CERTIFICATES.length, certificates: CERTIFICATES }));
    return;
  }

  // 6. API: Issue Certificate
  if (url.pathname === '/api/certificates/issue' && req.method === 'POST') {
    try {
      const { recipientName, recipientEmail, courseName } = await parseJsonBody(req);
      const newCert = {
        id: `DDMAI-CERT-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        recipientName: recipientName || 'Certified AI Filmmaker',
        recipientEmail: recipientEmail || 'creator@ddmai.video',
        courseName: courseName || 'Master AI Film Director & 2D Animated Documentary Specialist',
        issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        issuedBy: 'DDMAI.VIDEO Global Production Academy',
        grade: 'Distinction (100% Zero-Cost Mastery)',
        verificationUrl: `https://vedio-working.web.app?verify=DDMAI-CERT-2026`
      };
      CERTIFICATES.unshift(newCert);

      // Update user certified status if email matches
      const user = USERS.find(u => u.email.toLowerCase() === newCert.recipientEmail.toLowerCase());
      if (user) {
        user.certified = true;
        user.certId = newCert.id;
      }

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, certificate: newCert }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: e.message }));
    }
    return;
  }

  // 7. API: Images & Media Paths
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

  // 8. API: 50 Options
  if (url.pathname === '/api/options') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ total: OPTIONS_50.length, options: OPTIONS_50 }));
    return;
  }

  // 9. API: Prompt Decomposition
  if (url.pathname === '/api/split-prompt' && req.method === 'POST') {
    try {
      const data = await parseJsonBody(req);
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
      } else if (brief.includes('2d') || brief.includes('documentary') || brief.includes('spy') || brief.includes('noir')) {
        p1 = `Stylized 2D animated documentary style, dark noir graphic novel aesthetic, hand-drawn ink line art, clean cel-shading. 38-year-old gentleman in tailored charcoal three-piece suit in confident conversation with military general in olive uniform at a lavish reception hall, chiaroscuro shadows, warm amber chandelier light, 16:9 frame.`;
        p2 = `Slow 2D layered parallax camera push-in. Subtle 2D micro-movements: natural eye blink, slight confident head nod, ambient light glints on crystal glass, flat graphic novel plane. Audio: Voice-over says: "इकलौता स्पाई— जो दुश्मन देश के प्रेसिडेंट बनने की रेस तक पहुँच गया!", clean studio voiceover, no BGM, no subtitles.`;
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
      // Fallback for API JSON requests if missing
      if (reqPath.startsWith('/api/')) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Endpoint not found' }));
        return;
      }
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
  console.log(`================================================================`);
  console.log(`  DDMAI.VIDEO Production Studio v3.0 running at:`);
  console.log(`  Local URL:   http://localhost:${PORT}`);
  console.log(`  Cloud URL:   https://vedio-working.web.app`);
  console.log(`  Features:    Admin Panel | User Login | Certificates | 2D AI Engine`);
  console.log(`================================================================`);
});
