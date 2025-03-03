/**
 * FlingPing.co Stripe Image Integration Test
 * 
 * This script tests whether the FlingPing.co logo is accessible at the 
 * path used in the Stripe checkout configuration.
 */

import fetch from 'node-fetch';

// Configuration
const config = {
  serverHost: 'localhost',
  serverPort: 5000,
  imagePath: '/images/FlingPing.co_Logo_TP_Background_Removed.png'
};

async function testStripeImageAccess() {
  console.log('\n=== Testing Stripe Image Access ===');
  
  const imageUrl = `http://${config.serverHost}:${config.serverPort}${config.imagePath}`;
  console.log(`Testing image URL: ${imageUrl}`);
  
  try {
    console.log('Fetching image...');
    const response = await fetch(imageUrl);
    
    console.log(`Response status: ${response.status}`);
    
    if (response.ok) {
      console.log('✅ Image is accessible!');
      console.log(`Content type: ${response.headers.get('content-type')}`);
      console.log(`Content length: ${response.headers.get('content-length')} bytes`);
      
      // Verify this is actually an image
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.startsWith('image/')) {
        console.log('✅ Response is correctly identified as an image');
      } else {
        console.log('❌ Response does not have an image content type');
      }
    } else {
      console.log('❌ Image is not accessible');
      console.log(`Error: ${response.statusText}`);
    }
    
    console.log('\nVerification in Stripe checkout:');
    console.log('1. Open the Stripe checkout URL from test-checkout.js');
    console.log('2. Check if the FlingPing.co logo appears on the checkout page');
    console.log('3. If not, verify your production environment has this image available at:');
    console.log(`   https://yourdomain.com${config.imagePath}`);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testStripeImageAccess();