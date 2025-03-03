# FlingPing.co Hostinger Deployment Master Checklist

This comprehensive checklist covers all aspects of deploying FlingPing.co to Hostinger, including the enhanced Stripe checkout integration with local image assets.

## Pre-Deployment Preparation

### Code Review & Optimization
- [ ] All code has been reviewed and tested locally
- [ ] Unused dependencies have been removed
- [ ] Code has been optimized for production
- [ ] Console logs and debugging code have been removed

### Asset Preparation
- [ ] All images have been optimized for web
- [ ] Critical images for Stripe have been verified locally
- [ ] All static assets are organized in the public directory
- [ ] Favicon and other browser assets are ready

### Environment Configuration
- [ ] Create a production .env file with all required variables
- [ ] Ensure all API keys and secrets for production are available
- [ ] Verify domain configuration is correct
- [ ] Prepare Stripe production keys (switch from test mode)

## Build Process

### Application Build
- [ ] Run `npm run build` to create production build
- [ ] Verify build completes without errors
- [ ] Check the dist directory for complete files
- [ ] Test the production build locally if possible

### Deployment Package Preparation
- [ ] Organize files according to DEPLOYMENT-DIRECTORY-STRUCTURE.md
- [ ] Verify package.json includes all required dependencies
- [ ] Include README and essential documentation
- [ ] Exclude any development-only files

## Hostinger Configuration

### Account & Domain Setup
- [ ] Verify Hostinger account is active
- [ ] Ensure domain is properly configured
- [ ] Set up or verify SSL certificate
- [ ] Configure DNS settings if needed

### Node.js Environment Setup
- [ ] Select appropriate Node.js version (16.x or higher)
- [ ] Configure application entry point (dist/server/index.js)
- [ ] Set up environment variables in Hostinger dashboard
- [ ] Configure server port settings (typically port 3000)

## File Upload & Installation

### File Transfer
- [ ] Upload all files to Hostinger via FTP or file manager
- [ ] Maintain correct directory structure
- [ ] Verify critical files are in the correct locations
- [ ] Set proper file permissions

### Dependency Installation
- [ ] Run `npm install --production` on the server
- [ ] Verify node_modules directory is created properly
- [ ] Check for any installation errors
- [ ] Verify all dependencies are installed correctly

## Application Launch

### Server Startup
- [ ] Start the Node.js application via Hostinger dashboard
- [ ] Check server logs for successful startup
- [ ] Verify the application is running without errors
- [ ] Check that the server is listening on the correct port

### Initial Access Verification
- [ ] Access the website via domain name
- [ ] Verify the home page loads correctly
- [ ] Check that static assets are loading
- [ ] Test basic navigation

## Integration Verification

### Stripe Integration Testing
- [ ] Run verify-stripe-image.js to check logo accessibility
- [ ] Verify FlingPing.co logo is accessible at the expected URL
- [ ] Test the signup flow and check that Stripe checkout loads
- [ ] Verify logo appears in the Stripe checkout page
- [ ] Complete a test purchase with test card
- [ ] Check success and cancel flows

### Form Submission Testing
- [ ] Test email signup form submission
- [ ] Test contact form submission
- [ ] Verify data is stored correctly
- [ ] Check webhook forwarding is working

### Third-Party Integration Testing
- [ ] Verify Google Sheets integration is working
- [ ] Test Systeme.io webhook integration
- [ ] Check any other external integrations

## Performance & Security

### Performance Testing
- [ ] Run PageSpeed Insights test
- [ ] Check mobile and desktop performance
- [ ] Verify image loading times
- [ ] Test API response times

### Security Verification
- [ ] Verify SSL is working correctly
- [ ] Check for exposed environment variables
- [ ] Test API endpoint security
- [ ] Verify webhook security token validation

## Post-Deployment Tasks

### Documentation
- [ ] Update documentation with production URLs
- [ ] Document any issues encountered and their solutions
- [ ] Record server configuration details
- [ ] Update team on deployment status

### Monitoring Setup
- [ ] Set up uptime monitoring
- [ ] Configure error logging
- [ ] Set up performance monitoring
- [ ] Establish regular health checks

## Final Verification

### Comprehensive Testing
- [ ] Complete all checks in POST-DEPLOYMENT-VERIFICATION.md
- [ ] Verify all features from all devices
- [ ] Test with multiple browsers
- [ ] Check both desktop and mobile experiences

### Client Approval
- [ ] Request client review of the live site
- [ ] Address any client feedback
- [ ] Get final approval on deployment

## Resources & References

- [HOSTINGER-DEPLOYMENT-GUIDE.md](./HOSTINGER-DEPLOYMENT-GUIDE.md) - Detailed deployment instructions
- [STRIPE-IMAGE-INTEGRATION-GUIDE.md](./STRIPE-IMAGE-INTEGRATION-GUIDE.md) - Stripe image integration details
- [STRIPE-IMAGE-VERIFICATION.md](./STRIPE-IMAGE-VERIFICATION.md) - How to verify Stripe image integration
- [DEPLOYMENT-DIRECTORY-STRUCTURE.md](./DEPLOYMENT-DIRECTORY-STRUCTURE.md) - File organization guide
- [POST-DEPLOYMENT-VERIFICATION.md](./POST-DEPLOYMENT-VERIFICATION.md) - Comprehensive testing guide

## Notes

- This checklist should be customized based on your specific deployment requirements
- Some steps may not be applicable to all deployments
- Keep this document updated as the deployment process evolves