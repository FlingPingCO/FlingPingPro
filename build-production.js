// build-production.js
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname);

// Clean up old directories if they exist
if (fs.existsSync(path.join(rootDir, 'dist'))) {
  console.log('Removing existing dist directory...');
  fs.rmSync(path.join(rootDir, 'dist'), { recursive: true, force: true });
}

if (fs.existsSync(path.join(rootDir, 'flingping-deployment'))) {
  console.log('Removing existing deployment directory...');
  fs.rmSync(path.join(rootDir, 'flingping-deployment'), { recursive: true, force: true });
}

if (fs.existsSync(path.join(rootDir, 'flingping-deployment-full.zip'))) {
  console.log('Removing existing deployment zip file...');
  fs.unlinkSync(path.join(rootDir, 'flingping-deployment-full.zip'));
}

// Run the build
console.log('Running production build...');
try {
  execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
  console.log('Build completed successfully.');
  
  // Run post-build to organize files
  console.log('Running post-build script...');
  execSync('node scripts/post-build.js', { cwd: rootDir, stdio: 'inherit' });
  console.log('Post-build process completed successfully.');
  
  // Create the zip file
  console.log('Creating deployment zip file...');
  execSync('cd flingping-deployment && zip -r ../flingping-deployment-full.zip .', { cwd: rootDir, stdio: 'inherit' });
  
  console.log('Full production build complete! The deployment package is available at:');
  console.log('flingping-deployment-full.zip');
} catch (error) {
  console.error('Build process failed:', error);
  process.exit(1);
}