# DDMAI.VIDEO — Next-Gen AI Video & Image Production Studio

[![Firebase Live](https://img.shields.io/badge/Firebase%20Hosting-Live-0284c7?style=for-the-badge&logo=firebase)](https://vedio-working.web.app)
[![Zero-Cost Mode](https://img.shields.io/badge/Compute%20Cost-%240.00%20Zero--Cost-10b981?style=for-the-badge)](https://vedio-working.web.app)
[![Tests Passing](https://img.shields.io/badge/Playwright%20E2E-31%2F31%20PASS-emerald?style=for-the-badge)](https://github.com/pankaj34700-lgtm/DDMAIvideo)

> **DDMAI.VIDEO** is a Google Flow-style AI video and image production platform engineered to reduce creative compute costs to NIL ($0.00) using free-tier LLM agents, open-source models, and multi-shot keyframe chaining workflows.

---

## 🌐 Live Deployments

- **Live Cloud Web App:** [https://vedio-working.web.app](https://vedio-working.web.app)
- **Firebase Alternate URL:** [https://vedio-working.firebaseapp.com](https://vedio-working.firebaseapp.com)
- **Local Studio Server:** `http://localhost:3000`

---

## 🚀 Key Architectural Pillars

### 1. Dual-Prompt Decoupled Generation
Strictly separates keyframe image creation from video temporal dynamics:
* **Prompt 1 (Keyframe Image Still):** Spatial identity, lighting setups, 3-5 locked color anchors, shallow depth-of-field, with zero motion verbs.
* **Prompt 2 (Video Motion & Audio Foley):** Single directional camera vector, speed modifiers, physical action beats, static hold end-state, and foley acoustics without unrequested music.

### 2. The 10-Second Scene Math (6x10s = 60s Video)
To eradicate AI video morphing and hallucination:
* Every 10.0-second scene is built as **Shot 1 (4.0s keyframe start)** + **Shot 2 (6.0s chained tail frame)**.
* FFmpeg extracts the exact tail frame (`ffmpeg -sseof -0.1`) from Shot 1 as the pristine start frame for Shot 2.
* A 1-minute video is composed of exactly 6 scenes (12 coherent shots total).

### 3. Zero-Cost Engine Matrix ($0.00 / NIL Cost)
* **Image Synthesis ($0.00):** Google Imagen 3 (Free Tier 1,500 RPD) or FLUX.1-schnell via Hugging Face Serverless.
* **Video Generation ($0.00):** Gemini Omni 360p Draft + 0-credit 720p upscale / LTX-Video.
* **Audio Voiceover ($0.00):** Microsoft Edge-TTS with strict 2.5 words/second speech budget.
* **Post-Production Assembly ($0.00):** Local lossless FFmpeg stream-copy concatenation with -12dB background music ducking.

---

## 📂 Project Structure

```
├── website/
│   ├── server.js               # Node.js backend & API endpoints (/api/status, /api/options, /api/split-prompt)
│   └── public/
│       ├── index.html          # DDMAI.VIDEO Google Flow Studio Frontend
│       ├── api/                # Cloud CDN static endpoints (options.json, status.json)
│       └── images/             # Keyframes, ingredients, tails, and renders
├── firebase.json               # Firebase Hosting configuration
├── .firebaserc                 # Project binding: vedio-working
├── test_flow_studio_e2e.js     # Playwright 31-step E2E test suite
├── LAUNCH_DDMAI_VIDEO.bat      # One-click Windows desktop launcher
└── README.md
```

---

## 🛠️ Quickstart

### 1. Run Locally
```bash
# Clone the repository
git clone https://github.com/pankaj34700-lgtm/DDMAIvideo.git
cd DDMAIvideo

# Start local studio
node website/server.js
# Open http://localhost:3000 in your browser
```

Or simply double-click `LAUNCH_DDMAI_VIDEO.bat` on Windows!

### 2. Deploy to Firebase
```bash
firebase deploy --only hosting --project vedio-working
```

---

## 🔑 Free API Key Integrations
Configure your free API keys right inside the **`🔑 API Keys`** modal on the website or via `.env`:
1. **Google AI Studio (Gemini & Imagen 3):** [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) (Free $0.00 / 1,500 requests per day)
2. **Hugging Face (FLUX & LTX-Video):** [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) (Free Serverless Inference)
3. **Together AI:** [api.together.ai/settings/api-keys](https://api.together.ai/settings/api-keys) ($5-$25 free trial starter credits)

---

## 📄 License & Credits
Engineered for **DDMAI.VIDEO** • MIT License.
