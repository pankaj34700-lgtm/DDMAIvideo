const { test, expect } = require('@playwright/test');

test.describe('DDMAI.VIDEO Studio E2E Suite', () => {

  test('01: Studio Homepage & $0.00 Cost Guard loads correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/DDMAI\.VIDEO/);
    await expect(page.locator('text=$0.00 ZERO-COST MODE')).toBeVisible();
    await expect(page.locator('text=DDMAI.VIDEO Agent Prompt Box')).toBeVisible();
  });

  test('02: Welcome Modal displays and can be dismissed', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    const welcomeModal = page.locator('#welcome-modal');
    if (await welcomeModal.isVisible()) {
      await expect(page.locator('text=Welcome to DDMAI.VIDEO!')).toBeVisible();
      await page.click('button:has-text("Launch Studio")');
      await expect(welcomeModal).toBeHidden();
    }
  });

  test('03: Admin Panel opens with full Dashboard UI/UX', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('ddmai_welcome_dismissed', 'true');
    });
    await page.goto('/');

    // Open Admin Panel
    await page.click('#admin-panel-btn');
    const adminModal = page.locator('#admin-modal');
    await expect(adminModal).toBeVisible();
    await expect(page.locator('text=DDMAI SuperAdmin Command Center')).toBeVisible();
    await expect(page.locator('text=Total Creators')).toBeVisible();

    // Switch to User Management tab
    await page.click('#adm-tab-users');
    await expect(page.locator('#admin-users-tbody')).toBeVisible();

    // Close modal
    await page.evaluate(() => closeAdminModal());
    await expect(adminModal).toBeHidden();
  });

  test('04: User Dashboard opens and shows active session', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('ddmai_welcome_dismissed', 'true');
    });
    await page.goto('/');

    // Open User Dashboard from profile avatar
    await page.click('#user-nav-container button');
    const userModal = page.locator('#user-dashboard-modal');
    await expect(userModal).toBeVisible();
    await expect(page.locator('#dash-user-name')).toBeVisible();

    // Close dashboard
    await page.evaluate(() => closeUserDashboard());
    await expect(userModal).toBeHidden();
  });

  test('05: Luxury Certificate System rendering and customization', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('ddmai_welcome_dismissed', 'true');
    });
    await page.goto('/');

    // Open Certificate modal
    await page.click('button:has-text("Certificates")');
    const certModal = page.locator('#certificate-modal');
    await expect(certModal).toBeVisible();

    // Verify certificate elements
    await expect(page.locator('#printable-certificate')).toBeVisible();
    await expect(page.locator('text=Certificate of Excellence')).toBeVisible();
    await expect(page.locator('#cert-display-id')).toBeVisible();
    await expect(page.locator('text=DDMAI VERIFIED')).toBeVisible();

    // Close certificate modal
    await page.evaluate(() => closeCertificateModal());
    await expect(certModal).toBeHidden();
  });

  test('06: 2D Spy Documentary Prompt Decomposition', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('ddmai_welcome_dismissed', 'true');
    });
    await page.goto('/');

    // Apply 2D Spy Documentary preset
    await page.click('button:has-text("+ 2D Spy Documentary")');
    await page.waitForTimeout(600);

    // Verify Prompt 1 (Keyframe) & Prompt 2 (Motion) populated
    const p1 = await page.locator('#p1-content').textContent();
    const p2 = await page.locator('#p2-content').textContent();

    expect(p1).toContain('2D animated documentary');
    expect(p2).toContain('FAST PACING');
  });

  test('07: Clean Light Theme toggle and persistence', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('ddmai_welcome_dismissed', 'true');
    });
    await page.goto('/');

    const toggleBtn = page.locator('#theme-toggle-btn');
    await expect(toggleBtn).toBeVisible();

    // Toggle theme
    await toggleBtn.click();
    await page.waitForTimeout(300);

    // Verify localStorage key updated
    const savedTheme = await page.evaluate(() => localStorage.getItem('ddmai_theme'));
    expect(['light', 'dark']).toContain(savedTheme);

    // Toggle back
    await toggleBtn.click();
    await page.waitForTimeout(300);
  });

  test('08: Veteran, PankajBhai Umesh Gupta Admin Identity & Certificate Verification', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('ddmai_welcome_dismissed', 'true');
    });
    await page.goto('/');

    // Open Certificate modal
    await page.click('button:has-text("Certificates")');
    await page.waitForTimeout(400);

    // Verify exact updated recipient name
    const certName = await page.locator('#cert-display-name').textContent();
    expect(certName).toContain('Veteran, PankajBhai Umesh Gupta');

    // Close certificate
    await page.evaluate(() => closeCertificateModal());

    // Open Admin Panel and verify in user table
    await page.click('#admin-panel-btn');
    await page.waitForTimeout(400);
    await page.click('#adm-tab-users');
    await page.waitForTimeout(300);

    const userTableText = await page.locator('#admin-users-tbody').textContent();
    expect(userTableText).toContain('Veteran, PankajBhai Umesh Gupta');

    await page.evaluate(() => closeAdminModal());
  });

  test('09: Conversational AI Director Chat Feed & Execution', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('ddmai_welcome_dismissed', 'true');
    });
    await page.goto('/');

    // Check Chat Feed visible
    const chatFeed = page.locator('#agent-chat-feed');
    await expect(chatFeed).toBeVisible();

    // Type a command in prompt box
    await page.fill('#main-flow-input', 'Scene 1 रन करो');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(800);

    // Verify chat bubble appeared in feed
    const feedText = await chatFeed.textContent();
    expect(feedText).toContain('Scene 1');
  });

});
