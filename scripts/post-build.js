/**
 * FlingPing.co Post-Build Script
 * 
 * This script reorganizes the build output to match the required structure:
 * /dist
 *   ├── index.html
 *   ├── assets/  (CSS, JS, images, etc.)
 *   ├── favicon.ico
 *   ├── any other public files needed
 * 
 * Usage: node scripts/post-build.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Paths
const distPublicDir = path.join(rootDir, 'dist', 'public');
const distDir = path.join(rootDir, 'dist');
const publicDir = path.join(rootDir, 'public');

// Function to copy directory recursively
function copyDirRecursively(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursively(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Function to move files from source to destination
function moveFiles(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const files = fs.readdirSync(src);
  
  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    // Move file or directory
    fs.renameSync(srcPath, destPath);
  }
}

// Check if dist/public exists
if (fs.existsSync(distPublicDir)) {
  console.log('Moving files from dist/public to dist...');
  
  // Move all files from dist/public to dist
  moveFiles(distPublicDir, distDir);
  
  // Remove the now-empty dist/public directory
  fs.rmdirSync(distPublicDir);
  
  console.log('Successfully moved files to dist/');
} else {
  console.log('dist/public directory not found. No files to move.');
}

// Copy any other public files needed (images, favicon, etc.)
const publicImagesDir = path.join(publicDir, 'images');
const distImagesDir = path.join(distDir, 'images');

if (fs.existsSync(publicImagesDir)) {
  console.log('Copying images from public/images to dist/images...');
  copyDirRecursively(publicImagesDir, distImagesDir);
  console.log('Successfully copied images to dist/images/');
}

// Copy illustrations directory
const publicIllustrationsDir = path.join(publicDir, 'illustrations');
const distIllustrationsDir = path.join(distDir, 'illustrations');

if (fs.existsSync(publicIllustrationsDir)) {
  console.log('Copying illustrations from public/illustrations to dist/illustrations...');
  copyDirRecursively(publicIllustrationsDir, distIllustrationsDir);
  console.log('Successfully copied illustrations to dist/illustrations/');
}

console.log('Post-build process completed successfully!');