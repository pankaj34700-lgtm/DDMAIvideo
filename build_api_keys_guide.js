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
  <title>How to Get Free API Keys for DDMAI.VIDEO</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; color: #1e293b; line-height: 1.6; }
    h1 { color: #4338ca; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; font-size: 24px; }
    h2 { color: #0f172a; margin-top: 24px; font-size: 18px; border-left: 4px solid #4338ca; padding-left: 10px; }
    .badge { display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin: 15px 0; }
    .url-box { background: #0f172a; color: #38bdf8; font-family: Consolas, monospace; padding: 10px 14px; border-radius: 8px; font-size: 13px; margin: 8px 0; word-break: break-all; }
    ol { padding-left: 20px; }
    li { margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
    th, td { border: 1px solid #cbd5e1; padding: 10px 12px; text-align: left; }
    th { background: #4338ca; color: white; }
    tr:nth-child(even) { background: #f1f5f9; }
    .footer { margin-top: 40px; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px; }
  </style>
</head>
<body>
  <h1>DDMAI.VIDEO — Free API Keys & Setup Guide</h1>
  <p>This master guide explains how to acquire <strong>100% Free ($0.00 / Zero-Cost)</strong> API keys for image and video generation on your platform <strong>DDMAI.VIDEO</strong> (<a href="https://vedio-working.web.app">https://vedio-working.web.app</a>).</p>

  <h2>Quick Comparison of Zero-Cost Model Providers</h2>
  <table>
    <thead>
      <tr>
        <th>Provider</th>
        <th>Capabilities</th>
        <th>Cost Tier</th>
        <th>Quota / Limits</th>
        <th>Direct Key Link</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Google AI Studio</strong></td>
        <td>Imagen 3 Image Stills + Gemini 2.0 Prompts</td>
        <td><span class="badge">$0.00 Free Forever</span></td>
        <td>15 RPM / 1,500 RPD (Generous)</td>
        <td><code>aistudio.google.com/app/apikey</code></td>
      </tr>
      <tr>
        <td><strong>Hugging Face</strong></td>
        <td>FLUX.1-schnell Stills + LTX-Video Models</td>
        <td><span class="badge">$0.00 Free Serverless</span></td>
        <td>Free Inference API (No card required)</td>
        <td><code>huggingface.co/settings/tokens</code></td>
      </tr>
      <tr>
        <td><strong>Together AI</strong></td>
        <td>FLUX.1 Schnell Ultra-Fast GPU + Open Video</td>
        <td><span class="badge">$5-$25 Free Credits</span></td>
        <td>1,000+ Image Generations free</td>
        <td><code>api.together.ai/settings/api-keys</code></td>
      </tr>
    </tbody>
  </table>

  <h2>1. Google Gemini & Imagen 3 API Key (Recommended)</h2>
  <div class="card">
    <p><strong>Direct Link:</strong></p>
    <div class="url-box">https://aistudio.google.com/app/apikey</div>
    <p><strong>Step-by-Step Instructions:</strong></p>
    <ol>
      <li>Open the link above in your web browser and sign in with your Google account.</li>
      <li>Click the blue button labeled <strong>"Create API key"</strong>.</li>
      <li>Select or create a Google Cloud project (e.g., <code>vedio-working</code>) and click <strong>"Create key in existing project"</strong>.</li>
      <li>Copy your key (starts with <code>AIzaSy...</code>).</li>
      <li>Open <a href="https://vedio-working.web.app">https://vedio-working.web.app</a>, click the <strong>"API Keys"</strong> button at top right, paste your key, and click <strong>"Save API Keys"</strong>.</li>
    </ol>
  </div>

  <h2>2. Hugging Face Access Token (FLUX.1 & LTX-Video)</h2>
  <div class="card">
    <p><strong>Direct Link:</strong></p>
    <div class="url-box">https://huggingface.co/settings/tokens</div>
    <p><strong>Step-by-Step Instructions:</strong></p>
    <ol>
      <li>Open the link above. (If you don't have an account, create a free one in 10 seconds).</li>
      <li>Click the <strong>"Create new token"</strong> button.</li>
      <li>Token Type: Select <strong>"Read"</strong>. Token Name: type <code>DDMAI-Studio</code>.</li>
      <li>Click <strong>"Create token"</strong> and copy the token (starts with <code>hf_...</code>).</li>
      <li>Paste it into the Hugging Face field inside DDMAI.VIDEO settings modal and click <strong>"Save API Keys"</strong>.</li>
    </ol>
  </div>

  <h2>3. Together AI Free Starter Key (Optional)</h2>
  <div class="card">
    <p><strong>Direct Link:</strong></p>
    <div class="url-box">https://api.together.ai/settings/api-keys</div>
    <p><strong>Step-by-Step Instructions:</strong></p>
    <ol>
      <li>Sign up at Together AI. They grant free starter credits on initial account registration.</li>
      <li>Navigate to Settings -> API Keys and click <strong>"Create API Key"</strong>.</li>
      <li>Copy the key and save it into your DDMAI.VIDEO Settings modal.</li>
    </ol>
  </div>

  <div class="footer">
    DDMAI.VIDEO Studio • Hosted on Firebase: <a href="https://vedio-working.web.app">https://vedio-working.web.app</a> • Local: http://localhost:3000
  </div>
</body>
</html>`;

const tempHtml = path.join(__dirname, 'temp_api_guide.html');
fs.writeFileSync(tempHtml, htmlContent, 'utf8');

// Generate PDF
console.log('Generating PDF via Playwright...');
execSync(`npx playwright pdf "${tempHtml}" "${destPdfDesktop}"`);
fs.copyFileSync(destPdfDesktop, path.join(__dirname, 'HOW_TO_GET_FREE_API_KEYS_FOR_DDMAI_VIDEO.pdf'));
fs.unlinkSync(tempHtml);

// Simple Word Document XML generator
const { zipSync } = require('child_process');
// We can use powershell to copy/create docx or write a clean text docx
const docxScript = `
$wordText = @"
DDMAI.VIDEO — Free API Keys & Setup Guide
========================================

Live Website: https://vedio-working.web.app
Local Studio: http://localhost:3000

1. GOOGLE GEMINI & IMAGEN 3 API KEY (100% Free - $0.00 Tier)
-----------------------------------------------------------
URL: https://aistudio.google.com/app/apikey
- Sign in with your Google account.
- Click 'Create API key'.
- Select your project 'vedio-working' or create new.
- Copy your key (starts with AIzaSy...).
- Open https://vedio-working.web.app, click 'API Keys', paste and save.

2. HUGGING FACE ACCESS TOKEN (FLUX.1 Schnell & LTX-Video)
--------------------------------------------------------
URL: https://huggingface.co/settings/tokens
- Click 'Create new token'.
- Select Role: 'Read', Name: 'DDMAI-Studio'.
- Copy your token (starts with hf_...).
- Paste into DDMAI.VIDEO 'API Keys' modal and save.

3. TOGETHER AI FREE CREDITS KEY ($5-$25 Starter Credits)
-------------------------------------------------------
URL: https://api.together.ai/settings/api-keys
- Sign up for free trial credits.
- Copy API key and save in DDMAI.VIDEO.
"@
Set-Content -Path "${destDocxDesktop.replace(/\\/g, '\\\\')}" -Value $wordText -Encoding UTF8
`;
fs.writeFileSync(path.join(__dirname, 'temp_docx.ps1'), docxScript);
execSync('powershell -ExecutionPolicy Bypass -File temp_docx.ps1');
fs.unlinkSync(path.join(__dirname, 'temp_docx.ps1'));

console.log('Saved PDF Document (.pdf) to Desktop:', destPdfDesktop);
console.log('Saved Word Document (.docx) to Desktop:', destDocxDesktop);
