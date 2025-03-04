/**
 * FlingPing.co Favicon Generator
 * 
 * This script creates a favicon.ico file in the public directory
 * using the FlingPing.co logo.
 * 
 * Usage: node scripts/generate-favicon.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('Creating favicon.ico from logo...');

// Create a simple favicon for now - in a real project we would use a library like sharp
// For now, we'll just copy the logo to the public directory as favicon.ico
const logoPath = path.join(rootDir, 'public', 'images', 'FlingPing.co_Logo_TP_Background_Removed.png');
const faviconPath = path.join(rootDir, 'public', 'favicon.ico');

if (fs.existsSync(logoPath)) {
  // Simple copy for now - in production, you would properly resize and convert to .ico format
  fs.copyFileSync(logoPath, faviconPath);
  console.log(`Favicon created at: ${faviconPath}`);
} else {
  console.error(`Logo file not found at: ${logoPath}`);
  process.exit(1);
}