const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const destDocxDesktop = path.join(os.homedir(), 'Desktop', 'HOW_TO_GET_FREE_API_KEYS_FOR_DDMAI_VIDEO.docx');

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
        <w:spacing w:before="60" w:after="120"/>
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
    ${p("DDMAI.VIDEO — Free AI Image & Video API Keys Master Guide", { bold: true, size: 36, color: "4338CA", spaceAfter: 100 })}
    ${p("Step-by-Step Blueprint to Get 100% Free ($0.00 / Zero-Cost) Generative AI Keys", { size: 22, color: "64748B", italic: true, spaceAfter: 240 })}

    ${p("1. OVERVIEW: ZERO-COST API ARCHITECTURE", { bold: true, size: 26, color: "0F172A", spaceBefore: 200, spaceAfter: 120 })}
    ${p("To keep your production costs at $0.00 (NIL), DDMAI.VIDEO leverages free-tier allocations from top cloud AI providers. API keys are personal authentication tokens that you can generate in 30 seconds for free without entering a credit card.", { size: 21, color: "334155" })}

    ${p("2. GOOGLE GEMINI & IMAGEN 3 API KEY (RECOMMENDED #1)", { bold: true, size: 26, color: "0F172A", spaceBefore: 200, spaceAfter: 120 })}
    ${bullet("Provider: Google DeepMind & Google AI Studio")}
    ${bullet("Cost: 100% Free Tier ($0.00 / No Credit Card Needed)")}
    ${bullet("Generates: Imagen 3 High-Res Image Stills, Gemini 2.0 Flash Storyboard Decomposition, Multimodal Vision QA")}
    ${bullet("Rate Limits: 15 Requests Per Minute (RPM), 1,500 Requests Per Day (RPD)")}
    ${p("Direct Link:", { bold: true, size: 21, color: "4338CA", spaceBefore: 80, spaceAfter: 40 })}
    ${code("https://aistudio.google.com/app/apikey")}
    ${p("Steps to get:", { bold: true, size: 21, color: "0F172A", spaceBefore: 80, spaceAfter: 40 })}
    ${bullet("1. Open the URL above in your browser and sign in with your Google account.")}
    ${bullet("2. Click the blue 'Create API key' button.")}
    ${bullet("3. Select your Firebase project 'vedio-working' or select 'Create key in new project'.")}
    ${bullet("4. Copy the generated key (starts with 'AIzaSy...').")}
    ${bullet("5. Open https://vedio-working.web.app -> Click 'API Keys' -> Paste and click 'Save API Keys'.")}

    ${p("3. HUGGING FACE ACCESS TOKEN (FLUX.1 SCHNELL & LTX-VIDEO)", { bold: true, size: 26, color: "0F172A", spaceBefore: 200, spaceAfter: 120 })}
    ${bullet("Provider: Hugging Face (Open Source Community Hub)")}
    ${bullet("Cost: Free Serverless Inference API ($0.00)")}
    ${bullet("Generates: FLUX.1-schnell (4-step state-of-the-art keyframe image still generation), LTX-Video, CogVideoX")}
    ${p("Direct Link:", { bold: true, size: 21, color: "4338CA", spaceBefore: 80, spaceAfter: 40 })}
    ${code("https://huggingface.co/settings/tokens")}
    ${p("Steps to get:", { bold: true, size: 21, color: "0F172A", spaceBefore: 80, spaceAfter: 40 })}
    ${bullet("1. Open the URL above and create a free account if you don't already have one.")}
    ${bullet("2. Click 'Create new token'.")}
    ${bullet("3. Select Token Type: 'Read', enter Name: 'DDMAI-Studio', and click 'Create token'.")}
    ${bullet("4. Copy the token (starts with 'hf_...').")}
    ${bullet("5. Paste into DDMAI.VIDEO 'API Keys' manager modal and save.")}

    ${p("4. TOGETHER AI FREE CREDITS KEY (ULTRA-FAST GPU)", { bold: true, size: 26, color: "0F172A", spaceBefore: 200, spaceAfter: 120 })}
    ${bullet("Provider: Together AI")}
    ${bullet("Cost: $5 to $25 in Free Signup Credits (Generates 1,000+ FLUX images for free)")}
    ${p("Direct Link:", { bold: true, size: 21, color: "4338CA", spaceBefore: 80, spaceAfter: 40 })}
    ${code("https://api.together.ai/settings/api-keys")}
    ${bullet("1. Sign up for a free Together AI account.")}
    ${bullet("2. Go to Settings -> API Keys -> Create API Key.")}
    ${bullet("3. Paste into DDMAI.VIDEO settings.")}

    ${p("5. HOW TO USE KEYS IN DDMAI.VIDEO", { bold: true, size: 26, color: "0F172A", spaceBefore: 200, spaceAfter: 120 })}
    ${bullet("Option A (In Web Browser): Open https://vedio-working.web.app -> Click 'API Keys' button in the top navbar -> Paste keys -> Click 'Save API Keys'. Keys are safely encrypted in your browser.")}
    ${bullet("Option B (Local Environment File): Open .env in your project folder -> Add GEMINI_API_KEY=AIzaSy... and HF_TOKEN=hf_... -> Save file.")}
    <w:sectPr/>
  </w:body>
</w:document>`;

const tempDir = path.join(__dirname, 'temp_docx_package');
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

const tempZip = path.join(__dirname, 'temp_guide.zip');
execSync(`powershell -Command "Compress-Archive -Path '${tempDir}\\*' -DestinationPath '${tempZip}' -Force; Move-Item '${tempZip}' '${destDocxDesktop}' -Force"`);
fs.rmSync(tempDir, { recursive: true, force: true });

console.log('Successfully created true OpenXML docx at:', destDocxDesktop);
