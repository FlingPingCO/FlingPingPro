# Exporting FlingPing.co from Replit for Local Development

This guide explains how to export your FlingPing.co project from Replit and set it up for local development.

## Exporting from Replit

### Method 1: Using Replit's Download as ZIP

1. **While in your Replit project:**
   - Click on the three dots (...) in the Files panel
   - Select "Download as ZIP"
   - Save the ZIP file to your computer

2. **Extract the ZIP file:**
   - Right-click the downloaded ZIP file
   - Select "Extract All..." or use your preferred extraction tool
   - Choose a convenient location on your computer

### Method 2: Using Git (Recommended)

1. **Get the Git URL for your Replit:**
   - Click on the "Version Control" icon in the left sidebar
   - Copy the Git URL provided (should look like `https://github.com/replit/yourproject.git` or similar)

2. **Clone the repository:**
   ```bash
   git clone https://github.com/replit/yourproject.git flingping-website
   cd flingping-website
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

## Setting Up Your Local Environment

### Environment Variables

Create a `.env` file in the root directory with the necessary environment variables:

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

### Running the Application Locally

1. **Install dependencies (if you haven't already):**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   Open your browser and navigate to `http://localhost:5000`

## Important Notes

### Node.js Version
Make sure you're using Node.js version 18.x or higher. You can check your version with:
```bash
node --version
```

If needed, you can use [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm) to install or switch to the correct version.

### Differences from Replit Environment

Some things might work differently in your local environment compared to Replit:

1. **Port Configuration:**
   - Replit automatically handles port forwarding
   - Locally, you'll access the app at http://localhost:5000 (or whatever port is configured)

2. **Environment Variables:**
   - In Replit, these are set in the Secrets tab
   - Locally, you'll need to set them in your `.env` file

3. **File Paths:**
   - Replit uses absolute paths starting with `/`
   - Locally, it's better to use relative paths

## Troubleshooting Local Setup

### "Error: Cannot find module..."
This usually means a package is missing. Try running:
```bash
npm install
```

### Port conflicts
If port 5000 is already in use, you can change it in the server/index.ts file.

### Environment variable issues
Make sure your `.env` file is in the root directory and follows the correct format.

## Next Steps

After setting up locally, refer to the [LOCAL-DEVELOPMENT-GUIDE.md](./LOCAL-DEVELOPMENT-GUIDE.md) for more detailed information about the development workflow.

---

This export guide was prepared as part of the FlingPing.co website development. Last updated: March 3, 2025.