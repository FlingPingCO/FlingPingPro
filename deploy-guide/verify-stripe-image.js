/**
 * FlingPing.co Stripe Image Verification Script
 * 
 * This script verifies that the FlingPing.co logo is accessible
 * at the expected path on the production server.
 * 
 * Usage:
 * 1. Update the domain variable to your production domain
 * 2. Run: node verify-stripe-image.js
 */

const https = require('https');
const url = require('url');

// Replace with your production domain
const domain = process.env.VERIFY_DOMAIN || 'https://flingping.co';
const imagePath = '/images/FlingPing.co_Logo_TP_Background_Removed.png';
const imageUrl = `${domain}${imagePath}`;

console.log(`🔍 Verifying image accessibility at: ${imageUrl}`);

// Parse the URL
const parsedUrl = url.parse(imageUrl);

// Options for the request
const options = {
  hostname: parsedUrl.hostname,
  port: parsedUrl.port || 443,
  path: parsedUrl.path,
  method: 'GET',
  headers: {
    'User-Agent': 'FlingPing-Stripe-Image-Verifier/1.0'
  }
};

// Perform the request
const req = https.request(options, (res) => {
  console.log(`\n📊 Response Status: ${res.statusCode} ${res.statusMessage}`);
  console.log(`📋 Content Type: ${res.headers['content-type']}`);
  console.log(`📦 Content Length: ${res.headers['content-length']} bytes\n`);

  // Check if successful
  if (res.statusCode === 200) {
    if (res.headers['content-type'] && res.headers['content-type'].includes('image')) {
      console.log('✅ SUCCESS: Image is accessible and has the correct MIME type');
      
      // Additional checks
      if (res.headers['content-type'].includes('png')) {
        console.log('✅ Image is in PNG format (recommended for transparency)');
      } else {
        console.log('⚠️ WARNING: Image is not in PNG format, which is recommended for best quality');
      }
      
      if (res.headers['content-length']) {
        const size = parseInt(res.headers['content-length']);
        if (size > 100000) {
          console.log('⚠️ WARNING: Image size is larger than recommended (>100KB)');
        } else {
          console.log('✅ Image size is within reasonable limits');
        }
      }
      
    } else {
      console.log('❌ ERROR: Resource is accessible but is not an image');
      console.log(`Expected an image MIME type but got: ${res.headers['content-type']}`);
    }
  } else if (res.statusCode === 404) {
    console.log('❌ ERROR: Image not found (404)');
    console.log('Please check that the image exists at the specified path');
    console.log(`The image should be located at: public${imagePath}`);
  } else {
    console.log(`❌ ERROR: Unexpected status code: ${res.statusCode}`);
    console.log('Please check server configuration and access permissions');
  }

  // End of verification
  console.log('\n📝 Next Steps:');
  if (res.statusCode === 200 && res.headers['content-type'] && res.headers['content-type'].includes('image')) {
    console.log('1. Test the checkout process to ensure the image appears in Stripe checkout');
    console.log('2. Document this successful verification in your deployment records');
  } else {
    console.log('1. Fix the image access issues identified above');
    console.log('2. Run this verification script again to confirm the fix');
    console.log('3. If problems persist, consider using a direct Stripe payment link instead');
  }
});

req.on('error', (e) => {
  console.log('❌ ERROR: Connection failed');
  console.log(`Error details: ${e.message}`);
  console.log('\nPossible causes:');
  console.log('- Domain is not accessible');
  console.log('- SSL certificate issues');
  console.log('- Network connectivity problems');
});

req.end();

console.log('🔄 Sending request...');