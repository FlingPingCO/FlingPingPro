# FlingPing.co Webhook Integration Guide

This document explains how to properly set up the webhook integration flow for FlingPing.co to ensure secure data transmission between the website, Webhook.site, Google Sheets, and Systeme.io.

## Current Integration Flow

The current webhook integration flow works as follows:

1. User submits a form on FlingPing.co (email signup or contact form)
2. Form data is saved to the backend API
3. Backend forwards data to Webhook.site
4. Webhook.site can trigger a webhook back to FlingPing.co
5. FlingPing.co then forwards data to Google Sheets and Systeme.io

## Required Environment Variables

For complete functionality, the following environment variables need to be configured:

### Security
- `SYSTEME_WEBHOOK_SECRET`: Secret for webhook authentication (✅ Currently configured)

### Google Sheets Integration
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Email of Google service account
- `GOOGLE_PRIVATE_KEY`: Private key of Google service account
- `GOOGLE_SPREADSHEET_ID`: ID of the Google Spreadsheet
- `GOOGLE_SHEET_ID`: Sheet ID within the spreadsheet (default: 0)

### Systeme.io Integration
- `SYSTEME_API_KEY`: API key for Systeme.io

## Current Implementation Status

Currently, the application implements mock-friendly graceful degradation:

1. ✅ **Local Database Storage**: Always works, form submissions are saved locally
2. ✅ **Webhook.site Integration**: Always works, for testing and debugging
3. ⚠️ **Google Sheets Integration**: Mock implementation if variables are missing
4. ⚠️ **Systeme.io Integration**: Mock implementation if variables are missing

## Setting Up Google Sheets Integration

1. Create a Google Cloud project
2. Enable the Google Sheets API
3. Create a service account and download the credentials JSON file
4. Extract the client_email and private_key from the JSON file
5. Create a Google Spreadsheet and share it with the service account email
6. Set the following environment variables:
   ```
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   GOOGLE_SPREADSHEET_ID=spreadsheet-id-from-url
   GOOGLE_SHEET_ID=0
   ```

## Setting Up Systeme.io Integration

1. Log in to your Systeme.io account
2. Navigate to Settings > API Keys
3. Generate a new API key
4. Set the following environment variable:
   ```
   SYSTEME_API_KEY=your-systeme-io-api-key
   ```

## Security Considerations

All webhook requests are protected by the `SYSTEME_WEBHOOK_SECRET` environment variable. This secret is used to validate inbound webhook requests and is required for webhook authentication.

## Testing the Integration

You can test the complete webhook flow using the included `webhook-test.js` script:

```
node webhook-test.js
```

This script will:
1. Test direct form submissions
2. Test webhook.site forwarding
3. Test inbound webhook processing
4. Test Google Sheets and Systeme.io integration

## Troubleshooting

If data is not being properly forwarded to Google Sheets or Systeme.io:

1. Check the console logs for error messages
2. Verify that all required environment variables are set
3. Check the API endpoint configurations in `server/routes.ts`
4. Ensure that service accounts have proper permissions

When properly configured, the system provides quadruple redundancy for user data:
1. Local database
2. Webhook.site archives
3. Google Sheets backup
4. Systeme.io contact management