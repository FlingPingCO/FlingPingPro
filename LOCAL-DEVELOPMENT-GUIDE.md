# FlingPing.co Local Development Guide

This guide explains how to set up and run the FlingPing.co website locally on your machine.

## Prerequisites

### Required Software
- Node.js (v18.x or higher recommended)
- npm (v9.x or higher)
- Git (for version control)

### Environment Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd flingping-website
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   
   > **Note**: Make sure you're running this command in the directory that contains the `package.json` file. 
   > If you see `npm error code ENOENT` or `Could not read package.json`, you might be in the wrong directory.

3. **Set up environment variables**:
   Create a `.env` file in the root directory with the following variables:

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

## Running the Application

### Development Mode

To start the application in development mode:

```bash
npm run dev
```

This will:
- Start the Express server
- Start the Vite dev server
- Enable hot module replacement for frontend changes

The application will be available at `http://localhost:5000`

### Building for Production

To create a production build:

```bash
npm run build
```

This will create optimized files in the `dist` directory.

To start the production server:

```bash
npm run start
```

## Common Issues and Solutions

### "Could not read package.json" Error

This error typically means you're trying to run npm commands outside the project directory:

```
npm error code ENOENT
npm error syscall open
npm error path /Users/username/package.json
npm error errno -2
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory
```

**Solution**: Navigate to the correct project directory where package.json is located:
```bash
cd path/to/flingping-website
```

### Missing Dependencies

If you encounter errors about missing modules:

**Solution**: Make sure you've installed all dependencies:
```bash
npm install
```

### Environment Variable Issues

If the application can't find environment variables:

**Solution**: 
1. Check that your `.env` file exists and has the correct format
2. Make sure it's in the root directory of the project
3. Restart the development server after making changes to `.env`

### Port Already in Use

If you see an error that port 5000 is already in use:

**Solution**: Either:
1. Stop the other process using port 5000
2. Change the port in `server/index.ts` to another value (e.g., 3000)

## Project Structure Overview

- `/client` - Frontend React application
- `/server` - Express backend server
- `/shared` - Shared code between frontend and backend
- `/public` - Static assets

## Development Workflow

1. Make changes to the codebase
2. Test changes locally using `npm run dev`
3. Build for production using `npm run build`
4. Deploy according to the [FINAL-DEPLOYMENT-GUIDE.md](./deploy-guide/FINAL-DEPLOYMENT-GUIDE.md)

## Need Help?

If you encounter any issues not covered in this guide, please contact the development team for assistance.

---

This local development guide was prepared as part of the FlingPing.co website development. Last updated: March 3, 2025.