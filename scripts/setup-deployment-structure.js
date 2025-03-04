/**
 * FlingPing.co Deployment Structure Setup
 * 
 * This script creates the deployment structure for AWS S3 without running 
 * the full build process. It creates placeholder files to satisfy the 
 * required folder structure.
 * 
 * Usage: node scripts/setup-deployment-structure.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const deploymentDir = path.join(rootDir, 'flingping-deployment');

console.log('Setting up deployment structure...');

// Clean up old deployment directory if it exists
if (fs.existsSync(deploymentDir)) {
  console.log('Removing existing deployment directory...');
  fs.rmSync(deploymentDir, { recursive: true, force: true });
}

// Create deployment directory structure
console.log('Creating deployment directory structure...');
fs.mkdirSync(deploymentDir, { recursive: true });
fs.mkdirSync(path.join(deploymentDir, 'public'), { recursive: true });
fs.mkdirSync(path.join(deploymentDir, 'public', 'assets'), { recursive: true });
fs.mkdirSync(path.join(deploymentDir, 'public', 'images'), { recursive: true });

// Create placeholder files
console.log('Creating placeholder files...');

// Create index.html
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FlingPing.co</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="icon" href="public/favicon.ico">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="index.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(deploymentDir, 'index.html'), indexHtml);

// Create styles.css
const stylesCSS = `/* FlingPing.co main stylesheet */
:root {
  --primary: #2DD4BF;
  --secondary: #FF695E;
  --background: #f4e9d9;
  --foreground: #1a1a1a;
  --accent: #FFCA28;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: var(--background);
  color: var(--foreground);
}

#root {
  min-height: 100vh;
}`;

fs.writeFileSync(path.join(deploymentDir, 'styles.css'), stylesCSS);

// Create a minimal JavaScript file
const indexJs = `// FlingPing.co main JavaScript file
console.log('FlingPing.co application loaded');

// Display a message when no JavaScript bundle is available
window.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = \`
      <div style="max-width: 800px; margin: 0 auto; padding: 40px 20px; text-align: center;">
        <h1 style="color: #2DD4BF; margin-bottom: 20px;">FlingPing.co</h1>
        <p style="font-size: 18px; line-height: 1.6;">
          A cutting-edge sexual health platform providing inclusive, private, and 
          accessible digital health communication through innovative technology.
        </p>
        <div style="margin: 40px 0;">
          <p style="background: #FF695E; color: white; padding: 10px 20px; display: inline-block; border-radius: 4px;">
            This is a placeholder page for the AWS S3 deployment.
          </p>
        </div>
      </div>
    \`;
  }
});`;

fs.writeFileSync(path.join(deploymentDir, 'index.js'), indexJs);

// Copy favicon if it exists or generate one
const faviconSrc = path.join(rootDir, 'public', 'favicon.ico');
const faviconDest = path.join(deploymentDir, 'public', 'favicon.ico');

if (fs.existsSync(faviconSrc)) {
  console.log('Copying favicon...');
  fs.copyFileSync(faviconSrc, faviconDest);
} else {
  console.log('Generating favicon from logo...');
  try {
    execSync('node scripts/generate-favicon.js', { stdio: 'inherit' });
    if (fs.existsSync(path.join(rootDir, 'public', 'favicon.ico'))) {
      fs.copyFileSync(path.join(rootDir, 'public', 'favicon.ico'), faviconDest);
    }
  } catch (error) {
    console.warn('Failed to generate favicon:', error.message);
  }
}

// Copy package.json and package-lock.json
console.log('Copying package files...');
if (fs.existsSync(path.join(rootDir, 'package.json'))) {
  fs.copyFileSync(path.join(rootDir, 'package.json'), path.join(deploymentDir, 'package.json'));
}

if (fs.existsSync(path.join(rootDir, 'package-lock.json'))) {
  fs.copyFileSync(path.join(rootDir, 'package-lock.json'), path.join(deploymentDir, 'package-lock.json'));
}

// Copy AWS-S3-README.md as README.md
if (fs.existsSync(path.join(rootDir, 'AWS-S3-README.md'))) {
  fs.copyFileSync(path.join(rootDir, 'AWS-S3-README.md'), path.join(deploymentDir, 'README.md'));
}

// Copy all images from public/images to deployment
const publicImagesDir = path.join(rootDir, 'public', 'images');
const deployImagesDir = path.join(deploymentDir, 'public', 'images');

if (fs.existsSync(publicImagesDir)) {
  console.log('Copying images...');
  const imageFiles = fs.readdirSync(publicImagesDir);
  
  for (const file of imageFiles) {
    const srcPath = path.join(publicImagesDir, file);
    const destPath = path.join(deployImagesDir, file);
    
    if (fs.statSync(srcPath).isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Create a simple logo asset in public/assets
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
  <rect width="200" height="80" fill="#f4e9d9" rx="8" ry="8"/>
  <text x="10" y="50" font-family="Arial" font-size="24" font-weight="bold">
    <tspan fill="#2DD4BF">FlingPing</tspan><tspan fill="#FF695E">.co</tspan>
  </text>
</svg>`;

fs.writeFileSync(path.join(deploymentDir, 'public', 'assets', 'logo.svg'), logoSvg);

// Create zip file
console.log('Creating deployment zip file...');
try {
  execSync(`cd ${deploymentDir} && zip -r ../flingping-deployment.zip .`, { 
    stdio: 'inherit' 
  });
  
  const zipPath = path.join(rootDir, 'flingping-deployment.zip');
  const stats = fs.statSync(zipPath);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
  
  console.log(`\nDeployment zip file created: ${sizeMB} MB`);
} catch (error) {
  console.error('Failed to create zip file:', error.message);
}

console.log('\nDeployment structure setup completed successfully!');
console.log('You can now upload the flingping-deployment.zip file to AWS S3.');

// Display the final structure
console.log('\nFinal structure:');
try {
  execSync(`find ${deploymentDir} -type f | sort`, { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to display structure:', error.message);
}