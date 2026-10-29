const fs = require('fs');
const path = 'self reserch with video/website/public/index.html';
let html = fs.readFileSync(path, 'utf8');

// 1. Update initial script in head to force light mode
html = html.replace(
  /<script>\(function\(\)\{\s*try\s*\{\s*const t = localStorage\.getItem\('ddmai_theme'\) \|\| 'light'; if\(t === 'light'\) document\.documentElement\.classList\.add\('theme-light'\); \} catch\(e\)\{\} \}\)\(\);<\/script>/,
  `<script>(function(){ try { document.documentElement.classList.add('theme-light'); localStorage.setItem('ddmai_theme', 'light'); } catch(e){} })();</script>`
);

// 2. Welcome Banner
html = html.replace(
  'class="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30 flex items-center justify-between relative shadow-xl"',
  'class="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border border-indigo-200 flex items-center justify-between relative shadow-sm"'
);
html = html.replace(
  'class="w-11 h-11 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300 text-lg shadow-inner"',
  'class="w-11 h-11 rounded-2xl bg-indigo-100 border border-indigo-300 flex items-center justify-center text-indigo-700 text-lg shadow-xs"'
);
html = html.replace(
  'class="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono"',
  'class="px-2 py-0.5 rounded text-[10px] bg-indigo-100 text-indigo-700 border border-indigo-300 font-mono font-semibold"'
);
html = html.replace(
  'class="hidden sm:inline-flex px-3 py-1.5 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/40 text-xs font-semibold items-center space-x-1.5 transition"',
  'class="hidden sm:inline-flex px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-semibold items-center space-x-1.5 transition shadow-xs"'
);

// 3. Prompt Box Action buttons
html = html.replace(
  'class="bg-slate-100 hover:bg-[#222636] border border-slate-300 text-slate-700 font-medium text-xs px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5"',
  'class="bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-medium text-xs px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 shadow-xs"'
);

// 4. Prompt 1 & 2 Cards & links
html = html.replace(
  'class="bg-slate-100 hover:bg-[#222636] text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center space-x-1.5"',
  'class="bg-white hover:bg-slate-100 text-amber-800 border border-amber-300 px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 shadow-xs"'
);
html = html.replace(
  'class="bg-slate-100 hover:bg-[#222636] text-cyan-300 border border-cyan-500/30 px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center space-x-1.5"',
  'class="bg-white hover:bg-slate-100 text-cyan-800 border border-cyan-300 px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 shadow-xs"'
);
html = html.replace(
  'class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono"',
  'class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 font-mono"'
);
html = html.replace(
  'class="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono"',
  'class="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-300 font-mono"'
);
html = html.replace(
  'class="px-2 py-0.5 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition flex items-center space-x-1"',
  'class="px-2 py-0.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 transition flex items-center space-x-1"'
);
html = html.replace(
  'class="px-2 py-0.5 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition flex items-center space-x-1"',
  'class="px-2 py-0.5 rounded-md bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-300 transition flex items-center space-x-1"'
);

// Replace external link badges
html = html.replaceAll(
  'class="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-800 border border-slate-700 transition flex items-center space-x-1"',
  'class="px-2 py-0.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition flex items-center space-x-1 shadow-xs"'
);

// 5. Media Monitor Viewport & Overlays
html = html.replace(
  'class="relative w-full aspect-video max-h-[360px] bg-[#07080c] border border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center group shadow-inner"',
  'class="relative w-full aspect-video max-h-[360px] bg-slate-100 border border-slate-300 rounded-2xl overflow-hidden flex items-center justify-center group shadow-xs"'
);
html = html.replace(
  'class="w-16 h-16 mx-auto rounded-2xl bg-indigo-950/50 border border-indigo-700/40 flex items-center justify-center text-indigo-400 text-2xl shadow-lg"',
  'class="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 text-2xl shadow-xs"'
);
html = html.replace(
  'class="inline-flex items-center space-x-2 text-[11px] font-mono text-amber-300 bg-amber-950/40 border border-amber-600/30 px-3 py-1 rounded-lg"',
  'class="inline-flex items-center space-x-2 text-[11px] font-mono text-amber-800 bg-amber-50 border border-amber-300 px-3 py-1 rounded-lg"'
);
html = html.replace(
  'class="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/50 text-[10px] text-slate-700 font-mono flex items-center space-x-1.5"',
  'class="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-300 text-[10px] text-slate-800 font-mono flex items-center space-x-1.5 shadow-sm"'
);
html = html.replace(
  'class="bg-black/80 hover:bg-black text-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs flex items-center space-x-1.5 backdrop-blur-sm"',
  'class="bg-white hover:bg-slate-50 text-slate-800 px-3 py-1.5 rounded-lg border border-slate-300 text-xs flex items-center space-x-1.5 shadow-sm"'
);

// 6. Timeline Shot Card
html = html.replace(
  'class="w-full bg-gradient-to-r from-amber-900/40 via-indigo-900/50 to-purple-900/50 border border-amber-500/40 rounded-xl p-2.5 flex flex-col justify-between relative group hover:border-amber-400 transition"',
  'class="w-full bg-gradient-to-r from-amber-50 via-indigo-50 to-purple-50 border border-amber-300 rounded-xl p-2.5 flex flex-col justify-between relative group hover:border-amber-400 transition shadow-xs"'
);
html = html.replace(
  '<span class="font-bold text-amber-300">SH01: Damascus Presidential Reception (Two Figures)</span>',
  '<span class="font-bold text-amber-900">SH01: Damascus Presidential Reception (Two Figures)</span>'
);

// 7. Modals: Eliminate all dark backdrops
html = html.replaceAll('bg-black/85 backdrop-blur-md', 'bg-slate-900/30 backdrop-blur-sm');
html = html.replaceAll('bg-black/90 backdrop-blur-md', 'bg-slate-900/30 backdrop-blur-sm');
html = html.replaceAll('bg-black/80 backdrop-blur-sm', 'bg-slate-900/30 backdrop-blur-sm');

// 8. Certificate Modal Container & Buttons
html = html.replace(
  'class="bg-[#0f172a] border-2 border-amber-500/60 rounded-3xl w-full max-w-4xl p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto"',
  'class="bg-white border-2 border-amber-400 rounded-3xl w-full max-w-4xl p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto"'
);
html = html.replace(
  'class="px-3 py-1.5 rounded-xl bg-[#1e293b] hover:bg-[#334155] text-amber-300 text-xs font-semibold border border-amber-500/30 transition"',
  'class="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-300 transition"'
);

// 9. Modal close button hovers
html = html.replaceAll('hover:bg-[#1f2330]', 'hover:bg-slate-100');
html = html.replaceAll('hover:text-white', 'hover:text-slate-900');
html = html.replace('bg-[#202433] text-slate-700', 'bg-slate-100 text-slate-700');

// 10. User Dashboard & Auth
html = html.replace(
  'class="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/40 text-red-300 text-xs font-semibold transition"',
  'class="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 text-xs font-semibold transition"'
);

// 11. Toast Notifications Function: Clean Light Theme Toasts
const oldToast = `    function showToast(msg, type = 'info') {
      const container = document.getElementById('toast-container');
      if (!container) return;
      container.innerHTML = ''; // Prevent stacking toasts!
      const toast = document.createElement('div');
      const bg = type === 'success' ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200' :
                 type === 'error' ? 'bg-rose-950/90 border-rose-500 text-rose-200' :
                 'bg-indigo-950/90 border-indigo-500 text-indigo-200';
      toast.className = \`p-3 rounded-2xl border \${bg} shadow-2xl backdrop-blur-md text-xs font-semibold flex items-center space-x-2 transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-auto\`;
      toast.innerHTML = \`<i class="fa-solid fa-circle-info"></i><span>\${msg}</span>\`;`;

const newToast = `    function showToast(msg, type = 'info') {
      const container = document.getElementById('toast-container');
      if (!container) return;
      container.innerHTML = ''; // Prevent stacking toasts!
      const toast = document.createElement('div');
      const bg = type === 'success' ? 'bg-white border-2 border-emerald-500 text-emerald-900 shadow-xl' :
                 type === 'error' ? 'bg-white border-2 border-rose-500 text-rose-900 shadow-xl' :
                 'bg-white border-2 border-indigo-500 text-indigo-900 shadow-xl';
      toast.className = \`p-3 rounded-2xl border \${bg} text-xs font-bold flex items-center space-x-2 transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-auto\`;
      toast.innerHTML = \`<i class="fa-solid fa-circle-info text-indigo-600"></i><span>\${msg}</span>\`;`;

html = html.replace(oldToast, newToast);

// 12. Theme JS Logic: Permanently enforce light theme and prevent reverting
const oldThemeLogic = `    function initTheme() {
      // Default to 'light' theme as user requested, or load saved preference
      const savedTheme = localStorage.getItem('ddmai_theme') || 'light';
      applyTheme(savedTheme);
    }

    function toggleTheme() {
      const isLight = document.body.classList.contains('theme-light') || document.documentElement.classList.contains('theme-light');
      const nextTheme = isLight ? 'dark' : 'light';
      applyTheme(nextTheme);
      showToast(nextTheme === 'light' ? "☀️ Clean Light Theme Activated" : "🌙 Dark Theme Activated", 'info');
    }

    function applyTheme(theme) {
      const body = document.body;
      const html = document.documentElement;
      const icon = document.getElementById('theme-toggle-icon');
      const label = document.getElementById('theme-toggle-label');
      const btn = document.getElementById('theme-toggle-btn');

      if (theme === 'light') {
        body.classList.add('theme-light');
        html.classList.add('theme-light');
        localStorage.setItem('ddmai_theme', 'light');
        if (icon) icon.className = "fa-solid fa-moon text-indigo-600 text-xs";
        if (label) label.textContent = "Dark Mode";
        if (btn) btn.className = "px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-semibold transition flex items-center space-x-1.5 shadow-sm text-xs";
      } else {
        body.classList.remove('theme-light');
        html.classList.remove('theme-light');
        localStorage.setItem('ddmai_theme', 'dark');
        if (icon) icon.className = "fa-solid fa-sun text-amber-400 text-xs";
        if (label) label.textContent = "Light Mode";
        if (btn) btn.className = "px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-amber-300 font-semibold transition flex items-center space-x-1.5 shadow-sm text-xs";
      }
    }`;

const newThemeLogic = `    function initTheme() {
      // Enforce permanent clean Light Theme everywhere
      applyTheme('light');
    }

    function toggleTheme() {
      const current = localStorage.getItem('ddmai_theme');
      const nextTheme = current === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
      showToast("☀️ Clean Light Studio Active", 'info');
    }

    function applyTheme(theme) {
      const body = document.body;
      const html = document.documentElement;
      const icon = document.getElementById('theme-toggle-icon');
      const label = document.getElementById('theme-toggle-label');
      const btn = document.getElementById('theme-toggle-btn');

      // Keep light theme classes ALWAYS active to guarantee pure light background
      body.classList.add('theme-light');
      html.classList.add('theme-light');
      localStorage.setItem('ddmai_theme', theme);

      if (icon) icon.className = "fa-solid fa-sun text-amber-500 text-xs";
      if (label) label.textContent = "Light Studio";
      if (btn) btn.className = "px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold transition flex items-center space-x-1.5 shadow-sm text-xs";
    }`;

html = html.replace(oldThemeLogic, newThemeLogic);

fs.writeFileSync(path, html, 'utf8');
console.log('Successfully applied all light transformations to index.html!');
