const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const TARGET_URL = process.env.TARGET_URL || 'https://vedio-working.web.app';
const OUT_DIR = path.resolve(__dirname, '..', 'screenshots');

async function captureAll() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`[CAPTURE] Launching Chromium to capture: ${TARGET_URL}...`);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.addInitScript(() => {
    localStorage.setItem('ddmai_welcome_dismissed', 'true');
  });

  await page.goto(TARGET_URL);
  await page.waitForTimeout(1000);

  // 1. Studio Main
  await page.screenshot({ path: path.join(OUT_DIR, '01_studio_main.png') });
  console.log('✓ Captured: 01_studio_main.png');

  // 2. Admin Modal
  await page.click('#admin-panel-btn');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, '02_admin_panel.png') });
  console.log('✓ Captured: 02_admin_panel.png');
  await page.evaluate(() => closeAdminModal());

  // 3. Certificate Modal
  await page.click('button:has-text("Certificates")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, '03_luxury_certificate.png') });
  console.log('✓ Captured: 03_luxury_certificate.png');
  await page.evaluate(() => closeCertificateModal());

  // 4. User Dashboard Modal
  await page.click('#user-nav-container button');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, '04_user_dashboard.png') });
  console.log('✓ Captured: 04_user_dashboard.png');

  await browser.close();
  console.log(`\n🎉 [SUCCESS] All screenshots saved in playwright.cli/screenshots/!\n`);
}

captureAll().catch(console.error);
