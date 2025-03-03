/**
 * FlingPing.co Google Sheets Integration Setup Script
 * 
 * This script helps verify and test the Google Sheets integration.
 * 
 * Usage:
 * 1. Make sure your .env file has the correct Google Sheets credentials
 * 2. Run: node scripts/setup-google-sheets.js
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

// Configuration from environment variables
const config = {
  clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  privateKey: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
  sheetId: parseInt(process.env.GOOGLE_SHEET_ID || '0', 10)
};

// Check if all required environment variables are set
function checkEnvironmentVariables() {
  const requiredVars = [
    'GOOGLE_SERVICE_ACCOUNT_EMAIL',
    'GOOGLE_PRIVATE_KEY',
    'GOOGLE_SPREADSHEET_ID'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\nPlease add these to your .env file and try again.');
    return false;
  }
  
  console.log('✅ All required environment variables are set.');
  return true;
}

// Test connection to Google Sheets
async function testGoogleSheetsConnection() {
  console.log('\nTesting connection to Google Sheets...');
  
  try {
    // Create JWT auth client
    const auth = new google.auth.JWT({
      email: config.clientEmail,
      key: config.privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    // Create Google Sheets client
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Get spreadsheet info to verify access
    const response = await sheets.spreadsheets.get({
      spreadsheetId: config.spreadsheetId
    });
    
    console.log(`✅ Successfully connected to Google Spreadsheet: "${response.data.properties.title}"`);
    console.log(`   - Sheets: ${response.data.sheets.map(sheet => `"${sheet.properties.title}"`).join(', ')}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error connecting to Google Sheets:');
    console.error(`   ${error.message}`);
    
    if (error.message.includes('invalid_grant')) {
      console.error('\n⚠️ The private key appears to be invalid or expired.');
      console.error('   Please check your service account credentials.');
    }
    
    if (error.message.includes('not found')) {
      console.error('\n⚠️ The spreadsheet ID appears to be invalid or you don\'t have access.');
      console.error('   Please check your spreadsheet ID and service account permissions.');
    }
    
    return false;
  }
}

// Test adding data to the spreadsheet
async function testAddingData() {
  console.log('\nTesting adding data to Google Sheets...');
  
  try {
    // Create JWT auth client
    const auth = new google.auth.JWT({
      email: config.clientEmail,
      key: config.privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    // Create Google Sheets client
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Example test data
    const testData = {
      timestamp: new Date().toISOString(),
      name: 'Test User',
      email: 'test-' + Math.floor(Math.random() * 10000) + '@example.com',
      source: 'setup-script',
      form_name: 'test-form',
      form_id: 'setup-test',
      custom_fields: { test: true }
    };
    
    // Format data for insertion
    const values = [
      [
        testData.timestamp,
        testData.name,
        testData.email,
        testData.source,
        testData.form_name,
        testData.form_id,
        JSON.stringify(testData.custom_fields)
      ]
    ];
    
    // Append the data
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: config.spreadsheetId,
      range: `Sheet${config.sheetId + 1}!A:G`, // Sheets are 1-indexed in the API
      valueInputOption: 'RAW',
      requestBody: {
        values
      }
    });
    
    console.log(`✅ Successfully added test data to spreadsheet`);
    console.log(`   - Added to: ${response.data.updates.updatedRange}`);
    console.log(`   - Test email: ${testData.email}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error adding data to Google Sheets:');
    console.error(`   ${error.message}`);
    
    if (error.message.includes('insufficient permission')) {
      console.error('\n⚠️ The service account doesn\'t have write permission.');
      console.error('   Please make sure your service account has edit access to the spreadsheet.');
    }
    
    return false;
  }
}

// Create or update header row
async function setupSpreadsheetHeaders() {
  console.log('\nSetting up spreadsheet headers...');
  
  try {
    // Create JWT auth client
    const auth = new google.auth.JWT({
      email: config.clientEmail,
      key: config.privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    // Create Google Sheets client
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Define headers
    const headers = [
      'Timestamp',
      'Name',
      'Email',
      'Source',
      'Form Name',
      'Form ID',
      'Custom Fields',
      'Raw Data'
    ];
    
    // Check if headers already exist
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: config.spreadsheetId,
      range: `Sheet${config.sheetId + 1}!A1:H1`
    });
    
    if (response.data.values && response.data.values[0] && response.data.values[0].length === headers.length) {
      console.log('✅ Headers already exist in the spreadsheet');
    } else {
      // Update headers
      await sheets.spreadsheets.values.update({
        spreadsheetId: config.spreadsheetId,
        range: `Sheet${config.sheetId + 1}!A1:H1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [headers]
        }
      });
      
      console.log('✅ Successfully added headers to spreadsheet');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error setting up spreadsheet headers:');
    console.error(`   ${error.message}`);
    return false;
  }
}

// Main function
async function main() {
  console.log('==========================================');
  console.log('FlingPing.co Google Sheets Integration Setup');
  console.log('==========================================\n');
  
  // Check environment variables
  if (!checkEnvironmentVariables()) {
    process.exit(1);
  }
  
  // Test connection
  if (!await testGoogleSheetsConnection()) {
    process.exit(1);
  }
  
  // Setup headers
  if (!await setupSpreadsheetHeaders()) {
    process.exit(1);
  }
  
  // Test adding data
  if (!await testAddingData()) {
    process.exit(1);
  }
  
  console.log('\n==========================================');
  console.log('✅ Google Sheets integration is working correctly!');
  console.log('==========================================');
}

// Run the script
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});