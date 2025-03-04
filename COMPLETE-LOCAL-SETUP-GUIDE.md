# Complete Local Setup Guide for FlingPing.co

This guide provides detailed instructions for setting up the FlingPing.co application locally on your machine, addressing the specific issues you've encountered.

## Understanding the Issues

From the terminal outputs you've shared, I've identified several key issues:

1. **Systeme.io API is no longer accessible**: All your attempts to access Systeme.io API endpoints are returning 404 errors.

2. **Package.json not found**: You're trying to run npm commands in your home directory which doesn't contain a Node.js project.

3. **Project location confusion**: You have multiple directories with "flingping" in the name, making it unclear which one contains the project.

## Prerequisites

Make sure you have the following installed:

- Node.js (version 18+)
- npm (version 8+)
- Git (optional but recommended)

## Step 1: Locate or Create the Project Directory

From your `find` command output, you have two potential project directories:

```
/Users/bkerwood/CascadeProjects/personal-website/flingping
/Users/bkerwood/CascadeProjects/flingping
```

Let's check if either has the project files:

```bash
# Option 1
cd ~/CascadeProjects/personal-website/flingping
ls -la

# Option 2
cd ~/CascadeProjects/flingping
ls -la
```

If either directory contains files like `package.json`, `server/`, and `client/`, that's your project directory. If not, you'll need to create a new directory and download the project from Replit (see below).

## Step 2: Download the Latest Code from Replit

The issues with Systeme.io suggest that you need the updated codebase that has removed these dependencies. The easiest way to get the latest code is to download it from Replit:

1. **In Replit**: 
   - Click on the three dots (...) in the Files panel
   - Select "Download as ZIP"
   - Save to your Downloads folder

2. **Extract the ZIP file**:
   ```bash
   cd ~/Downloads
   mkdir -p ~/CascadeProjects/flingping-latest
   unzip [filename].zip -d ~/CascadeProjects/flingping-latest
   ```

3. **Navigate to the project directory**:
   ```bash
   cd ~/CascadeProjects/flingping-latest
   ```

## Step 3: Set Up Environment Variables

The application requires several environment variables to function properly. Create a `.env` file in the project root:

```bash
# Use a text editor to create the .env file
nano .env
```

Add the following content, replacing placeholders with your actual values:

```
# Stripe Integration
STRIPE_SECRET_KEY=sk_test_your_stripe_test_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Google Sheets Integration
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id

# Webhook Security
PIPEDREAM_SECURITY_TOKEN=your-random-security-token

# Frontend Variables (optional)
VITE_PUBLIC_URL=http://localhost:5000
```

## Step 4: Install Dependencies

Make sure you're in the project directory (where package.json is located) and run:

```bash
npm install
```

This will install all the required Node.js packages.

## Step 5: Set Up Google Sheets Integration (Optional)

The application is configured to fall back to a mock implementation for Google Sheets in development mode, so you don't need to set this up to test the basic functionality.

If you want to test the actual Google Sheets integration:

1. **Create a Google Cloud Project**: 
   - Go to https://console.cloud.google.com/
   - Create a new project
   - Enable the Google Sheets API

2. **Create a Service Account**:
   - Go to IAM & Admin > Service Accounts
   - Create a new service account
   - Grant it the necessary permissions (Sheets Editor role)
   - Create a key for the service account (JSON format)

3. **Set up the Spreadsheet**:
   - Create a new Google Sheet
   - Share it with the service account email address
   - Copy the spreadsheet ID from the URL (the long string in the middle)

4. **Update your .env file** with the details from the service account key file

## Step 6: Start the Development Server

Now you can start the application:

```bash
npm run dev
```

This will start the server on port 5000. You can access the application at http://localhost:5000.

## Step 7: Test Stripe Integration

The application has a Stripe integration for the "Founding Flinger" membership. To test this:

1. Navigate to the homepage
2. Click the "Become a Founding Flinger" button
3. Enter your test email and name
4. You should be redirected to the Stripe test checkout page

Note: For testing, use the following Stripe test card details:
- Card Number: 4242 4242 4242 4242
- Expiry: Any future date (e.g., 12/30)
- CVC: Any 3 digits (e.g., 123)
- Zip: Any 5 digits (e.g., 12345)

## Troubleshooting

### "Error: Cannot find module '...'"
This usually means a package is missing. Try running `npm install` again.

### "Error: listen EADDRINUSE: address already in use :::5000"
This means port 5000 is already in use. You can either:
- Kill the process using port 5000:
  ```bash
  lsof -i :5000
  kill -9 [PID]
  ```
- Or modify the server port in `server/index.ts`

### Google Sheets Integration Issues
If you're having issues with the Google Sheets integration:
1. Check that your .env file has the correct values
2. Ensure the service account has access to the spreadsheet
3. Verify the spreadsheet ID is correct

The system has a fallback mechanism for development, so it will log to the console instead of sending data to Google Sheets.

### Stripe Integration Issues
If the Stripe checkout isn't working:
1. Ensure your Stripe API keys are correct in the .env file
2. Check that the server is running (with `npm run dev`)
3. Look at the server logs for any error messages

## Building for Production

When you're ready to deploy:

```bash
npm run build
```

This will create a production-ready build in the `dist` directory.

## Additional Resources

- Refer to the `LOCAL-DEVELOPMENT-GUIDE.md` file for more details on the codebase structure
- Check `EXPORT-FROM-REPLIT-GUIDE.md` for more information on downloading from Replit
- See `SYSTEME-REMOVAL-COMPLETE.md` for details on the Systeme.io removal

## What's Changed Since Systeme.io Removal

1. **Signup Process**: Now uses a direct form submission instead of Systeme.io embed
2. **Data Storage**: Form submissions go directly to Google Sheets instead of Systeme.io
3. **API Endpoints**: New webhooks have been added for backward compatibility
4. **Stripe Integration**: Connects directly to Stripe without Systeme.io as middleware

## Need Help?

If you have any questions or run into issues, please reach out for assistance.