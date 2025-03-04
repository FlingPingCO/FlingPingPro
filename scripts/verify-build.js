/**
 * FlingPing.co Build Verification Script
 * 
 * This script verifies that the build output contains all the required files
 * and has the correct structure for AWS S3 deployment.
 * 
 * Usage: node scripts/verify-build.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const deploymentDir = path.join(rootDir, 'flingping-deployment');

// Required files and directories
const requiredFiles = [
  'index.html',
  'styles.css',
  'index.js',
  'package.json',
  'public/favicon.ico',
  'README.md'
];

const requiredDirs = [
  'public',
  'public/assets',
  'public/images'
];

console.log('FlingPing.co Build Verification\n');

if (!fs.existsSync(deploymentDir)) {
  console.error('❌ Error: Deployment directory not found!');
  console.log('Please run the build script first: node scripts/build-prod.js');
  process.exit(1);
}

// Check required directories
console.log('Checking required directories...');
let dirErrors = 0;

requiredDirs.forEach(dir => {
  const dirPath = path.join(deploymentDir, dir);
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    console.log(`✅ Found directory: ${dir}`);
  } else {
    console.error(`❌ Missing directory: ${dir}`);
    dirErrors++;
  }
});

// Check required files
console.log('\nChecking required files...');
let fileErrors = 0;

requiredFiles.forEach(file => {
  const filePath = path.join(deploymentDir, file);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    console.log(`✅ Found file: ${file}`);
  } else {
    console.error(`❌ Missing file: ${file}`);
    fileErrors++;
  }
});

// Check image files
const imagesDir = path.join(deploymentDir, 'public', 'images');
if (fs.existsSync(imagesDir)) {
  const imageFiles = fs.readdirSync(imagesDir);
  console.log(`\nFound ${imageFiles.length} files in public/images directory`);
  
  if (imageFiles.length === 0) {
    console.warn('⚠️ Warning: No image files found in public/images directory');
  }
}

// Check asset files
const assetsDir = path.join(deploymentDir, 'public', 'assets');
if (fs.existsSync(assetsDir)) {
  const assetFiles = fs.readdirSync(assetsDir);
  console.log(`Found ${assetFiles.length} files in public/assets directory`);
  
  if (assetFiles.length === 0) {
    console.warn('⚠️ Warning: No asset files found in public/assets directory');
  }
}

// Check zip file
const zipPath = path.join(rootDir, 'flingping-deployment.zip');
if (fs.existsSync(zipPath)) {
  const stats = fs.statSync(zipPath);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
  console.log(`\n✅ Found deployment zip file: ${sizeMB} MB`);
} else {
  console.error('\n❌ Deployment zip file not found!');
  fileErrors++;
}

// Summary
console.log('\n--- Verification Summary ---');
if (dirErrors === 0 && fileErrors === 0) {
  console.log('✅ All required files and directories are present.');
  console.log('✅ Build structure is valid for AWS S3 deployment.');
  console.log('\nYou can now upload the files to AWS S3 following the deployment guide.');
} else {
  console.error(`❌ Verification failed with ${fileErrors} missing files and ${dirErrors} missing directories.`);
  console.log('Please check the build process and try again.');
  process.exit(1);
}