const { chromium, devices } = require('playwright');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const OUT_DIR = path.resolve(__dirname, '..', 'screenshots', 'responsive');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

async function verifyAllDevices() {
  console.log('================================================================');
  console.log('       📱 DDMAI.VIDEO MULTI-DEVICE RESPONSIVENESS AUDIT         ');
  console.log('================================================================');

  // Start local server
  const serverPath = path.resolve(__dirname, '..', '..', 'self reserch with video', 'website', 'server.js');
  const server = spawn('node', [serverPath], { stdio: 'inherit' });
  await new Promise(r => setTimeout(r, 2000));

  const browser = await chromium.launch();

  const testCases = [
    { name: 'iPhone 13 (390x844)', device: devices['iPhone 13'], file: '01_mobile_iphone13.png' },
    { name: 'Pixel 7 (412x915)', device: devices['Pixel 7'], file: '02_mobile_pixel7.png' },
    { name: 'Small Phone (360x740)', viewport: { width: 360, height: 740 }, file: '03_mobile_360.png' },
    { name: 'iPad Gen 7 (768x1024)', device: devices['iPad (gen 7)'], file: '04_tablet_ipad768.png' },
    { name: 'Laptop Small (1024x768)', viewport: { width: 1024, height: 768 }, file: '05_laptop_1024.png' },
    { name: 'Laptop Standard (1280x800)', viewport: { width: 1280, height: 800 }, file: '06_laptop_1280.png' },
    { name: 'Desktop Widescreen (1440x900)', viewport: { width: 1440, height: 900 }, file: '07_desktop_1440.png' }
  ];

  let allPassed = true;

  for (const tc of testCases) {
    const context = tc.device 
      ? await browser.newContext({ ...tc.device }) 
      : await browser.newContext({ viewport: tc.viewport });

    const page = await context.newPage();
    await page.addInitScript(() => {
      localStorage.setItem('ddmai_welcome_dismissed', 'true');
    });

    await page.goto('http://localhost:3000');
    await page.waitForTimeout(600);

    const docWidth = await page.evaluate(() => document.documentElement.clientWidth);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const overflow = scrollWidth > docWidth + 2;

    const status = overflow ? '❌ FAIL (Horizontal Overflow)' : '✅ PASS (Zero Overflow)';
    console.log(`[${tc.name.padEnd(28)}] clientWidth: ${String(docWidth).padStart(4)}, scrollWidth: ${String(scrollWidth).padStart(4)} -> ${status}`);

    if (overflow) allPassed = false;

    // Capture screenshot
    await page.screenshot({ path: path.join(OUT_DIR, tc.file) });

    await context.close();
  }

  await browser.close();
  server.kill();

  console.log('----------------------------------------------------------------');
  if (allPassed) {
    console.log('🎉 [SUCCESS] 100% of tested devices passed with ZERO horizontal overflow!');
  } else {
    console.log('⚠️ [WARNING] Some devices had horizontal overflow.');
  }
}

verifyAllDevices().catch(console.error);
