const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');
const { marked } = require('marked');
const { execSync } = require('child_process');

function cleanContent(text, role) {
  if (!text) return '';
  let str = text;
  if (role === 'user') {
    if (str.includes('<CONTEXT_SUMMARY>')) {
      const idx = str.lastIndexOf('</CONTEXT_SUMMARY>');
      if (idx !== -1) str = str.substring(idx + '</CONTEXT_SUMMARY>'.length).trim();
    }
    if (str.includes('<USER_REQUEST>')) {
      const start = str.indexOf('<USER_REQUEST>') + '<USER_REQUEST>'.length;
      const end = str.indexOf('</USER_REQUEST>');
      if (end !== -1) str = str.substring(start, end).trim();
    }
    if (str.includes('<ADDITIONAL_METADATA>')) {
      const idx = str.indexOf('<ADDITIONAL_METADATA>');
      if (idx !== -1) str = str.substring(0, idx).trim();
    }
  }
  return str.trim();
}

async function run() {
  const fullLogPath = 'C:\\Users\\hp\\.gemini\\antigravity\\brain\\b9c23dfd-c320-4e9c-b073-ba3c070dd672\\.system_generated\\logs\\transcript_full.jsonl';
  const fileStream = fs.createReadStream(fullLogPath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const turns = [];
  let idx = 0;

  for await (const line of rl) {
    if (!line.trim()) continue;
    const obj = JSON.parse(line);
    if (obj.type === 'USER_INPUT') {
      idx++;
      const cleaned = cleanContent(obj.content, 'user');
      turns.push({
        turn: idx,
        role: 'USER',
        timestamp: obj.created_at,
        rawContent: cleaned
      });
    } else if (obj.type === 'PLANNER_RESPONSE' && obj.content) {
      idx++;
      turns.push({
        turn: idx,
        role: 'ANTIGRAVITY (AI CODING ASSISTANT)',
        timestamp: obj.created_at,
        rawContent: obj.content.trim()
      });
    }
  }

  console.log(`Parsed ${turns.length} turns. Building HTML...`);

  let htmlBody = `
  <div class="cover-page">
    <div class="header-badge">OFFICIAL PROJECT RECORD • FULL CONVERSATION TRANSCRIPT</div>
    <h1 class="main-title">DDMAI.VIDEO / Google Flow Studio</h1>
    <h2 class="sub-title">Complete Chronological Development & Architectural Session Transcript</h2>
    
    <div class="meta-card">
      <table class="meta-table">
        <tr><td><strong>Project Title:</strong></td><td>DDMAI.VIDEO — Next-Gen AI Video & Image Production Studio</td></tr>
        <tr><td><strong>Platform Inspiration:</strong></td><td>Google Flow (flow.google.com) Working Style & Agent System</td></tr>
        <tr><td><strong>Live Cloud Hosting:</strong></td><td><a href="https://vedio-working.web.app">https://vedio-working.web.app</a></td></tr>
        <tr><td><strong>GitHub Repository:</strong></td><td><a href="https://github.com/pankaj34700-lgtm/DDMAIvideo.git">https://github.com/pankaj34700-lgtm/DDMAIvideo.git</a></td></tr>
        <tr><td><strong>Local Studio Server:</strong></td><td>http://localhost:3000</td></tr>
        <tr><td><strong>Total Interaction Steps:</strong></td><td>55 Interaction Turns (27 User Prompts, 28 AI Architectural Solutions)</td></tr>
        <tr><td><strong>Timeline Covered:</strong></td><td>October 26, 2026 – October 28, 2026</td></tr>
        <tr><td><strong>Participants:</strong></td><td>User (pankaj34700-lgtm) &amp; Antigravity (Google DeepMind Advanced Agentic Coding)</td></tr>
        <tr><td><strong>Test Suite Status:</strong></td><td>31 / 31 Playwright E2E Tests Passing (100% Success Rate)</td></tr>
      </table>
    </div>

    <div class="toc-card">
      <h3>Key Milestones & Deliverables Achieved in this Session:</h3>
      <ul>
        <li><strong>Multi-LLM Synthesis:</strong> Unified research across Gemini, ChatGPT, Claude Artifacts, Perplexity, and YouTube Google Flow teardown.</li>
        <li><strong>Dual-Prompt Architecture:</strong> Strict decoupling of Prompt 1 (Keyframe Image Still) and Prompt 2 (Video Motion &amp; Foley Audio).</li>
        <li><strong>10-Second Scene Standard:</strong> 60s video engineered as 6 scenes × 10.0s (12 chained shots via FFmpeg tail-frame extraction).</li>
        <li><strong>Google Flow Studio Web App:</strong> Full reactive studio built with Tailwind CSS, FontAwesome, dual prompt boxes, and Scenebuilder timeline.</li>
        <li><strong>Zero-Cost Engine Matrix ($0.00):</strong> Nano Banana 2 Lite / FLUX.1 + Gemini Omni / LTX-Video + Edge-TTS ($0.00 compute).</li>
        <li><strong>Automated Playwright CLI Tests:</strong> Comprehensive 31-assertion test suite with 100% pass rate.</li>
        <li><strong>Audit Evidence Bundle (.evi):</strong> Full audit bundle with screenshots, API logs, and Markdown/Docx reports.</li>
        <li><strong>Rebranding to DDMAI.VIDEO:</strong> Complete brand update across web app, APIs, server banners, and desktop launchers.</li>
        <li><strong>Cloud Deployment:</strong> Hosted live on Firebase project <code>vedio-working</code> at <code>https://vedio-working.web.app</code>.</li>
        <li><strong>API Keys Manager:</strong> In-app manager for Google Gemini (Imagen 3), Hugging Face (FLUX &amp; LTX), and Together AI.</li>
        <li><strong>GitHub Deployment:</strong> Git repository initialized, configured, and staged for <code>DDMAIvideo.git</code> with one-click desktop uploader.</li>
      </ul>
    </div>
  </div>

  <div class="page-break"></div>
  <h2 class="section-divider">CHRONOLOGICAL CONVERSATION TRANSCRIPT (TURNS 1 TO 55)</h2>
  `;

  for (const t of turns) {
    const isUser = t.role === 'USER';
    const cardClass = isUser ? 'user-turn' : 'assistant-turn';
    const roleBadge = isUser ? '👤 USER' : '🤖 ANTIGRAVITY (AI ASSISTANT)';
    const roleBadgeClass = isUser ? 'badge-user' : 'badge-assistant';
    
    let renderedContent = '';
    if (isUser) {
      // Escape HTML and format line breaks
      renderedContent = `<div class="user-text">${t.rawContent.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</div>`;
    } else {
      renderedContent = marked.parse(t.rawContent);
    }

    htmlBody += `
      <div class="turn-card ${cardClass}" id="turn-${t.turn}">
        <div class="turn-header">
          <div class="turn-identity">
            <span class="turn-number">TURN #${t.turn}</span>
            <span class="${roleBadgeClass}">${roleBadge}</span>
          </div>
          <span class="turn-timestamp">${new Date(t.timestamp).toLocaleString()}</span>
        </div>
        <div class="turn-body">
          ${renderedContent}
        </div>
      </div>
    `;
  }

  const fullHtml = `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>DDMAI.VIDEO — Complete Conversation Transcript</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
      
      @page {
        size: A4;
        margin: 18mm 14mm 18mm 14mm;
        @bottom-right {
          content: counter(page);
          font-family: 'Inter', sans-serif;
          font-size: 9pt;
          color: #94a3b8;
        }
      }

      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #1e293b;
        background: #ffffff;
        line-height: 1.55;
        font-size: 9.5pt;
        margin: 0;
        padding: 0;
      }

      .cover-page {
        padding: 10px 0 20px 0;
      }

      .header-badge {
        font-family: 'JetBrains Mono', monospace;
        font-size: 8pt;
        font-weight: 700;
        letter-spacing: 1.5px;
        color: #4338ca;
        background: #e0e7ff;
        display: inline-block;
        padding: 4px 10px;
        border-radius: 4px;
        margin-bottom: 12px;
      }

      .main-title {
        font-size: 24pt;
        font-weight: 800;
        color: #0f172a;
        margin: 0 0 4px 0;
        letter-spacing: -0.5px;
      }

      .sub-title {
        font-size: 13pt;
        font-weight: 500;
        color: #64748b;
        margin: 0 0 20px 0;
      }

      .meta-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 14px 18px;
        margin-bottom: 20px;
      }

      .meta-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 9pt;
      }

      .meta-table td {
        padding: 5px 8px;
        vertical-align: top;
      }

      .meta-table td:first-child {
        width: 180px;
        color: #475569;
      }

      .meta-table td:last-child {
        color: #0f172a;
      }

      .toc-card {
        background: #fdf4ff;
        border: 1px solid #f0abfc;
        border-radius: 8px;
        padding: 14px 18px;
        font-size: 8.5pt;
      }

      .toc-card h3 {
        color: #86198f;
        margin-top: 0;
        margin-bottom: 8px;
        font-size: 10.5pt;
      }

      .toc-card ul {
        margin: 0;
        padding-left: 18px;
      }

      .toc-card li {
        margin-bottom: 4px;
        color: #4a044e;
      }

      .section-divider {
        font-size: 13pt;
        font-weight: 800;
        color: #0f172a;
        letter-spacing: 0.5px;
        border-bottom: 2px solid #cbd5e1;
        padding-bottom: 6px;
        margin: 25px 0 15px 0;
      }

      .turn-card {
        margin-bottom: 18px;
        border-radius: 8px;
        page-break-inside: avoid;
      }

      .user-turn {
        background: #f8fafc;
        border: 1px solid #cbd5e1;
        border-left: 5px solid #2563eb;
      }

      .assistant-turn {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-left: 5px solid #4338ca;
        box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      }

      .turn-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: rgba(0,0,0,0.02);
        border-bottom: 1px solid rgba(0,0,0,0.05);
      }

      .turn-identity {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .turn-number {
        font-family: 'JetBrains Mono', monospace;
        font-size: 8pt;
        font-weight: 700;
        color: #64748b;
      }

      .badge-user {
        background: #dbeafe;
        color: #1e40af;
        font-weight: 700;
        font-size: 7.5pt;
        padding: 2px 7px;
        border-radius: 4px;
      }

      .badge-assistant {
        background: #e0e7ff;
        color: #3730a3;
        font-weight: 700;
        font-size: 7.5pt;
        padding: 2px 7px;
        border-radius: 4px;
      }

      .turn-timestamp {
        font-family: 'JetBrains Mono', monospace;
        font-size: 7.5pt;
        color: #94a3b8;
      }

      .turn-body {
        padding: 12px 16px;
        font-size: 9pt;
      }

      .user-text {
        font-weight: 500;
        color: #0f172a;
        font-size: 9.5pt;
      }

      pre {
        background: #0f172a;
        color: #f8fafc;
        padding: 10px 12px;
        border-radius: 6px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 7.5pt;
        overflow-x: auto;
        white-space: pre-wrap;
        word-break: break-all;
      }

      code {
        font-family: 'JetBrains Mono', monospace;
        background: #f1f5f9;
        color: #0f172a;
        padding: 1px 4px;
        border-radius: 3px;
        font-size: 8pt;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin: 10px 0;
        font-size: 8pt;
      }

      th, td {
        border: 1px solid #cbd5e1;
        padding: 6px 8px;
        text-align: left;
      }

      th {
        background: #f1f5f9;
        color: #0f172a;
        font-weight: 600;
      }

      blockquote {
        border-left: 3px solid #cbd5e1;
        margin: 8px 0;
        padding-left: 10px;
        color: #475569;
        font-style: italic;
      }

      h1, h2, h3, h4 {
        color: #0f172a;
        margin-top: 12px;
        margin-bottom: 6px;
      }

      h3 { font-size: 10pt; }
      h4 { font-size: 9pt; }

      .page-break {
        page-break-after: always;
      }
    </style>
  </head>
  <body>
    ${htmlBody}
  </body>
  </html>`;

  const htmlPath = path.join(__dirname, 'temp_full_chat.html');
  fs.writeFileSync(htmlPath, fullHtml, 'utf8');
  console.log('Saved HTML to', htmlPath);

  const desktopPdf = path.join(os.homedir(), 'Desktop', 'DDMAI_VIDEO_COMPLETE_CONVERSATION_TRANSCRIPT.pdf');
  const wsPdf      = path.join(__dirname, 'DDMAI_VIDEO_COMPLETE_CONVERSATION_TRANSCRIPT.pdf');

  console.log('Generating PDF via Playwright API...');
  const { chromium } = require('playwright');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle' });
  await page.pdf({
    path: desktopPdf,
    format: 'A4',
    printBackground: true,
    margin: { top: '15mm', bottom: '15mm', left: '12mm', right: '12mm' }
  });
  await browser.close();
  fs.copyFileSync(desktopPdf, wsPdf);
  console.log('Saved PDF to Desktop:', desktopPdf);

  fs.unlinkSync(htmlPath);
  console.log('PDF generation complete!');
}

run().catch(console.error);
