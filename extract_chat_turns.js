const fs = require('fs');
const readline = require('readline');

const fullLogPath = 'C:\\Users\\hp\\.gemini\\antigravity\\brain\\b9c23dfd-c320-4e9c-b073-ba3c070dd672\\.system_generated\\logs\\transcript_full.jsonl';
const fileStream = fs.createReadStream(fullLogPath);
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

const entries = [];

rl.on('line', (line) => {
  if (!line.trim()) return;
  const obj = JSON.parse(line);
  if (obj.type === 'USER_INPUT') {
    let content = obj.content || '';
    if (content.includes('<USER_REQUEST>')) {
      const start = content.indexOf('<USER_REQUEST>') + '<USER_REQUEST>'.length;
      const end = content.indexOf('</USER_REQUEST>');
      if (end !== -1) {
        content = content.substring(start, end).trim();
      }
    }
    entries.push({
      role: 'user',
      timestamp: obj.created_at,
      content: content
    });
  } else if (obj.type === 'PLANNER_RESPONSE' && obj.content) {
    entries.push({
      role: 'assistant',
      timestamp: obj.created_at,
      content: obj.content
    });
  }
});

rl.on('close', () => {
  console.log('Total extracted entries:', entries.length);
  entries.forEach((e, idx) => {
    console.log(`[#${idx+1}] ${e.role.toUpperCase()} (${e.timestamp}) — Length: ${e.content.length} chars`);
    console.log(`     Preview: ${e.content.substring(0, 100).replace(/\r?\n/g, ' ')}...\n`);
  });
});
