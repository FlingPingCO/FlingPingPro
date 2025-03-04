/**
 * FlingPing.co Post-Build Script
 * 
 * This script reorganizes the build output to match the required structure:
 * /flingping-deployment
 * │── index.html  (Main HTML file)
 * │── styles.css  (Main styles)
 * │── index.js  (Main JS)
 * │── package.json
 * │── package-lock.json
 * │── public/  
 * │   ├── assets/  (Logos, icons, etc.)
 * │   ├── images/  (All images & illustrations)
 * │   ├── favicon.ico
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
const deploymentDir = path.join(rootDir, 'flingping-deployment');
const distDir = path.join(rootDir, 'dist');
const publicDir = path.join(rootDir, 'public');
const distPublicDir = path.join(distDir, 'public');

// Create clean deployment directory
if (fs.existsSync(deploymentDir)) {
  console.log('Removing existing deployment directory...');
  fs.rmSync(deploymentDir, { recursive: true, force: true });
}

console.log('Creating fresh deployment directory structure...');
fs.mkdirSync(deploymentDir, { recursive: true });
fs.mkdirSync(path.join(deploymentDir, 'public'), { recursive: true });
fs.mkdirSync(path.join(deploymentDir, 'public', 'assets'), { recursive: true });
fs.mkdirSync(path.join(deploymentDir, 'public', 'images'), { recursive: true });

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

// Function to copy file if it exists
function copyFileIfExists(src, dest) {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    return true;
  }
  return false;
}

// Check for and copy main HTML file from dist
const indexHtmlSrc = path.join(distDir, 'index.html');
if (fs.existsSync(indexHtmlSrc)) {
  console.log('Copying index.html to deployment directory...');
  fs.copyFileSync(indexHtmlSrc, path.join(deploymentDir, 'index.html'));
}

// Find and copy main CSS file to root as styles.css
const assetsDir = path.join(distDir, 'assets');
if (fs.existsSync(assetsDir)) {
  const cssFiles = fs.readdirSync(assetsDir).filter(file => file.endsWith('.css'));
  if (cssFiles.length > 0) {
    console.log('Copying main CSS file as styles.css...');
    fs.copyFileSync(
      path.join(assetsDir, cssFiles[0]), 
      path.join(deploymentDir, 'styles.css')
    );
  }
  
  // Copy the JS file to root as index.js
  const jsFiles = fs.readdirSync(assetsDir).filter(file => file.endsWith('.js'));
  if (jsFiles.length > 0) {
    console.log('Copying main JS file as index.js...');
    fs.copyFileSync(
      path.join(assetsDir, jsFiles[0]), 
      path.join(deploymentDir, 'index.js')
    );
  }
  
  // Copy the rest of the assets to public/assets
  console.log('Copying assets to public/assets...');
  fs.readdirSync(assetsDir).forEach(file => {
    if (!file.endsWith('.css') && !file.endsWith('.js')) {
      fs.copyFileSync(
        path.join(assetsDir, file),
        path.join(deploymentDir, 'public', 'assets', file)
      );
    }
  });
}

// Copy server-side index.js if it exists
const serverIndexSrc = path.join(distDir, 'index.js');
if (fs.existsSync(serverIndexSrc) && !fs.existsSync(path.join(deploymentDir, 'index.js'))) {
  console.log('Copying server index.js file...');
  fs.copyFileSync(serverIndexSrc, path.join(deploymentDir, 'index.js'));
}

// Copy package.json and package-lock.json
console.log('Copying package files...');
copyFileIfExists(
  path.join(rootDir, 'package.json'),
  path.join(deploymentDir, 'package.json')
);
copyFileIfExists(
  path.join(rootDir, 'package-lock.json'),
  path.join(deploymentDir, 'package-lock.json')
);

// Copy the AWS-S3-README.md as README.md in the deployment folder
copyFileIfExists(
  path.join(rootDir, 'AWS-S3-README.md'),
  path.join(deploymentDir, 'README.md')
);

// Copy favicon if it exists
const faviconSrc = path.join(publicDir, 'favicon.ico');
if (fs.existsSync(faviconSrc)) {
  console.log('Copying favicon.ico...');
  fs.copyFileSync(faviconSrc, path.join(deploymentDir, 'public', 'favicon.ico'));
}

// Copy public images and illustrations to public/images directory
console.log('Consolidating images and illustrations...');
const imagesDestDir = path.join(deploymentDir, 'public', 'images');

// Copy from public/images
const publicImagesDir = path.join(publicDir, 'images');
if (fs.existsSync(publicImagesDir)) {
  console.log('Copying images from public/images...');
  copyDirRecursively(publicImagesDir, imagesDestDir);
}

// Copy from dist/images if it exists
const distImagesDir = path.join(distDir, 'images');
if (fs.existsSync(distImagesDir)) {
  console.log('Copying images from dist/images...');
  copyDirRecursively(distImagesDir, imagesDestDir);
}

// Copy from public/illustrations to public/images
const publicIllustrationsDir = path.join(publicDir, 'illustrations');
if (fs.existsSync(publicIllustrationsDir)) {
  console.log('Copying illustrations to public/images...');
  const illustrations = fs.readdirSync(publicIllustrationsDir);
  for (const file of illustrations) {
    const srcPath = path.join(publicIllustrationsDir, file);
    const destPath = path.join(imagesDestDir, file);
    if (fs.statSync(srcPath).isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy from dist/illustrations if it exists
const distIllustrationsDir = path.join(distDir, 'illustrations');
if (fs.existsSync(distIllustrationsDir)) {
  console.log('Copying illustrations from dist/illustrations...');
  const illustrations = fs.readdirSync(distIllustrationsDir);
  for (const file of illustrations) {
    const srcPath = path.join(distIllustrationsDir, file);
    const destPath = path.join(imagesDestDir, file);
    if (fs.statSync(srcPath).isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('Post-build process completed successfully!');