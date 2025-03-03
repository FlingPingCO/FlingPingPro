/**
 * FlingPing.co Webhook Integration Test Script
 * 
 * This script simulates the webhook integration flow for testing purposes.
 * It sends test data to both our direct API endpoints and webhook endpoints.
 * 
 * To use:
 * 1. Make sure the server is running (npm run dev)
 * 2. Run this script: node webhook-test.js
 */

import https from 'https';
import http from 'http';
import { env } from 'process';

// Configuration
const config = {
  // Server info (change as needed for your environment)
  serverHost: 'localhost',
  serverPort: 5000,
  
  // Webhook.site URL (replace with your actual webhook URL)
  webhookSiteId: '00af6027-a80c-4b5f-bd0e-ce5408f954ed',
  
  // Security token (for testing only - in production, this is in environment variables)
  webhookSecret: env.SYSTEME_WEBHOOK_SECRET || 'test-webhook-secret',
};

// Test data
const testEmailSignup = {
  name: 'Test User',
  email: 'test.user@gmail.com',
  form_type: 'email_signup'
};

const testContactForm = {
  name: 'Contact User',
  email: 'contact.user@outlook.com',
  message: 'This is a test contact message',
  form_type: 'contact_form'
};

// Helper function to make HTTP requests
function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = (options.port === 443 ? https : http).request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        console.log(`Response Status: ${res.statusCode}`);
        try {
          const parsedData = JSON.parse(responseData);
          console.log('Response Body:', JSON.stringify(parsedData, null, 2));
          resolve({ status: res.statusCode, data: parsedData });
        } catch (e) {
          console.log('Response Body (not JSON):', responseData);
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('Request Error:', error.message);
      reject(error);
    });
    
    if (data) {
      const strData = typeof data === 'string' ? data : JSON.stringify(data);
      req.write(strData);
    }
    
    req.end();
  });
}

// Test functions
async function testDirectEmailSignup() {
  console.log('\n=== Testing Direct Email Signup ===');
  try {
    const options = {
      hostname: config.serverHost,
      port: config.serverPort,
      path: '/api/email-signup',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    await makeRequest(options, testEmailSignup);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

async function testDirectContactForm() {
  console.log('\n=== Testing Direct Contact Form ===');
  try {
    const options = {
      hostname: config.serverHost,
      port: config.serverPort,
      path: '/api/contact',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    await makeRequest(options, testContactForm);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

async function testWebhookSiteForward() {
  console.log('\n=== Testing Webhook.site Forward ===');
  try {
    const options = {
      hostname: 'webhook.site',
      port: 443,
      path: `/${config.webhookSiteId}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    await makeRequest(options, testEmailSignup);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

async function testInboundWebhook() {
  console.log('\n=== Testing Inbound Webhook (with webhook secret) ===');
  try {
    const options = {
      hostname: config.serverHost,
      port: config.serverPort,
      path: '/webhook/inbound',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': config.webhookSecret
      }
    };
    
    await makeRequest(options, testEmailSignup);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

async function testInboundWebhookMissingToken() {
  console.log('\n=== Testing Inbound Webhook (missing webhook secret) ===');
  try {
    const options = {
      hostname: config.serverHost,
      port: config.serverPort,
      path: '/webhook/inbound',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    await makeRequest(options, testEmailSignup);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

async function testInboundWebhookContactForm() {
  console.log('\n=== Testing Inbound Webhook with Contact Form ===');
  try {
    const options = {
      hostname: config.serverHost,
      port: config.serverPort,
      path: '/webhook/inbound',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': config.webhookSecret
      }
    };
    
    await makeRequest(options, testContactForm);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run all tests
async function runAllTests() {
  try {
    console.log('Starting webhook integration tests...');
    
    // Test direct API endpoints
    await testDirectEmailSignup();
    await testDirectContactForm();
    
    // Test webhook flow
    await testWebhookSiteForward();
    await testInboundWebhook();
    await testInboundWebhookMissingToken();
    await testInboundWebhookContactForm();
    
    console.log('\nAll tests completed!');
  } catch (error) {
    console.error('Test suite failed:', error);
  }
}

// Execute tests
runAllTests();