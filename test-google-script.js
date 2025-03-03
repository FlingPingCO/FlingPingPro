// @ts-check
import fetch from 'node-fetch';

async function testGoogleAppsScriptIntegration() {
  console.log('Testing Google Apps Script Integration...');
  
  const testData = {
    form_type: "test_integration",
    name: "Test Integration",
    email: "test-integration@example.com",
    message: "This is a test message from the integration test",
    timestamp: new Date().toISOString(),
    source: "direct_test",
    form_name: "Integration Test Form",
    form_id: "test_script",
    custom_fields: {
      form_type: "test_integration"
    }
  };

  try {
    // Send request to Google Apps Script
    console.log('Sending request to Google Apps Script...');
    const response = await fetch('https://script.google.com/macros/s/AKfycbyHH0EG9iOxbumMMs098mXdSSh3q9mzlKnCd8rfJAPCWhM8_aPK1xV4UPv_Arm4vZPHBA/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData),
      redirect: 'follow' // Follow redirects automatically
    });

    console.log(`Google Apps Script Response Status Code: ${response.status}`);
    const responseText = await response.text();
    console.log(`Google Apps Script Response: ${responseText || 'No response'}`);
    
    if (responseText.includes('Success')) {
      console.log("✅ Test data successfully submitted to Google Sheets via Apps Script");
    } else {
      console.log("❌ Failed to submit test data to Google Sheets via Apps Script");
    }
  } catch (error) {
    console.error('Error during Google Apps Script integration test:', error);
  }
}

// Run the test
testGoogleAppsScriptIntegration();