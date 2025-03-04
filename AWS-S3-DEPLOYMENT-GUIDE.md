# FlingPing.co AWS S3 Deployment Guide

This guide provides step-by-step instructions for deploying the FlingPing.co website to Amazon S3 static website hosting.

## Preparation

### 1. Generate the Deployment Package

There are two ways to generate the deployment package:

#### Option A: Quick Setup (Recommended for testing)

This creates a lightweight placeholder site with proper structure:

```bash
node scripts/setup-deployment-structure.js
```

#### Option B: Full Production Build

This builds the complete site with all features (may take longer):

```bash
node scripts/build-prod.js
```

Both options will create a `flingping-deployment.zip` file in the root directory.

## AWS S3 Deployment Steps

### 1. Log into AWS Console

- Go to [AWS Management Console](https://aws.amazon.com/console/)
- Log in with your credentials

### 2. Create an S3 Bucket

1. Navigate to S3 service
2. Click "Create bucket"
3. Enter a bucket name (e.g., `flingping-website`)
4. Select your region
5. Uncheck "Block all public access"
6. Check the acknowledgment box
7. Keep other settings as default
8. Click "Create bucket"

### 3. Configure the Bucket for Static Website Hosting

1. Click on your newly created bucket
2. Go to the "Properties" tab
3. Scroll down to "Static website hosting"
4. Click "Edit"
5. Select "Enable"
6. Enter `index.html` for both the Index document and Error document
7. Click "Save changes"

### 4. Set Bucket Policy for Public Access

1. Go to the "Permissions" tab
2. Scroll down to "Bucket policy"
3. Click "Edit"
4. Copy and paste the following policy (replace `YOUR-BUCKET-NAME` with your actual bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```

5. Click "Save changes"

### 5. Upload the Deployment Files

#### Method 1: Using AWS Console (simpler)

1. Click on the "Objects" tab
2. Click "Upload"
3. Extract the `flingping-deployment.zip` file locally
4. Upload all the extracted files and folders
5. For each file, ensure the correct Content-Type is set:
   - HTML files: `text/html`
   - CSS files: `text/css`
   - JavaScript files: `application/javascript`
   - Images: `image/png`, `image/jpeg`, or appropriate type
   - SVG files: `image/svg+xml`

#### Method 2: Using AWS CLI (recommended for efficiency)

1. Install AWS CLI if not already installed
2. Configure AWS CLI with your credentials
3. Extract the `flingping-deployment.zip` file
4. Navigate to the extracted directory
5. Run the following commands:

```bash
# Upload HTML, CSS, and JS files with proper content types
aws s3 cp index.html s3://YOUR-BUCKET-NAME/ --content-type "text/html"
aws s3 cp styles.css s3://YOUR-BUCKET-NAME/ --content-type "text/css"
aws s3 cp index.js s3://YOUR-BUCKET-NAME/ --content-type "application/javascript"

# Upload remaining files with appropriate content types
aws s3 cp public/favicon.ico s3://YOUR-BUCKET-NAME/public/ --content-type "image/x-icon"
aws s3 sync public/ s3://YOUR-BUCKET-NAME/public/ --exclude "favicon.ico"
```

### 6. Verify the Deployment

1. Go back to the "Properties" tab
2. Scroll down to "Static website hosting"
3. Copy the "Bucket website endpoint" URL
4. Open the URL in your browser to verify the website is working correctly

### 7. Set Up CloudFront (Optional but Recommended)

For improved performance and HTTPS:

1. Go to CloudFront in AWS Console
2. Click "Create distribution"
3. For "Origin domain," select your S3 website endpoint
4. Configure other settings as needed
5. Click "Create distribution"
6. Use the provided CloudFront domain to access your website

## Troubleshooting

### Common Issues

1. **403 Forbidden errors:**
   - Check that the bucket policy is configured correctly
   - Verify that all files have the appropriate permissions

2. **CSS or JavaScript not loading:**
   - Ensure correct content types are set for all files
   - Check for any CORS issues

3. **Images not displaying:**
   - Verify paths are correct (should be `public/images/...`)
   - Ensure proper content types are set

### Content Type Reference

Here's a reference of common content types:

- HTML: `text/html`
- CSS: `text/css`
- JavaScript: `application/javascript`
- PNG images: `image/png`
- JPEG images: `image/jpeg`
- SVG images: `image/svg+xml`
- ICO files: `image/x-icon`
- Font files:
  - WOFF: `font/woff`
  - WOFF2: `font/woff2`
  - TTF: `font/ttf`
  - OTF: `font/otf`

## Updating the Website

To update the website:

1. Make your changes locally
2. Generate a new deployment package using one of the methods above
3. Upload the new files to your S3 bucket, replacing the old ones
4. If using CloudFront, you may need to create an invalidation to clear the cache

## Support

If you encounter any issues during deployment, please contact the development team or open an issue in the repository.