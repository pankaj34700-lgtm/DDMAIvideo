const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');
const { execSync } = require('child_process');

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
  const { bold = false, size = 21, color = "1E293B", spaceBefore = 0, spaceAfter = 100, bg = null, italic = false, font = "Calibri" } = options;
  const shading = bg ? `<w:shd w:val="clear" w:color="auto" w:fill="${bg}"/>` : '';
  const boldTag = bold ? '<w:b/>' : '';
  const italicTag = italic ? '<w:i/>' : '';
  return `
    <w:p>
      <w:pPr>
        <w:spacing w:before="${spaceBefore}" w:after="${spaceAfter}"/>
        ${shading}
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="${font}" w:hAnsi="${font}"/>
          ${boldTag}
          ${italicTag}
          <w:sz w:val="${size}"/>
          <w:color w:val="${color}"/>
        </w:rPr>
        <w:t xml:space="preserve">${escapeXml(text)}</w:t>
      </w:r>
    </w:p>
  `;
}

function bullet(text) {
  return `
    <w:p>
      <w:pPr>
        <w:ind w:left="360" w:hanging="180"/>
        <w:spacing w:before="20" w:after="60"/>
      </w:pPr>
      <w:r>
        <w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="20"/><w:color w:val="334155"/></w:rPr>
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
        <w:ind w:left="200" w:right="200"/>
        <w:spacing w:before="40" w:after="80"/>
      </w:pPr>
      <w:r>
        <w:rPr><w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/><w:sz w:val="17"/><w:color w:val="0F172A"/></w:rPr>
        <w:t xml:space="preserve">${escapeXml(text)}</w:t>
      </w:r>
    </w:p>
  `;
}

function turnBanner(turnNum, role, timestamp) {
  const isUser = role === 'USER';
  const bg = isUser ? '1E293B' : '4338CA';
  const roleLabel = isUser ? '👤 USER PROMPT' : '🤖 ANTIGRAVITY (AI CODING ASSISTANT)';
  const dateStr = new Date(timestamp).toLocaleString();
  const bannerText = `TURN #${turnNum}  |  ${roleLabel}  |  ${dateStr}`;
  return p(bannerText, { bold: true, size: 20, color: "FFFFFF", bg: bg, spaceBefore: 240, spaceAfter: 80 });
}

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

  console.log(`Parsed ${turns.length} turns for Word Document. Building OpenXML...`);

  let bodyXml = '';

  // Cover Page & Header
  bodyXml += p("DDMAI.VIDEO / Google Flow Studio", { bold: true, size: 36, color: "4338CA", spaceAfter: 60 });
  bodyXml += p("Complete Chronological Project Development Transcript (55 Interaction Turns)", { size: 22, color: "64748B", italic: true, spaceAfter: 180 });

  bodyXml += p("EXECUTIVE PROJECT OVERVIEW & METADATA", { bold: true, size: 24, color: "0F172A", spaceBefore: 120, spaceAfter: 80 });
  bodyXml += bullet("Project Title: DDMAI.VIDEO — Next-Gen AI Video & Image Production Studio");
  bodyXml += bullet("Working Style Inspiration: Google Flow (flow.google.com) AI Agent Studio");
  bodyXml += bullet("Live Cloud Web App: https://vedio-working.web.app");
  bodyXml += bullet("GitHub Repository: https://github.com/pankaj34700-lgtm/DDMAIvideo.git");
  bodyXml += bullet("Local Web Studio: http://localhost:3000");
  bodyXml += bullet("Total Interaction Turns: 55 Steps (27 User Prompts, 28 AI Solutions)");
  bodyXml += bullet("Timeline: October 26, 2026 – October 28, 2026");
  bodyXml += bullet("Playwright E2E Test Suite: 31 out of 31 Tests Passing (100% Success Rate)");

  bodyXml += p("KEY ARCHITECTURAL HIGHLIGHTS ACHIEVED", { bold: true, size: 24, color: "0F172A", spaceBefore: 160, spaceAfter: 80 });
  bodyXml += bullet("1. Multi-LLM Research Synthesis: Consolidated deep research from Gemini, ChatGPT, Claude Artifacts, Perplexity, and YouTube Google Flow teardown into a 50-option architectural matrix.");
  bodyXml += bullet("2. Dual-Prompt Decoupled Architecture: Prompt 1 (Keyframe Image Still) locked to visual identity without motion bleed; Prompt 2 (Video Motion & Audio Foley) with directional camera vectors and speed modifiers.");
  bodyXml += bullet("3. 10-Second Scene Standard (6x10s = 60s Video): Structured 60-second video production into 6 scenes of 10s, each split into Shot 1 (4.0s keyframe start) + Shot 2 (6.0s chained tail frame via ffmpeg -sseof -0.1).");
  bodyXml += bullet("4. Google Flow Studio Clone: Full responsive web application with dark-mode aesthetic, dual prompt boxes, Scenebuilder timeline, and zero-cost model router.");
  bodyXml += bullet("5. Firebase Hosting Deployment: Deployed to global Google CDN on project 'vedio-working' at https://vedio-working.web.app.");
  bodyXml += bullet("6. Free API Keys Manager: In-app modal connecting Google Gemini (Imagen 3), Hugging Face (FLUX & LTX), and Together AI.");
  bodyXml += bullet("7. GitHub Deployment: Clean Git repository setup, staged, and pushed to https://github.com/pankaj34700-lgtm/DDMAIvideo.git.");

  bodyXml += p("CHRONOLOGICAL CHAT TRANSCRIPT", { bold: true, size: 26, color: "0F172A", spaceBefore: 240, spaceAfter: 120 });

  // Render each turn
  for (const t of turns) {
    bodyXml += turnBanner(t.turn, t.role, t.timestamp);

    const isUser = t.role === 'USER';
    const lines = t.rawContent.split(/\r?\n/);

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      if (isUser) {
        bodyXml += p(line, { size: 21, color: "0F172A", bg: "F8FAFC", spaceBefore: 20, spaceAfter: 40 });
      } else {
        if (line.startsWith('# ')) {
          bodyXml += p(line.replace('# ', ''), { bold: true, size: 26, color: "0F172A", spaceBefore: 120, spaceAfter: 60 });
        } else if (line.startsWith('## ')) {
          bodyXml += p(line.replace('## ', ''), { bold: true, size: 23, color: "1E293B", spaceBefore: 100, spaceAfter: 50 });
        } else if (line.startsWith('### ')) {
          bodyXml += p(line.replace('### ', ''), { bold: true, size: 21, color: "4338CA", spaceBefore: 80, spaceAfter: 40 });
        } else if (line.startsWith('- ') || line.startsWith('* ')) {
          bodyXml += bullet(line.replace(/^[-*]\s+/, ''));
        } else if (line.startsWith('```') || line.startsWith('`')) {
          bodyXml += code(line.replace(/```[a-z]*/g, '').replace(/`/g, ''));
        } else if (line.startsWith('|')) {
          // Table row representation
          bodyXml += code(line);
        } else {
          bodyXml += p(line, { size: 20, color: "334155", spaceBefore: 20, spaceAfter: 40 });
        }
      }
    }
  }

  const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${bodyXml}
    <w:sectPr/>
  </w:body>
</w:document>`;

  const tempDir = path.join(__dirname, 'temp_chat_docx_pkg');
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

  const desktopDocx = path.join(os.homedir(), 'Desktop', 'DDMAI_VIDEO_COMPLETE_CONVERSATION_TRANSCRIPT.docx');
  const wsDocx      = path.join(__dirname, 'DDMAI_VIDEO_COMPLETE_CONVERSATION_TRANSCRIPT.docx');
  const tempZip     = path.join(__dirname, 'temp_chat_pkg.zip');

  console.log('Zipping OpenXML package via PowerShell...');
  execSync(`powershell -Command "Compress-Archive -Path '${tempDir}\\*' -DestinationPath '${tempZip}' -Force; Move-Item '${tempZip}' '${desktopDocx}' -Force"`);
  fs.copyFileSync(desktopDocx, wsDocx);
  fs.rmSync(tempDir, { recursive: true, force: true });

  console.log('Saved Word Document (.docx) to Desktop:', desktopDocx);
  console.log('Saved Word Document (.docx) to Workspace:', wsDocx);
}

run().catch(console.error);
