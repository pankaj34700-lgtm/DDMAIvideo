const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const desktopPath = path.join(os.homedir(), 'Desktop');
const destDocxDesktop = path.join(desktopPath, 'HOW_TO_GET_FREE_API_KEYS_FOR_DDMAI_VIDEO.docx');
const destPdfDesktop  = path.join(desktopPath, 'HOW_TO_GET_FREE_API_KEYS_FOR_DDMAI_VIDEO.pdf');

const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Complete API Key Catalog for AI Image & Video Generation</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 30px; color: #1e293b; line-height: 1.5; font-size: 13px; }
    h1 { color: #4338ca; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; font-size: 22px; margin-bottom: 8px; }
    h2 { color: #0f172a; margin-top: 20px; font-size: 16px; border-left: 4px solid #4338ca; padding-left: 8px; }
    .badge-free { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
    .badge-credit { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; background: #fdf4ff; color: #a21caf; border: 1px solid #f0abfc; }
    .badge-cloud { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
    th { background: #4338ca; color: white; font-weight: 600; }
    tr:nth-child(even) { background: #f8fafc; }
    .provider-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin: 10px 0; }
    .url-box { background: #0f172a; color: #38bdf8; font-family: Consolas, monospace; padding: 6px 10px; border-radius: 6px; font-size: 11px; margin: 4px 0; }
    .page-break { page-break-after: always; }
  </style>
</head>
<body>
  <h1>DDMAI.VIDEO — Comprehensive Image & Video API Key Catalog</h1>
  <p>An exhaustive catalog of the top 12 API options for generating AI images and videos, categorized by cost, quota, and model architecture.</p>

  <h2>Master Comparison Table (12 Providers)</h2>
  <table>
    <thead>
      <tr>
        <th>Provider</th>
        <th>Models Supported</th>
        <th>Outputs</th>
        <th>Cost & Free Quota</th>
        <th>Direct API Key URL</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>1. Google AI Studio</strong></td>
        <td>Imagen 3, Gemini 2.0 Flash</td>
        <td>Image + Vision</td>
        <td><span class="badge-free">$0.00 Free Forever (1,500 RPD)</span></td>
        <td><code>aistudio.google.com/app/apikey</code></td>
      </tr>
      <tr>
        <td><strong>2. Hugging Face</strong></td>
        <td>FLUX.1-schnell, LTX-Video, CogVideoX</td>
        <td>Image + Video</td>
        <td><span class="badge-free">$0.00 Free Serverless API</span></td>
        <td><code>huggingface.co/settings/tokens</code></td>
      </tr>
      <tr>
        <td><strong>3. Cloudflare Workers AI</strong></td>
        <td>@cf/black-forest-labs/flux-1-schnell</td>
        <td>Image</td>
        <td><span class="badge-free">$0.00 (10,000 neurons/day)</span></td>
        <td><code>dash.cloudflare.com/profile/api-tokens</code></td>
      </tr>
      <tr>
        <td><strong>4. Pollinations.ai</strong></td>
        <td>FLUX, SDXL, Turbo</td>
        <td>Image</td>
        <td><span class="badge-free">$0.00 (No Key Needed)</span></td>
        <td><code>image.pollinations.ai</code></td>
      </tr>
      <tr>
        <td><strong>5. Together AI</strong></td>
        <td>FLUX.1 Schnell/Dev, LTX-Video</td>
        <td>Image + Video</td>
        <td><span class="badge-credit">$5 to $25 Free Trial Credits</span></td>
        <td><code>api.together.ai/settings/api-keys</code></td>
      </tr>
      <tr>
        <td><strong>6. Fal.ai</strong></td>
        <td>FLUX.1 Schnell, Wan2.1, HunyuanVideo</td>
        <td>Image + Video</td>
        <td><span class="badge-credit">$10 Free Starter Credits</span></td>
        <td><code>fal.ai/dashboard/keys</code></td>
      </tr>
      <tr>
        <td><strong>7. Replicate</strong></td>
        <td>Veo 2, Wan2.1, Minimax, Stable Video</td>
        <td>Image + Video</td>
        <td><span class="badge-credit">Free Trial GPU Credits</span></td>
        <td><code>replicate.com/account/api-tokens</code></td>
      </tr>
      <tr>
        <td><strong>8. Google Vertex AI</strong></td>
        <td>Veo 2 Video, Imagen 3 Enterprise</td>
        <td>Image + Video</td>
        <td><span class="badge-cloud">$300 Google Cloud Free Credit</span></td>
        <td><code>console.cloud.google.com/vertex-ai</code></td>
      </tr>
      <tr>
        <td><strong>9. Kling AI (Kuaishou)</strong></td>
        <td>Kling 1.5 Video (5s/10s HD)</td>
        <td>Video</td>
        <td><span class="badge-credit">66 Free Daily Points on signup</span></td>
        <td><code>klingai.com/api</code></td>
      </tr>
      <tr>
        <td><strong>10. MiniMax (Hailuo AI)</strong></td>
        <td>Video-01 Cinematic Director</td>
        <td>Video</td>
        <td><span class="badge-credit">3 Free Daily Generations / Pay-as-you-go</span></td>
        <td><code>api.minimax.chat</code></td>
      </tr>
      <tr>
        <td><strong>11. Luma Dream Machine</strong></td>
        <td>Ray 2 Cinematic Video</td>
        <td>Video</td>
        <td><span class="badge-credit">30 Free Videos/month web trial</span></td>
        <td><code>lumalabs.ai/dream-machine/api</code></td>
      </tr>
      <tr>
        <td><strong>12. Runway ML</strong></td>
        <td>Gen-3 Alpha Turbo (Video-to-Video)</td>
        <td>Video</td>
        <td><span class="badge-credit">125 Free Starter Credits</span></td>
        <td><code>app.runwayml.com/settings/api-keys</code></td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <h2>Deep Dive by Category</h2>

  <h3>CATEGORY A: 100% FREE / ZERO-COST APIS ($0.00 / NO CREDIT CARD)</h3>
  <div class="provider-card">
    <strong>1. Google AI Studio (Gemini & Imagen 3)</strong><br>
    <em>Best for:</em> Keyframe Image Stills (Imagen 3) & Storyboard Prompt Decomposition (Gemini 2.0 Flash).<br>
    <em>Why use:</em> Google gives 15 requests per minute and 1,500 requests per day 100% free with zero fees.<br>
    <div class="url-box">https://aistudio.google.com/app/apikey</div>
  </div>

  <div class="provider-card">
    <strong>2. Hugging Face Serverless Inference API</strong><br>
    <em>Best for:</em> Open-source image model <strong>FLUX.1-schnell</strong> (Black Forest Labs) and open-source video models <strong>LTX-Video</strong> & <strong>CogVideoX</strong>.<br>
    <em>Why use:</em> Free serverless inference without needing your own GPU hardware.<br>
    <div class="url-box">https://huggingface.co/settings/tokens</div>
  </div>

  <div class="provider-card">
    <strong>3. Cloudflare Workers AI</strong><br>
    <em>Best for:</em> Edge-hosted FLUX.1 Schnell image generation.<br>
    <em>Why use:</em> Cloudflare gives every free account 10,000 AI Neurons per day at $0.00.<br>
    <div class="url-box">https://dash.cloudflare.com/profile/api-tokens</div>
  </div>

  <h3>CATEGORY B: FREE STARTER CREDIT APIS (HIGH-SPEED GPU)</h3>
  <div class="provider-card">
    <strong>4. Together AI</strong><br>
    <em>Best for:</em> Sub-second FLUX.1 Schnell image generation and LTX-Video.<br>
    <em>Why use:</em> Provides $5 to $25 in free starter credit upon registration (equivalent to 1,000+ image generations).<br>
    <div class="url-box">https://api.together.ai/settings/api-keys</div>
  </div>

  <div class="provider-card">
    <strong>5. Fal.ai</strong><br>
    <em>Best for:</em> Next-gen video models including Wan2.1 and HunyuanVideo.<br>
    <em>Why use:</em> Includes free starting credits and ultra-fast inference streaming.<br>
    <div class="url-box">https://fal.ai/dashboard/keys</div>
  </div>

  <div class="provider-card">
    <strong>6. Replicate</strong><br>
    <em>Best for:</em> Running Google Veo 2, Minimax Video-01, and Stable Video Diffusion via standard REST API.<br>
    <div class="url-box">https://replicate.com/account/api-tokens</div>
  </div>

  <h3>CATEGORY C: DEDICATED CINEMATIC VIDEO GENERATION APIS</h3>
  <div class="provider-card">
    <strong>7. Kling AI API (Kuaishou)</strong><br>
    <em>Best for:</em> Complex physical camera movements, human anatomy stability, and 1080p 10-second scene clips.<br>
    <div class="url-box">https://klingai.com/api</div>
  </div>

  <div class="provider-card">
    <strong>8. MiniMax Video-01 (Hailuo AI)</strong><br>
    <em>Best for:</em> Emotional facial expressions, cinematic lighting, and realistic physics.<br>
    <div class="url-box">https://api.minimax.chat</div>
  </div>

  <div class="provider-card">
    <strong>9. Luma Dream Machine (Ray 2 API)</strong><br>
    <em>Best for:</em> Start-to-end keyframe interpolation and camera orbit paths.<br>
    <div class="url-box">https://lumalabs.ai/dream-machine/api</div>
  </div>

  <div class="provider-card">
    <strong>10. Runway Gen-3 Alpha API</strong><br>
    <em>Best for:</em> Industry-standard cinematic commercial rendering, Motion Brush, and multi-asset video-to-video.<br>
    <div class="url-box">https://app.runwayml.com/settings/api-keys</div>
  </div>
</body>
</html>`;

const tempHtml = path.join(__dirname, 'temp_catalog.html');
fs.writeFileSync(tempHtml, htmlContent, 'utf8');

console.log('Rendering expanded PDF via Playwright...');
execSync(`npx playwright pdf "${tempHtml}" "${destPdfDesktop}"`);
fs.copyFileSync(destPdfDesktop, path.join(__dirname, 'HOW_TO_GET_FREE_API_KEYS_FOR_DDMAI_VIDEO.pdf'));
fs.unlinkSync(tempHtml);

// Build styled OpenXML .docx
function escapeXml(unsafe) {
  return (unsafe || '').replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

function p(text, options = {}) {
  const { bold = false, size = 22, color = "1E293B", spaceBefore = 0, spaceAfter = 100 } = options;
  const boldTag = bold ? '<w:b/>' : '';
  return `
    <w:p>
      <w:pPr><w:spacing w:before="${spaceBefore}" w:after="${spaceAfter}"/></w:pPr>
      <w:r>
        <w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>${boldTag}<w:sz w:val="${size}"/><w:color w:val="${color}"/></w:rPr>
        <w:t xml:space="preserve">${escapeXml(text)}</w:t>
      </w:r>
    </w:p>
  `;
}

function bullet(text) {
  return `
    <w:p>
      <w:pPr><w:ind w:left="360" w:hanging="180"/><w:spacing w:before="20" w:after="60"/></w:pPr>
      <w:r>
        <w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="21"/><w:color w:val="334155"/></w:rPr>
        <w:t xml:space="preserve">•  ${escapeXml(text)}</w:t>
      </w:r>
    </w:p>
  `;
}

function code(text) {
  return `
    <w:p>
      <w:pPr>
        <w:shd w:val="clear" w:color="auto" w:fill="F1F5F9"/>
        <w:ind w:left="240" w:right="240"/>
        <w:spacing w:before="40" w:after="80"/>
      </w:pPr>
      <w:r>
        <w:rPr><w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/><w:sz w:val="18"/><w:color w:val="0F172A"/></w:rPr>
        <w:t xml:space="preserve">${escapeXml(text)}</w:t>
      </w:r>
    </w:p>
  `;
}

let docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${p("DDMAI.VIDEO — Comprehensive Image & Video API Key Catalog", { bold: true, size: 34, color: "4338CA", spaceAfter: 80 })}
    ${p("Exhaustive Breakdown of 12 Major Image & Video Generative AI API Providers", { size: 21, color: "64748B", spaceAfter: 200 })}

    ${p("TIER 1: 100% FREE / ZERO-COST APIS ($0.00 / NO CREDIT CARD)", { bold: true, size: 24, color: "0F172A", spaceBefore: 160, spaceAfter: 100 })}
    ${bullet("1. Google AI Studio (Imagen 3 & Gemini 2.0 Flash) — 100% Free Forever (1,500 requests/day). URL: https://aistudio.google.com/app/apikey")}
    ${bullet("2. Hugging Face Serverless API (FLUX.1 Schnell & LTX-Video) — Free open-source inference. URL: https://huggingface.co/settings/tokens")}
    ${bullet("3. Cloudflare Workers AI (@cf/black-forest-labs/flux-1-schnell) — 10,000 free neurons daily. URL: https://dash.cloudflare.com/profile/api-tokens")}
    ${bullet("4. Pollinations.ai — Completely free public inference endpoint with zero keys required. URL: https://image.pollinations.ai")}

    ${p("TIER 2: FREE STARTER CREDIT APIS (HIGH-SPEED GPU)", { bold: true, size: 24, color: "0F172A", spaceBefore: 160, spaceAfter: 100 })}
    ${bullet("5. Together AI — $5 to $25 free starter credit (FLUX.1 Schnell, LTX-Video). URL: https://api.together.ai/settings/api-keys")}
    ${bullet("6. Fal.ai — $10 free credit for ultra-fast FLUX & Wan2.1 video. URL: https://fal.ai/dashboard/keys")}
    ${bullet("7. Replicate — Free starter credits for Veo 2, Minimax, Stable Video Diffusion. URL: https://replicate.com/account/api-tokens")}

    ${p("TIER 3: DEDICATED CINEMATIC VIDEO GENERATION APIS", { bold: true, size: 24, color: "0F172A", spaceBefore: 160, spaceAfter: 100 })}
    ${bullet("8. Google Cloud Vertex AI (Veo 2 & Imagen 3) — $300 free trial credits for new Google Cloud accounts. URL: https://console.cloud.google.com/vertex-ai")}
    ${bullet("9. Kling AI API (Kuaishou) — 66 daily credits on signup; realistic physical motion & 10s HD generation. URL: https://klingai.com/api")}
    ${bullet("10. MiniMax Hailuo AI (Video-01) — 3 free daily generations; outstanding human emotion & physics. URL: https://api.minimax.chat")}
    ${bullet("11. Luma Dream Machine (Ray 2) — 30 free video generations monthly on web trial. URL: https://lumalabs.ai/dream-machine/api")}
    ${bullet("12. Runway ML (Gen-3 Alpha Turbo) — 125 free starter credits for cinematic camera controls. URL: https://app.runwayml.com/settings/api-keys")}

    ${p("HOW TO ACTIVATE IN DDMAI.VIDEO", { bold: true, size: 24, color: "0F172A", spaceBefore: 160, spaceAfter: 100 })}
    ${bullet("Live Cloud URL: https://vedio-working.web.app")}
    ${bullet("Local Studio: http://localhost:3000")}
    ${bullet("Click the 'API Keys' button in the top navigation bar, paste your chosen keys, and click 'Save API Keys'. Keys are encrypted safely in your browser.")}
    <w:sectPr/>
  </w:body>
</w:document>`;

const tempDir = path.join(__dirname, 'temp_docx_package2');
if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
fs.mkdirSync(path.join(tempDir, '_rels'), { recursive: true });
fs.mkdirSync(path.join(tempDir, 'word', '_rels'), { recursive: true });

fs.writeFileSync(path.join(tempDir, '[Content_Types].xml'), `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`);

fs.writeFileSync(path.join(tempDir, '_rels', '.rels'), `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`);

fs.writeFileSync(path.join(tempDir, 'word', 'document.xml'), docXml);

const tempZip = path.join(__dirname, 'temp_guide2.zip');
execSync(`powershell -Command "Compress-Archive -Path '${tempDir}\\*' -DestinationPath '${tempZip}' -Force; Move-Item '${tempZip}' '${destDocxDesktop}' -Force"`);
fs.rmSync(tempDir, { recursive: true, force: true });

console.log('Saved updated PDF Document (.pdf) to Desktop:', destPdfDesktop);
console.log('Saved updated Word Document (.docx) to Desktop:', destDocxDesktop);
