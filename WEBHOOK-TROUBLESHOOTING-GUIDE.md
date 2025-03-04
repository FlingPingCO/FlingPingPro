# FlingPing.co Webhook Integration Troubleshooting Guide

## Common Issues and Solutions

### 1. Webhook.site Connection Issues

#### Symptoms:
- Error logs show "Webhook.site Request Error"
- No data appears in webhook.site dashboard

#### Solutions:
- Verify the webhook.site URL is correct (00af6027-a80c-4b5f-bd0e-ce5408f954ed)
- Check network connectivity from the server
- Confirm HTTPS request formatting is correct
- Try accessing webhook.site directly to verify it's operational

#### Debugging Steps:
```javascript
// Add this to server/routes.ts in the webhook request error handler
console.error(`Webhook.site Request Error Details:`, {
  error: e.message,
  stack: e.stack,
  requestOptions: requestOptions
});
```

### 2. Systeme.io API Validation Errors

#### Symptoms:
- 422 status code responses from Systeme.io API
- Error messages about invalid email formats
- "Email address is already used" errors

#### Solutions:
- Verify email addresses conform to Systeme.io requirements
- Implement client-side email validation (regex patterns)
- Check for duplicate email prevention in forms
- Consider implementing email verification before sending to Systeme.io

#### Debugging Steps:
```javascript
// Add detailed logging for Systeme.io API requests
console.log('Systeme.io API Request Details:', {
  endpoint: 'api.systeme.io/api/contacts',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': '[REDACTED]',
    'Accept': 'application/json'
  },
  data: {
    email: formData.email,
    firstName: formData.name.split(' ')[0],
    lastName: formData.name.split(' ').slice(1).join(' '),
    // Redact other details
  }
});
```

### 3. Google Sheets Integration Errors

#### Symptoms:
- "ERR_OSSL_UNSUPPORTED" errors
- "Error sending data to Google Sheets" messages
- Missing data in Google Sheets

#### Solutions:
- Verify Google service account credentials are correctly formatted
- Ensure the private key is properly escaped in environment variables
- Check spreadsheet ID and permissions
- Use the fallback mechanism in development environments

#### Debugging Private Key Issues:
```bash
# Check if private key is correctly formatted (without revealing the key)
echo $GOOGLE_PRIVATE_KEY | wc -c
# Should return the character count of your key

# Verify service account email format
echo $GOOGLE_SERVICE_ACCOUNT_EMAIL | grep -E "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
# Should return the email if correctly formatted
```

### 4. Webhook Security Validation Failures

#### Symptoms:
- 403 Forbidden responses from inbound webhook endpoints
- "Invalid or missing webhook secret header" errors
- Webhook data not being processed

#### Solutions:
- Verify `SYSTEME_WEBHOOK_SECRET` is correctly set in environment variables
- Ensure webhook requests include the `X-Webhook-Secret` header
- Check for case sensitivity or whitespace issues in the secret
- Verify the header name matches exactly what the server expects

#### Debugging Steps:
```javascript
// Add detailed header logging (be careful not to expose secrets in production)
console.log('Webhook Headers Received:', Object.keys(req.headers));
console.log('Webhook Secret Header Length:', 
  (req.headers['x-webhook-secret'] as string)?.length || 'Missing');
```

### 5. Circular Webhook Loop Issues

#### Symptoms:
- Excessive API calls
- Duplicate data in storage systems
- Server performance degradation

#### Solutions:
- Implement deduplication using timestamps or unique IDs
- Add rate limiting to webhook endpoints
- Implement a flag system to prevent recursive processing
- Add logging to track the flow of specific requests

#### Implementation Example:
```javascript
// Add to webhook processing logic
const processId = crypto.randomUUID();
console.log(`Processing webhook [${processId}] from source: ${req.headers['user-agent']}`);

// Add a recently processed cache to avoid duplicates
const recentlyProcessed = new Map();
// Check for recently processed identical payloads
const payloadHash = crypto.createHash('md5').update(JSON.stringify(req.body)).digest('hex');
if (recentlyProcessed.has(payloadHash)) {
  console.log(`Skipping duplicate webhook payload [${processId}], previous: ${recentlyProcessed.get(payloadHash)}`);
  return res.status(200).json({ success: true, message: "Duplicate request", skipped: true });
}
recentlyProcessed.set(payloadHash, processId);
```

### 6. Environment Configuration Issues

#### Symptoms:
- "Configuration not found" messages
- Integration fallbacks being triggered unexpectedly
- Inconsistent behavior between environments

#### Solutions:
- Verify all required environment variables are set
- Check for proper formatting of multi-line environment values
- Implement configuration validation on application startup
- Create a configuration diagnostic endpoint for troubleshooting

#### Configuration Check Example:
```javascript
// Add to server startup
function validateConfiguration() {
  const configStatus = {
    systemeApiKey: !!process.env.SYSTEME_API_KEY,
    systemeWebhookSecret: !!process.env.SYSTEME_WEBHOOK_SECRET,
    googleServiceEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    googlePrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
    googleSpreadsheetId: !!process.env.GOOGLE_SPREADSHEET_ID,
  };
  
  const missingConfigs = Object.entries(configStatus)
    .filter(([_, status]) => !status)
    .map(([name]) => name);
    
  if (missingConfigs.length > 0) {
    console.warn(`WARNING: Missing configurations: ${missingConfigs.join(', ')}`);
  } else {
    console.log('All required configurations present');
  }
  
  return configStatus;
}
```

## Advanced Troubleshooting

### Logging Strategy
- Enable DEBUG level logging in production for integration points
- Implement structured logging with correlation IDs
- Set up log aggregation and monitoring
- Create dashboard alerts for integration failures

### Network Diagnostics
- Use tools like `curl` to test API endpoints directly
- Verify DNS resolution for integration services
- Check for network restrictions or firewall issues
- Test latency to integration services

### Data Validation Testing
- Create a test suite with boundary cases for email formats
- Test with international characters and special cases
- Verify handling of malformed JSON data
- Implement data sanitization for all inputs

## Support Resources

- [Systeme.io API Documentation](https://systeme.io/api-docs)
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Webhook.site Documentation](https://webhook.site/docs)

---

Last Updated: March 3, 2025

For additional support, contact the FlingPing.co development team.