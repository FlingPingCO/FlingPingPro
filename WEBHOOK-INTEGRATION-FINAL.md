# FlingPing.co Webhook Integration Flow

## Overview
This document provides a comprehensive overview of the data flow for FlingPing.co form submissions, including the integration with webhook.site, Systeme.io, and Google Sheets.

## Architecture Diagram

```
Client Form Submission
        ↓
FlingPing.co API ← Database Storage
        ↓
        ├──────→ Webhook.site
        │           ↓ 
        │     Inbound Webhook
        │           ↓
        ├──────→ Systeme.io API (Contact Management)
        │
        └──────→ Google Sheets (Data Tracking)
```

## Data Flow Details

### 1. Form Submission (Client → FlingPing.co API)
- Users submit forms on the FlingPing.co website (Email Signup, Contact Form)
- Data is validated and saved to the application database
- API responds with success confirmation to the client

### 2. FlingPing.co API → Webhook.site
- Form data is formatted and sent to webhook.site
- Webhook.site URL: `https://webhook.site/00af6027-a80c-4b5f-bd0e-ce5408f954ed`
- Data includes: form_type, user data, and timestamp
- This enables monitoring and debugging of form submissions

### 3. Webhook.site → Inbound Webhook
- Webhook.site can be configured to forward data to FlingPing.co's inbound webhook endpoint
- Endpoint: `/webhook/inbound`
- Security: Requires `X-Webhook-Secret` header with correct token
- This creates a circular flow for testing and backup data processing

### 4. FlingPing.co API → Systeme.io API
- Contact information is formatted according to Systeme.io requirements
- Endpoint: `api.systeme.io/api/contacts`
- Authentication: Uses `X-API-Key` header with Systeme.io API key
- Different form types include appropriate custom fields
- Error handling includes logging and fallback mechanisms

### 5. FlingPing.co API → Google Sheets
- Form data is formatted for Google Sheets insertion
- Authentication: Uses Google Service Account credentials
- Fallback mechanism implemented for development environments
- This provides a backup of all submissions and analytics data

## Security Implementations

### API Keys and Secrets
- All sensitive credentials are stored as environment variables:
  - `SYSTEME_API_KEY`: For Systeme.io API authentication
  - `SYSTEME_WEBHOOK_SECRET`: For webhook endpoint security
  - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: For Google Sheets authentication
  - `GOOGLE_PRIVATE_KEY`: For Google Sheets authentication
  - `GOOGLE_SPREADSHEET_ID`: To identify the target spreadsheet

### Webhook Security
- All inbound webhooks require the `X-Webhook-Secret` header
- Requests without valid secret are rejected with 403 Forbidden
- Additional header formats are supported for compatibility

## Error Handling

### Systeme.io API Errors
- Email validation errors are logged but don't disrupt the application flow
- Responses are monitored for debugging purposes
- Future improvements will include enhanced client-side validation

### Google Sheets Integration
- Fallback logging mechanism implemented for development environments
- PKCS#8 private key compatibility issues are handled gracefully
- All data is logged even when API calls fail

## Testing and Monitoring

### Webhook Testing
- The `webhook-test.js` script tests all integration points
- Tests include direct API endpoints and webhook flows
- Security validation is verified through missing token tests

### Response Monitoring
- All API responses are logged for monitoring
- Status codes and response bodies are captured
- Error conditions trigger detailed logging

## Implementation Notes

### Systeme.io Integration
- Contact creation uses the `/api/contacts` endpoint
- Each form type includes appropriate custom fields
- Names are split into firstName and lastName fields

### Google Sheets Integration
- Data is formatted into rows with consistent columns
- Integration handles large data payloads with truncation
- Timestamps ensure data ordering and tracking

## Recommendations for Production

1. Implement webhook.site forwarding to the inbound webhook endpoint for production use
2. Configure email validation to match Systeme.io requirements
3. Setup proper Google Service Account credentials on production servers
4. Implement monitoring alerts for integration failures

---

Documentation Last Updated: March 3, 2025