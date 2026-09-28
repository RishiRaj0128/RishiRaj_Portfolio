/**
 * Screenshot generator for Rishi Raj Portfolio projects
 * Captures 1440x900 viewport screenshots after warming up free-tier hosts
 * Run with: node scripts/capture-screenshots.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.resolve(__dirname, '../public/projects');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function capture() {
  let chromium;
  try {
    const playwright = await import('playwright');
    chromium = playwright.chromium;
  } catch {
    console.log('Playwright not installed in node_modules. Attempting to run via npx playwright...');
  }

  if (!chromium) {
    console.log('To run this script, install playwright: npm i -D playwright');
    return;
  }

  console.log('Launching browser for project captures...');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // 1. Cinebook Movie Booking Frontend
  const cinebookUrl = 'https://coruscating-eclair-2724dd.netlify.app/';
  console.log(`Warming up and capturing ${cinebookUrl}...`);
  try {
    await page.goto(cinebookUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    const cinebookPath = path.join(outputDir, 'cinebook-preview.webp');
    await page.screenshot({ path: cinebookPath, type: 'webp', quality: 85 });
    console.log(`Saved screenshot to ${cinebookPath}`);
  } catch (err) {
    console.error(`Failed to capture Cinebook:`, err.message);
  }

  await browser.close();
  console.log('Capture process finished.');
}

capture().catch(console.error);
