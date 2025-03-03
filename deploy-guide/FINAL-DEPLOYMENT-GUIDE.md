# FlingPing.co Final Deployment Guide

This comprehensive guide provides step-by-step instructions for deploying the FlingPing.co website on Hostinger after the completion of Systeme.io removal.

## Prerequisites

### Accounts & Services
- Hostinger account with Node.js hosting enabled
- Google Cloud Platform account with:
  - Service Account for Google Sheets API
  - Google Analytics property (G-QR5CM2PM80)
- Stripe account with:
  - Properly configured product for "Founding Flinger" membership
  - Webhook endpoints set up
- Domain (FlingPing.co) with DNS access

### Required Environment Variables
```
# Stripe Integration
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxx

# Google Sheets Integration
GOOGLE_SERVICE_ACCOUNT_EMAIL=google-sheets@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nXXXXXXXXXXXXXXXX\n-----END PRIVATE KEY-----\n
GOOGLE_SPREADSHEET_ID=1xXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx

# Webhook Security
PIPEDREAM_SECURITY_TOKEN=your_webhook_security_token

# Frontend Configuration
VITE_STRIPE_PRODUCT_LINK=/api/create-checkout-session
```

## Deployment Steps

### 1. Prepare Your Hostinger Environment

1. **Set up Node.js hosting**:
   - Log in to your Hostinger control panel
   - Navigate to "Website" > "Hosting" section
   - Verify Node.js is enabled (version 18.x or higher recommended)

2. **Configure domain settings**:
   - Set up your domain (FlingPing.co) to point to your hosting
   - Enable SSL/HTTPS for the domain

### 2. Upload Your Application

1. **Prepare the codebase**:
   ```bash
   npm run build
   ```

2. **Upload files via FTP or Git**:
   - Upload the entire project directory to your hosting root
   - Make sure to include all files and folders

3. **Set up environment variables**:
   - Navigate to "Website" > "Advanced" > "Environment Variables"
   - Add all required environment variables listed in the prerequisites

### 3. Configure Node.js Application

1. **Set the entry point**:
   - Navigate to Node.js Application settings
   - Set the entry point to: `server/index.js`
   - Set the application root directory to your project root

2. **Configure application settings**:
   - Port: Leave as default (Hostinger will handle this)
   - Environment: `production`
   - Node.js version: 18.x

3. **Set up process management**:
   - Enable application auto-restart
   - Set memory limit as needed (512MB minimum recommended)

### 4. Deploy and Start Application

1. **Start the Node.js application**:
   - Click "Deploy" or "Start" in the Hostinger control panel
   - Wait for confirmation that the application is running

2. **Verify the deployment**:
   - Visit your domain (https://flingping.co)
   - Check that all pages load correctly
   - Test all forms and features (see verification checklist below)

## Post-Deployment Verification

### Website Functionality
- [ ] Homepage loads correctly with all images and styles
- [ ] Navigation menu works correctly
- [ ] All internal links work and lead to the correct pages
- [ ] Responsive design works on mobile, tablet, and desktop

### Form Functionality
- [ ] Email signup form submits successfully
- [ ] Contact form submits successfully
- [ ] Form submissions appear in Google Sheets

### Payment Processing
- [ ] "Become a Founding Flinger" button works correctly
- [ ] Stripe checkout opens properly
- [ ] Test payments go through successfully
- [ ] Success/cancel pages work correctly

### Analytics & Tracking
- [ ] Google Analytics is working (check real-time data)
- [ ] Event tracking is functioning correctly

### API Endpoints
- [ ] `/api/email-signup` responds correctly
- [ ] `/api/contact` responds correctly
- [ ] `/api/create-checkout-session` works with Stripe
- [ ] `/webhook/legacy` and `/webhook/inbound` correctly process data

## Troubleshooting Common Issues

### Application Won't Start
- Check Node.js version compatibility
- Verify entry point is correct
- Check environment variables are properly set
- Review application logs for specific errors

### Database Connection Issues
- Ensure the required tables are properly created
- Check database connection strings in environment variables

### Missing Images or Styles
- Verify all static assets are properly uploaded
- Check for path issues in the build files

### API or Form Submission Errors
- Check environment variables for API keys
- Verify webhook endpoints are correctly configured
- Check server logs for specific error messages

## Monitoring & Maintenance

### Regular Checks
- Monitor Google Analytics for user behavior and issues
- Review Google Sheets data regularly
- Keep track of Stripe dashboard for payment activities

### Updates
- When making updates to the application:
  1. Test changes locally first
  2. Create a backup of the current production files
  3. Deploy changes during low-traffic periods
  4. Verify all functionality after updates

## Contact & Support
For any deployment issues or questions, contact:
- Your development team
- Hostinger support for hosting-specific issues
- Stripe support for payment-related issues

---

This deployment guide was prepared as part of the FlingPing.co website development. Last updated: March 3, 2025.