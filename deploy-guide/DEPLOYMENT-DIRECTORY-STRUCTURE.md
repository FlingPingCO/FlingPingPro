# FlingPing.co Deployment Directory Structure

This guide outlines the recommended directory structure for deploying FlingPing.co to Hostinger or similar hosting providers.

## Overview

Proper file organization is critical for a successful deployment. This guide specifies where files should be placed on the server and highlights important files that require special attention.

## Root Directory Structure

```
/
├── public/               # Static assets (publicly accessible)
│   ├── images/           # Image assets
│   │   ├── FlingPing.co_Logo_TP_Background_Removed.png   # Critical for Stripe
│   │   └── [other image files...]
│   ├── favicon.ico       # Site favicon
│   └── [other static files...]
├── dist/                 # Compiled application code
│   ├── client/           # Compiled frontend assets
│   │   ├── assets/       # Bundled JS/CSS
│   │   └── index.html    # Main HTML file
│   └── server/           # Compiled backend code
│       └── index.js      # Server entry point
├── node_modules/         # NPM dependencies (installed via npm install)
├── .env                  # Environment variables (CRITICAL)
├── package.json          # Project metadata and dependencies
└── package-lock.json     # Dependency lock file
```

## Key Files and Their Purpose

### Critical for Stripe Integration

- **`/public/images/FlingPing.co_Logo_TP_Background_Removed.png`**
  - Purpose: Displayed on Stripe checkout page
  - Requirements: Must be PNG format with transparent background
  - Notes: Referenced in Stripe checkout configuration

### Environment Configuration

- **`.env`**
  - Purpose: Contains environment variables for server configuration
  - Requirements: Must include all required variables listed in HOSTINGER-DEPLOYMENT-GUIDE.md
  - Security: Should not be publicly accessible

### Application Entry Points

- **`dist/server/index.js`**
  - Purpose: Server entry point for Node.js
  - Configuration: May need to be specified in Hostinger's Node.js configuration panel

- **`dist/client/index.html`**
  - Purpose: Main HTML entry point for the website
  - Notes: Served by the Node.js application, not directly by the web server

## Deployment Process

### 1. Build the Application

Before deploying, build the application locally:

```bash
npm run build
```

This will generate the `dist/` directory with compiled client and server code.

### 2. Prepare Files for Upload

Create a deployment package with these directories and files:

- `public/`
- `dist/`
- `package.json`
- `package-lock.json`
- `.env` (with production values)

### 3. Upload to Server

Upload the files maintaining the directory structure shown above.

## Hostinger-Specific Configuration

### Node.js Settings

In the Hostinger control panel:

1. Set the Node.js version to 16.x or higher
2. Configure the entry point as `dist/server/index.js`
3. Set the environment variables in the appropriate section

### File Permissions

Set appropriate permissions:

- Directories: 755 (drwxr-xr-x)
- Files: 644 (rw-r--r--)
- Executable scripts: 755 (rwxr-xr-x)

## Verification

After uploading, verify:

1. The server starts without errors
2. Static assets are accessible at `/images/...` paths
3. The FlingPing.co logo is accessible at `/images/FlingPing.co_Logo_TP_Background_Removed.png`

## Troubleshooting

### Common Directory Issues

- **Missing Image Files**: If Stripe checkout doesn't show the logo, verify the image exists at exactly `/public/images/FlingPing.co_Logo_TP_Background_Removed.png`

- **Permission Problems**: If files can't be read, check and correct file permissions

- **Environment Variables Not Loading**: Verify `.env` file is in the correct location and formatted properly

## Example Manual Verification Commands

To verify the file structure on the server:

```bash
# Check if the important logo file exists
ls -la public/images/FlingPing.co_Logo_TP_Background_Removed.png

# Verify file permissions
find . -type f -name "*.js" -exec ls -la {} \;
find . -type f -name "*.html" -exec ls -la {} \;
find . -type d -exec ls -ld {} \;

# Check environment file
cat .env | grep -v "KEY\|SECRET\|PASSWORD" # Shows variables without exposing secrets
```