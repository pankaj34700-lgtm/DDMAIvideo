const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to live Firebase URL: https://vedio-working.web.app ...');
  const response = await page.goto('https://vedio-working.web.app', { waitUntil: 'networkidle', timeout: 30000 });
  console.log('HTTP Status:', response.status());

  const pageTitle = await page.title();
  console.log('Page Title:', pageTitle);

  // Test preset click
  console.log('Testing preset click...');
  await page.locator('button:has-text("+ Perfume Commercial")').click();
  await page.waitForTimeout(600);

  const p1Text = await page.locator('#p1-content').textContent();
  console.log('P1 decomposed text preview:', p1Text.substring(0, 80) + '...');

  // Capture screenshot of live hosted website
  const shotPath = path.join(__dirname, 'evidence', 'firebase_hosted_live.png');
  await page.screenshot({ path: shotPath, fullPage: false });
  console.log('Saved screenshot to evidence:', shotPath);

  const artifactPath = path.join('C:\\Users\\hp\\.gemini\\antigravity\\brain\\b9c23dfd-c320-4e9c-b073-ba3c070dd672', 'firebase_hosted_live.png');
  await page.screenshot({ path: artifactPath, fullPage: false });
  console.log('Saved screenshot to artifacts:', artifactPath);

  const desktopEvidencePath = path.join('C:\\Users\\hp\\Desktop\\EVIDENCE_TEST_REPORTS', 'firebase_hosted_live.png');
  await page.screenshot({ path: desktopEvidencePath, fullPage: false });
  console.log('Saved screenshot to Desktop evidence:', desktopEvidencePath);

  await browser.close();
  console.log('Verification finished successfully!');
})();
