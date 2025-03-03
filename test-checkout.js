/**
 * FlingPing.co Stripe Checkout Test Script
 * 
 * This script tests the Stripe checkout functionality with our updated local image integration.
 * 
 * To use:
 * 1. Make sure the server is running (npm run dev)
 * 2. Run this script: node test-checkout.js
 */

import fetch from 'node-fetch';

// Configuration
const config = {
  // Server info (change as needed for your environment)
  serverHost: 'localhost',
  serverPort: 5000,
};

// Generate unique email addresses with timestamps to avoid duplicate email errors
const timestamp = new Date().getTime();
const testUser = {
  name: 'Test User',
  email: `test.user.${timestamp}@example.com`,
};

async function testStripeCheckoutSession() {
  console.log('\n=== Testing Stripe Checkout Session ===');
  console.log(`Test user: ${testUser.name} (${testUser.email})`);
  
  try {
    console.log('Creating checkout session...');
    const response = await fetch(`http://${config.serverHost}:${config.serverPort}/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });

    const data = await response.json();
    console.log(`Response status: ${response.status}`);
    
    if (response.ok) {
      console.log('✅ Checkout session created successfully!');
      console.log(`Session URL: ${data.url}`);
      console.log('\nTo test the full checkout flow:');
      console.log('1. Open the URL above in your browser');
      console.log('2. Verify that the FlingPing.co logo appears on the checkout page');
      console.log('3. Complete a test payment with card number: 4242 4242 4242 4242');
      console.log('4. Verify the success/cancel flows');
    } else {
      console.log('❌ Failed to create checkout session');
      console.log('Error:', data);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testStripeCheckoutSession();