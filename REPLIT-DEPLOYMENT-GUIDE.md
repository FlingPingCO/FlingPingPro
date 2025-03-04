# Replit Deployment Guide for FlingPing.co

This guide provides specific instructions for getting your FlingPing.co application working properly on Replit before deploying to Hostinger.

## Project Setup Information

After examining your project, here's what I've determined:

### Framework Information
- **Backend**: Node.js with Express.js
- **Frontend**: React with Vite for bundling
- **Package Manager**: npm
- **Build System**: Vite + esbuild

### Current Scripts Configuration
Your `package.json` already has the following scripts configured:
```json
"scripts": {
  "dev": "tsx server/index.ts",
  "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
  "start": "NODE_ENV=production node dist/index.js",
  "check": "tsc",
  "db:push": "drizzle-kit push"
}
```

## Step 1: Confirm Everything is Working on Replit

### Install Dependencies (if needed)
If you're experiencing issues with missing dependencies:
```bash
npm install
```

### Start the Development Server
```bash
npm run dev
```
This will run the application in development mode using `tsx` for the TypeScript server.

### Verify It's Working
- Open the Replit webview to see if the application is running properly
- You should see your FlingPing.co website

## Step 2: Building for Production on Replit

To create a production build:
```bash
npm run build
```

This command will:
1. Build the client-side React application using Vite
2. Bundle the server code with esbuild into the `dist` directory

If this command succeeds, you'll have a production-ready build in the `dist` directory.

## Step 3: Testing the Production Build on Replit

To test the production build:
```bash
npm run start
```

This will run the application in production mode using the bundled files in the `dist` directory.

## Common Issues and Solutions

### 1. Missing Dependencies
If you see errors about missing packages:
```bash
npm install [package-name]
```

### 2. Build Errors
If the build fails with TypeScript errors:
```bash
npm run check
```
This will show you the specific TypeScript errors that need to be fixed.

### 3. Port Conflicts
If you see errors about port 5000 being in use:
- Check if another workflow is already running
- Use the Replit workflow control to stop any running workflows before starting again

### 4. Environment Variables
Ensure your `.env` file has all the required variables:
- STRIPE_SECRET_KEY
- STRIPE_PUBLISHABLE_KEY
- GOOGLE_SERVICE_ACCOUNT_EMAIL
- GOOGLE_PRIVATE_KEY
- GOOGLE_SPREADSHEET_ID
- PIPEDREAM_SECURITY_TOKEN

## Preparing for Hostinger Deployment

Once everything is working properly on Replit, you're ready to prepare for Hostinger deployment:

1. Create a production build: `npm run build`
2. Download the built files:
   - `dist/` directory (contains both client and server code)
   - `public/` directory (contains static assets)
   - `package.json` and `package-lock.json`

3. Create a production `.env` file with values appropriate for your Hostinger hosting

## Need Help?

If you're still experiencing issues:
1. Check the console logs for specific error messages
2. Review the application logs in the workflow tab
3. Try running individual commands to isolate where the issue is occurring