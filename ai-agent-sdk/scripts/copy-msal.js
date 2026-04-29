#!/usr/bin/env node

/**
 * Copy msal-browser.js to dist directory
 * Cross-platform script to copy the MSAL library file
 */

import { copyFile, mkdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = dirname(__dirname);

const sourceFile = join(projectRoot, 'src/core/auth/msal-browser.js');
const destDir = join(projectRoot, 'dist/core/auth');
const destFile = join(destDir, 'msal-browser.js');

try {
  // Ensure destination directory exists
  await mkdir(destDir, { recursive: true });
  
  // Copy the file
  await copyFile(sourceFile, destFile);
  
  console.log('✅ Copied msal-browser.js to dist/core/auth/');
} catch (error) {
  console.error('❌ Failed to copy msal-browser.js:', error.message);
  process.exit(1);
}
