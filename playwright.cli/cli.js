#!/usr/bin/env node

/**
 * DDMAI.VIDEO — Playwright Automation & Test CLI
 * Unified runner for Headless E2E, Cloud Verification, and Visual Screenshots.
 */

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const ARGS = process.argv.slice(2);
const ROOT_DIR = path.resolve(__dirname, '..');
const LOCAL_STUDIO_URL = 'http://localhost:3000';
const CLOUD_STUDIO_URL = 'https://vedio-working.web.app';

console.log('\n================================================================');
console.log('       🎭 DDMAI.VIDEO PLAYWRIGHT AUTOMATION CLI (v3.0)        ');
console.log('================================================================\n');

function printHelp() {
  console.log(`Usage: node cli.js [command] [options]

Commands:
  test              Run all Playwright E2E tests against Local Studio (port 3000)
  test:cloud        Run Playwright E2E tests against Live Cloud (vedio-working.web.app)
  test:headed       Run E2E tests in visible browser window (Headed Mode)
  test:ui           Launch Playwright Interactive Test UI Dashboard
  screenshot        Capture full-page screenshots of all Studio views & Modals
  help              Display this help menu

Examples:
  node cli.js test
  node cli.js test:cloud
  node cli.js screenshot
  node cli.js test:headed
`);
}

if (ARGS.length === 0 || ARGS.includes('help') || ARGS.includes('--help')) {
  printHelp();
  process.exit(0);
}

const command = ARGS[0];

if (command === 'test') {
  console.log(`[INFO] Running Playwright E2E tests against Local Studio: ${LOCAL_STUDIO_URL}...`);
  try {
    execSync(`npx playwright test --config=playwright.config.js`, {
      stdio: 'inherit',
      cwd: __dirname,
      env: { ...process.env, BASE_URL: LOCAL_STUDIO_URL }
    });
    console.log('\n[SUCCESS] All Playwright E2E tests passed successfully!\n');
  } catch (err) {
    console.error('\n[ERROR] Playwright tests encountered failures.\n');
    process.exit(1);
  }
} else if (command === 'test:cloud') {
  console.log(`[INFO] Running Playwright E2E tests against Live Cloud: ${CLOUD_STUDIO_URL}...`);
  try {
    execSync(`npx playwright test --config=playwright.config.js`, {
      stdio: 'inherit',
      cwd: __dirname,
      env: { ...process.env, TARGET: 'cloud', BASE_URL: CLOUD_STUDIO_URL }
    });
    console.log('\n[SUCCESS] Cloud Playwright verification passed!\n');
  } catch (err) {
    console.error('\n[ERROR] Cloud tests failed.\n');
    process.exit(1);
  }
} else if (command === 'test:headed') {
  console.log('[INFO] Launching Playwright tests in Headed (Visible Browser) mode...');
  execSync(`npx playwright test --config=playwright.config.js --headed`, {
    stdio: 'inherit',
    cwd: __dirname
  });
} else if (command === 'test:ui') {
  console.log('[INFO] Launching Playwright Interactive Test UI Dashboard...');
  execSync(`npx playwright test --config=playwright.config.js --ui`, {
    stdio: 'inherit',
    cwd: __dirname
  });
} else if (command === 'screenshot') {
  console.log('[INFO] Capturing high-resolution screenshots of Studio & Modals...');
  try {
    execSync(`node scripts/capture.js`, {
      stdio: 'inherit',
      cwd: __dirname
    });
  } catch (err) {
    console.error('[ERROR] Screenshot capture failed:', err.message);
  }
} else {
  console.log(`[UNKNOWN COMMAND] '${command}'`);
  printHelp();
}
