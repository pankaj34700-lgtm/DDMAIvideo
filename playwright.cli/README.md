# 🎭 DDMAI.VIDEO Playwright CLI (`playwright.cli/`)

Dedicated End-to-End browser testing, visual regression, and screenshot capture suite for **DDMAI.VIDEO Studio**.

---

## 📁 Folder Structure
```
playwright.cli/
├── cli.js                  # Unified Playwright CLI runner
├── playwright.config.js    # Playwright configuration (Local & Cloud endpoints)
├── run.bat                 # 1-Click interactive Windows batch launcher
├── README.md               # Documentation & usage guide
├── screenshots/            # Output folder for automated high-res captures
└── tests/
    └── studio.e2e.spec.js  # E2E test suite (Admin, Auth, Certificate, 2D Prompts)
```

---

## 🚀 Quick Start Commands

```bash
# 1. Run all tests against local studio (port 3000)
node cli.js test

# 2. Run all tests against live Firebase cloud app
node cli.js test:cloud

# 3. Run in headed mode (watch browser execute live)
node cli.js test:headed

# 4. Open Playwright interactive UI
node cli.js test:ui

# 5. Capture high-res screenshots of Studio & Modals
node cli.js screenshot
```

Or simply double-click **`run.bat`** on Windows!
