# FlingPing.co Deployment Guide

This guide provides the step-by-step instructions to deploy the FlingPing.co website to Amazon S3 for production.

## Step 1: Generate Deployment Package

First, we need to generate the deployment package which will bundle all the necessary files:

```bash
# Change to the project directory
cd /path/to/flingping-project

# Run the production build script
node scripts/build-prod.js
```

This will create:
1. A `/flingping-deployment` directory with the complete site structure
2. A `flingping-deployment.zip` file that contains all the files ready for upload

## Step 2: Admin Access Documentation

Before deploying, make sure you have securely documented the admin access details:

- Admin URL: https://your-domain.com/admin (After deployment)
- Username: [Your Admin Username]
- Password: [Your Admin Password]

## Step 3: AWS S3 Deployment

Follow these steps to deploy to AWS S3:

1. **Create an S3 bucket**:
   - Log into your AWS Management Console
   - Navigate to S3 and create a new bucket (e.g., `flingping-website`)
   - Uncheck "Block all public access" (since this is a public website)

2. **Configure static website hosting**:
   - In your bucket settings, go to "Properties"
   - Enable static website hosting
   - Set index document and error document to `index.html`

3. **Set bucket policy for public access**:
   - Go to "Permissions" > "Bucket policy"
   - Add the following policy (replace `YOUR-BUCKET-NAME` with your actual bucket name):
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

4. **Upload website files**:
   - Extract `flingping-deployment.zip` (if not already working with the extracted directory)
   - Upload all files and directories to your S3 bucket:
     
   **Option 1: AWS Console (Manual)**
   - Click "Upload" in your bucket
   - Add files and folders from the `flingping-deployment` directory
   - Ensure correct content types are set for each file type

   **Option 2: AWS CLI (Recommended)**
   ```bash
   # Install and configure AWS CLI if not already done
   aws configure
   
   # Upload the main files with correct content types
   aws s3 cp index.html s3://YOUR-BUCKET-NAME/ --content-type "text/html"
   aws s3 cp styles.css s3://YOUR-BUCKET-NAME/ --content-type "text/css"
   aws s3 cp index.js s3://YOUR-BUCKET-NAME/ --content-type "application/javascript"
   
   # Upload the other files
   aws s3 cp public/favicon.ico s3://YOUR-BUCKET-NAME/public/ --content-type "image/x-icon"
   aws s3 sync public/ s3://YOUR-BUCKET-NAME/public/
   ```

5. **Verify deployment**:
   - Access your website via the S3 website endpoint URL (found in the "Properties" tab)
   - Check that all pages, styles, images, and functionality work correctly

## Step 4: Custom Domain (Optional)

For a professional setup, connect your domain to the S3 bucket:

1. **Set up CloudFront**:
   - Create a CloudFront distribution pointing to your S3 bucket
   - This provides HTTPS and better performance

2. **Configure DNS**:
   - In your domain registrar, create a CNAME record pointing to your CloudFront distribution
   - Or, if using Route 53, create an alias record pointing to your CloudFront distribution

## Step 5: Blog System Setup

After deployment, set up the blog system:

1. **Verify Admin Access**:
   - Navigate to `/admin` on your deployed site
   - Log in with the admin credentials
   - Verify you can create, edit, and delete blog posts and categories

2. **Create Initial Content**:
   - Set up initial blog categories if they don't exist
   - Create or check sample blog posts for each category

## Step 6: Post-Deployment Tasks

Once the site is live:

1. **Verify Integrations**:
   - Check if Stripe payment integration is working
   - Verify webhook integrations with Systeme.io
   - Test Google Sheets connection if it's being used

2. **Test All Functionality**:
   - Test the contact form
   - Test newsletter signup
   - Test blog system and comments if applicable
   - Test user authentication if applicable
   - Test payment processing

3. **Browser Testing**:
   - Test the site in different browsers (Chrome, Firefox, Safari, Edge)
   - Test on mobile devices with different screen sizes

## Troubleshooting Common Issues

### Images Not Loading
- Check that image paths are correct
- Verify the proper content types are set for image files
- Check the S3 bucket policy allows public read access

### CSS/JS Not Working
- Ensure proper content types are set for CSS and JS files
- Check for console errors in the browser developer tools
- Verify that files were uploaded to the correct locations

### Blog System Issues
- Verify that the data files are properly stored and accessible
- Check server logs for any error messages
- Ensure admin authentication is working properly

## Support

For any deployment issues or questions, please contact:
- [Your Support Email]
- [Your Support Phone]

For detailed technical questions about the codebase, refer to the documentation in the repository.