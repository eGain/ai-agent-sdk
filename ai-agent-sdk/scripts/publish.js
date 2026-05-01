#!/usr/bin/env node

/**
 * Publish script that uses GitHub PAT from environment variables or .env file
 * Usage: npm run publish-package
 *
 * Publishes this package to GitHub Packages only (`npm.pkg.github.com`).
 * Public npmjs.org releases are handled by workflows on the eGain/ai-agent-sdk repo.
 *
 * Required environment variable (set in .env file or environment):
 * - GITHUB_TOKEN or NPM_TOKEN: GitHub Personal Access Token with 'write:packages' permission
 */

import { execSync } from 'child_process';
import { exit } from 'process';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Load .env file from project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const envPath = join(projectRoot, '.env');
config({ path: envPath });

// Read package.json to get version
const packageJsonPath = join(projectRoot, 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
const packageVersion = packageJson.version;
const packageName = packageJson.name;

const REGISTRY = 'https://npm.pkg.github.com/';
const AUTH_CONFIG_KEY = `//npm.pkg.github.com/:_authToken`;

// Check for token in environment variables (from .env file or system env)
const token = process.env.GITHUB_TOKEN || process.env.NPM_TOKEN;


if (!token) {
  console.error('❌ Error: GitHub Personal Access Token not found!');
  console.error('');
  console.error('Please set one of the following:');
  console.error('  1. Create a .env file in the project root with:');
  console.error('     GITHUB_TOKEN=your_token_here');
  console.error('');
  console.error('  2. Or set environment variable:');
  console.error('     export GITHUB_TOKEN=your_token_here');
  console.error('     npm run publish-package');
  console.error('');
  console.error('  3. Or use NPM_TOKEN instead:');
  console.error('     NPM_TOKEN=your_token_here');
  console.error('');
  console.error('To create a token:');
  console.error('  https://github.com/settings/tokens');
  console.error('  (Requires "write:packages" permission)');
  exit(1);
}


try {
  // Set the auth token in npm config
  console.log('🔐 Configuring npm authentication...');
  execSync(`npm config set ${AUTH_CONFIG_KEY} ${token}`, { stdio: 'inherit' });
  
  // Verify registry is configured
  console.log('✅ Authentication configured');
  console.log('');
  console.log(`📦 Publishing ${packageName}@${packageVersion}...`);
  console.log('');
  
  // Run npm publish (prepublishOnly will run automatically)
  // Use --no-workspaces to avoid workspace-related issues
  // Capture output to detect "already published" errors while still showing it
  try {
    const publishOutput = execSync(
      `npm publish --no-workspaces --registry ${REGISTRY}`,
      {
        encoding: 'utf-8',
        stdio: 'pipe',
      }
    );
    // Show the output
    process.stdout.write(publishOutput);
    console.log('');
    console.log(`✅ Package ${packageName}@${packageVersion} published successfully!`);
  } catch (publishErr) {
    // Show the output even on error
    if (publishErr.stdout) {
      process.stdout.write(publishErr.stdout.toString());
    }
    if (publishErr.stderr) {
      process.stderr.write(publishErr.stderr.toString());
    }
    throw publishErr;
  }
  
} catch (error) {
  const errorMessage = error.message || error.toString();
  const errorOutput = error.output ? error.output.map(o => o?.toString() || '').join('') : '';
  const stderrOutput = error.stderr?.toString() || '';
  const stdoutOutput = error.stdout?.toString() || '';
  const fullError = (errorMessage + errorOutput + stderrOutput + stdoutOutput).toLowerCase();
  
  // Check if the error is about version already existing
  if (fullError.includes('previously published versions') || 
      fullError.includes('you cannot publish over') ||
      fullError.includes('epublishconflict') ||
      fullError.includes('cannot publish over')) {
    console.log('');
    console.log(`✅ Version ${packageVersion} of ${packageName} already exists in the registry.`);
    console.log('   This is expected if the package was already published successfully.');
    console.log('');
    console.log('   To publish a new version, update the version in package.json first:');
    console.log('     npm version patch   # 0.0.3 → 0.0.4');
    console.log('     npm version minor   # 0.0.3 → 0.1.0');
    console.log('     npm version major   # 0.0.3 → 1.0.0');
    console.log('');
    console.log('   Then run: npm run publish-package');
    console.log('');
    exit(0); // Exit with success since package version already exists
  } else if (fullError.includes('prepublishOnly') || 
             fullError.includes('ELIFECYCLE') ||
             fullError.includes('test') ||
             fullError.includes('ERR_UNKNOWN_BUILTIN_MODULE')) {
    // This is a prepublishOnly hook failure (build/test failed)
    console.error('');
    console.error('❌ Publishing aborted due to prepublishOnly hook failure!');
    console.error('   The package was NOT published.');
    console.error('');
    console.error('   The prepublishOnly hook runs: npm run clean && npm run build:all && npm run test');
    console.error('   One of these steps failed. Please fix the errors above and try again.');
    console.error('');
    if (fullError.includes('ERR_UNKNOWN_BUILTIN_MODULE')) {
      console.error('   💡 Tip: This error often indicates a Node.js version incompatibility.');
      console.error('      Make sure you are using Node.js 16+ (preferably 18+ LTS).');
      console.error(`      Current version: ${process.version}`);
      console.error('');
    }
    exit(1);
  } else {
    console.error('');
    console.error('❌ Publishing failed!');
    if (errorMessage) {
      console.error('Error:', errorMessage);
    }
    exit(1);
  }
}
