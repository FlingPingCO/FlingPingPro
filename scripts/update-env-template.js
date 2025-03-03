/**
 * FlingPing.co Environment Variable Setup Script
 * 
 * This script helps create or update the .env file with the necessary variables.
 * 
 * Usage:
 * 1. Run: node scripts/update-env-template.js
 * 2. Follow the prompts to enter your environment variables
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Define the environment variables we need
const requiredVariables = [
  {
    name: 'STRIPE_SECRET_KEY',
    description: 'Your Stripe Secret API Key (begins with sk_)',
    default: '',
    sensitive: true
  },
  {
    name: 'STRIPE_PUBLISHABLE_KEY',
    description: 'Your Stripe Publishable API Key (begins with pk_)',
    default: '',
    sensitive: false
  },
  {
    name: 'GOOGLE_SERVICE_ACCOUNT_EMAIL',
    description: 'The email address of your Google service account',
    default: '',
    sensitive: false
  },
  {
    name: 'GOOGLE_PRIVATE_KEY',
    description: 'The private key for your Google service account (-----BEGIN PRIVATE KEY----- ... -----END PRIVATE KEY-----)',
    default: '',
    sensitive: true,
    multiline: true
  },
  {
    name: 'GOOGLE_SPREADSHEET_ID',
    description: 'The ID of your Google Spreadsheet (from the URL)',
    default: '',
    sensitive: false
  },
  {
    name: 'GOOGLE_SHEET_ID',
    description: 'The index of the sheet to use (usually 0 for the first sheet)',
    default: '0',
    sensitive: false
  },
  {
    name: 'PIPEDREAM_SECURITY_TOKEN',
    description: 'A secure token for webhook validation',
    default: '',
    sensitive: true,
    generate: true
  },
  {
    name: 'VITE_STRIPE_PRODUCT_LINK',
    description: 'The URL path for the Stripe checkout',
    default: '/api/create-checkout-session',
    sensitive: false
  }
];

// Create a readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to ask a question and get a response
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Function to generate a random token
function generateSecureToken(length = 32) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
}

// Function to read the current .env file
function readCurrentEnv() {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    return fs.readFileSync(envPath, 'utf8');
  }
  return '';
}

// Function to extract values from the current .env file
function extractCurrentValues(envContent) {
  const values = {};
  const lines = envContent.split('\n');
  for (const line of lines) {
    // Skip comments and empty lines
    if (line.trim().startsWith('#') || line.trim() === '') {
      continue;
    }
    
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      values[key] = value;
    }
  }
  return values;
}

// Main function
async function main() {
  console.log('==========================================');
  console.log('FlingPing.co Environment Variable Setup');
  console.log('==========================================\n');
  
  // Read current .env file if it exists
  const currentEnvContent = readCurrentEnv();
  const currentValues = extractCurrentValues(currentEnvContent);
  
  console.log('This script will help you create or update your .env file with the necessary variables.\n');
  console.log('For each variable, you can:');
  console.log('  - Enter a new value');
  console.log('  - Press Enter to keep the current value (if any)');
  console.log('  - Type "generate" for security tokens to generate a random value\n');
  
  // Go through each required variable
  const newValues = {};
  for (const variable of requiredVariables) {
    const currentValue = currentValues[variable.name] || variable.default;
    const displayValue = variable.sensitive ? (currentValue ? '******' : '(empty)') : currentValue;
    
    let question = `${variable.name} - ${variable.description}\n`;
    question += `Current value: ${displayValue}\n`;
    
    if (variable.generate) {
      question += 'Enter new value (or "generate" for a random value, or press Enter to keep current): ';
    } else {
      question += 'Enter new value (or press Enter to keep current): ';
    }
    
    let value;
    if (variable.multiline) {
      console.log(question);
      console.log('For multiline input, enter each line and finish with a line containing only "END"');
      let lines = [];
      let line;
      do {
        line = await askQuestion('> ');
        if (line !== 'END') {
          lines.push(line);
        }
      } while (line !== 'END');
      value = lines.join('\\n');
    } else {
      value = await askQuestion(question);
    }
    
    if (value === '') {
      newValues[variable.name] = currentValue;
    } else if (variable.generate && value.toLowerCase() === 'generate') {
      newValues[variable.name] = generateSecureToken();
      console.log(`Generated new value: ${newValues[variable.name]}`);
    } else {
      newValues[variable.name] = value;
    }
    
    console.log(''); // Empty line for spacing
  }
  
  // Create the new .env content
  let newEnvContent = '# FlingPing.co Environment Variables\n';
  newEnvContent += '# Generated on ' + new Date().toISOString() + '\n\n';
  
  // Stripe section
  newEnvContent += '# Stripe Integration\n';
  newEnvContent += `STRIPE_SECRET_KEY=${newValues.STRIPE_SECRET_KEY}\n`;
  newEnvContent += `STRIPE_PUBLISHABLE_KEY=${newValues.STRIPE_PUBLISHABLE_KEY}\n\n`;
  
  // Google Sheets section
  newEnvContent += '# Google Sheets Integration\n';
  newEnvContent += `GOOGLE_SERVICE_ACCOUNT_EMAIL=${newValues.GOOGLE_SERVICE_ACCOUNT_EMAIL}\n`;
  newEnvContent += `GOOGLE_PRIVATE_KEY=${newValues.GOOGLE_PRIVATE_KEY}\n`;
  newEnvContent += `GOOGLE_SPREADSHEET_ID=${newValues.GOOGLE_SPREADSHEET_ID}\n`;
  newEnvContent += `GOOGLE_SHEET_ID=${newValues.GOOGLE_SHEET_ID}\n\n`;
  
  // Webhook section
  newEnvContent += '# Webhook Security\n';
  newEnvContent += `PIPEDREAM_SECURITY_TOKEN=${newValues.PIPEDREAM_SECURITY_TOKEN}\n\n`;
  
  // Frontend section
  newEnvContent += '# Frontend Configuration\n';
  newEnvContent += `VITE_STRIPE_PRODUCT_LINK=${newValues.VITE_STRIPE_PRODUCT_LINK}\n`;
  
  // Write the new .env file
  const envPath = path.join(process.cwd(), '.env');
  fs.writeFileSync(envPath, newEnvContent);
  
  console.log('✅ .env file has been created/updated successfully!');
  console.log(`   Location: ${envPath}`);
  console.log('\n⚠️ Important: Never commit your .env file to version control.');
  console.log('   Make sure .env is in your .gitignore file.\n');
  
  // Provide next steps
  console.log('Next steps:');
  console.log('1. Test the Google Sheets integration:');
  console.log('   node scripts/setup-google-sheets.js');
  console.log('2. Start the development server:');
  console.log('   npm run dev');
  
  console.log('\n==========================================');
  
  // Close the readline interface
  rl.close();
}

// Run the script
main().catch(error => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});