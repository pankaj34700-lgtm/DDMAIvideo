const { chromium, devices } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '..', 'screenshots', 'responsive');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

async function checkResponsiveness() {
  const browser = await chromium.launch();

  const configs = [
    { name: '01_mobile_iphone13', device: devices['iPhone 13'] },
    { name: '02_mobile_pixel7', device: devices['Pixel 7'] },
    { name: '03_tablet_ipad', device: devices['iPad (gen 7)'] },
    { name: '04_laptop_1024', viewport: { width: 1024, height: 768 } }
  ];

  for (const cfg of configs) {
    const context = cfg.device 
      ? await browser.newContext({ ...cfg.device })
      : await browser.newContext({ viewport: cfg.viewport });

    const page = await context.newPage();
    await page.addInitScript(() => {
      localStorage.setItem('ddmai_welcome_dismissed', 'true');
    });

    await page.goto('https://vedio-working.web.app');
    await page.waitForTimeout(1000);

    // Check if horizontal scrollbar appears on body/window (a classic responsiveness bug!)
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    const hasHorizontalOverflow = scrollWidth > clientWidth;

    console.log(`[${cfg.name}] scrollWidth: ${scrollWidth}, clientWidth: ${clientWidth}, Horizontal Overflow: ${hasHorizontalOverflow}`);

    await page.screenshot({ path: path.join(OUT_DIR, `${cfg.name}.png`), fullPage: false });

    // Also test opening admin modal, certificate modal, and prompt box on mobile
    if (cfg.name === '01_mobile_iphone13') {
      // Test mobile menu or modals
      await page.click('button:has-text("Certificates")').catch(() => {});
      await page.waitForTimeout(500);
      if (await page.locator('#certificate-modal').isVisible()) {
        await page.screenshot({ path: path.join(OUT_DIR, `01_mobile_certificate_modal.png`) });
        await page.evaluate(() => closeCertificateModal());
      }
    }

    await context.close();
  }

  await browser.close();
  console.log('Finished capturing responsive screenshots!');
}

checkResponsiveness().catch(console.error);
