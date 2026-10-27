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

let body = '';

// Title
body += p("MASTER BLUEPRINT: HOW TO PRODUCE A 1-MINUTE (60s) AI VIDEO", { bold: true, size: 38, color: "1E1B4B", spaceAfter: 40 });
body += p("The 6-Scene, 12-Shot Mathematical Architecture for Flawless Storytelling & Zero Temporal Collapse", { bold: true, size: 22, color: "4338CA", spaceAfter: 80 });
body += p("Step-by-Step Flowchart, Dual-Prompt Suite, Audio Budgeting, and FFmpeg Assembly Guide", { italic: true, size: 19, color: "64748B", spaceAfter: 240 });

// Section 1
body += p("1. The Mathematical Law of 1-Minute AI Videos", { bold: true, size: 28, color: "1E1B4B", spaceBefore: 200, spaceAfter: 80 });
body += p("Generative video models (Google Veo 3.1, Gemini Omni Flash, Seedance, MiniMax) cannot generate a continuous 60-second clip in one pass. Attempting to prompt 60 seconds directly causes temporal degradation, morphing faces, melting bodies, and loss of narrative structure.");
body += p("The industry-standard solution is the 6x10-Second Modular Architecture: A 1-minute (60.0-second) video is composed of exactly 6 structured scenes of 10.0 seconds each. Each 10-second scene is built from 2 shots (Shot 1 [4.0s] + Shot 2 [6.0s]), totaling 12 individual shots.");

// Section 2: Narrative Beat Sheet
body += p("2. The 6-Scene Narrative Structure (60 Seconds)", { bold: true, size: 28, color: "1E1B4B", spaceBefore: 200, spaceAfter: 80 });
body += p("Every commercial, YouTube short, or promotional film follows this precise pacing curve:");

const headers = ["Scene #", "Timeline", "Narrative Purpose", "Shot Breakdown (Math)", "Narration Word Budget"];
const rows = [
  ["Scene 1", "0:00 – 0:10", "The Hook & Problem", "SH1 (4s Close-Up) + SH2 (6s Action)", "Max 25 words (Hook in first 2s)"],
  ["Scene 2", "0:10 – 0:20", "Agitation & Context", "SH1 (4s Medium) + SH2 (6s Push-In)", "Max 25 words (Deepen tension)"],
  ["Scene 3", "0:20 – 0:30", "The Turning Point / Reveal", "SH1 (4s Wide) + SH2 (6s Reveal Orbit)", "Max 25 words (Introduce solution)"],
  ["Scene 4", "0:30 – 0:40", "Core Benefit / Transformation", "SH1 (4s Detail) + SH2 (6s Tracking)", "Max 25 words (Show proof in action)"],
  ["Scene 5", "0:40 – 0:50", "Climax & Social Proof", "SH1 (4s Reaction) + SH2 (6s Wide Hero)", "Max 25 words (Emotional peak)"],
  ["Scene 6", "0:50 – 1:00", "Resolution & CTA", "SH1 (4s Packshot) + SH2 (6s Calm Hold)", "Max 20 words (Calm last 3s for logo)"]
];
body += table(headers, rows);

// Section 3: Step-by-Step Flowchart
body += p("3. The Complete 8-Step Production Flowchart", { bold: true, size: 28, color: "1E1B4B", spaceBefore: 200, spaceAfter: 80 });
body += bullet("STEP 1: Lock the Project Sheet — Define aspect ratio (9:16 or 16:9), verbatim style string, 3-5 color anchors, and voice talent.");
body += bullet("STEP 2: Scriptwriting & Audio-First Timing — Write voiceover capped at 130 words total (2.5 words/second). Generate voice track first to establish exact scene timings.");
body += bullet("STEP 3: Generate Keyframe Images (Prompt 1) — Create 6 initial keyframes (one per scene) using Nano Banana 2 Lite or FLUX.1 Schnell. Store in website/public/images/keyframes/.");
body += bullet("STEP 4: Generate Shot 1 (4.0s) Video — Feed Keyframe 1 into Veo 3.1 Fast or Gemini Omni Flash as start frame with Prompt 2 (Motion & camera vector).");
body += bullet("STEP 5: Extract Tail Frame for Shot 2 Chaining — Extract final frame of Shot 1 using FFmpeg (-sseof -0.1). Save to website/public/images/tails/.");
body += bullet("STEP 6: Generate Shot 2 (6.0s) Video — Pass extracted tail frame as starting frame for Shot 2 to guarantee zero visual jump or identity drift across cut.");
body += bullet("STEP 7: Repeat for Scenes 2 through 6 — Produce all 12 shots following the exact 4s+6s chained formula.");
body += bullet("STEP 8: Final Master Concat & Audio Sidechain Ducking — Stitch all 12 clips into 60.0s master and duck music bed by -12dB under voiceover.");

// Section 4: Prompt Architecture & Example
body += p("4. Concrete Prompt Suite for Scene 1 (The Hook)", { bold: true, size: 28, color: "1E1B4B", spaceBefore: 200, spaceAfter: 80 });
body += p("Shot 1 (4.0s) — Establishing Keyframe Image (Prompt 1):");
body += code(`Photorealistic cinematic commercial studio footage, crisp 35mm finish. Close-up of one frosted glass perfume bottle with fluted brass cap resting on wet obsidian slate, soft natural side-lighting from top-left, warm amber, matte black, and brass color anchors, shallow depth of field, vertical 9:16 frame.`);
body += p("Shot 1 (4.0s) — Video Motion & Audio (Prompt 2):");
body += code(`Slow micro push-in. A single water droplet glides down the curve of the bottle, catching golden light, then settles onto the dark stone. Ends with the bottle held still and centered. Audio: Soft water droplet drip, quiet studio silence, no music, no subtitles.`);

body += p("Shot 2 (6.0s) — Continuity Chained from Shot 1 Tail Frame:");
body += code(`Slow smooth 45-degree orbit around the bottle. Gentle wafts of pale golden mist drift smoothly from behind the bottle across the base, light rays scatter through mist, fluted brass cap gleams. Ends with bottle standing proud and centered. Audio: Low elegant sub-bass swell, soft airy breeze whoosh, voiceover begins: "Pure essence, redefined." no subtitles.`);

// Section 5: Automated FFmpeg Concat Commands
body += p("5. Automated FFmpeg Assembly Script for 60-Second Master", { bold: true, size: 28, color: "1E1B4B", spaceBefore: 200, spaceAfter: 80 });
body += p("To assemble all 6 scenes (12 shots) into a seamless 60.0s master video with audio ducking, execute:");
body += code(`# 1. Create file list
cat <<EOF > 60s_scenes.txt
file 'P01_S01_SH1.mp4'
file 'P01_S01_SH2.mp4'
file 'P01_S02_SH1.mp4'
file 'P01_S02_SH2.mp4'
file 'P01_S03_SH1.mp4'
file 'P01_S03_SH2.mp4'
file 'P01_S04_SH1.mp4'
file 'P01_S04_SH2.mp4'
file 'P01_S05_SH1.mp4'
file 'P01_S05_SH2.mp4'
file 'P01_S06_SH1.mp4'
file 'P01_S06_SH2.mp4'
EOF

# 2. Concat 12 shots losslessly into 60-second video
ffmpeg -y -f concat -safe 0 -i 60s_scenes.txt -c copy P01_Master_60s_video.mp4

# 3. Mix background music bed with -12dB voiceover ducking
ffmpeg -y -i P01_Master_60s_video.mp4 -i full_voiceover.wav -i ambient_music.mp3 \\
-filter_complex "[1:a]volume=1.0[vo];[2:a]volume=0.25[bg];[bg][vo]amix=inputs=2:duration=first[aout]" \\
-map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 192k website/public/renders/P01_Master_60s_Final.mp4`);

// Build and Save to Desktop
const fullDocXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>${body}</w:body>
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

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), '1min_guide_'));
fs.mkdirSync(path.join(tempDir, '_rels'), { recursive: true });
fs.mkdirSync(path.join(tempDir, 'word'), { recursive: true });

fs.writeFileSync(path.join(tempDir, '[Content_Types].xml'), contentTypesXml, 'utf8');
fs.writeFileSync(path.join(tempDir, '_rels', '.rels'), relsXml, 'utf8');
fs.writeFileSync(path.join(tempDir, 'word', 'document.xml'), fullDocXml, 'utf8');

const desktopPath = path.join(os.homedir(), 'Desktop');
const destDocxDesktop = path.join(desktopPath, '1-Minute Video Production Master Blueprint & Flowchart.docx');
const destDocxWs = path.join(__dirname, '1-Minute Video Production Master Blueprint & Flowchart.docx');

if (fs.existsSync(destDocxDesktop)) fs.unlinkSync(destDocxDesktop);
if (fs.existsSync(destDocxWs)) fs.unlinkSync(destDocxWs);

execSync(`powershell -NoProfile -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('${tempDir}', '${destDocxDesktop}')"`);
fs.copyFileSync(destDocxDesktop, destDocxWs);
fs.rmSync(tempDir, { recursive: true, force: true });

console.log('Successfully generated 1-Minute Master Guide on Desktop:', destDocxDesktop);
console.log('Successfully mirrored to Workspace:', destDocxWs);
