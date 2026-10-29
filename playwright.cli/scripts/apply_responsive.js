const fs = require('fs');
const path = 'self reserch with video/website/public/index.html';
let html = fs.readFileSync(path, 'utf8');

// 1. Add global responsive CSS styles in <style>
const responsiveCss = `
    /* Responsive Global Safeguards */
    html, body {
      overflow-x: hidden !important;
      max-width: 100vw !important;
    }
    
    /* Smooth horizontal scrollbar hiding for swipeable pill bars */
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    /* Modal maximum width safety on all mobile screens */
    @media (max-width: 640px) {
      .modal-responsive-card {
        max-width: calc(100vw - 1rem) !important;
        margin: 0.5rem auto !important;
        padding: 1rem !important;
      }
      #printable-certificate {
        padding: 1rem !important;
        border-width: 4px !important;
      }
      #cert-display-name {
        font-size: 1.25rem !important;
        line-height: 1.5rem !important;
        padding-left: 0.5rem !important;
        padding-right: 0.5rem !important;
      }
    }
`;

html = html.replace('</style>', `${responsiveCss}\n  </style>`);

// 2. Transform the Top Header to be fully responsive
const oldHeader = `  <!-- ==================== TOP NAVIGATION BAR ==================== -->
  <header class="bg-white border-b border-slate-200 shadow-xs px-4 lg:px-6 py-2.5 flex items-center justify-between sticky top-0 z-50">
    <!-- Left: Brand Logo & Title -->
    <div class="flex items-center space-x-4">
      <div class="flex items-center space-x-2.5 cursor-pointer" onclick="showWelcomeModal()">
        <!-- DDMAI Studio Prism Icon -->
        <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
          <i class="fa-solid fa-play text-xs ml-0.5"></i>
        </div>
        <div class="flex items-center space-x-2">
          <span class="font-flow font-extrabold text-base tracking-tight text-slate-900">DDMAI<span class="text-indigo-600">.VIDEO</span></span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>$0.00 ZERO-COST MODE</span>
          </span>
        </div>
      </div>

      <!-- Project Breadcrumb & Session Selector -->
      <div class="hidden xl:flex items-center space-x-2 pl-4 border-l border-slate-200 text-xs">
        <span class="text-slate-500">Project /</span>
        <select class="bg-slate-100 text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1 text-xs outline-none focus:border-indigo-500 font-medium">
          <option>2D Animated Spy Documentary (Eli Cohen)</option>
          <option>Commercial Campaign 2026 (10s Scenes)</option>
          <option>TikTok UGC Skincare Reel</option>
          <option>Sci-Fi Short Movie Teaser</option>
          <option>+ Create New Project Session</option>
        </select>
      </div>
    </div>

    <!-- Center/Right: Studio Tools & Control Buttons -->
    <div class="flex items-center space-x-2.5 text-xs">
      <!-- Agent Toggle Switch -->
      <button onclick="toggleFlowAgentMode()" id="flow-agent-toggle" class="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/25 transition">
        <i class="fa-solid fa-wand-magic-sparkles text-xs"></i>
        <span>DDMAI Agent: <strong>ON</strong></span>
      </button>

      <!-- Advanced DDMAI Tools Drawer Trigger -->
      <button onclick="openToolsModal()" class="hidden md:flex px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-medium transition items-center space-x-1.5">
        <i class="fa-solid fa-sliders text-cyan-400"></i>
        <span>FX Tools</span>
      </button>

      <!-- 50 Options Matrix -->
      <button onclick="openOptionsModal()" class="hidden sm:flex px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-medium transition items-center space-x-1.5">
        <i class="fa-solid fa-cube text-purple-400"></i>
        <span>50 Options</span>
      </button>

      <!-- API Keys Manager Trigger -->
      <button onclick="openApiKeysModal()" class="px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-300 font-medium transition flex items-center space-x-1.5 shadow-sm shadow-amber-500/10">
        <i class="fa-solid fa-key text-amber-400 text-xs"></i>
        <span class="hidden sm:inline">API Keys</span>
      </button>

      <!-- Certificate System Button -->
      <button onclick="openCertificateModal()" class="px-3 py-1.5 rounded-xl bg-amber-100/70 hover:bg-amber-200/80 border border-amber-300 text-amber-900 font-medium transition flex items-center space-x-1.5 shadow-sm">
        <i class="fa-solid fa-award text-yellow-400 text-xs"></i>
        <span class="hidden md:inline">Certificates</span>
      </button>

      <!-- ADMIN PANEL BUTTON (HIGHLIGHTED) -->
      <button onclick="openAdminModal()" id="admin-panel-btn" class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 text-white font-bold transition flex items-center space-x-1.5 shadow-md shadow-rose-600/25 border border-rose-400/30">
        <i class="fa-solid fa-shield-halved text-xs"></i>
        <span>Admin Panel</span>
      </button>

      <!-- THEME TOGGLE BUTTON (LIGHT / DARK SWITCH) -->
      <button onclick="toggleTheme()" id="theme-toggle-btn" class="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-amber-300 font-semibold transition flex items-center space-x-1.5 shadow-sm text-xs" title="Toggle Clean Light Theme / Dark Mode">
        <i id="theme-toggle-icon" class="fa-solid fa-sun text-amber-400 text-xs"></i>
        <span id="theme-toggle-label" class="hidden sm:inline">Light Mode</span>
      </button>

      <!-- USER LOGIN / DASHBOARD BUTTON -->
      <div id="user-nav-container">
        <!-- Dynamically rendered based on login status -->
        <button onclick="openAuthModal()" id="login-nav-btn" class="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3.5 py-1.5 rounded-xl shadow-md transition flex items-center space-x-1.5">
          <i class="fa-regular fa-user text-xs"></i>
          <span>Sign In</span>
        </button>
      </div>

      <!-- Welcome Tour Quick Trigger -->
      <button onclick="showWelcomeModal()" title="Welcome Tour & Info" class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition">
        <i class="fa-solid fa-circle-question text-xs"></i>
      </button>
    </div>
  </header>`;

const newHeader = `  <!-- ==================== TOP NAVIGATION BAR ==================== -->
  <header class="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-50">
    <!-- Main Top Row -->
    <div class="px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 max-w-full">
      <!-- Left: Brand Logo & Title -->
      <div class="flex items-center space-x-2 sm:space-x-3 shrink-0">
        <div class="flex items-center space-x-2 cursor-pointer" onclick="showWelcomeModal()">
          <!-- DDMAI Studio Prism Icon -->
          <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 shrink-0">
            <i class="fa-solid fa-play text-xs ml-0.5"></i>
          </div>
          <div class="flex items-center space-x-1.5 sm:space-x-2">
            <span class="font-flow font-extrabold text-sm sm:text-base tracking-tight text-slate-900 whitespace-nowrap">DDMAI<span class="text-indigo-600">.VIDEO</span></span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center space-x-1 shrink-0 whitespace-nowrap">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>$0.00 ZERO-COST MODE</span>
            </span>
          </div>
        </div>

        <!-- Project Breadcrumb & Session Selector (2xl screens only to avoid pushing header) -->
        <div class="hidden 2xl:flex items-center space-x-2 pl-3 border-l border-slate-200 text-xs">
          <span class="text-slate-500">Project /</span>
          <select class="bg-slate-100 text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1 text-xs outline-none focus:border-indigo-500 font-medium max-w-[200px] truncate">
            <option>2D Animated Spy Documentary (Eli Cohen)</option>
            <option>Commercial Campaign 2026 (10s Scenes)</option>
            <option>TikTok UGC Skincare Reel</option>
            <option>Sci-Fi Short Movie Teaser</option>
          </select>
        </div>
      </div>

      <!-- Desktop Studio Tools (lg & xl screens) -->
      <div class="hidden lg:flex items-center space-x-1.5 xl:space-x-2 text-xs shrink-0">
        <!-- Agent Toggle Switch -->
        <button onclick="toggleFlowAgentMode()" id="flow-agent-toggle" class="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-600 text-white font-medium shadow-xs transition whitespace-nowrap">
          <i class="fa-solid fa-wand-magic-sparkles text-xs"></i>
          <span>DDMAI Agent: <strong>ON</strong></span>
        </button>

        <!-- FX Tools -->
        <button onclick="openToolsModal()" class="hidden xl:flex px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-medium transition items-center space-x-1.5 whitespace-nowrap">
          <i class="fa-solid fa-sliders text-cyan-600"></i>
          <span>FX Tools</span>
        </button>

        <!-- 50 Options -->
        <button onclick="openOptionsModal()" class="hidden xl:flex px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-medium transition items-center space-x-1.5 whitespace-nowrap">
          <i class="fa-solid fa-cube text-purple-600"></i>
          <span>50 Options</span>
        </button>

        <!-- API Keys -->
        <button onclick="openApiKeysModal()" class="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 font-medium transition flex items-center space-x-1.5 shadow-xs whitespace-nowrap">
          <i class="fa-solid fa-key text-amber-600 text-xs"></i>
          <span>API Keys</span>
        </button>

        <!-- Certificate System Button -->
        <button onclick="openCertificateModal()" class="px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 font-medium transition flex items-center space-x-1.5 shadow-xs whitespace-nowrap">
          <i class="fa-solid fa-award text-amber-600 text-xs"></i>
          <span>Certificates</span>
        </button>

        <!-- ADMIN PANEL BUTTON -->
        <button onclick="openAdminModal()" id="admin-panel-btn" class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 text-white font-bold transition flex items-center space-x-1.5 shadow-xs whitespace-nowrap">
          <i class="fa-solid fa-shield-halved text-xs"></i>
          <span>Admin Panel</span>
        </button>

        <!-- THEME TOGGLE BUTTON -->
        <button onclick="toggleTheme()" id="theme-toggle-btn" class="px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold transition flex items-center space-x-1.5 shadow-xs text-xs whitespace-nowrap" title="Pure Light Theme Active">
          <i id="theme-toggle-icon" class="fa-solid fa-sun text-amber-500 text-xs"></i>
          <span id="theme-toggle-label">Light Studio</span>
        </button>

        <!-- USER LOGIN / DASHBOARD BUTTON -->
        <div id="user-nav-container" class="shrink-0">
          <button onclick="openAuthModal()" id="login-nav-btn" class="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-1.5 rounded-xl shadow-xs transition flex items-center space-x-1.5 whitespace-nowrap">
            <i class="fa-regular fa-user text-xs"></i>
            <span>Sign In</span>
          </button>
        </div>

        <!-- Welcome Tour Quick Trigger -->
        <button onclick="showWelcomeModal()" title="Welcome Tour & Info" class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition shrink-0">
          <i class="fa-solid fa-circle-question text-xs"></i>
        </button>
      </div>

      <!-- Right: Mobile & Tablet Compact Bar (< lg) -->
      <div class="flex lg:hidden items-center space-x-1.5 shrink-0 text-xs">
        <!-- Direct Admin Button for mobile -->
        <button onclick="openAdminModal()" class="px-2 py-1 rounded-lg bg-gradient-to-r from-red-600 to-indigo-600 text-white font-bold flex items-center space-x-1 shadow-xs text-[11px] whitespace-nowrap">
          <i class="fa-solid fa-shield-halved text-[10px]"></i>
          <span>Admin</span>
        </button>

        <!-- Direct Certificate Button for mobile -->
        <button onclick="openCertificateModal()" class="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 font-medium flex items-center space-x-1 text-[11px] whitespace-nowrap">
          <i class="fa-solid fa-award text-[10px]"></i>
          <span>Certs</span>
        </button>

        <!-- Direct User Profile for mobile -->
        <div id="user-nav-mobile" class="shrink-0" onclick="currentUser ? openUserDashboard() : openAuthModal()">
          <button class="w-7 h-7 rounded-lg bg-rose-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            V
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Swipeable Quick-Actions Strip (< lg) -->
    <div class="lg:hidden border-t border-slate-100 bg-slate-50/90 px-3 py-1.5 flex items-center space-x-2 overflow-x-auto no-scrollbar text-[11px] whitespace-nowrap">
      <button onclick="toggleFlowAgentMode()" class="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-medium flex items-center space-x-1 shadow-xs shrink-0">
        <i class="fa-solid fa-wand-magic-sparkles text-[9px]"></i>
        <span>Agent: ON</span>
      </button>

      <button onclick="openToolsModal()" class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium flex items-center space-x-1 shrink-0">
        <i class="fa-solid fa-sliders text-cyan-600 text-[10px]"></i>
        <span>FX Tools</span>
      </button>

      <button onclick="openOptionsModal()" class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium flex items-center space-x-1 shrink-0">
        <i class="fa-solid fa-cube text-purple-600 text-[10px]"></i>
        <span>50 Options</span>
      </button>

      <button onclick="openApiKeysModal()" class="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-300 text-amber-800 font-medium flex items-center space-x-1 shrink-0">
        <i class="fa-solid fa-key text-amber-600 text-[9px]"></i>
        <span>API Keys</span>
      </button>

      <button onclick="toggleTheme()" class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium flex items-center space-x-1 shrink-0">
        <i class="fa-solid fa-sun text-amber-500 text-[10px]"></i>
        <span>Light Mode</span>
      </button>

      <button onclick="showWelcomeModal()" class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium flex items-center space-x-1 shrink-0">
        <i class="fa-solid fa-circle-question text-indigo-600 text-[10px]"></i>
        <span>Tour</span>
      </button>
    </div>
  </header>`;

html = html.replace(oldHeader, newHeader);

// 3. Make Welcome Banner responsive
const oldWelcomeBanner = `<div id="welcome-banner" class="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border border-indigo-200 flex items-center justify-between relative shadow-sm">
        <div class="flex items-center space-x-4">
          <div class="w-11 h-11 rounded-2xl bg-indigo-100 border border-indigo-300 flex items-center justify-center text-indigo-700 text-lg shadow-xs">
            <i class="fa-solid fa-clapperboard"></i>
          </div>
          <div>
            <h2 class="text-sm sm:text-base font-flow font-extrabold text-slate-900 flex items-center space-x-2">
              <span>Welcome to DDMAI.VIDEO Studio v3.0!</span>
              <span class="px-2 py-0.5 rounded text-[10px] bg-indigo-100 text-indigo-700 border border-indigo-300 font-mono font-semibold">Academy Edition</span>
            </h2>
            <p class="text-xs text-slate-700 mt-0.5">
              Zero-cost AI video generation studio with built-in <strong>2D Noir Documentary Rules</strong>, <strong>User Login Dashboard</strong>, and <strong>Director Certification System</strong>.
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button onclick="openCertificateModal()" class="hidden sm:inline-flex px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-semibold items-center space-x-1.5 transition shadow-xs">
            <i class="fa-solid fa-graduation-cap"></i>
            <span>Earn Certificate</span>
          </button>
          <button onclick="dismissWelcomeBanner()" class="text-slate-500 hover:text-slate-900 p-1.5"><i class="fa-solid fa-xmark"></i></button>
        </div>
      </div>`;

const newWelcomeBanner = `<div id="welcome-banner" class="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative shadow-xs">
        <div class="flex items-start sm:items-center space-x-3 sm:space-x-4">
          <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-indigo-100 border border-indigo-300 flex items-center justify-center text-indigo-700 text-lg shadow-xs shrink-0 mt-0.5 sm:mt-0">
            <i class="fa-solid fa-clapperboard"></i>
          </div>
          <div class="flex-1">
            <h2 class="text-sm sm:text-base font-flow font-extrabold text-slate-900 flex flex-wrap items-center gap-1.5">
              <span>Welcome to DDMAI.VIDEO Studio v3.0!</span>
              <span class="px-2 py-0.5 rounded text-[10px] bg-indigo-100 text-indigo-700 border border-indigo-300 font-mono font-semibold">Academy Edition</span>
            </h2>
            <p class="text-xs text-slate-600 mt-0.5 leading-relaxed">
              Zero-cost AI video generation studio with built-in <strong>2D Noir Documentary Rules</strong>, <strong>User Login Dashboard</strong>, and <strong>Director Certification System</strong>.
            </p>
          </div>
        </div>
        <div class="flex items-center justify-between sm:justify-end space-x-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-indigo-100">
          <button onclick="openCertificateModal()" class="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-semibold flex items-center space-x-1.5 transition shadow-xs">
            <i class="fa-solid fa-graduation-cap"></i>
            <span>Earn Certificate</span>
          </button>
          <button onclick="dismissWelcomeBanner()" class="text-slate-400 hover:text-slate-700 p-1.5"><i class="fa-solid fa-xmark"></i></button>
        </div>
      </div>`;

html = html.replace(oldWelcomeBanner, newWelcomeBanner);

// 4. Make Prompt Box Header responsive
const oldPromptHeader = `        <!-- Prompt Box Top Header -->
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center space-x-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span class="font-flow font-bold text-slate-900 text-sm" id="prompt-box-mode-title">DDMAI.VIDEO Agent Prompt Box</span>
          </div>

          <div class="flex items-center space-x-2">
            <span class="text-[11px] text-slate-500">Aspect Ratio:</span>
            <select id="canvas-aspect" class="bg-slate-100 text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1 text-xs outline-none">
              <option value="16:9">16:9 Widescreen (YouTube / Doc)</option>
              <option value="9:16">9:16 Vertical (TikTok / Reels)</option>
              <option value="1:1">1:1 Square (Social Feed)</option>
              <option value="4:5">4:5 Portrait</option>
            </select>

            <span class="text-[11px] text-slate-500 ml-2">Scene Math:</span>
            <select id="scene-plan-select" class="bg-slate-100 text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1 text-xs outline-none font-mono">
              <option value="4.0s">4.0s Fast Punchy Hook</option>
              <option value="6.0s">6.0s Narrative Beat</option>
              <option value="4+6">4s + 6s = 10.0s Standard</option>
              <option value="10_native">10.0s Omni Native</option>
            </select>
          </div>
        </div>`;

const newPromptHeader = `        <!-- Prompt Box Top Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div class="flex items-center space-x-2 shrink-0">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span class="font-flow font-bold text-slate-900 text-sm" id="prompt-box-mode-title">DDMAI.VIDEO Agent Prompt Box</span>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <div class="flex items-center space-x-1.5">
              <span class="text-[11px] text-slate-500 whitespace-nowrap">Aspect:</span>
              <select id="canvas-aspect" class="bg-slate-100 text-slate-800 border border-slate-200 rounded-lg px-2 py-1 text-xs outline-none max-w-[130px] sm:max-w-none">
                <option value="16:9">16:9 (Doc/YT)</option>
                <option value="9:16">9:16 (TikTok)</option>
                <option value="1:1">1:1 (Square)</option>
                <option value="4:5">4:5 (Portrait)</option>
              </select>
            </div>

            <div class="flex items-center space-x-1.5">
              <span class="text-[11px] text-slate-500 whitespace-nowrap">Math:</span>
              <select id="scene-plan-select" class="bg-slate-100 text-slate-800 border border-slate-200 rounded-lg px-2 py-1 text-xs outline-none font-mono max-w-[130px] sm:max-w-none">
                <option value="4.0s">4.0s Fast Hook</option>
                <option value="6.0s">6.0s Narrative</option>
                <option value="4+6">4s + 6s Standard</option>
                <option value="10_native">10.0s Omni Native</option>
              </select>
            </div>
          </div>
        </div>`;

html = html.replace(oldPromptHeader, newPromptHeader);

// 5. Make Prompt Input bottom toolbar responsive
const oldPromptToolbar = `          <!-- Bottom Toolbar of Prompt Box (Flow Style) -->
          <div class="flex flex-wrap items-center justify-between gap-2.5 mt-3 pt-2 border-t border-slate-200">
            <!-- Quick References & Presets -->
            <div class="flex items-center space-x-2 text-xs">
              <button onclick="triggerIngredientUpload()" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[11px] flex items-center space-x-1.5 transition">
                <i class="fa-solid fa-paperclip text-slate-500"></i>
                <span>Attach Reference / Avatar</span>
              </button>

              <button onclick="applyFlowPreset('2d_spy')" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-amber-500/40 text-amber-300 text-[11px] font-semibold transition">
                + 2D Spy Documentary
              </button>
              <button onclick="applyFlowPreset('perfume')" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[11px] transition">
                + Perfume Commercial
              </button>
              <button onclick="applyFlowPreset('ugc')" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-pink-300 text-[11px] transition">
                + UGC TikTok
              </button>
            </div>

            <!-- Action Buttons: Split to Dual-Prompt or Conversational Edit -->
            <div class="flex items-center space-x-2">
              <button onclick="sendAgentChatMessage()" class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs px-4 py-1.5 rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center space-x-1.5">
                <i class="fa-solid fa-paper-plane text-xs"></i>
                <span>Ask / Run AI (Enter)</span>
              </button>
              <button onclick="executeFlowDecomposition()" class="bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-medium text-xs px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 shadow-xs">
                <i class="fa-solid fa-bolt text-amber-400"></i>
                <span>Generate (Zero-Cost Mode)</span>
              </button>
            </div>
          </div>`;

const newPromptToolbar = `          <!-- Bottom Toolbar of Prompt Box (Flow Style) -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mt-3 pt-2 border-t border-slate-200">
            <!-- Quick References & Presets -->
            <div class="flex flex-wrap items-center gap-1.5 text-xs">
              <button onclick="triggerIngredientUpload()" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[11px] flex items-center space-x-1.5 transition">
                <i class="fa-solid fa-paperclip text-slate-500"></i>
                <span>Attach Ref</span>
              </button>

              <button onclick="applyFlowPreset('2d_spy')" class="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 text-[11px] font-semibold transition">
                + 2D Spy Documentary
              </button>
              <button onclick="applyFlowPreset('perfume')" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[11px] transition">
                + Perfume Commercial
              </button>
              <button onclick="applyFlowPreset('ugc')" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-pink-700 text-[11px] transition">
                + UGC TikTok
              </button>
            </div>

            <!-- Action Buttons: Split to Dual-Prompt or Conversational Edit -->
            <div class="flex flex-wrap sm:flex-nowrap items-center gap-2">
              <button onclick="sendAgentChatMessage()" class="flex-1 sm:flex-initial bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs px-4 py-2 sm:py-1.5 rounded-xl shadow-xs transition flex items-center justify-center space-x-1.5">
                <i class="fa-solid fa-paper-plane text-xs"></i>
                <span>Ask / Run AI</span>
              </button>
              <button onclick="executeFlowDecomposition()" class="flex-1 sm:flex-initial bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-medium text-xs px-3 py-2 sm:py-1.5 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-xs">
                <i class="fa-solid fa-bolt text-amber-500"></i>
                <span>Generate (Zero-Cost Mode)</span>
              </button>
            </div>
          </div>`;

html = html.replace(oldPromptToolbar, newPromptToolbar);

// 6. Make Scenebuilder Timeline & Viewport responsive
const oldTimelineHeader = `      <!-- SCENEBUILDER TIMELINE & LIVE MEDIA VIEWPORT -->
      <div class="flow-card rounded-2xl p-5 shadow-2xl space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center space-x-2.5">
            <i class="fa-solid fa-film text-indigo-400 text-sm"></i>
            <div>
              <h3 class="text-sm font-flow font-bold text-slate-900 tracking-tight">Active Scene Viewport &amp; Timeline (4.0s Hook Take • Scene 01)</h3>
              <p class="text-[11px] text-slate-500">Play, preview, and inspect your rendered 2D animated shots &amp; keyframes</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <!-- Hidden File Pickers -->
            <input type="file" id="media-video-picker" accept="video/mp4,video/webm" class="hidden" onchange="handleVideoFileLoaded(event)">
            <input type="file" id="media-image-picker" accept="image/png,image/jpeg,image/webp" class="hidden" onchange="handleImageFileLoaded(event)">

            <button onclick="document.getElementById('media-image-picker').click()" class="bg-white hover:bg-slate-100 text-amber-800 border border-amber-300 px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 shadow-xs">
              <i class="fa-regular fa-image text-xs"></i>
              <span>Load Keyframe (PNG)</span>
            </button>
            <button onclick="document.getElementById('media-video-picker').click()" class="bg-white hover:bg-slate-100 text-cyan-800 border border-cyan-300 px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 shadow-xs">
              <i class="fa-solid fa-file-video text-xs"></i>
              <span>Load Rendered Video (MP4)</span>
            </button>
            <button onclick="loadSampleSceneTake()" class="bg-indigo-900/60 hover:bg-indigo-800/80 text-amber-200 border border-indigo-500/40 px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 shadow">
              <i class="fa-solid fa-wand-magic-sparkles text-amber-400"></i>
              <span>Play Sample Take (Scene 1)</span>
            </button>
            <button onclick="simulateFlowPlayback()" id="flow-playback-btn" class="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 shadow-lg shadow-emerald-600/30">
              <i id="flow-play-icon" class="fa-solid fa-play text-[10px]"></i>
              <span id="flow-play-text">Preview Scene</span>
            </button>
          </div>
        </div>`;

const newTimelineHeader = `      <!-- SCENEBUILDER TIMELINE & LIVE MEDIA VIEWPORT -->
      <div class="flow-card rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center space-x-2.5">
            <i class="fa-solid fa-film text-indigo-500 text-sm"></i>
            <div>
              <h3 class="text-sm font-flow font-bold text-slate-900 tracking-tight">Active Scene Viewport &amp; Timeline</h3>
              <p class="text-[11px] text-slate-500">Play, preview, and inspect your rendered 2D animated shots &amp; keyframes</p>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <!-- Hidden File Pickers -->
            <input type="file" id="media-video-picker" accept="video/mp4,video/webm" class="hidden" onchange="handleVideoFileLoaded(event)">
            <input type="file" id="media-image-picker" accept="image/png,image/jpeg,image/webp" class="hidden" onchange="handleImageFileLoaded(event)">

            <button onclick="document.getElementById('media-image-picker').click()" class="bg-white hover:bg-slate-100 text-amber-800 border border-amber-300 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 shadow-xs">
              <i class="fa-regular fa-image text-xs"></i>
              <span class="hidden sm:inline">Load </span><span>Keyframe (PNG)</span>
            </button>
            <button onclick="document.getElementById('media-video-picker').click()" class="bg-white hover:bg-slate-100 text-cyan-800 border border-cyan-300 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 shadow-xs">
              <i class="fa-solid fa-file-video text-xs"></i>
              <span class="hidden sm:inline">Load </span><span>Video (MP4)</span>
            </button>
            <button onclick="loadSampleSceneTake()" class="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 shadow-xs">
              <i class="fa-solid fa-wand-magic-sparkles text-amber-500"></i>
              <span>Sample Take</span>
            </button>
            <button onclick="simulateFlowPlayback()" id="flow-playback-btn" class="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 shadow-xs">
              <i id="flow-play-icon" class="fa-solid fa-play text-[10px]"></i>
              <span id="flow-play-text">Preview Scene</span>
            </button>
          </div>
        </div>`;

html = html.replace(oldTimelineHeader, newTimelineHeader);

// 7. Make Timeline tracks safe from overflowing
html = html.replace(
  '<span>0.0s ───────────────────────────────────────────────────────────── 4.0s</span>',
  '<span class="font-mono text-[9px] text-slate-500 font-semibold">0.0s ─── 4.0s</span>'
);

// 8. Make Audio Track flex responsive
const oldAudioTrack = `          <!-- Audio Track with Voiceover Waveform -->
          <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between space-x-3">
            <div class="flex items-center space-x-2 text-xs text-slate-500">
              <i class="fa-solid fa-microphone text-indigo-400 text-xs"></i>
              <span class="text-[10px] font-mono">VOICE-OVER BED: "इकलौता स्पाई— जो दुश्मन देश के प्रेसिडेंट बनने की रेस तक पहुँच गया!"</span>
            </div>
            <!-- Simulated Waveform -->
            <div class="flex items-center space-x-1 h-3 flex-1 max-w-xs">
              <div class="w-1 bg-indigo-500/40 h-1 rounded-full"></div>
              <div class="w-1 bg-indigo-500 h-3 rounded-full animate-pulse"></div>
              <div class="w-1 bg-indigo-400 h-2.5 rounded-full animate-pulse"></div>
              <div class="w-1 bg-indigo-500 h-3 rounded-full animate-pulse"></div>
              <div class="w-1 bg-indigo-300 h-1.5 rounded-full"></div>
            </div>
            <span class="text-[10px] text-emerald-400 font-mono">Brisk 1.25x Tempo</span>
          </div>`;

const newAudioTrack = `          <!-- Audio Track with Voiceover Waveform -->
          <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 overflow-hidden">
            <div class="flex items-center space-x-2 text-xs text-slate-600 truncate">
              <i class="fa-solid fa-microphone text-indigo-500 text-xs shrink-0"></i>
              <span class="text-[10px] font-mono truncate">VOICE-OVER: "इकलौता स्पाई— जो दुश्मन देश के प्रेसिडेंट बनने की रेस तक पहुँच गया!"</span>
            </div>
            <div class="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
              <!-- Simulated Waveform -->
              <div class="flex items-center space-x-1 h-3 w-16">
                <div class="w-1 bg-indigo-300 h-1 rounded-full"></div>
                <div class="w-1 bg-indigo-500 h-3 rounded-full animate-pulse"></div>
                <div class="w-1 bg-indigo-400 h-2.5 rounded-full animate-pulse"></div>
                <div class="w-1 bg-indigo-500 h-3 rounded-full animate-pulse"></div>
                <div class="w-1 bg-indigo-300 h-1.5 rounded-full"></div>
              </div>
              <span class="text-[10px] text-emerald-600 font-mono font-bold">1.25x Tempo</span>
            </div>
          </div>`;

html = html.replace(oldAudioTrack, newAudioTrack);

// 9. Update modal cards to use modal-responsive-card class
html = html.replaceAll(
  'class="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden"',
  'class="modal-responsive-card bg-white border border-slate-200 rounded-3xl w-full max-w-2xl p-4 sm:p-8 space-y-5 sm:space-y-6 shadow-2xl relative overflow-hidden"'
);
html = html.replaceAll(
  'class="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl"',
  'class="modal-responsive-card bg-white border border-slate-200 rounded-3xl w-full max-w-md p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl"'
);
html = html.replaceAll(
  'class="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl p-6 sm:p-7 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto"',
  'class="modal-responsive-card bg-white border border-slate-200 rounded-3xl w-full max-w-3xl p-4 sm:p-7 space-y-5 sm:space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto"'
);
html = html.replaceAll(
  'class="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl p-6 sm:p-7 space-y-6 shadow-2xl max-h-[90vh] flex flex-col"',
  'class="modal-responsive-card bg-white border border-slate-200 rounded-3xl w-full max-w-4xl p-4 sm:p-7 space-y-4 sm:space-y-6 shadow-2xl max-h-[90vh] flex flex-col"'
);
html = html.replaceAll(
  'class="bg-white border-2 border-amber-400 rounded-3xl w-full max-w-4xl p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto"',
  'class="modal-responsive-card bg-white border-2 border-amber-400 rounded-3xl w-full max-w-4xl p-4 sm:p-8 space-y-5 sm:space-y-6 shadow-2xl relative my-auto"'
);

// 10. Wrap Admin User Management Table in overflow-x-auto
const oldAdminUsersTab = `      <!-- Tab 2: User Roles & Creators -->
      <div id="admin-sec-users" class="hidden space-y-4 overflow-y-auto flex-1 pr-1 text-xs">
        <div class="flex items-center justify-between">
          <span class="text-slate-500 font-medium">Registered Creators &amp; Permissions</span>
          <button onclick="openAuthModal()" class="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition">
            + Add New User
          </button>
        </div>
        <table class="w-full text-left border-collapse">`;

const newAdminUsersTab = `      <!-- Tab 2: User Roles & Creators -->
      <div id="admin-sec-users" class="hidden space-y-4 overflow-y-auto flex-1 pr-1 text-xs">
        <div class="flex items-center justify-between">
          <span class="text-slate-500 font-medium">Registered Creators &amp; Permissions</span>
          <button onclick="openAuthModal()" class="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition">
            + Add New User
          </button>
        </div>
        <div class="overflow-x-auto w-full border border-slate-200 rounded-xl">
        <table class="w-full text-left border-collapse min-w-[500px]">`;

html = html.replace(oldAdminUsersTab, newAdminUsersTab);
html = html.replace('        </table>\n      </div>', '        </table>\n        </div>\n      </div>');

fs.writeFileSync(path, html, 'utf8');
console.log('Successfully applied all device responsive transformations!');
