# FlingPing.co - Deployment File Structure

This document outlines the file structure for deploying FlingPing.co to Hostinger.

## Key Files and Directories

### Root Directory
- `package.json` - Node.js project configuration
- `package-lock.json` - Dependency lock file

### Build Output (`dist/` directory)
After running `npm run build`, the following structure is created:
- `dist/index.js` - Compiled server-side code
- `dist/public/` - Compiled client-side assets
  - `dist/public/index.html` - Main HTML file
  - `dist/public/assets/` - Compiled JavaScript, CSS, and other assets

### Static Assets (`public/` directory)
- `public/illustrations/` - Custom illustrations used throughout the site
- `public/images/` - Other static images
- `public/attached_assets/` - Additional assets

## Required Files for Deployment

The following files must be uploaded to Hostinger:

```
├── dist/
│   ├── index.js (compiled server)
│   └── public/
│       ├── index.html
│       ├── assets/
│       └── ...
├── public/
│   ├── illustrations/
│   ├── images/
│   └── attached_assets/
├── package.json
└── package-lock.json
```

## Notes on Environment Configuration

- Server code automatically serves static files from the `dist/public` directory
- The Express server handles both API requests and serves the React application
- Ensure environment variables are properly configured on Hostinger

## Critical API Endpoints

The following API endpoints must be accessible:

### Front-end API Endpoints
- `GET /api/blog-posts` - Retrieves blog posts
- `GET /api/blog-posts/:id` - Retrieves a specific blog post
- `GET /api/blog-categories` - Retrieves blog categories
- `GET /api/founding-flinger-count` - Gets count of founding members
- `POST /api/email-signup` - Processes email signup form
- `POST /api/contact` - Processes contact form
- `POST /api/create-checkout-session` - Creates Stripe checkout session
- `GET /api/create-checkout-session` - Redirects to Stripe checkout

### Webhook Endpoints
- `POST /webhook/systeme` - Receives webhooks from Systeme.io
- `POST /webhook/inbound` - Receives forwarded webhooks from webhook.site
- `POST /api/webhook` - Receives Stripe webhooks

## Domain and SSL Configuration

When setting up on Hostinger:
1. Configure your domain to point to the Hostinger server
2. Set up SSL certificate for secure https:// access
3. Ensure the `DOMAIN` environment variable matches your actual domain

## Post-Deployment Verification Checklist

- [ ] Website loads correctly at domain
- [ ] All pages are accessible
- [ ] Illustrations and images display properly
- [ ] Forms submit successfully
- [ ] Payment processing works
- [ ] Webhooks are received correctly
- [ ] Google Sheets integration is working