const { chromium } = require('playwright');
const path = require('path');

async function testToast() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.addInitScript(() => {
    localStorage.setItem('ddmai_welcome_dismissed', 'true');
  });
  await page.goto('https://vedio-working.web.app');
  await page.waitForTimeout(1000);

  // Click generate button
  await page.click('button:has-text("Generate (Zero-Cost Mode)")');
  await page.waitForTimeout(400);

  const outPath = path.resolve(__dirname, '..', 'screenshots', '06_toast_notification_light.png');
  await page.screenshot({ path: outPath });
  console.log('✓ Captured: 06_toast_notification_light.png');
  await browser.close();
}

testToast().catch(console.error);
