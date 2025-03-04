/**
 * FlingPing.co Production Build Script
 * 
 * This script:
 * 1. Cleans old files and documentation
 * 2. Runs the standard build process
 * 3. Runs the post-build script to organize the output directory according to requirements
 * 4. Creates a zip file of the deployment directory for easy upload to AWS S3
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

function cleanOldFiles() {
  console.log('Cleaning old deployment files and documentation...');
  
  // Remove old Hostinger docs and other unnecessary files
  const filesToRemove = [
    'HOSTINGER-DEPLOYMENT-GUIDE.md',
    'SIMPLIFIED-HOSTINGER-DEPLOYMENT.md',
    'EXPORT-FROM-REPLIT-GUIDE.md',
    'flingping-deployment.zip',
    'response.json',
    'test-checkout.js',
    'test-google-script.js',
    'test-stripe-image.js',
    'webhook-test.js',
    'SYSTEME-API-DEPRECATION-NOTICE.md',
    'SYSTEME-INTEGRATION.md',
    'SYSTEME-MIGRATION-COMPLETE.md',
    'SYSTEME-MIGRATION-COMPLETE-UPDATE.md',
    'SYSTEME-REMOVAL-COMPLETE.md',
    'WEBHOOK-INTEGRATION-COMPLETION.md',
    'WEBHOOK-INTEGRATION-DOCS.md',
    'WEBHOOK-INTEGRATION-FINAL.md',
    'WEBHOOK-INTEGRATION-FLOW.md',
    'WEBHOOK-INTEGRATION-GUIDE.md',
    'WEBHOOK-INTEGRATION.md',
    'WEBHOOK-TEST-FINAL-REPORT.md',
    'WEBHOOK-TEST-REPORT.md',
    'WEBHOOK-TEST-REPORT-SYSTEME.md',
    'WEBHOOK-TROUBLESHOOTING-GUIDE.md'
  ];
  
  filesToRemove.forEach(file => {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`Deleted: ${file}`);
      } catch (error) {
        console.warn(`Could not delete ${file}: ${error.message}`);
      }
    }
  });
  
  // Remove old dist directory if it exists
  const distDir = path.join(rootDir, 'dist');
  if (fs.existsSync(distDir)) {
    try {
      fs.rmSync(distDir, { recursive: true, force: true });
      console.log('Deleted old dist directory');
    } catch (error) {
      console.warn(`Could not delete dist directory: ${error.message}`);
    }
  }
  
  // Remove old deployment directory if it exists
  const deploymentDir = path.join(rootDir, 'flingping-deployment');
  if (fs.existsSync(deploymentDir)) {
    try {
      fs.rmSync(deploymentDir, { recursive: true, force: true });
      console.log('Deleted old deployment directory');
    } catch (error) {
      console.warn(`Could not delete deployment directory: ${error.message}`);
    }
  }
}

try {
  // 1. Clean old files
  cleanOldFiles();
  
  // 2. Run the standard build
  console.log('\nRunning production build...');
  execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
  console.log('Build completed successfully.\n');

  // 3. Run post-build script
  console.log('Running post-build script to organize files...');
  execSync('node scripts/post-build.js', { cwd: rootDir, stdio: 'inherit' });
  console.log('Post-build process completed successfully.\n');

  // 4. Create a zip file of the deployment directory
  console.log('Creating zip file of the deployment directory...');
  execSync('cd flingping-deployment && zip -r ../flingping-deployment.zip .', { cwd: rootDir, stdio: 'inherit' });
  console.log('\nProduction build process completed!');
  
  const zipPath = path.join(rootDir, 'flingping-deployment.zip');
  const zipStats = fs.statSync(zipPath);
  const zipSizeMB = (zipStats.size / 1024 / 1024).toFixed(2);
  
  console.log(`\nZip file created: flingping-deployment.zip (${zipSizeMB} MB)`);
  console.log('Final structure created in /flingping-deployment directory');
  console.log('You can now manually upload the zip file to AWS S3.');
  
  // Display the final structure
  console.log('\nFinal structure:');
  execSync('find flingping-deployment -type f | sort', { cwd: rootDir, stdio: 'inherit' });
  
} catch (error) {
  console.error('Build process failed:', error);
  process.exit(1);
}