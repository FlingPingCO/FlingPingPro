# FlingPing.co - Hostinger Deployment Guide

This document provides instructions for deploying the FlingPing.co website to Hostinger hosting services.

## Overview

FlingPing.co is a full-stack Node.js application consisting of:
- Front-end: React with Tailwind CSS
- Back-end: Express.js API
- Data storage: In-memory storage (can be upgraded to a database)
- Integrations: Stripe, Google Sheets, webhook.site, Systeme.io

## Pre-deployment Checklist

1. **Domain Configuration**
   - Ensure your domain is registered and connected to Hostinger
   - Set up appropriate DNS records

2. **Environment Variables**
   The following environment variables need to be configured on Hostinger:
   ```
   # Google Sheets Integration
   GOOGLE_PRIVATE_KEY=<value>
   GOOGLE_SERVICE_ACCOUNT_EMAIL=<value>
   GOOGLE_SPREADSHEET_ID=<value>
   
   # Stripe Payment Integration
   STRIPE_PUBLISHABLE_KEY=<value>
   STRIPE_SECRET_KEY=<value>
   STRIPE_PRODUCT_ID=<value>        # The Stripe product ID for the membership
   STRIPE_PRICE_ID=<value>          # The Stripe price ID for the membership
   
   # Systeme.io Integration
   SYSTEME_API_KEY=<value>
   SYSTEME_WEBHOOK_SECRET=<value>
   
   # Webhook Integration
   PIPEDREAM_SECURITY_TOKEN=<value>
   
   # Server Configuration
   DOMAIN=https://flingping.co (update to your actual domain)
   PORT=3000 (or as required by Hostinger)
   NODE_ENV=production
   
   # Frontend Environment Variables (for the build process)
   VITE_STRIPE_PRODUCT_LINK=https://buy.stripe.com/00g9Ee2HifDDety001   # Direct Stripe payment link URL (preferred)
   ```

## Deployment Steps

### 1. Building the Application

Run the following commands in your development environment:

```bash
# Build both client and server
npm run build

# This will create:
# - dist/public (client files)
# - dist/index.js (server bundle)
```

### 2. Preparing Files for Upload

Ensure the following files and directories are ready for upload:
- `dist/` directory (containing both client and server files)
- `package.json` and `package-lock.json`
- `public/` directory (for static assets)

### 3. Uploading to Hostinger

1. Log in to your Hostinger control panel
2. Navigate to File Manager or use FTP/SFTP to upload files
3. Upload all the prepared files to the appropriate directory on your hosting

### 4. Setting Up Node.js Environment

Hostinger provides Node.js hosting through its control panel:

1. Navigate to the Node.js section in your Hostinger control panel
2. Select the appropriate Node.js version (14.x or higher recommended)
3. Configure the startup file as `dist/index.js`
4. Set up the environment variables listed in the pre-deployment checklist

### 5. Installing Dependencies

SSH into your Hostinger server and run:

```bash
npm install --production
```

### 6. Starting the Application

Hostinger typically provides a way to start/restart your Node.js application from the control panel. Use that to start the application.

If you need to start manually, run:

```bash
NODE_ENV=production node dist/index.js
```

### 7. Post-Deployment Verification

After deployment, verify the following:

1. Website loads correctly at your domain
2. All static assets (illustrations, etc.) display properly
3. The API endpoints respond correctly:
   - `/api/email-signup`
   - `/api/contact`
   - `/webhook/systeme`
   - `/webhook/inbound`

4. Test the integration with external services:
   - Stripe payment processing (see `deploy-guide/PAYMENT-INTEGRATION-GUIDE.md` for details)
   - Form submissions to Google Sheets
   - Integration with webhook.site
   - Systeme.io interactions

## Troubleshooting

### Common Issues

1. **Server returns 404 for React routes:**
   - Ensure the server's catch-all route is working correctly to serve the React app

2. **Missing environment variables:**
   - Verify all environment variables are set correctly in Hostinger

3. **Issues with webhook integrations:**
   - Check that the webhook endpoints are accessible from external services
   - Ensure security tokens are properly configured

### Logs

Access application logs through Hostinger's control panel or via SSH for troubleshooting.

## Payment System Configuration

FlingPing.co offers two methods for processing payments:

1. **Direct Stripe Payment Link** (Recommended)
   - Set `VITE_STRIPE_PRODUCT_LINK` environment variable to your Stripe payment link
   - This bypasses the API and sends users directly to Stripe's hosted checkout page
   - See `deploy-guide/PAYMENT-INTEGRATION-GUIDE.md` for detailed setup instructions

2. **API-generated Stripe Checkout** (Fallback)
   - Used automatically if no direct payment link is configured
   - Requires `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY` to be properly set
   - Creates a dynamic checkout session through the Stripe API

Refer to `deploy-guide/PAYMENT-INTEGRATION-GUIDE.md` for complete documentation on payment options.

## Maintenance

1. **Updating the application:**
   - Build a new version
   - Upload updated files
   - Restart the application

2. **Monitoring:**
   - Set up uptime monitoring
   - Monitor for errors and performance issues

3. **Backups:**
   - Regularly backup your application files and data

## Support

For further assistance, contact Hostinger support or refer to their Node.js hosting documentation.