const fs = require('fs');
const readline = require('readline');

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
    if (str.includes('<SYSTEM_MESSAGE>')) {
      // Injected system messages can be labeled as system events
    }
  }
  return str.trim();
}

const fullLogPath = 'C:\\Users\\hp\\.gemini\\antigravity\\brain\\b9c23dfd-c320-4e9c-b073-ba3c070dd672\\.system_generated\\logs\\transcript_full.jsonl';
const fileStream = fs.createReadStream(fullLogPath);
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

const turns = [];
let idx = 0;

rl.on('line', (line) => {
  if (!line.trim()) return;
  const obj = JSON.parse(line);
  if (obj.type === 'USER_INPUT') {
    idx++;
    const cleaned = cleanContent(obj.content, 'user');
    turns.push({
      turn: idx,
      role: 'USER',
      timestamp: obj.created_at,
      content: cleaned
    });
  } else if (obj.type === 'PLANNER_RESPONSE' && obj.content) {
    idx++;
    turns.push({
      turn: idx,
      role: 'ANTIGRAVITY (AI ASSISTANT)',
      timestamp: obj.created_at,
      content: obj.content.trim()
    });
  }
});

rl.on('close', () => {
  console.log(`Successfully parsed ${turns.length} interaction turns.`);
  const sample = turns[0];
  console.log(`First turn: [${sample.role}] ${sample.content.substring(0, 100)}...`);
  const last = turns[turns.length - 1];
  console.log(`Last turn: [${last.role}] ${last.content}...`);
});
