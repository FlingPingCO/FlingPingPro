# FlingPing.co AWS S3 Deployment Guide

This guide provides step-by-step instructions for deploying the FlingPing.co website to AWS S3 static website hosting.

## Prerequisites

- AWS account with access to S3
- AWS CLI installed and configured (optional, for command-line deployment)
- The production build zip file (flingping-deployment.zip)

## Step 1: Generate the Production Build

1. Run the production build script:
   ```
   node scripts/build-prod.js
   ```

2. This will:
   - Clean old deployment files
   - Generate a favicon if needed
   - Create the production build
   - Organize files into the proper structure
   - Create a `flingping-deployment.zip` file
   - Show the final file structure

## Step 2: Create an S3 Bucket

1. Sign in to the AWS Management Console and open the [S3 console](https://console.aws.amazon.com/s3/)
2. Choose **Create bucket**
3. Enter a bucket name (e.g., `flingping-website` or your domain name)
4. Select your preferred AWS Region
5. Uncheck **Block all public access** (since this is a public website)
6. Acknowledge that the bucket will be public
7. Keep other settings as default and click **Create bucket**

## Step 3: Configure the Bucket for Static Website Hosting

1. Select your new bucket from the list
2. Go to the **Properties** tab
3. Scroll down to **Static website hosting** and click **Edit**
4. Select **Enable**
5. Set **Index document** to `index.html`
6. Set **Error document** to `index.html` (for SPA routing)
7. Click **Save changes**

## Step 4: Set Bucket Permissions

1. Go to the **Permissions** tab
2. Under **Bucket policy**, click **Edit**
3. Enter the following policy (replace `YOUR-BUCKET-NAME` with your actual bucket name):

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

4. Click **Save changes**

## Step 5: Upload the Website Files

### Option 1: Using AWS Console

1. Go to the **Objects** tab of your bucket
2. Click **Upload**
3. Unzip `flingping-deployment.zip` on your local machine
4. Upload all the files and folders, maintaining the structure
5. Click **Upload**

### Option 2: Using AWS CLI

1. Unzip the deployment package:
   ```
   unzip flingping-deployment.zip -d flingping-deployment
   ```

2. Upload the files using AWS CLI (replace `YOUR-BUCKET-NAME` with your bucket name):
   ```
   aws s3 sync flingping-deployment s3://YOUR-BUCKET-NAME
   ```

## Step 6: Set Content-Type Metadata (Optional but Recommended)

For proper serving of CSS and JavaScript files, set the correct content types:

```
aws s3 cp s3://YOUR-BUCKET-NAME/styles.css s3://YOUR-BUCKET-NAME/styles.css --content-type "text/css" --metadata-directive REPLACE
aws s3 cp s3://YOUR-BUCKET-NAME/index.js s3://YOUR-BUCKET-NAME/index.js --content-type "application/javascript" --metadata-directive REPLACE
```

## Step 7: Access Your Website

1. Go to the **Properties** tab of your bucket
2. Scroll down to **Static website hosting**
3. Find the **Bucket website endpoint** URL
4. Click the URL to visit your deployed website

## Step 8: Set Up CloudFront for HTTPS (Optional)

For HTTPS support and better performance, consider setting up CloudFront:

1. Open the [CloudFront console](https://console.aws.amazon.com/cloudfront/)
2. Click **Create Distribution**
3. For **Origin Domain Name**, enter your S3 website endpoint
4. Configure other settings as needed
5. Click **Create Distribution**
6. Wait for the distribution to deploy
7. Use the CloudFront domain name to access your website with HTTPS

## Step 9: Set Up Custom Domain (Optional)

To use a custom domain with your website:

1. Register your domain with Route 53 or another domain registrar
2. Create a new record set pointing to your CloudFront distribution or S3 website endpoint
3. For HTTPS with a custom domain, request an SSL certificate through AWS Certificate Manager

## Troubleshooting

- **404 Errors**: Ensure your bucket policy is set correctly
- **CSS/JS Not Loading**: Check that content types are set correctly
- **Routing Issues**: Make sure error document is set to index.html

## Maintenance and Updates

For future updates:

1. Run the build script again: `node scripts/build-prod.js`
2. Re-upload the new files to S3
3. Consider setting up a CI/CD pipeline for automated deployments

For more information, refer to the [AWS S3 documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html).