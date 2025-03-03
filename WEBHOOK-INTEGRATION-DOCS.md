# Webhook Integrations Documentation

Date: March 3, 2025

## Overview

This document provides comprehensive documentation for the webhook integrations implemented in the FlingPing.co platform. These integrations allow data from various sources to be automatically processed and stored in multiple destinations.

## Current Integrations

### 1. Webhook.site Integration

Used for testing and debugging webhook payloads.

**Endpoint URL**: `https://webhook.site/00af6027-a80c-4b5f-bd0e-ce5408f954ed`

**Integration Points**:
- Contact form submissions
- Email signup form submissions
- Systeme.io webhook payloads (forwarded)

**Purpose**: 
- Provides a visual dashboard for inspecting incoming webhook data
- Helps with debugging and validating webhook payloads
- No authentication required for development/testing

### 2. Systeme.io Integration

Receives webhook data from Systeme.io marketing platform.

**Endpoint**: `/webhook/systeme`

**Payload Format**:
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

**Processing**:
1. Stores data in local database (email signups table)
2. Forwards data to webhook.site for debugging/monitoring
3. Sends data to Google Sheets (when configured)
4. Sends data to Notion database (when configured)

### 3. Google Sheets Integration

Stores form submission and webhook data in Google Sheets.

**Configuration Required**:
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Service account email
- `GOOGLE_PRIVATE_KEY`: Service account private key
- `GOOGLE_SPREADSHEET_ID`: ID of the target spreadsheet
- `GOOGLE_SHEET_ID`: Index of the sheet within the spreadsheet (default: 0)

**Data Format**:
Each row contains:
- Timestamp
- Name
- Email
- Source
- Form Name
- Form ID
- Custom Fields (JSON string)
- Raw Data (truncated JSON string)

### 4. Notion Integration

Stores form submission and webhook data in a Notion database.

**Configuration Required**:
- `NOTION_API_KEY`: Notion API integration token
- `NOTION_DATABASE_ID`: ID of the target Notion database

**Database Properties**:
- Name (title)
- Email (text)
- Source (select)
- Form Name (text)
- Submitted At (date)
- Custom Fields (text, truncated to 2000 chars)

## Implementation Details

### Contact Form Integration

Located in `server/routes.ts` under the `/api/contact` endpoint.

Processing flow:
1. Validates input using Zod schema
2. Stores in local database
3. Sends to webhook.site for monitoring

### Email Signup Integration

Located in `server/routes.ts` under the `/api/email-signup` endpoint.

Processing flow:
1. Validates input using Zod schema
2. Checks for existing signup to prevent duplicates
3. Stores in local database
4. Sends to webhook.site for monitoring

### Systeme.io Webhook Integration

Located in `server/routes.ts` under the `/webhook/systeme` endpoint.

Processing flow:
1. Extracts and normalizes data from various field formats
2. Checks for existing signup to prevent duplicates
3. Stores in local database
4. Forwards to webhook.site for monitoring/debugging
5. Sends to Google Sheets (if configured)
6. Sends to Notion (if configured)

## Error Handling

All integrations implement non-blocking error handling, meaning:
- Failures in one integration do not prevent others from processing
- All errors are logged but don't cause the request to fail
- Webhook endpoints always return success responses to prevent retries

## Security Considerations

- Webhook validation is implemented but needs configuration via `SYSTEME_WEBHOOK_SECRET`
- All external API keys should be stored as environment variables
- Service accounts should have minimal necessary permissions

## Testing

Refer to the following test reports for integration testing details:
- `WEBHOOK-TEST-REPORT.md` - General webhook testing
- `WEBHOOK-TEST-REPORT-SYSTEME.md` - Systeme.io specific testing

## Sample Test Commands

```bash
# Test contact form
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"This is a test message"}' \
  http://localhost:5000/api/contact

# Test email signup
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}' \
  http://localhost:5000/api/email-signup

# Test Systeme.io webhook
curl -X POST -H "Content-Type: application/json" \
  -d '{"contact_email":"test@example.com","contact_first_name":"Test","contact_last_name":"User","form_name":"Test Form","form_id":"test123"}' \
  http://localhost:5000/webhook/systeme
```