const fs = require('fs');
const path = 'self reserch with video/website/public/index.html';
let html = fs.readFileSync(path, 'utf8');

// 1. Update the Header HTML with the Hamburger Menu Button
const oldHeaderStart = `  <!-- ==================== TOP NAVIGATION BAR ==================== -->
  <header class="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-50">
    <!-- Main Top Row -->
    <div class="px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 max-w-full">
      <!-- Left: Brand Logo & Title -->
      <div class="flex items-center space-x-2 sm:space-x-3 shrink-0">
        <div class="flex items-center space-x-2 cursor-pointer" onclick="showWelcomeModal()">`;

const newHeaderStart = `  <!-- ==================== TOP NAVIGATION BAR ==================== -->
  <header class="bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs sticky top-0 z-40">
    <!-- Main Top Row -->
    <div class="px-3 sm:px-4 lg:px-6 h-14 sm:h-16 flex items-center justify-between gap-3 max-w-full">
      <!-- Left: Hamburger Menu & Brand Logo -->
      <div class="flex items-center space-x-2.5 sm:space-x-3.5 shrink-0">
        <!-- Hamburger Icon Button -->
        <button onclick="toggleHamburgerMenu()" id="hamburger-menu-btn" class="w-9 h-9 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 active:scale-95" title="Open Studio Menu & Tools">
          <i class="fa-solid fa-bars text-sm"></i>
        </button>

        <!-- Brand Logo & Home Trigger -->
        <div class="flex items-center space-x-2.5 cursor-pointer" onclick="showWelcomeModal()">`;

html = html.replace(oldHeaderStart, newHeaderStart);

// 2. Add the Executive Hamburger Slide-over Drawer HTML before the </body> tag or right after <header>
const drawerHtml = `
  <!-- ==================== EXECUTIVE HAMBURGER SLIDE-OVER DRAWER ==================== -->
  <div id="hamburger-drawer-overlay" class="hidden fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 transition-opacity" onclick="toggleHamburgerMenu()"></div>
  <aside id="hamburger-drawer" class="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white border-r border-slate-200 z-50 shadow-2xl flex flex-col justify-between transform -translate-x-full transition-transform duration-300 ease-in-out">
    <!-- Drawer Header -->
    <div class="p-4 border-b border-slate-100 flex items-center justify-between">
      <div class="flex items-center space-x-2.5">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-sm">
          <i class="fa-solid fa-play text-xs ml-0.5"></i>
        </div>
        <div>
          <div class="font-flow font-extrabold text-sm text-slate-900 tracking-tight">DDMAI<span class="text-indigo-600">.VIDEO</span></div>
          <div class="text-[10px] font-mono text-emerald-600 font-semibold">v3.0 Executive Studio</div>
        </div>
      </div>
      <button onclick="toggleHamburgerMenu()" class="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition">
        <i class="fa-solid fa-xmark text-sm"></i>
      </button>
    </div>

    <!-- Drawer Navigation Content -->
    <div class="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
      <!-- Section 1: Core Navigation -->
      <div>
        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">Studio Workspace</div>
        <div class="space-y-1">
          <a href="#" onclick="toggleHamburgerMenu()" class="flex items-center space-x-2.5 px-3 py-2 rounded-xl bg-indigo-50 text-indigo-900 font-semibold border border-indigo-200/60">
            <i class="fa-solid fa-clapperboard text-indigo-600 w-4"></i>
            <span>Active Scene Studio</span>
          </a>
          <button onclick="openAdminModal(); toggleHamburgerMenu();" class="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition text-left">
            <i class="fa-solid fa-shield-halved text-rose-600 w-4"></i>
            <span>Admin Command Center</span>
          </button>
          <button onclick="openCertificateModal(); toggleHamburgerMenu();" class="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition text-left">
            <i class="fa-solid fa-graduation-cap text-amber-600 w-4"></i>
            <span>Director Certificates</span>
          </button>
        </div>
      </div>

      <!-- Section 2: AI Production Tools -->
      <div>
        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">AI Production Tools</div>
        <div class="space-y-1">
          <button onclick="openToolsModal(); toggleHamburgerMenu();" class="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition text-left">
            <i class="fa-solid fa-sliders text-cyan-600 w-4"></i>
            <span>FX Tools &amp; Shader Bento</span>
          </button>
          <button onclick="openOptionsModal(); toggleHamburgerMenu();" class="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition text-left">
            <i class="fa-solid fa-cube text-purple-600 w-4"></i>
            <span>50 Platform Options</span>
          </button>
          <button onclick="openApiKeysModal(); toggleHamburgerMenu();" class="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition text-left">
            <i class="fa-solid fa-key text-amber-600 w-4"></i>
            <span>API Keys &amp; Model Credentials</span>
          </button>
        </div>
      </div>

      <!-- Section 3: Presets & 2D Documentary Rules -->
      <div>
        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">Production Blueprints</div>
        <div class="space-y-1">
          <button onclick="applyFlowPreset('2d_spy'); toggleHamburgerMenu();" class="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-amber-50 text-amber-900 font-medium transition text-left">
            <i class="fa-solid fa-user-secret text-amber-600 w-4"></i>
            <span>2D Spy Documentary (Noir)</span>
          </button>
          <button onclick="applyFlowPreset('perfume'); toggleHamburgerMenu();" class="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition text-left">
            <i class="fa-solid fa-spray-can-sparkles text-pink-600 w-4"></i>
            <span>Perfume Commercial (10s)</span>
          </button>
          <button onclick="applyFlowPreset('ugc'); toggleHamburgerMenu();" class="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition text-left">
            <i class="fa-brands fa-tiktok text-purple-600 w-4"></i>
            <span>UGC TikTok Reel</span>
          </button>
        </div>
      </div>

      <!-- Section 4: Quick Toggles -->
      <div>
        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">Quick Settings</div>
        <div class="space-y-1">
          <button onclick="toggleFlowAgentMode()" class="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition">
            <div class="flex items-center space-x-2.5">
              <i class="fa-solid fa-wand-magic-sparkles text-indigo-600 w-4"></i>
              <span>Conversational Agent</span>
            </div>
            <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">ON</span>
          </button>
          <button onclick="toggleTheme()" class="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition">
            <div class="flex items-center space-x-2.5">
              <i class="fa-solid fa-sun text-amber-500 w-4"></i>
              <span>Light Theme</span>
            </div>
            <span class="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Active</span>
          </button>
          <button onclick="showWelcomeModal(); toggleHamburgerMenu();" class="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition text-left">
            <i class="fa-solid fa-circle-question text-indigo-600 w-4"></i>
            <span>Interactive Tour &amp; Help</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Drawer Footer -->
    <div class="p-4 border-t border-slate-100 bg-slate-50/50">
      <div class="flex items-center justify-between text-xs">
        <div class="flex items-center space-x-2">
          <div class="w-7 h-7 rounded-lg bg-rose-600 text-white font-bold text-xs flex items-center justify-center">V</div>
          <div class="truncate max-w-[140px]">
            <div class="font-bold text-slate-800 text-[11px] truncate">Veteran, PankajBhai</div>
            <div class="text-[9px] text-slate-500 font-mono">SuperAdmin</div>
          </div>
        </div>
        <button onclick="currentUser ? handleUserLogout() : openAuthModal(); toggleHamburgerMenu();" class="text-[11px] text-rose-600 hover:underline font-semibold">
          Logout
        </button>
      </div>
    </div>
  </aside>
`;

html = html.replace('</header>', `</header>\n${drawerHtml}`);

// 3. Add toggleHamburgerMenu JS function
const jsFunction = `
    // Hamburger Drawer Navigation Toggle
    function toggleHamburgerMenu() {
      const drawer = document.getElementById('hamburger-drawer');
      const overlay = document.getElementById('hamburger-drawer-overlay');
      if (!drawer || !overlay) return;
      const isOpen = !drawer.classList.contains('-translate-x-full');
      if (isOpen) {
        drawer.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
      } else {
        drawer.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
      }
    }

    // Close drawer on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const drawer = document.getElementById('hamburger-drawer');
        const overlay = document.getElementById('hamburger-drawer-overlay');
        if (drawer && !drawer.classList.contains('-translate-x-full')) {
          drawer.classList.add('-translate-x-full');
          if (overlay) overlay.classList.add('hidden');
        }
      }
    });
`;

html = html.replace('    function initTheme() {', `${jsFunction}\n    function initTheme() {`);

fs.writeFileSync(path, html, 'utf8');
console.log('Successfully added Hamburger icon in header and executive slide-over drawer!');
