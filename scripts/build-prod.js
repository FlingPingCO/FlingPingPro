/**
 * FlingPing.co Production Build Script
 * 
 * This script:
 * 1. Runs the standard build process
 * 2. Runs the post-build script to organize the output directory
 * 3. Creates a zip file of the dist directory for easy deployment
 * 
 * Usage: node scripts/build-prod.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

try {
  // 1. Run the standard build
  console.log('Running production build...');
  execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
  console.log('Build completed successfully.\n');

  // 2. Run post-build script
  console.log('Running post-build script to organize files...');
  execSync('node scripts/post-build.js', { cwd: rootDir, stdio: 'inherit' });
  console.log('Post-build process completed successfully.\n');

  // 3. Create a zip file of the dist directory
  console.log('Creating zip file of the dist directory...');
  execSync('zip -r flingping-deployment.zip dist/', { cwd: rootDir, stdio: 'inherit' });
  console.log('\nProduction build process completed!');
  
  const zipPath = path.join(rootDir, 'flingping-deployment.zip');
  const zipStats = fs.statSync(zipPath);
  const zipSizeMB = (zipStats.size / 1024 / 1024).toFixed(2);
  
  console.log(`\nZip file created: flingping-deployment.zip (${zipSizeMB} MB)`);
  console.log('You can now manually upload this zip file to AWS S3 or your deployment platform.');
} catch (error) {
  console.error('Build process failed:', error);
  process.exit(1);
}