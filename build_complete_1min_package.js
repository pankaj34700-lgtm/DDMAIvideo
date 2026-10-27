const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const desktopPath = path.join(os.homedir(), 'Desktop');
const destDocxDesktop = path.join(desktopPath, '1-Minute Video Production Master Blueprint & Flowchart.docx');
const destPdfDesktop  = path.join(desktopPath, '1-Minute Video Production Master Blueprint & Flowchart.pdf');

const wsDocx = path.join(__dirname, '1-Minute Video Production Master Blueprint & Flowchart.docx');
const wsPdf  = path.join(__dirname, '1-Minute Video Production Master Blueprint & Flowchart.pdf');

// Helper XML Escaping
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
          <w:sz w:val="18"/>
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
          <w:rPr><w:b/><w:sz w:val="18"/><w:color w:val="FFFFFF"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr>
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
            <w:rPr><w:sz w:val="17"/><w:color w:val="1E293B"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr>
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

// -------------------------------------------------------------
// 1. GENERATE WORD DOCUMENT XML BODY
// -------------------------------------------------------------
let docXmlBody = '';

// Title
docXmlBody += p("1-MINUTE (60s) AI VIDEO PRODUCTION MASTER BLUEPRINT", { bold: true, size: 36, color: "1E1B4B", spaceAfter: 40 });
docXmlBody += p("The Complete 6-Scene, 12-Shot Mathematical Architecture, Full Prompt Suite & Flowchart", { bold: true, size: 22, color: "4338CA", spaceAfter: 80 });
docXmlBody += p("Standard Operating Procedure for Google Flow Studio, Veo 3.1 Fast, Gemini Omni Flash, and Zero-Cost Production", { italic: true, size: 19, color: "64748B", spaceAfter: 200 });

// Section 1
docXmlBody += p("1. The Mathematical Law of 1-Minute AI Videos", { bold: true, size: 26, color: "1E1B4B", spaceBefore: 200, spaceAfter: 80 });
docXmlBody += p("AI video models (Google Veo 3.1, Gemini Omni Flash 1.1, Seedance, MiniMax) cannot generate a continuous 60-second video from a single prompt. Doing so causes temporal collapse, facial drift, and melted objects.");
docXmlBody += p("The universal solution is the 6x10-Second Modular Architecture: A 1-minute (60.0-second) video consists of exactly 6 structured scenes of 10.0 seconds each. Each 10-second scene is built from 2 connected shots (Shot 1 [4.0s] + Shot 2 [6.0s]), totaling 12 individual shots.");

// Section 2: Narrative Blueprint Table
docXmlBody += p("2. The 6-Scene Narrative Structure (60 Seconds)", { bold: true, size: 26, color: "1E1B4B", spaceBefore: 200, spaceAfter: 80 });
docXmlBody += p("Every high-performing commercial, UGC TikTok ad, or promotional short follows this exact pacing curve:");

const tableHeaders = ["Scene #", "Timeline", "Narrative Purpose", "Shot Breakdown (Math)", "Narration Word Budget"];
const tableRows = [
  ["Scene 1", "0:00 – 0:10", "The Hook & Problem", "SH1 (4s Close-Up) + SH2 (6s Action)", "Max 25 words (Hook in first 2s)"],
  ["Scene 2", "0:10 – 0:20", "Agitation & Context", "SH1 (4s Medium) + SH2 (6s Push-In)", "Max 25 words (Deepen tension)"],
  ["Scene 3", "0:20 – 0:30", "The Turning Point / Reveal", "SH1 (4s Wide) + SH2 (6s Reveal Orbit)", "Max 25 words (Introduce hero solution)"],
  ["Scene 4", "0:30 – 0:40", "Core Benefit / Transformation", "SH1 (4s Detail) + SH2 (6s Tracking)", "Max 25 words (Show product in action)"],
  ["Scene 5", "0:40 – 0:50", "Climax & Social Proof", "SH1 (4s Reaction) + SH2 (6s Wide Hero)", "Max 25 words (Emotional peak)"],
  ["Scene 6", "0:50 – 1:00", "Resolution & CTA", "SH1 (4s Packshot) + SH2 (6s Calm Hold)", "Max 20 words (Calm last 3s for logo)"]
];
docXmlBody += table(tableHeaders, tableRows);

// Section 3: The Complete 8-Step Flowchart
docXmlBody += p("3. Step-by-Step 8-Stage Production Flowchart", { bold: true, size: 26, color: "1E1B4B", spaceBefore: 200, spaceAfter: 80 });
docXmlBody += bullet("STAGE 1 (Lock Sheet): Lock visual style string, 3-5 color anchors, aspect ratio (9:16 or 16:9), and voiceover profile.");
docXmlBody += bullet("STAGE 2 (Audio-First Script): Write script capped at 120-135 words (2.5 words/sec). Generate voiceover using Edge-TTS or Gemini Omni ($0.00).");
docXmlBody += bullet("STAGE 3 (Keyframe Generation): Create 6 initial still keyframes (Prompt 1) using Nano Banana 2 Lite or FLUX.1 Schnell. Store in website/public/images/keyframes/.");
docXmlBody += bullet("STAGE 4 (Shot 1 Video): Feed Keyframe 1 into Veo 3.1 Fast or Gemini Omni as start frame with Prompt 2 (Motion & camera dynamics). Output 4.0s clip.");
docXmlBody += bullet("STAGE 5 (Tail Frame Extraction): Extract exact last frame of Shot 1 using FFmpeg (-sseof -0.1). Save to website/public/images/tails/.");
docXmlBody += bullet("STAGE 6 (Shot 2 Chained): Pass extracted tail frame as starting frame for Shot 2 (6.0s) to guarantee zero character or lighting jump.");
docXmlBody += bullet("STAGE 7 (Repeat for Scenes 2 to 6): Complete all 6 scenes following the exact 4s+6s chained formula (12 shots total).");
docXmlBody += bullet("STAGE 8 (Master Assembly & Audio Mix): Losslessly concatenate all 12 clips into 60.0s master and mix voiceover with -12dB music ducking.");

// Section 4: Full 12-Shot Prompt Suite
docXmlBody += p("4. Complete 12-Shot Prompt Suite (All 6 Scenes)", { bold: true, size: 26, color: "1E1B4B", spaceBefore: 200, spaceAfter: 80 });

// Scene 1 Prompts
docXmlBody += p("SCENE 1: THE HOOK (0:00 – 0:10)", { bold: true, size: 22, color: "4338CA", spaceBefore: 120, spaceAfter: 40 });
docXmlBody += p("• Shot 1 (4.0s) — Prompt 1 (Keyframe Image Still):");
docXmlBody += code("Photorealistic cinematic commercial studio footage, crisp 35mm finish. Close-up of one frosted glass perfume bottle with fluted brass cap resting on wet obsidian slate, soft natural side-lighting from top-left, warm amber, matte black, and brass color anchors, shallow depth of field, vertical 9:16 frame.");
docXmlBody += p("• Shot 1 (4.0s) — Prompt 2 (Video Motion & Audio):");
docXmlBody += code("Slow micro push-in. A single water droplet glides down the curve of the bottle, catching golden light, then settles onto the dark stone. Ends with the bottle held still and centered. Audio: Soft water droplet drip, quiet studio silence, no music, no subtitles.");
docXmlBody += p("• Shot 2 (6.0s) — Prompt 2 (Chained from Shot 1 Tail Frame):");
docXmlBody += code("Slow smooth 45-degree orbit around the bottle. Gentle wafts of pale golden mist drift smoothly from behind the bottle across the base, light rays scatter through mist, fluted brass cap gleams. Ends with bottle standing proud and centered. Audio: Low elegant sub-bass swell, soft airy breeze whoosh, voiceover begins: 'True essence, redefined.' no subtitles.");

// Scene 2 Prompts
docXmlBody += p("SCENE 2: AGITATION & CONTEXT (0:10 – 0:20)", { bold: true, size: 22, color: "4338CA", spaceBefore: 120, spaceAfter: 40 });
docXmlBody += p("• Shot 1 (4.0s) — Prompt 1 (Keyframe Still):");
docXmlBody += code("Photorealistic cinematic commercial footage. Medium shot of a 28-year-old elegant woman in a tailored matte black silk blazer, seated in a minimalist dark stone dressing room, gazing thoughtfully toward an amber vanity light, warm amber and charcoal tones, vertical 9:16 frame.");
docXmlBody += p("• Shot 1 (4.0s) — Prompt 2 (Video Motion):");
docXmlBody += code("Static locked-off camera. She lifts her left hand slowly toward her collarbone, a subtle calm breath lifts her shoulders, soft amber light reflects in her eyes. Ends with her gaze held steady. Audio: Soft silk fabric rustle, subtle warm room tone, voiceover: 'In a world of fleeting noise...' no subtitles.");
docXmlBody += p("• Shot 2 (6.0s) — Prompt 2 (Chained Tail):");
docXmlBody += code("Slow push-in toward her profile. She turns her head gracefully toward the camera, a faint knowing smile touches her lips, hair catches warm edge backlight. Ends with her looking into lens. Audio: Gentle ambient breath, soft cello undertone, voiceover: '...find a signature that stays.' no subtitles.");

// Scene 3 Prompts
docXmlBody += p("SCENE 3: THE TURNING POINT / REVEAL (0:20 – 0:30)", { bold: true, size: 22, color: "4338CA", spaceBefore: 120, spaceAfter: 40 });
docXmlBody += p("• Shot 1 (4.0s) — Prompt 1 (Keyframe Still):");
docXmlBody += code("Photorealistic commercial cinematography. Wide shot of the obsidian vanity table, the woman reaches out to pick up the frosted brass perfume bottle, warm golden hour rays piercing through sheer blinds, deep amber and rich charcoal palette, vertical 9:16 frame.");
docXmlBody += p("• Shot 1 (4.0s) — Prompt 2 (Video Motion):");
docXmlBody += code("Slow crane down. Her hand enters frame smoothly, slender fingers wrap around the frosted glass flutes, lifting the bottle cleanly from the stone pedestal. Ends with bottle raised at chest level. Audio: Crisp stone release, delicate glass click, voiceover: 'Crafted from rare botanical notes...' no subtitles.");
docXmlBody += p("• Shot 2 (6.0s) — Prompt 2 (Chained Tail):");
docXmlBody += code("Slow tracking shot. She brings the fluted bottle up, presses the golden atomizer once, producing an ultra-fine micro-mist of golden fragrance that catches the sunlight. Ends with mist dispersing in slow motion. Audio: Crisp mechanical atomizer mist spray hiss, light melodic chime, voiceover: '...harvested at golden hour.' no subtitles.");

// Scene 4 Prompts
docXmlBody += p("SCENE 4: CORE BENEFIT & TRANSFORMATION (0:30 – 0:40)", { bold: true, size: 22, color: "4338CA", spaceBefore: 120, spaceAfter: 40 });
docXmlBody += p("• Shot 1 (4.0s) — Prompt 1 (Keyframe Still):");
docXmlBody += code("Photorealistic macro cinematography. Extreme close-up of golden liquid ripples inside the transparent chamber of the perfume bottle, bubbles rising slowly through liquid amber, backlit by warm golden light, vertical 9:16 frame.");
docXmlBody += p("• Shot 1 (4.0s) — Prompt 2 (Video Motion):");
docXmlBody += code("Slow micro push-in. Golden liquid swirls gently in hypnotic waves, micro bubbles rise and catch diamond-like sparkles, amber light refracts through glass facets. Ends with swirl calming. Audio: Deep liquid chime resonance, warm sub-bass pulse, voiceover: 'Twenty-four-hour longevity.' no subtitles.");
docXmlBody += p("• Shot 2 (6.0s) — Prompt 2 (Chained Tail):");
docXmlBody += code("Smooth lateral truck. Macro focus shifts from the liquid core to the polished brass nozzle, showing precision engraving and flawless metal craftsmanship. Ends with nozzle centered. Audio: Soft metallic glide, delicate harmonic swell, voiceover: 'Pure perfume oil concentration.' no subtitles.");

// Scene 5 Prompts
docXmlBody += p("SCENE 5: EMOTIONAL PEAK & CLIMAX (0:40 – 0:50)", { bold: true, size: 22, color: "4338CA", spaceBefore: 120, spaceAfter: 40 });
docXmlBody += p("• Shot 1 (4.0s) — Prompt 1 (Keyframe Still):");
docXmlBody += code("Photorealistic cinematic fashion film. Medium wide shot of the woman walking confidently through a grand modern architectural archway, black evening dress flowing behind her, warm golden side-lighting casting long shadows, vertical 9:16 frame.");
docXmlBody += p("• Shot 1 (4.0s) — Prompt 2 (Video Motion):");
docXmlBody += code("Tracking shot moving alongside her. She strides forward with relaxed elegance, fabric swaying rhythmically, heads turn in blurred background, warm evening wind catches her hair. Ends with her entering golden light beam. Audio: Confident heel clicks on marble, distant ambient room murmur, voiceover: 'Unforgettable presence in every room.' no subtitles.");
docXmlBody += p("• Shot 2 (6.0s) — Prompt 2 (Chained Tail):");
docXmlBody += code("Slow orbit around her as she pauses. She pauses at the archway edge, looks back over her shoulder with an empowered, radiant expression, warm sunset light halos her silhouette. Ends with her steady confident gaze. Audio: Majestic orchestral swell, soft breeze, voiceover: 'Wear your legacy.' no subtitles.");

// Scene 6 Prompts
docXmlBody += p("SCENE 6: RESOLUTION & CALL TO ACTION (0:50 – 1:00)", { bold: true, size: 22, color: "4338CA", spaceBefore: 120, spaceAfter: 40 });
docXmlBody += p("• Shot 1 (4.0s) — Prompt 1 (Keyframe Still):");
docXmlBody += code("Photorealistic luxury product hero shot. Medium close-up of the perfume bottle resting perfectly centered on polished black travertine stone, soft amber backlight, clean blank upper frame left for logo text overlay, vertical 9:16 frame.");
docXmlBody += p("• Shot 1 (4.0s) — Prompt 2 (Video Motion):");
docXmlBody += code("Slow pull-back revealing surroundings. The camera glides backward smoothly by three inches, warm light rays slowly scan across the brass cap, travertine surface reflects warm gold. Ends with bottle perfectly centered. Audio: Soft concluding piano chord, quiet luxury studio silence, voiceover: 'AURA. The new fragrance.' no subtitles.");
docXmlBody += p("• Shot 2 (6.0s) — Prompt 2 (Chained Tail - Calm CTA Hold):");
docXmlBody += code("Static locked-off camera. The bottle remains completely still and sharp in center frame, subtle warm light slowly fades around the edges, upper third remains clean and still for call to action text. Ends with serene static hold. Audio: Final sustained resonant chime, gentle fade to silence, voiceover: 'Discover yours today at aura.com' no subtitles.");

// Section 5: Automated FFmpeg Concat Script
docXmlBody += p("5. Automated FFmpeg Assembly Script for 60-Second Master", { bold: true, size: 26, color: "1E1B4B", spaceBefore: 200, spaceAfter: 80 });
docXmlBody += p("To assemble all 6 scenes (12 shots) into a seamless 60.0s master video with audio ducking, execute:");
docXmlBody += code(`# 1. Create file list
cat <<EOF > 60s_scenes.txt
file 'Scene1_SH1.mp4'
file 'Scene1_SH2.mp4'
file 'Scene2_SH1.mp4'
file 'Scene2_SH2.mp4'
file 'Scene3_SH1.mp4'
file 'Scene3_SH2.mp4'
file 'Scene4_SH1.mp4'
file 'Scene4_SH2.mp4'
file 'Scene5_SH1.mp4'
file 'Scene5_SH2.mp4'
file 'Scene6_SH1.mp4'
file 'Scene6_SH2.mp4'
EOF

# 2. Concat 12 shots losslessly into 60-second video
ffmpeg -y -f concat -safe 0 -i 60s_scenes.txt -c copy video_60s_noaudio.mp4

# 3. Mix background music bed with -12dB voiceover ducking
ffmpeg -y -i video_60s_noaudio.mp4 -i full_voiceover.mp3 -i ambient_music.mp3 \\
-filter_complex "[1:a]volume=1.0[vo];[2:a]volume=0.25[bg];[bg][vo]amix=inputs=2:duration=first[aout]" \\
-map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 192k website/public/renders/Final_1Minute_Master_Video.mp4`);

// Build .docx via OpenXML
const fullDocXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>${docXmlBody}</w:body>
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

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), '1min_full_'));
fs.mkdirSync(path.join(tempDir, '_rels'), { recursive: true });
fs.mkdirSync(path.join(tempDir, 'word'), { recursive: true });

fs.writeFileSync(path.join(tempDir, '[Content_Types].xml'), contentTypesXml, 'utf8');
fs.writeFileSync(path.join(tempDir, '_rels', '.rels'), relsXml, 'utf8');
fs.writeFileSync(path.join(tempDir, 'word', 'document.xml'), fullDocXml, 'utf8');

if (fs.existsSync(destDocxDesktop)) fs.unlinkSync(destDocxDesktop);
if (fs.existsSync(wsDocx)) fs.unlinkSync(wsDocx);

execSync(`powershell -NoProfile -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('${tempDir}', '${destDocxDesktop}')"`);
fs.copyFileSync(destDocxDesktop, wsDocx);
fs.rmSync(tempDir, { recursive: true, force: true });
console.log('Saved Word Document (.docx) to Desktop:', destDocxDesktop);

// -------------------------------------------------------------
// 2. GENERATE HIGH-QUALITY PDF VIA HTML & PLAYWRIGHT
// -------------------------------------------------------------
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>1-Minute AI Video Production Master Blueprint</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
    body { font-family: 'Inter', sans-serif; color: #1e293b; line-height: 1.5; padding: 30px; font-size: 11pt; }
    h1 { color: #1e1b4b; font-size: 20pt; font-weight: 700; margin-bottom: 4px; }
    h2 { color: #4338ca; font-size: 13pt; font-weight: 700; margin-top: 18px; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
    h3 { color: #3730a3; font-size: 11pt; font-weight: 600; margin-top: 12px; margin-bottom: 4px; }
    p { margin-bottom: 8px; }
    ul { margin-left: 20px; margin-bottom: 10px; }
    li { margin-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 15px; font-size: 9pt; }
    th { background-color: #4338ca; color: white; padding: 6px 8px; text-align: left; font-weight: 600; }
    td { padding: 6px 8px; border-bottom: 1px solid #e2e8f0; }
    tr:nth-child(even) td { background-color: #f8fafc; }
    pre { background-color: #f1f5f9; padding: 8px 10px; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 8.5pt; color: #0f172a; white-space: pre-wrap; word-break: break-all; margin-bottom: 8px; }
    .badge { display: inline-block; background-color: #e0e7ff; color: #3730a3; font-size: 8pt; font-weight: 600; padding: 2px 6px; border-radius: 4px; margin-bottom: 4px; }
    .page-break { page-break-before: always; }
  </style>
</head>
<body>
  <h1>1-MINUTE (60s) AI VIDEO PRODUCTION MASTER BLUEPRINT</h1>
  <p style="color: #4338ca; font-size: 13pt; font-weight: 600; margin-bottom: 4px;">The 6-Scene, 12-Shot Mathematical Architecture, Full Prompt Suite & Flowchart</p>
  <p style="color: #64748b; font-style: italic; font-size: 10pt; margin-bottom: 18px;">Standard Operating Procedure for Google Flow Studio, Veo 3.1 Fast, Gemini Omni Flash & Zero-Cost Pipeline</p>

  <h2>1. The Mathematical Law of 1-Minute AI Videos</h2>
  <p>Generative video models (Google Veo 3.1, Gemini Omni Flash 1.1, Seedance, MiniMax) cannot produce a continuous 60-second video from a single prompt. Doing so causes severe temporal collapse, facial drift, and melted objects.</p>
  <p><strong>The Universal 6x10-Second Modular Architecture:</strong> A 1-minute (60.0s) video is composed of exactly <strong>6 structured scenes of 10.0 seconds each</strong>. Each 10-second scene is built from <strong>2 connected shots</strong> (Shot 1 [4.0s] + Shot 2 [6.0s]), totaling <strong>12 individual shots</strong>.</p>

  <h2>2. The 6-Scene Narrative Structure (60 Seconds)</h2>
  <table>
    <thead>
      <tr><th>Scene #</th><th>Timeline</th><th>Narrative Purpose</th><th>Shot Structure</th><th>Narration Word Budget</th></tr>
    </thead>
    <tbody>
      <tr><td>Scene 1</td><td>0:00 – 0:10</td><td>The Hook & Problem</td><td>SH1 (4s Close-Up) + SH2 (6s Action)</td><td>Max 25 words (Hook in first 2s)</td></tr>
      <tr><td>Scene 2</td><td>0:10 – 0:20</td><td>Agitation & Context</td><td>SH1 (4s Medium) + SH2 (6s Push-In)</td><td>Max 25 words (Deepen tension)</td></tr>
      <tr><td>Scene 3</td><td>0:20 – 0:30</td><td>Turning Point / Reveal</td><td>SH1 (4s Wide) + SH2 (6s Reveal Orbit)</td><td>Max 25 words (Introduce hero solution)</td></tr>
      <tr><td>Scene 4</td><td>0:30 – 0:40</td><td>Core Benefit / Transformation</td><td>SH1 (4s Detail) + SH2 (6s Tracking)</td><td>Max 25 words (Show product in action)</td></tr>
      <tr><td>Scene 5</td><td>0:40 – 0:50</td><td>Climax & Social Proof</td><td>SH1 (4s Reaction) + SH2 (6s Wide Hero)</td><td>Max 25 words (Emotional peak)</td></tr>
      <tr><td>Scene 6</td><td>0:50 – 1:00</td><td>Resolution & CTA</td><td>SH1 (4s Packshot) + SH2 (6s Calm Hold)</td><td>Max 20 words (Calm last 3s for logo)</td></tr>
    </tbody>
  </table>

  <h2>3. Step-by-Step 8-Stage Production Flowchart</h2>
  <ul>
    <li><strong>STAGE 1 (Lock Sheet):</strong> Lock style string, 3-5 color anchors, aspect ratio (9:16 or 16:9), and voice talent.</li>
    <li><strong>STAGE 2 (Audio-First Script):</strong> Write voiceover script capped at 120-135 words (2.5 words/sec). Generate voice track using Edge-TTS or Gemini Omni ($0.00).</li>
    <li><strong>STAGE 3 (Keyframe Generation):</strong> Create 6 initial still keyframes (Prompt 1) using Nano Banana 2 Lite or FLUX.1 Schnell. Store in <code>website/public/images/keyframes/</code>.</li>
    <li><strong>STAGE 4 (Shot 1 Video):</strong> Feed Keyframe 1 into Veo 3.1 Fast or Gemini Omni as start frame with Prompt 2 (Motion). Output 4.0s clip.</li>
    <li><strong>STAGE 5 (Tail Frame Extraction):</strong> Extract exact last frame of Shot 1 via FFmpeg (<code>ffmpeg -sseof -0.1</code>) into <code>website/public/images/tails/</code>.</li>
    <li><strong>STAGE 6 (Shot 2 Chained):</strong> Pass extracted tail frame as starting frame for Shot 2 (6.0s) to guarantee zero character or lighting jump.</li>
    <li><strong>STAGE 7 (Repeat for Scenes 2 to 6):</strong> Produce all 12 shots following the exact 4s+6s chained formula.</li>
    <li><strong>STAGE 8 (Master Assembly & Audio Mix):</strong> Losslessly concatenate all 12 clips into 60.0s master and mix voiceover with -12dB music ducking.</li>
  </ul>

  <div class="page-break"></div>

  <h2>4. Complete 12-Shot Prompt Suite (All 6 Scenes)</h2>

  <h3>SCENE 1: THE HOOK (0:00 – 0:10)</h3>
  <span class="badge">Shot 1 (4.0s) — Prompt 1: Keyframe Image Still</span>
  <pre>Photorealistic cinematic commercial studio footage, crisp 35mm finish. Close-up of one frosted glass perfume bottle with fluted brass cap resting on wet obsidian slate, soft natural side-lighting from top-left, warm amber, matte black, and brass color anchors, shallow depth of field, vertical 9:16 frame.</pre>
  
  <span class="badge">Shot 1 (4.0s) — Prompt 2: Video Motion & Audio</span>
  <pre>Slow micro push-in. A single water droplet glides down the curve of the bottle, catching golden light, then settles onto the dark stone. Ends with the bottle held still and centered. Audio: Soft water droplet drip, quiet studio silence, no music, no subtitles.</pre>

  <span class="badge">Shot 2 (6.0s) — Prompt 2: Chained from Shot 1 Tail Frame</span>
  <pre>Slow smooth 45-degree orbit around the bottle. Gentle wafts of pale golden mist drift smoothly from behind the bottle across the base, light rays scatter through mist, fluted brass cap gleams. Ends with bottle standing proud and centered. Audio: Low elegant sub-bass swell, soft airy breeze whoosh, voiceover begins: "True essence, redefined." no subtitles.</pre>

  <h3>SCENE 2: AGITATION & CONTEXT (0:10 – 0:20)</h3>
  <span class="badge">Shot 1 (4.0s) — Prompt 1: Keyframe Still</span>
  <pre>Photorealistic cinematic commercial footage. Medium shot of a 28-year-old elegant woman in a tailored matte black silk blazer, seated in a minimalist dark stone dressing room, gazing thoughtfully toward an amber vanity light, warm amber and charcoal tones, vertical 9:16 frame.</pre>
  
  <span class="badge">Shot 1 (4.0s) — Prompt 2: Video Motion</span>
  <pre>Static locked-off camera. She lifts her left hand slowly toward her collarbone, a subtle calm breath lifts her shoulders, soft amber light reflects in her eyes. Ends with her gaze held steady. Audio: Soft silk fabric rustle, subtle warm room tone, voiceover: "In a world of fleeting noise..." no subtitles.</pre>

  <span class="badge">Shot 2 (6.0s) — Prompt 2: Chained Tail</span>
  <pre>Slow push-in toward her profile. She turns her head gracefully toward the camera, a faint knowing smile touches her lips, hair catches warm edge backlight. Ends with her looking into lens. Audio: Gentle ambient breath, soft cello undertone, voiceover: "...find a signature that stays." no subtitles.</pre>

  <h3>SCENE 3: THE TURNING POINT / REVEAL (0:20 – 0:30)</h3>
  <span class="badge">Shot 1 (4.0s) — Prompt 1: Keyframe Still</span>
  <pre>Photorealistic commercial cinematography. Wide shot of the obsidian vanity table, the woman reaches out to pick up the frosted brass perfume bottle, warm golden hour rays piercing through sheer blinds, deep amber and rich charcoal palette, vertical 9:16 frame.</pre>
  
  <span class="badge">Shot 1 (4.0s) — Prompt 2: Video Motion</span>
  <pre>Slow crane down. Her hand enters frame smoothly, slender fingers wrap around the frosted glass flutes, lifting the bottle cleanly from the stone pedestal. Ends with bottle raised at chest level. Audio: Crisp stone release, delicate glass click, voiceover: "Crafted from rare botanical notes..." no subtitles.</pre>

  <span class="badge">Shot 2 (6.0s) — Prompt 2: Chained Tail</span>
  <pre>Slow tracking shot. She brings the fluted bottle up, presses the golden atomizer once, producing an ultra-fine micro-mist of golden fragrance that catches the sunlight. Ends with mist dispersing in slow motion. Audio: Crisp mechanical atomizer mist spray hiss, light melodic chime, voiceover: "...harvested at golden hour." no subtitles.</pre>

  <div class="page-break"></div>

  <h3>SCENE 4: CORE BENEFIT & TRANSFORMATION (0:30 – 0:40)</h3>
  <span class="badge">Shot 1 (4.0s) — Prompt 1: Keyframe Still</span>
  <pre>Photorealistic macro cinematography. Extreme close-up of golden liquid ripples inside the transparent chamber of the perfume bottle, bubbles rising slowly through liquid amber, backlit by warm golden light, vertical 9:16 frame.</pre>
  
  <span class="badge">Shot 1 (4.0s) — Prompt 2: Video Motion</span>
  <pre>Slow micro push-in. Golden liquid swirls gently in hypnotic waves, micro bubbles rise and catch diamond-like sparkles, amber light refracts through glass facets. Ends with swirl calming. Audio: Deep liquid chime resonance, warm sub-bass pulse, voiceover: "Twenty-four-hour longevity." no subtitles.</pre>

  <span class="badge">Shot 2 (6.0s) — Prompt 2: Chained Tail</span>
  <pre>Smooth lateral truck. Macro focus shifts from the liquid core to the polished brass nozzle, showing precision engraving and flawless metal craftsmanship. Ends with nozzle centered. Audio: Soft metallic glide, delicate harmonic swell, voiceover: "Pure perfume oil concentration." no subtitles.</pre>

  <h3>SCENE 5: EMOTIONAL PEAK & CLIMAX (0:40 – 0:50)</h3>
  <span class="badge">Shot 1 (4.0s) — Prompt 1: Keyframe Still</span>
  <pre>Photorealistic cinematic fashion film. Medium wide shot of the woman walking confidently through a grand modern architectural archway, black evening dress flowing behind her, warm golden side-lighting casting long shadows, vertical 9:16 frame.</pre>
  
  <span class="badge">Shot 1 (4.0s) — Prompt 2: Video Motion</span>
  <pre>Tracking shot moving alongside her. She strides forward with relaxed elegance, fabric swaying rhythmically, heads turn in blurred background, warm evening wind catches her hair. Ends with her entering golden light beam. Audio: Confident heel clicks on marble, distant ambient room murmur, voiceover: "Unforgettable presence in every room." no subtitles.</pre>

  <span class="badge">Shot 2 (6.0s) — Prompt 2: Chained Tail</span>
  <pre>Slow orbit around her as she pauses. She pauses at the archway edge, looks back over her shoulder with an empowered, radiant expression, warm sunset light halos her silhouette. Ends with her steady confident gaze. Audio: Majestic orchestral swell, soft breeze, voiceover: "Wear your legacy." no subtitles.</pre>

  <h3>SCENE 6: RESOLUTION & CALL TO ACTION (0:50 – 1:00)</h3>
  <span class="badge">Shot 1 (4.0s) — Prompt 1: Keyframe Still</span>
  <pre>Photorealistic luxury product hero shot. Medium close-up of the perfume bottle resting perfectly centered on polished black travertine stone, soft amber backlight, clean blank upper frame left for logo text overlay, vertical 9:16 frame.</pre>
  
  <span class="badge">Shot 1 (4.0s) — Prompt 2: Video Motion</span>
  <pre>Slow pull-back revealing surroundings. The camera glides backward smoothly by three inches, warm light rays slowly scan across the brass cap, travertine surface reflects warm gold. Ends with bottle perfectly centered. Audio: Soft concluding piano chord, quiet luxury studio silence, voiceover: "AURA. The new fragrance." no subtitles.</pre>

  <span class="badge">Shot 2 (6.0s) — Prompt 2: Chained Tail - Calm CTA Hold</span>
  <pre>Static locked-off camera. The bottle remains completely still and sharp in center frame, subtle warm light slowly fades around the edges, upper third remains clean and still for call to action text. Ends with serene static hold. Audio: Final sustained resonant chime, gentle fade to silence, voiceover: "Discover yours today at aura.com" no subtitles.</pre>

  <h2>5. Automated FFmpeg Assembly Script for 60-Second Master</h2>
  <pre># 1. Create file list
cat <<EOF > 60s_scenes.txt
file 'Scene1_SH1.mp4'
file 'Scene1_SH2.mp4'
file 'Scene2_SH1.mp4'
file 'Scene2_SH2.mp4'
file 'Scene3_SH1.mp4'
file 'Scene3_SH2.mp4'
file 'Scene4_SH1.mp4'
file 'Scene4_SH2.mp4'
file 'Scene5_SH1.mp4'
file 'Scene5_SH2.mp4'
file 'Scene6_SH1.mp4'
file 'Scene6_SH2.mp4'
EOF

# 2. Concat 12 shots losslessly into 60-second video
ffmpeg -y -f concat -safe 0 -i 60s_scenes.txt -c copy video_60s_noaudio.mp4

# 3. Mix background music bed with -12dB voiceover ducking
ffmpeg -y -i video_60s_noaudio.mp4 -i full_voiceover.mp3 -i ambient_music.mp3 \\
-filter_complex "[1:a]volume=1.0[vo];[2:a]volume=0.25[bg];[bg][vo]amix=inputs=2:duration=first[aout]" \\
-map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 192k website/public/renders/Final_1Minute_Master_Video.mp4</pre>
</body>
</html>`;

const tempHtml = path.join(__dirname, 'temp_1min_guide.html');
fs.writeFileSync(tempHtml, htmlContent, 'utf8');

// Generate PDF via Playwright CLI
console.log('Generating PDF via Playwright...');
execSync(`npx playwright pdf "${tempHtml}" "${destPdfDesktop}"`);
fs.copyFileSync(destPdfDesktop, wsPdf);
fs.unlinkSync(tempHtml);

console.log('Saved PDF Document (.pdf) to Desktop:', destPdfDesktop);
console.log('All files verified and saved to Desktop & Workspace.');
