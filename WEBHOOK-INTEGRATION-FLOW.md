# FlingPing.co Webhook Integration Flow

This document outlines the workflow for form submissions through webhooks on FlingPing.co.

## Overview

The system uses a multi-step webhook integration that allows for:
1. Secure data collection via web forms
2. Processing and validation of submitted data
3. Storage in multiple systems (local database, Systeme.io, Google Sheets)
4. Proper security validation at all steps

## Detailed Flow

### Form Submission Flow

```
User Form Submission → Webhook.site → Our Backend → Systeme.io & Google Sheets
```

1. **User submits a form on FlingPing.co website**
   - Form data is sent to our backend
   - Backend validates and saves the data locally
   - Backend forwards the data to Webhook.site for processing

2. **Webhook.site receives and processes the data**
   - Acts as an intermediary service to allow filtering and routing
   - Sends the data to our `/webhook/inbound` endpoint
   - Includes security validation with `X-Security-Token` header

3. **Our `/webhook/inbound` endpoint processes the webhook**
   - Validates the security token (`PIPEDREAM_SECURITY_TOKEN`)
   - Saves the data to our local database (if needed)
   - Forwards the data to Systeme.io API
   - Also sends the data to Google Sheets as a backup

4. **Systeme.io API receives the customer data**
   - Adds the contact to the appropriate list/workflow
   - Handles marketing automation, emails, etc.

5. **Google Sheets stores a complete record**
   - Acts as a backup storage system
   - Provides easy data access for team members

### Security Considerations

All webhook communications are secured with token-based authentication:

1. **Inbound Webhooks (Webhook.site → Our Backend)**
   - Protected by `X-Security-Token` header validation
   - Uses `PIPEDREAM_SECURITY_TOKEN` environment variable

2. **Systeme.io Webhooks (Systeme.io → Our Backend)**
   - Protected by `X-Webhook-Secret` header validation
   - Uses `SYSTEME_WEBHOOK_SECRET` environment variable

### Endpoint Reference

| Endpoint | Purpose | Security | Request Format |
|----------|---------|----------|----------------|
| `/api/email-signup` | Frontend form submission | N/A (internal) | `POST` with JSON body containing `name` and `email` |
| `/api/contact` | Frontend contact form | N/A (internal) | `POST` with JSON body containing `name`, `email`, and `message` |
| `/webhook/inbound` | Receive data from Webhook.site | `X-Security-Token` header | `POST` with JSON body from Webhook.site |
| `/webhook/systeme` | Receive data from Systeme.io | `X-Webhook-Secret` header | `POST` with JSON body from Systeme.io |

## Data Format

### Email Signup Format

```json
{
  "name": "User Name",
  "email": "user@example.com",
  "form_type": "email_signup"
}
```

### Contact Form Format

```json
{
  "name": "User Name",
  "email": "user@example.com",
  "message": "The user's message content",
  "form_type": "contact_form"
}
```

## Implementation Details

1. **Webhook.site Configuration**
   - Create a webhook at Webhook.site
   - Configure it to forward to your `/webhook/inbound` endpoint
   - Add the `X-Security-Token` header with the value from `PIPEDREAM_SECURITY_TOKEN`

2. **Google Sheets Integration**
   - Requires service account credentials in environment variables:
     - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
     - `GOOGLE_PRIVATE_KEY`
     - `GOOGLE_SPREADSHEET_ID`
     - `GOOGLE_SHEET_ID`

3. **Systeme.io Integration**
   - Requires API credentials in environment variables:
     - `SYSTEME_API_KEY`
     - `SYSTEME_WEBHOOK_SECRET`

## Troubleshooting

Common issues and their solutions:

1. **Webhook not being received**
   - Check that Webhook.site is properly configured
   - Verify that the security token is correctly set

2. **Data not appearing in Systeme.io**
   - Check Systeme.io API endpoints and authentication
   - Verify the data format matches Systeme.io expectations

3. **Google Sheets integration failing**
   - Verify the service account has proper permissions
   - Check that the sheet ID is correct