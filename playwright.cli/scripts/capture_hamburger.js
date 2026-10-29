const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const OUT_DIR = path.resolve(__dirname, '..', 'screenshots');

async function captureHamburger() {
  const serverPath = path.resolve(__dirname, '..', '..', 'self reserch with video', 'website', 'server.js');
  const server = spawn('node', [serverPath], { stdio: 'inherit' });
  await new Promise(r => setTimeout(r, 2000));

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.addInitScript(() => {
    localStorage.setItem('ddmai_welcome_dismissed', 'true');
  });

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(800);

  // 1. Capture Header with Hamburger Icon (closed)
  await page.screenshot({ path: path.join(OUT_DIR, '07_header_professional_hamburger.png') });
  console.log('✓ Captured: 07_header_professional_hamburger.png');

  // 2. Click Hamburger Icon to open Executive Drawer
  await page.click('#hamburger-menu-btn');
  await page.waitForTimeout(500);

  // 3. Capture Open Hamburger Drawer
  await page.screenshot({ path: path.join(OUT_DIR, '08_hamburger_drawer_open.png') });
  console.log('✓ Captured: 08_hamburger_drawer_open.png');

  await browser.close();
  server.kill();
  console.log('\n🎉 Finished capturing hamburger screenshots!');
}

captureHamburger().catch(console.error);
