const { chromium } = require('playwright');
const path = require('path');

async function captureTimeline() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.addInitScript(() => {
    localStorage.setItem('ddmai_welcome_dismissed', 'true');
  });
  await page.goto('https://vedio-working.web.app');
  await page.waitForTimeout(1000);

  // Scroll down to the viewport & timeline
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(500);

  const outPath = path.resolve(__dirname, '..', 'screenshots', '05_viewport_timeline_light.png');
  await page.screenshot({ path: outPath });
  console.log('✓ Captured: 05_viewport_timeline_light.png');
  await browser.close();
}

captureTimeline().catch(console.error);
