# FlingPing.co Updated Deployment Guide

*Date: March 3, 2025*

This updated guide reflects the removal of Systeme.io integration from the FlingPing.co platform. All sign-ups and user data are now handled directly through our application with Stripe for payments and Google Sheets for data collection.

## Environment Variables

The following environment variables must be set in your hosting environment:

### Core Variables
- `STRIPE_SECRET_KEY` - Your Stripe secret API key
- `STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
- `DOMAIN` - Your site domain (e.g., https://flingping.co)

### Webhook Integration Variables
- `PIPEDREAM_SECURITY_TOKEN` - Secret token for validating webhook requests

### Google Sheets Integration Variables
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` - Service account email for Google Sheets API
- `GOOGLE_PRIVATE_KEY` - Private key for Google service account
- `GOOGLE_SPREADSHEET_ID` - ID of the target Google Spreadsheet
- `GOOGLE_SHEET_ID` - Index of the target sheet (defaults to 0)

## Deployment Checklist

1. **Prepare Environment Variables**
   - Ensure all environment variables are configured in the Hostinger dashboard
   - Double-check that the GOOGLE_PRIVATE_KEY is properly formatted with escaped newlines

2. **Upload Code**
   - Upload the entire codebase to your Hostinger hosting environment
   - Ensure proper file permissions are set

3. **Install Dependencies**
   - Run `npm install` to install all required dependencies

4. **Build the Application**
   - Run `npm run build` to create the production build

5. **Configure Node.js Settings**
   - Set the Node.js version to 18.x or later
   - Configure the startup file as `server/index.ts`
   - Set the port to match Hostinger's requirements (typically 3000)

6. **Test Endpoints**
   - Verify the `/api/create-checkout-session` endpoint is working
   - Verify the `/webhook/inbound` endpoint is working
   - Test the form submission flow

7. **Configure Stripe Webhook**
   - Set up the Stripe webhook to point to your production URL
   - Add the endpoint: `https://yourdomain.com/api/webhook`
   - Enable the necessary events (checkout.session.completed, etc.)

## Post-Deployment Verification

Run the verification scripts to ensure everything is working correctly:

```bash
node deploy-guide/verify-stripe-image.js
```

This script verifies that the FlingPing.co logo is accessible at the expected path on the production server.

## Troubleshooting

If you encounter issues after deployment:

1. **Check Logs**
   - Review the Hostinger error logs for any issues

2. **Verify Environment Variables**
   - Ensure all environment variables are correctly set
   - Check for any typos or formatting issues

3. **Test API Endpoints**
   - Use curl to test the API endpoints directly
   - Example: `curl -X GET https://yourdomain.com/api/founding-flinger-count`

4. **Webhook Issues**
   - Verify the webhook security token is correct
   - Check Stripe dashboard for webhook delivery failures

## Legacy Endpoint Support

For backward compatibility, the following endpoints are still supported but will be removed in a future release:

- `/webhook/systeme` - Maintains compatibility with any existing webhook integrations

## Questions or Issues?

Contact the development team for assistance with deployment issues.