# FlingPing.co Deployment Checklist - March 2025 Update

This checklist includes all the latest updates for deploying FlingPing.co, with special attention to the enhanced payment integration and image optimization.

## 📋 Pre-Deployment Preparation

- [ ] Verify all code changes have been committed and pushed
- [ ] Run tests to ensure all features are working locally
- [ ] Check that all environment variables are documented
- [ ] Review image assets to ensure they're optimized for web

## 📁 Files to Upload

### Core Files
- [ ] All application files (client, server, shared directories)
- [ ] Package files (package.json, package-lock.json)
- [ ] Configuration files (vite.config.ts, tsconfig.json, etc.)

### Key Image Assets
- [ ] `/public/images/FlingPing.co_Logo_TP_Background_Removed.png` (critical for Stripe integration)
- [ ] All other illustrations and images in the public directory

## ⚙️ Environment Variables

### Required Environment Variables
- [ ] `DOMAIN=https://flingping.co` (used for Stripe image integration)
- [ ] `STRIPE_SECRET_KEY` (for API-generated checkout)
- [ ] `STRIPE_PUBLISHABLE_KEY` (for frontend Stripe integration)

### Optional Environment Variables
- [ ] `VITE_STRIPE_PRODUCT_LINK` (for direct Stripe payment link)
- [ ] `GOOGLE_SERVICE_ACCOUNT_EMAIL` (for Google Sheets integration)
- [ ] `GOOGLE_PRIVATE_KEY` (for Google Sheets integration)
- [ ] `GOOGLE_SPREADSHEET_ID` (for Google Sheets integration)
- [ ] `SYSTEME_API_KEY` (for Systeme.io integration)
- [ ] `SYSTEME_WEBHOOK_SECRET` (for Systeme.io webhook validation)

## 🔄 Database Configuration

- [ ] Check database connections (if applicable)
- [ ] Verify tables have been created
- [ ] Run any necessary migrations

## 🚀 Deployment Steps

1. [ ] Upload all files to Hostinger
2. [ ] Configure environment variables in Hostinger dashboard
3. [ ] Install dependencies via Hostinger deployment process
4. [ ] Build the application
5. [ ] Start the application service

## ✅ Post-Deployment Verification

### Payment Integration
- [ ] Verify Stripe checkout creates successfully
- [ ] Confirm the FlingPing.co logo appears on the checkout page
- [ ] Test payment flow with test card (4242 4242 4242 4242)
- [ ] Verify success and cancel flows

### Form Submission
- [ ] Test email signup form
- [ ] Test contact form
- [ ] Verify data is stored in backend
- [ ] Confirm data is sent to Google Sheets (if configured)

### Image Loading
- [ ] Check all images load properly on the site
- [ ] Verify the FlingPing.co logo loads in the Stripe checkout

### Responsive Design
- [ ] Test site on mobile devices
- [ ] Test site on tablets
- [ ] Test site on desktop browsers

## 🔄 Continuous Monitoring

- [ ] Set up uptime monitoring
- [ ] Configure error logging
- [ ] Schedule regular health checks

## 📝 Documentation Updates

- [ ] Update deployment documentation with any new findings
- [ ] Document any issues encountered and their solutions
- [ ] Keep a record of successful deployment parameters

## 🛠️ Troubleshooting Resources

If you encounter issues during deployment, refer to these resources:

- STRIPE-IMAGE-INTEGRATION-GUIDE.md (for Stripe image issues)
- PAYMENT-INTEGRATION-GUIDE.md (for payment flow issues)
- HOSTINGER-DEPLOYMENT-GUIDE.md (for hosting configuration)
- POST-DEPLOYMENT-VERIFICATION.md (for testing procedures)

## 🔔 Important Notes

- The Stripe checkout experience now relies on local image assets instead of external URLs
- Both direct payment link and API-generated checkout options are available
- The recommended approach for production is using the direct Stripe payment link