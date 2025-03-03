# FlingPing.co - Hostinger Deployment Checklist

## Pre-Deployment Tasks
- [ ] Run `npm run build` locally to verify build succeeds
- [ ] Verify all static assets are included in the build
- [ ] Test application locally with `NODE_ENV=production node dist/index.js`
- [ ] Check all form submissions and API endpoints work in the production build

## Domain and DNS Configuration
- [ ] Register domain with Hostinger (if not already done)
- [ ] Configure DNS settings
- [ ] Set up SSL certificate for HTTPS

## Hostinger Server Setup
- [ ] Select appropriate Node.js hosting plan
- [ ] Set up Node.js environment (version 14.x or higher)
- [ ] Configure entry point as `dist/index.js`

## Environment Variables Setup
- [ ] Configure all required environment variables:
  - [ ] `GOOGLE_PRIVATE_KEY`
  - [ ] `GOOGLE_SERVICE_ACCOUNT_EMAIL`
  - [ ] `STRIPE_PUBLISHABLE_KEY`
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `SYSTEME_API_KEY`
  - [ ] `SYSTEME_WEBHOOK_SECRET`
  - [ ] `PIPEDREAM_SECURITY_TOKEN`
  - [ ] `GOOGLE_SPREADSHEET_ID`
  - [ ] `DOMAIN=https://flingping.co` (or your actual domain)
  - [ ] `PORT=3000` (or as required by Hostinger)
  - [ ] `NODE_ENV=production`

## File Deployment
- [ ] Upload `dist/` directory (contains both server and client files)
- [ ] Upload `public/` directory (for static assets)
- [ ] Upload `package.json` and `package-lock.json`
- [ ] Ensure correct file permissions are set

## Dependency Installation
- [ ] SSH into Hostinger server
- [ ] Run `npm install --production`

## Application Launch
- [ ] Start application using Hostinger's Node.js control panel
- [ ] Verify application is running using Hostinger's process monitor

## Integration Testing
- [ ] Test frontend routing (all pages load correctly)
- [ ] Test all form submissions:
  - [ ] Email signup form
  - [ ] Contact form
- [ ] Test Stripe payment integration:
  - [ ] Checkout flow
  - [ ] Webhook receipt
- [ ] Test integration with external services:
  - [ ] Google Sheets integration
  - [ ] webhook.site forwarding
  - [ ] Systeme.io integration

## Common Issues and Solutions
- **Issue**: Server returns 404 for React routes
  - **Solution**: Verify the catch-all route in server/vite.ts works correctly
- **Issue**: API endpoints not responding
  - **Solution**: Check server logs, verify port configuration
- **Issue**: Form submissions fail
  - **Solution**: Check environment variables for API keys
- **Issue**: Webhook endpoints not receiving data
  - **Solution**: Verify firewall settings, URL configuration

## Post-Deployment Monitoring
- [ ] Set up uptime monitoring
- [ ] Configure error reporting
- [ ] Set up regular backups
- [ ] Document deployment process for future updates

## Security Considerations
- [ ] Ensure all API keys and secrets are securely stored
- [ ] Configure firewall rules to restrict access if needed
- [ ] Set up rate limiting for API endpoints
- [ ] Implement CORS properly for API security

## Performance Optimization
- [ ] Enable gzip compression on Hostinger
- [ ] Configure appropriate cache headers for static assets
- [ ] Set up a CDN if needed for global distribution