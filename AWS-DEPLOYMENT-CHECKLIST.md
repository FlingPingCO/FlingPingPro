# FlingPing.co AWS S3 Deployment Checklist

Use this checklist to ensure a smooth deployment process for your FlingPing.co website.

## Pre-Deployment Preparation

- [ ] Generate the deployment package
  ```bash
  node scripts/setup-deployment-structure.js
  ```
  or
  ```bash
  node scripts/build-prod.js
  ```

- [ ] Download the `flingping-deployment.zip` file from Replit to your local machine
- [ ] Extract the zip file (for manual upload) or keep it zipped (for programmatic upload)
- [ ] Verify that all required files are present in the extracted directory
- [ ] Review the AWS-S3-DEPLOYMENT-GUIDE.md for detailed instructions

## AWS S3 Setup

- [ ] Create a new S3 bucket with a suitable name (e.g., `flingping-website`)
- [ ] Uncheck "Block all public access" (acknowledge the security implications)
- [ ] Enable static website hosting in the bucket properties
  - [ ] Set index document to `index.html`
  - [ ] Set error document to `index.html` (for SPA routing)
- [ ] Add a bucket policy to allow public read access:
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

## File Upload

- [ ] Upload all files from the deployment package to S3
  - [ ] Option 1: Use the AWS Management Console
    - [ ] Upload files maintaining the directory structure
    - [ ] Set appropriate content types for each file:
      - HTML: `text/html`
      - CSS: `text/css`
      - JavaScript: `application/javascript`
      - Images: Appropriate image types
      - Favicon: `image/x-icon`
  
  - [ ] Option 2: Use AWS CLI for more efficient upload
    ```bash
    # Example AWS CLI commands
    aws s3 cp index.html s3://YOUR-BUCKET-NAME/ --content-type "text/html"
    aws s3 cp styles.css s3://YOUR-BUCKET-NAME/ --content-type "text/css"
    aws s3 cp index.js s3://YOUR-BUCKET-NAME/ --content-type "application/javascript"
    aws s3 cp public/favicon.ico s3://YOUR-BUCKET-NAME/public/ --content-type "image/x-icon"
    aws s3 sync public/ s3://YOUR-BUCKET-NAME/public/
    ```

## Website Verification

- [ ] Access your website via the S3 website endpoint URL
  - The URL format is typically: `http://YOUR-BUCKET-NAME.s3-website-REGION.amazonaws.com`
- [ ] Test navigation through all pages
- [ ] Verify all images load correctly
- [ ] Check if styles are correctly applied
- [ ] Test responsive behavior on different screen sizes
- [ ] Verify blog functionality
  - [ ] Blog listing page works
  - [ ] Individual blog posts load correctly
  - [ ] Images in blog posts display properly
- [ ] Test admin panel access at `/admin`
  - [ ] Login with admin credentials
  - [ ] Verify blog management functionality

## Performance and SEO Optimization

- [ ] Check page load speed
- [ ] Verify meta tags and SEO elements
- [ ] Check for any console errors in browser developer tools
- [ ] Ensure proper social media preview cards work
- [ ] Validate structured data if applicable

## Domain Setup (Optional)

- [ ] Set up CloudFront distribution for HTTPS and performance
  - [ ] Create a new CloudFront distribution
  - [ ] Set the S3 website endpoint as the origin
  - [ ] Configure cache behavior
  - [ ] Set up HTTPS with an SSL certificate
- [ ] Configure your custom domain in your DNS provider
  - [ ] Add a CNAME record pointing to CloudFront
  - [ ] Or use Route 53 for AWS-integrated DNS management

## Post-Deployment

- [ ] Perform final cross-browser testing
- [ ] Document deployment configuration
- [ ] Save access credentials in a secure location
- [ ] Plan for future updates and maintenance

## Security Considerations

- [ ] Review S3 bucket permissions to ensure only necessary access is granted
- [ ] Consider implementing AWS WAF for additional security
- [ ] Set up CloudTrail for S3 and CloudFront access logging
- [ ] Change admin panel default credentials

## Contact Information

For deployment assistance or issues, contact:
- [Your Name]
- [Your Email Address]
- [Your Phone Number]