const fs = require('fs');
const html = fs.readFileSync('self reserch with video/website/public/index.html', 'utf8');

const regex = /class="[^"]*(?:bg-\[#(?:0|1|2)[0-9a-fA-F]{5}\]|bg-black|bg-slate-900|bg-slate-950|from-indigo-950|from-slate-900|bg-gray-900|bg-gray-800)[^"]*"/g;

let matches = [];
let match;
while ((match = regex.exec(html)) !== null) {
  const lineNo = html.substring(0, match.index).split('\n').length;
  matches.push({ line: lineNo, text: match[0].substring(0, 100) });
}

console.log('Total dark class elements found:', matches.length);
matches.forEach(m => console.log('Line ' + m.line + ': ' + m.text));
