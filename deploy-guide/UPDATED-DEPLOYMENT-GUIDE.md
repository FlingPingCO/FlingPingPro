# FlingPing.co Updated Deployment Guide

This guide provides comprehensive instructions for deploying the FlingPing.co website after the migration away from Systeme.io.

## Prerequisites

- Node.js 16+ installed on your server
- Access to your Hostinger control panel
- Domain configured to point to your hosting server
- All required environment variables (see below)

## Environment Variables

The following environment variables must be configured on the hosting platform:

### Core Variables
- `NODE_ENV` - Set to `production` for deployment
- `PORT` - Port to run the application (usually 3000 or as provided by hosting)
- `PUBLIC_URL` - URL of the deployed site (e.g., https://flingping.co)

### Stripe Integration
- `STRIPE_SECRET_KEY` - Secret key for Stripe API
- `STRIPE_PUBLISHABLE_KEY` - Publishable key for Stripe API
- `STRIPE_WEBHOOK_SECRET` - Secret for Stripe webhook validation

### Webhook Integration
- `PIPEDREAM_SECURITY_TOKEN` - Security token for webhook validation

### Google Sheets Integration
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` - Email for Google service account
- `GOOGLE_PRIVATE_KEY` - Private key for Google service account
- `GOOGLE_SPREADSHEET_ID` - ID of the Google spreadsheet to use

## Deployment Steps

### 1. Prepare the Production Build

1. Clone the repository to your local machine
2. Install dependencies: `npm install`
3. Build the application: `npm run build`

### 2. Configure Hostinger

1. Log in to your Hostinger control panel
2. Navigate to "Website" > "Node.js"
3. Set the Node.js version to 16.x or higher
4. Configure environment variables as listed above
5. Set the entry point to `server/index.js`
6. Set the build command to `npm run build`

### 3. Upload Files

1. Upload the entire project directory to your Hostinger server 
2. Alternatively, set up a Git deployment pipeline

### 4. Start the Application

1. In Hostinger control panel, go to "Website" > "Node.js"
2. Click "Restart Application"
3. Wait for the application to start (check logs for any errors)

### 5. Verify the Deployment

1. Visit your domain (e.g., https://flingping.co)
2. Test the following functionality:
   - Home page loads correctly
   - Signup form works and submits correctly to Google Sheets
   - Contact form works and submits correctly to Google Sheets
   - Checkout process works correctly with Stripe

## Troubleshooting

### Common Issues

1. **Website Not Loading**:
   - Check Node.js application status in Hostinger
   - Verify environment variables are set correctly
   - Check server logs for errors

2. **Forms Not Working**:
   - Verify PIPEDREAM_SECURITY_TOKEN is correct
   - Check Google Sheets integration variables
   - Look for network errors in browser console

3. **Payment Processing Issues**:
   - Verify Stripe keys are correctly set
   - Check Stripe dashboard for transaction logs
   - Ensure webhooks are correctly configured in Stripe dashboard

## Post-Deployment Verification

After deploying, perform the following tests:

1. Submit a test signup through the main form and verify it appears in Google Sheets
2. Submit a test message through the contact form and verify it appears in Google Sheets
3. Process a test payment (use Stripe test cards) and verify it completes successfully
4. Check all pages for proper styling and responsiveness
5. Verify all links are working correctly

## Maintenance

### Regular Maintenance Tasks

1. Monitor Google Sheets for proper data collection
2. Check server logs periodically for errors
3. Keep Node.js and npm packages updated
4. Monitor Stripe dashboard for payment issues

## Support

If you encounter issues during deployment, contact:

- Technical support: support@flingping.co
- Hosting issues: Hostinger support at https://www.hostinger.com/support