# FlingPing.co Hostinger Deployment Guide

This guide provides specific instructions for deploying the FlingPing.co application to Hostinger, covering all the necessary steps from building the application to configuring the server.

## 1. Confirm the Build Setup

First, let's examine the current project configuration to ensure everything is set up correctly:

### Framework Information
- **Framework**: This project uses a custom Node.js/Express server with a React frontend built with Vite
- **Server**: Express.js running on Node.js
- **Frontend**: React with Vite for bundling and development
- **Database**: In-memory storage (no external database required)

### Build Commands
The project uses the following npm scripts (from package.json):
```json
"scripts": {
  "dev": "tsx server/index.ts",
  "build": "vite build && tsc --project tsconfig.server.json", 
  "start": "node dist/server/index.js"
}
```

## 2. Prepare Your Project for Production

Before deploying to Hostinger, we need to prepare the application for production:

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create a Production Build
```bash
npm run build
```
This will:
1. Build the client-side React application using Vite
2. Compile the server TypeScript files
3. Generate all assets in the `dist` directory

### Step 3: Test the Production Build Locally
```bash
npm run start
```
Verify that the application works correctly on http://localhost:5000

## 3. Deploy to Hostinger

Hostinger offers Node.js hosting which is perfect for this application. Follow these steps to deploy:

### Step 1: Prepare Files for Upload

You'll need to upload the following files and directories:
- `dist/` directory (contains both server and client code)
- `public/` directory (contains static assets)
- `package.json` and `package-lock.json`
- `.env` file (with production configuration)

### Step 2: Create a .env File for Production

Create a production `.env` file with the following variables:
```
# Stripe Integration - Use your production keys for Hostinger
STRIPE_SECRET_KEY=sk_live_your_production_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_production_key

# Google Sheets Integration
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id

# Webhook Security
PIPEDREAM_SECURITY_TOKEN=your-webhook-security-token

# Production configuration
NODE_ENV=production
PORT=3000
```

### Step 3: Upload Files to Hostinger

Using Hostinger's File Manager or FTP:
1. Upload all the prepared files to your hosting account
2. Ensure the directory structure is maintained

### Step 4: Configure Hostinger's Node.js Settings

In Hostinger's control panel:
1. Navigate to the Node.js section
2. Set up a new Node.js application:
   - **Node.js Version**: Select Node.js 18.x or higher
   - **Entry Point**: `dist/server/index.js`
   - **Environment**: Production
   - **Start Command**: `node dist/server/index.js`

3. Configure Environment Variables:
   - Add all the variables from your `.env` file in the Environment Variables section

### Step 5: Start Your Application

1. Click the "Start/Restart" button in Hostinger's Node.js panel
2. Wait for the application to initialize

## 4. Verify and Debug Deployment

### Verify Deployment
1. Visit your domain (e.g., https://flingping.co)
2. Test the main functionality:
   - Homepage loads correctly
   - Signup form works
   - Contact form works
   - Stripe checkout process functions properly

### Common Issues and Solutions

#### Application Won't Start
Check Hostinger's application logs for errors, common issues include:
- Incorrect entry point path
- Missing environment variables
- Dependency issues

#### 404 Errors for Static Assets
Ensure that:
- The `public` directory is in the correct location
- The server is correctly configured to serve static files

#### API Endpoints Not Responding
Verify that:
- Your server is running properly
- The correct port is being used
- No firewall rules are blocking the requests

#### Stripe Checkout Not Working
Check that:
- You're using the correct Stripe API keys for production
- The webhook endpoints are accessible from the internet
- Stripe is properly configured to work with your production domain

## 5. Post-Deployment Tasks

### Set Up Domain and SSL
1. Configure your domain in Hostinger
2. Enable SSL for secure HTTPS connections

### Set Up Monitoring
Consider setting up:
- Uptime monitoring
- Error tracking
- Performance monitoring

### Regular Backups
Set up regular backups of:
- Your code and configuration
- Any data stored in Google Sheets

## 6. Ongoing Maintenance

### Updating the Application
When you need to update the application:
1. Create a new build locally: `npm run build`
2. Upload the updated files to Hostinger
3. Restart the Node.js application

### Monitoring Logs
Regularly check the application logs for:
- Errors
- Performance issues
- Security concerns

## Contact Information

If you encounter any issues with this deployment guide, please contact:
- Technical Support: [Your contact info]

---

**Note**: This guide is specific to the FlingPing.co application structure and may need adjustments based on Hostinger's specific hosting environment.