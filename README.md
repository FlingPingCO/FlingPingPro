# FlingPing.co Platform

A cutting-edge sexual health platform providing inclusive, private, and accessible digital health communication through innovative technology and user-centric design.

## Tech Stack

- **Frontend:** React with Tailwind CSS for styling
- **Backend:** Node.js with Express
- **Data Storage:** In-memory database with webhook backup
- **Payments:** Enhanced Stripe integration with local image assets
- **Form Data Collection:** webhook.site, Google Sheets, and Notion integrations
- **Email Marketing:** Systeme.io webhook integration
- **Authentication:** Custom user auth system

## Key Features

- Email signup form with data collection
- Contact form with data collection
- Founding Flinger membership with enhanced Stripe checkout experience
- Multiple payment options (direct Stripe link or API-generated checkout)
- Local image integration for consistent branding in checkout flow
- Webhook integration for form data backup
- User account management

## Project Structure

- `client/` - Frontend React application
- `server/` - Backend Express server
- `shared/` - Shared types and schemas
- `public/` - Static assets

## Integration Documentation

### Payment Integration
- [Stripe Integration](./STRIPE-INTEGRATION.md)
- [Stripe Checkout Enhancement Summary](./STRIPE-CHECKOUT-ENHANCEMENT-SUMMARY.md)
- [Stripe Image Integration Guide](./deploy-guide/STRIPE-IMAGE-INTEGRATION-GUIDE.md)
- [Payment Integration Guide](./deploy-guide/PAYMENT-INTEGRATION-GUIDE.md)
- [Stripe Product Configuration](./deploy-guide/STRIPE-PRODUCT-CONFIGURATION.md)

### Webhook & External Services
- [Webhook Integration](./WEBHOOK-INTEGRATION.md)
- [Webhook Test Report](./WEBHOOK-TEST-REPORT.md)
- [Comprehensive Webhook Documentation](./WEBHOOK-INTEGRATION-DOCS.md)
- [Webhook Integration Flow](./WEBHOOK-INTEGRATION-FLOW.md)

### Third-Party Integrations
- [Systeme.io Integration](./SYSTEME-INTEGRATION.md)
- [Systeme.io Test Report](./WEBHOOK-TEST-REPORT-SYSTEME.md)
- [Systeme.io Payment Integration](./deploy-guide/SYSTEME-PAYMENT-INTEGRATION.md)

### Deployment & Verification
- [Hostinger Deployment Guide](./deploy-guide/HOSTINGER-DEPLOYMENT-GUIDE.md)
- [Updated Deployment Checklist](./deploy-guide/UPDATED-DEPLOYMENT-CHECKLIST.md)
- [Post-Deployment Verification](./deploy-guide/POST-DEPLOYMENT-VERIFICATION.md)

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Access the application at:
   ```
   http://localhost:5000
   ```

## Environment Variables

The following environment variables are used:

### Core Environment Variables
- `STRIPE_SECRET_KEY` - Stripe API secret key
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `DOMAIN` - Domain for redirects (defaults to http://localhost:5000)
- `VITE_STRIPE_PRODUCT_LINK` - Optional direct Stripe payment link (for production use)

### Webhook & Systeme.io Integration Variables
- `SYSTEME_WEBHOOK_SECRET` - Secret for validating all webhook requests (Systeme.io and inbound webhooks)
- `SYSTEME_API_KEY` - API key for Systeme.io API integration

### Google Sheets Integration Variables
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` - Service account email for Google Sheets API
- `GOOGLE_PRIVATE_KEY` - Private key for Google service account
- `GOOGLE_SPREADSHEET_ID` - ID of the target Google Spreadsheet
- `GOOGLE_SHEET_ID` - Index of the target sheet (defaults to 0)

### Notion Integration Variables
- `NOTION_API_KEY` - Notion API integration token
- `NOTION_DATABASE_ID` - ID of the target Notion database

## Development Guidelines

1. All new endpoints should follow the pattern in `server/routes.ts`
2. All new components should be added to `client/src/components`
3. Shared types should be defined in `shared/schema.ts`
4. Use the existing storage patterns in `server/storage.ts`

## Webhook Integration

The application implements a bidirectional webhook integration system:

### Outbound (FlingPing.co → Webhook.site)
- Forms on FlingPing.co send data to our backend first
- Data is stored in our database and then forwarded to Webhook.site
- Webhook URL: `https://webhook.site/00af6027-a80c-4b5f-bd0e-ce5408f954ed`
- Two form types are supported: Email Signup (`form_type: "email_signup"`) and Contact Form (`form_type: "contact_form"`)

### Inbound (Webhook.site → FlingPing.co → Systeme.io & Google Sheets)
- Webhook.site processes the data and forwards it to our webhook endpoint
- Endpoint: `/webhook/inbound` secured with `X-Webhook-Secret` header
- Our system validates, processes, and stores the data
- Data is then forwarded to Systeme.io's API for contact management
- A backup copy is sent to Google Sheets for data redundancy

### Testing & Development
- Use the `webhook-test.js` script to test the integration flow
- See [Webhook Integration Flow](./WEBHOOK-INTEGRATION-FLOW.md) for a detailed explanation of the entire process
- Refer to [Systeme.io Integration](./SYSTEME-INTEGRATION.md) for specific details about the Systeme.io integration

## License

Proprietary - All rights reserved