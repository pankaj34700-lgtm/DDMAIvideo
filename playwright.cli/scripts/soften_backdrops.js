const fs = require('fs');
const path = 'self reserch with video/website/public/index.html';
let html = fs.readFileSync(path, 'utf8');

html = html.replaceAll('bg-slate-900/30 backdrop-blur-sm', 'bg-slate-500/20 backdrop-blur-sm');

fs.writeFileSync(path, html, 'utf8');
console.log('Replaced modal backdrops with ultra-clean frosted veil');
