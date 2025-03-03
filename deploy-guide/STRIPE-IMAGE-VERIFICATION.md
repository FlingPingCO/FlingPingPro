# Stripe Image Integration Verification

This document provides step-by-step instructions for verifying that the FlingPing.co logo is properly integrated into the Stripe checkout experience after deployment.

## Overview

Our improved Stripe checkout experience uses a locally-hosted FlingPing.co logo image. This verification guide ensures that after deployment, the image is:

1. Accessible from the server
2. Correctly referenced in the Stripe checkout configuration
3. Visible to users during the checkout process

## Prerequisites

- FlingPing.co website is deployed and accessible
- Stripe integration is configured with the correct API keys
- Environment variables are properly set

## Image Accessibility Test

First, verify that the logo image is accessible at the expected URL:

1. Open a browser and navigate to:
   ```
   https://yourdomain.com/images/FlingPing.co_Logo_TP_Background_Removed.png
   ```
   Replace `yourdomain.com` with your actual deployed domain.

2. Verify the image loads correctly:
   - Image should display clearly
   - No 404 or other error codes should appear
   - Image should have a transparent background

3. Check the image properties:
   - Right-click on the image and select "View image info" or similar
   - Verify the image type is PNG
   - Confirm the dimensions are appropriate (recommended: at least 128px width)

## Automated Image Test

Use the provided test script to verify image accessibility programmatically:

1. Update the test script with your production domain:
   ```javascript
   // In test-stripe-image.js
   const domain = "https://yourdomain.com"; // Update this
   ```

2. Run the test:
   ```bash
   node test-stripe-image.js
   ```

3. Check the output:
   - Status code should be 200
   - Content type should be "image/png"
   - File size should match expected size

## Stripe Checkout Integration Test

Now verify the image appears in the actual Stripe checkout:

1. Navigate to the home page of your deployed site
2. Fill out the signup form with test data:
   - Name: Test User
   - Email: test@example.com

3. Submit the form to trigger the checkout flow

4. On the Stripe checkout page, verify:
   - The FlingPing.co logo appears at the top of the checkout form
   - The image is clear and properly sized
   - There are no console errors related to image loading (F12 > Console)

5. Complete a test purchase:
   - Use test card number: 4242 4242 4242 4242
   - Any future expiration date
   - Any 3-digit CVC
   - Any postal code

6. Verify success and cancel paths work as expected

## Troubleshooting Common Issues

### Image Not Found (404)

If the image returns a 404 error:

1. Verify the image exists in the correct location:
   - For Hostinger: Check the `/public/images/` directory
   - Ensure the filename matches exactly: `FlingPing.co_Logo_TP_Background_Removed.png`

2. Check file permissions:
   - The file should be readable by the web server

3. Verify path configuration:
   - In `server/stripe.ts`, check that the image path is correctly constructed

### Image Loads But Doesn't Appear in Checkout

If the image loads directly but doesn't appear in Stripe checkout:

1. Check the `DOMAIN` environment variable:
   - Ensure it's set to your full domain with protocol (https://yourdomain.com)
   - No trailing slash should be present

2. Verify Stripe configuration:
   - Check Stripe Dashboard > Products to see if image URL is registered

3. Check for CORS issues:
   - Look in browser console for CORS-related errors
   - Ensure your server allows Stripe to access your images

### Image Appears Incorrect or Distorted

If the image appears but looks wrong:

1. Verify image dimensions and format:
   - Image should be at least 128px wide for Stripe
   - PNG format with transparency is recommended

2. Check image optimization:
   - The image should be web-optimized but still clear
   - Size should be reasonable (typically under 100KB)

## Switching to Direct Stripe Link (Alternative)

If you continue having issues with the API-generated checkout images, consider using the direct Stripe payment link:

1. Set the environment variable:
   ```
   VITE_STRIPE_PRODUCT_LINK=https://buy.stripe.com/your_link
   ```

2. This will bypass the API-generated checkout and use Stripe's hosted checkout page directly

## Documenting Results

After completing the verification:

1. Document any issues encountered
2. Note the successful checkout URL pattern
3. Take screenshots of the checkout page showing the logo for future reference

## Regular Verification

Perform this verification:
- After each deployment
- When updating the logo image
- When changing Stripe configuration
- Periodically as part of routine maintenance