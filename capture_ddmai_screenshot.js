const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Verify title
  const title = await page.title();
  console.log('Page Title:', title);

  const shotPath = path.join(__dirname, 'evidence', 'ddmai_video_studio_live.png');
  await page.screenshot({ path: shotPath, fullPage: false });
  console.log('Saved screenshot to:', shotPath);

  // Also save to artifact directory for rendering in response
  const artifactPath = path.join('C:\\Users\\hp\\.gemini\\antigravity\\brain\\b9c23dfd-c320-4e9c-b073-ba3c070dd672', 'ddmai_video_studio_live.png');
  await page.screenshot({ path: artifactPath, fullPage: false });
  console.log('Saved artifact screenshot to:', artifactPath);

  // Also copy to Desktop EVIDENCE folder
  const desktopEvidencePath = path.join('C:\\Users\\hp\\Desktop\\EVIDENCE_TEST_REPORTS', 'ddmai_video_studio_live.png');
  await page.screenshot({ path: desktopEvidencePath, fullPage: false });
  console.log('Saved Desktop evidence screenshot to:', desktopEvidencePath);

  await browser.close();
})();
