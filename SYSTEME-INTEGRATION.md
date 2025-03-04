# Systeme.io Webhook Integration Guide for FlingPing.co

This document outlines how to set up and use the Systeme.io webhook integration with FlingPing.co.

## Overview

The Systeme.io integration allows data from your Systeme.io forms, email campaigns, and other interactions to be automatically synchronized with:

1. FlingPing.co's internal database
2. Google Sheets (optional)
3. Notion database (optional)

## Webhook Endpoint

The webhook endpoint that should be configured in Systeme.io is:

```
https://[your-domain]/webhook/systeme
```

Replace `[your-domain]` with your actual domain, such as `flingping.co`.

## Required Environment Variables

For the webhook to function properly, you need to set the following environment variables:

### Core Functionality
- `SYSTEME_WEBHOOK_SECRET`: A secret value used to verify webhook requests (**required for production**)

### Google Sheets Integration (Optional)
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Email address for your Google service account
- `GOOGLE_PRIVATE_KEY`: Private key for your Google service account (with proper escaping for newlines)
- `GOOGLE_SPREADSHEET_ID`: ID of the Google Spreadsheet to use
- `GOOGLE_SHEET_ID`: Index of the sheet within the spreadsheet (defaults to 0, which is the first sheet)

### Notion Integration (Optional)
- `NOTION_API_KEY`: Your Notion API integration token
- `NOTION_DATABASE_ID`: ID of the Notion database to use

## Setting Up in Systeme.io

1. Log in to your Systeme.io account
2. Navigate to "Automations" or "Webhooks" section
3. Create a new webhook
4. Set the destination URL to your webhook endpoint
5. Select the events you want to trigger the webhook (form submissions, purchases, etc.)
6. Add a custom header named `X-Webhook-Secret` with your secret value (must match the `SYSTEME_WEBHOOK_SECRET` environment variable)
7. Save and activate the webhook

## Data Format

The webhook expects data in the following format, but will attempt to handle variations:

```json
{
  "contact_email": "user@example.com",
  "contact_first_name": "John",
  "contact_last_name": "Doe",
  "form_name": "Newsletter Signup",
  "form_id": "123456",
  "custom_fields": {
    "source": "landing_page",
    "referrer": "google"
  }
}
```

However, the integration is flexible and will attempt to extract key information from different field names that Systeme.io might use.

## Testing the Integration

You can test the webhook integration by:

1. Submitting a test form in Systeme.io
2. Checking the server logs for webhook processing information
3. Verifying data appears in your database, Google Sheets and/or Notion

## Troubleshooting

- **Webhook not receiving data**: Check the Systeme.io webhook configuration and make sure it's active
- **Database errors**: Ensure your database tables are properly set up
- **Google Sheets errors**: Verify that the service account has edit permissions on the spreadsheet
- **Notion errors**: Check that your integration token has proper permissions for the database

## Security Considerations

- Always use HTTPS for your webhook endpoint
- **The webhook requires an `X-Webhook-Secret` header for authentication**
  - Requests without this header or with an incorrect value will be rejected with a 403 Forbidden response
  - Generate a random, strong secret (e.g., `openssl rand -hex 32`) and store it in both the environment variable and Systeme.io webhook configuration
- Restrict permissions for service accounts to only what's necessary
- Never expose your API keys or secrets in public repositories or client-side code
- Regularly rotate your webhook secret for enhanced security