const fs = require('fs');
const path = require('path');
const os = require('os');
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
  const { bold = false, size = 22, color = "1E293B", spaceBefore = 0, spaceAfter = 120, bg = null, italic = false, font = "Calibri" } = options;
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
        <w:spacing w:before="20" w:after="80"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
          <w:sz w:val="21"/>
          <w:color w:val="334155"/>
        </w:rPr>
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
        <w:spacing w:before="60" w:after="120"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/>
          <w:sz w:val="19"/>
          <w:color w:val="0F172A"/>
        </w:rPr>
        <w:t xml:space="preserve">${escapeXml(text)}</w:t>
      </w:r>
    </w:p>
  `;
}

function table(headers, rows) {
  const headerCells = headers.map(h => `
    <w:tc>
      <w:tcPr>
        <w:shd w:val="clear" w:color="auto" w:fill="4338CA"/>
        <w:tcMar><w:top w:w="120"/><w:bottom w:w="120"/><w:left w:w="120"/><w:right w:w="120"/></w:tcMar>
      </w:tcPr>
      <w:p>
        <w:r>
          <w:rPr><w:b/><w:sz w:val="19"/><w:color w:val="FFFFFF"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr>
          <w:t>${escapeXml(h)}</w:t>
        </w:r>
      </w:p>
    </w:tc>
  `).join('');

  const rowBlocks = rows.map((r, i) => {
    const bg = i % 2 === 1 ? 'F8FAFC' : 'FFFFFF';
    const cells = r.map(c => `
      <w:tc>
        <w:tcPr>
          <w:shd w:val="clear" w:color="auto" w:fill="${bg}"/>
          <w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="120"/><w:right w:w="120"/></w:tcMar>
        </w:tcPr>
        <w:p>
          <w:r>
            <w:rPr><w:sz w:val="18"/><w:color w:val="1E293B"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr>
            <w:t>${escapeXml(c)}</w:t>
          </w:r>
        </w:p>
      </w:tc>
    `).join('');
    return `<w:tr>${cells}</w:tr>`;
  }).join('');

  return `
    <w:tbl>
      <w:tblPr>
        <w:tblBorders>
          <w:top w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
          <w:left w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
          <w:bottom w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
          <w:right w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
          <w:insideH w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
          <w:insideV w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
        </w:tblBorders>
      </w:tblPr>
      <w:tr>${headerCells}</w:tr>
      ${rowBlocks}
    </w:tbl>
    <w:p><w:pPr><w:spacing w:after="160"/></w:pPr></w:p>
  `;
}

// Build Document Body XML
let body = '';

// Title
body += p("REQUEST FOR PROPOSAL (RFP) & ARCHITECTURE BLUEPRINT", { bold: true, size: 40, color: "1E1B4B", spaceAfter: 40 });
body += p("Google Flow Clone (flow.google.com) with Zero-Cost Model Routing & Autonomous Multi-Agent Studio", { bold: true, size: 24, color: "4338CA", spaceAfter: 80 });
body += p("Enterprise Specification for Building a 100% Zero-Cost/Near-Zero AI Video & Image Making Website and Autonomous Multi-Agent Studio", { italic: true, size: 20, color: "64748B", spaceAfter: 240 });

// Section 1
body += p("1. Executive Summary & Zero-Cost Philosophy", { bold: true, size: 28, color: "1E1B4B", spaceBefore: 240, spaceAfter: 80 });
body += p("The objective of this RFP is to deliver an enterprise-grade web platform and autonomous multi-agent production suite that clones the operational style, user experience, and features of Google Flow (flow.google.com), while driving generation compute costs to NIL or virtually ZERO ($0.00).");
body += p("Commercial cloud video APIs typically charge $0.20 to $0.80 per 5-second clip, making continuous scene iterations costly. By architecting a hybrid toolchain combining free cloud tiers (Google Flow Free Agent, Gemini Omni 360p Draft with 0-credit 720p upscale, Google AI Studio free tier) and open-source local/Colab models (FLUX.1 Schnell, LTX-Video, CogVideoX, Microsoft Edge-TTS), the platform eliminates recurring API bills.");

// Section 2
body += p("2. Google Flow Working Style Replication Matrix", { bold: true, size: 28, color: "1E1B4B", spaceBefore: 240, spaceAfter: 80 });
body += p("The web application replicates all 9 signature operational mechanics of Google Flow:");
body += bullet("Dual-Mode Prompt Box: Instantly toggle between natural-language Flow Agent chat and direct generation mode.");
body += bullet("Persistent Agent Instructions: Global project guidelines and reference images locking style, colors, and character continuity.");
body += bullet("Conversational Video-to-Video Editing: Multi-turn natural language adjustments ('change lighting to sunset') preserving core motion.");
body += bullet("Frames-to-Video (Keyframing): Dedicated Prompt 1 (Keyframe Image Still) passing verified starting frames into video engines.");
body += bullet("Extend Clip Engine: Generates seamless continuous action extending directly from the tail of an existing shot.");
body += bullet("Scenebuilder Interactive Timeline: Multi-clip non-linear timeline enforcing the 10.0-second scene law (4s + 6s) with head/tail trim handles.");
body += bullet("Pixel Bento (Knob Automation): Real-time parameter recording sliders for contrast, grain, and crop zoom during playback.");
body += bullet("Shader FX & Video Granulator: Procedural post-generation 35mm grain, vintage halation, and chromatic aberration filters.");
body += bullet("Poster Designer & Type Overlays: Clean vector title rendering keeping text glyphs out of messy diffusion latent spaces.");

// Section 3
body += p("3. The Zero-Cost Toolchain: Driving Production Cost to $0.00", { bold: true, size: 28, color: "1E1B4B", spaceBefore: 240, spaceAfter: 80 });
body += p("The platform integrates five zero-cost pillars to ensure creators can generate high volumes of video and images without paying API credits:");

const headers = ["Production Role", "Zero-Cost Cloud Option ($0.00)", "Zero-Cost Open-Source / Local ($0.00)", "Estimated Cost"];
const rows = [
  ["Agent Brain & Planning", "Google Flow Free Agent (0 credits) / AI Studio", "Ollama (Llama 3.3 70B / Qwen 2.5 local)", "$0.00 (Free)"],
  ["Prompt 1 Keyframe Stills", "Nano Banana 2 Lite (Default free model)", "FLUX.1 Schnell (Apache 2.0 open-weights)", "$0.00 (Free)"],
  ["Prompt 2 Video Motion", "Gemini Omni 360p Draft + 0-credit 720p upscale", "LTX-Video / CogVideoX-5B / HunyuanVideo", "$0.00 (Free)"],
  ["Voiceover & Speech", "Gemini Omni Custom Voice Presets", "Microsoft Edge-TTS / Kokoro-82M Neural Audio", "$0.00 (Free)"],
  ["Video Stitching & Mix", "Headless Cloudflare Worker / Local Node server", "Local FFmpeg (x264/AAC Lossless Concat)", "$0.00 (Free)"]
];
body += table(headers, rows);

// Section 4
body += p("4. Step-by-Step Image-to-Video Workflow for the Website", { bold: true, size: 28, color: "1E1B4B", spaceBefore: 240, spaceAfter: 80 });
body += p("Step 1: Draft Prompt 1 (Keyframe Still) describing only visual attributes (style, character anchors, pose, lighting, 3-5 colors).");
body += p("Step 2: Generate still image using Nano Banana 2 Lite or FLUX.1 Schnell and save directly to website/public/images/keyframes/P01_S01_SH1_keyframe.png.");
body += p("Step 3: Web server automatically serves image at http://localhost:3000/images/keyframes/P01_S01_SH1_keyframe.png; timeline renders thumbnail card.");
body += p("Step 4: Video model (Veo 3.1 or Gemini Omni) ingests keyframe as starting frame; Prompt 2 applies camera movement and action beats.");
body += p("Step 5: Extract final frame of Shot 1 via FFmpeg (ffmpeg -sseof -0.1 -i SH1.mp4 -frames:v 1 SH1_tail.jpg) into website/public/images/tails/.");
body += p("Step 6: Shot 2 ingests the tail frame as starting image, guaranteeing zero visual jump or identity drift across the internal cut.");
body += p("Step 7: Lossless FFmpeg concat combines Shot 1 (4s) + Shot 2 (6s) into final 10.0s master render in website/public/renders/ ($0.00 compute cost).");

// Section 5
body += p("5. The 50-Option Feature Matrix Integration", { bold: true, size: 28, color: "1E1B4B", spaceBefore: 240, spaceAfter: 80 });
body += p("The website implements all 50 architectural options across 10 pillars:");
body += bullet("Pillars I-III: Multi-model router, Dual-Prompt splitter, 10s scene assembler, 24 camera moves, 20 lighting setups, verbatim style lock.");
body += bullet("Pillars IV-VI: Persistent character sheets, product geometry preservation, 2.5 wps speech budget, zero-cost pre-gen linter, safe zones.");
body += bullet("Pillars VII-X: 3-turn conversational V2V edit, segment inpainting, multi-track timeline, 36-artifact computer vision QA, headless FFmpeg worker.");

// Section 6
body += p("6. Deployment & Access Links", { bold: true, size: 28, color: "1E1B4B", spaceBefore: 240, spaceAfter: 80 });
body += code(`Live Deployed Website:       http://localhost:3000
Official Google Flow:        https://flow.google
Google AI Studio (Free API): https://aistudio.google.com
Images Storage Directory:    website/public/images/keyframes/
Video Renders Directory:     website/public/renders/
Images API Endpoint:         http://localhost:3000/api/images
50-Options API Endpoint:     http://localhost:3000/api/options`);

const fullDocXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${body}
  </w:body>
</w:document>`;

const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

// Build to Temp and Zip
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rfp_docx_'));
fs.mkdirSync(path.join(tempDir, '_rels'), { recursive: true });
fs.mkdirSync(path.join(tempDir, 'word'), { recursive: true });

fs.writeFileSync(path.join(tempDir, '[Content_Types].xml'), contentTypesXml, 'utf8');
fs.writeFileSync(path.join(tempDir, '_rels', '.rels'), relsXml, 'utf8');
fs.writeFileSync(path.join(tempDir, 'word', 'document.xml'), fullDocXml, 'utf8');

const desktopPath = path.join(os.homedir(), 'Desktop');
const destDocxDesktop = path.join(desktopPath, 'Google Flow Clone - Zero-Cost Video & Image Platform RFP.docx');
const destDocxWs = path.join(__dirname, 'Google Flow Clone - Zero-Cost Video & Image Platform RFP.docx');

if (fs.existsSync(destDocxDesktop)) fs.unlinkSync(destDocxDesktop);
if (fs.existsSync(destDocxWs)) fs.unlinkSync(destDocxWs);

// Zip using PowerShell
execSync(`powershell -NoProfile -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('${tempDir}', '${destDocxDesktop}')"`);
fs.copyFileSync(destDocxDesktop, destDocxWs);

// Cleanup temp
fs.rmSync(tempDir, { recursive: true, force: true });

console.log('Successfully generated Word Document on Desktop: ' + destDocxDesktop);
console.log('Successfully mirrored to Workspace: ' + destDocxWs);
