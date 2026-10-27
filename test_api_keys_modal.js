const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to https://vedio-working.web.app ...');
  await page.goto('https://vedio-working.web.app', { waitUntil: 'networkidle' });

  console.log('Opening API Keys modal...');
  await page.locator('button[onclick="openApiKeysModal()"]').click();
  await page.waitForTimeout(500);

  const modal = page.locator('#api-keys-modal');
  console.log('API Keys Modal visible:', await modal.isVisible());

  const shotPath = path.join(__dirname, 'evidence', 'api_keys_manager_modal.png');
  await page.screenshot({ path: shotPath, fullPage: false });
  console.log('Saved screenshot to evidence:', shotPath);

  const artifactPath = path.join('C:\\Users\\hp\\.gemini\\antigravity\\brain\\b9c23dfd-c320-4e9c-b073-ba3c070dd672', 'api_keys_manager_modal.png');
  await page.screenshot({ path: artifactPath, fullPage: false });

  const desktopEvidencePath = path.join('C:\\Users\\hp\\Desktop\\EVIDENCE_TEST_REPORTS', 'api_keys_manager_modal.png');
  await page.screenshot({ path: desktopEvidencePath, fullPage: false });

  await browser.close();
  console.log('API Keys Modal verification complete!');
})();
