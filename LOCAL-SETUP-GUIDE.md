# Local Development Setup Guide for FlingPing.co

Based on the terminal outputs you've shared, I've identified several issues that need to be addressed for successful local development:

## Current Issues

### 1. Systeme.io API Unavailability
Your curl requests to the Systeme.io API are returning 404 errors:
```
curl -X POST "https://api.systeme.io/contact" -H "Content-Type: application/json" -H "X-API-KEY: wvgcm9cnghcikkxc7z1uily25jhetiz7w8yn1dbep4nrniqtfcrawsjz3v6px5ky" -d '{...}'
```

This confirms that the Systeme.io API endpoints are no longer accessible or have changed, which validates our decision to remove all Systeme.io dependencies from the codebase.

### 2. npm Command Issues
You're encountering this error repeatedly:
```
npm error code ENOENT
npm error syscall open
npm error path /Users/bkerwood/package.json
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory
```

This is happening because you're trying to run npm commands in your home directory `/Users/bkerwood/` which doesn't contain a package.json file.

## Step-by-Step Solution

### 1. Download the Project from Replit

First, let's get the project onto your local machine:

1. **Open the Replit project in your browser**

2. **Download as ZIP**:
   - Click on the three dots (...) in the Files panel
   - Select "Download as ZIP"
   - Save the ZIP file to your Downloads folder

3. **Extract the project**:
   ```bash
   # Navigate to your Downloads folder
   cd ~/Downloads
   
   # Create a new directory for the project
   mkdir -p ~/CascadeProjects/flingping-website
   
   # Extract the ZIP file to that directory
   unzip flingping-website.zip -d ~/CascadeProjects/flingping-website
   ```

### 2. Set Up the Project Locally

1. **Navigate to the project directory**:
   ```bash
   cd ~/CascadeProjects/flingping-website
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Create the .env file**:
   Create a file named `.env` in the project root with the following content:
   ```
   # Stripe Integration
   STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxx
   STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxx

   # Google Sheets Integration
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nXXXXXXXXXXXXXXXX\n-----END PRIVATE KEY-----\n
   GOOGLE_SPREADSHEET_ID=your-spreadsheet-id

   # Webhook Security
   PIPEDREAM_SECURITY_TOKEN=your-webhook-security-token

   # Frontend Configuration
   VITE_STRIPE_PRODUCT_LINK=/api/create-checkout-session
   ```

4. **Verify installation**:
   ```bash
   # List all files to confirm proper extraction
   ls -la
   
   # Check if package.json exists
   cat package.json
   ```

### 3. Development Workflow

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Access the application**:
   Open your browser and navigate to `http://localhost:5000`

3. **Making changes**:
   - Edit files using your preferred code editor
   - The server will automatically reload when you save changes

### 4. Build for Production

1. **Create a production build**:
   ```bash
   npm run build
   ```

2. **Test the production build**:
   ```bash
   npm run start
   ```

## Troubleshooting

### If You Can't Find the Project Directory
I notice you tried to find the flingping directory with:
```bash
find ~/ -type d -name "flingping" 2>/dev/null
```

And found:
```
/Users/bkerwood//CascadeProjects/personal-website/flingping
/Users/bkerwood//CascadeProjects/flingping
```

Try checking these directories to see if they contain the project:
```bash
ls -la /Users/bkerwood/CascadeProjects/flingping
ls -la /Users/bkerwood/CascadeProjects/personal-website/flingping
```

If one of these has a package.json file, that's your project directory!

### If You Need to Create a New Project Directory
If you prefer to start fresh:
```bash
# Create a new directory
mkdir -p ~/CascadeProjects/flingping-new

# Move to that directory
cd ~/CascadeProjects/flingping-new

# Now download the Replit project as described above
```

## Final Notes

1. The Systeme.io API integration has been completely removed from the codebase as it's no longer accessible.

2. All data collection now goes directly to Google Sheets.

3. Remember that all npm commands must be run from the directory containing the package.json file.

4. If you encounter any issues, please refer to the EXPORT-FROM-REPLIT-GUIDE.md and LOCAL-DEVELOPMENT-GUIDE.md files for more detailed instructions.