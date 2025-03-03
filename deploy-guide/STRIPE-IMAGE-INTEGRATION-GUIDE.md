# Stripe Product Image Integration Guide

This guide explains how to configure the Stripe checkout page to display the FlingPing.co logo image correctly in both development and production environments.

## Overview

Our Stripe checkout integration has been enhanced to use a local image asset for the product display. This ensures:

1. Consistent branding across all payment touchpoints
2. Reduced dependency on external image hosting
3. Better loading performance
4. Direct control over the image assets

## Implementation Details

The Stripe checkout configuration now dynamically references the FlingPing.co logo from the local `/public/images/` directory:

```javascript
// In server/stripe.ts
images: [
  `${process.env.DOMAIN || 'http://localhost:5000'}/images/FlingPing.co_Logo_TP_Background_Removed.png`
],
```

This implementation:
- Uses the configured `DOMAIN` environment variable in production
- Falls back to `http://localhost:5000` during development
- References a local image file in the public directory

## Required Files

Ensure the following file is present in your deployment:

- `/public/images/FlingPing.co_Logo_TP_Background_Removed.png`

## Environment Configuration

For production deployment, set the following environment variable:

```
DOMAIN=https://flingping.co
```

This ensures Stripe can correctly access your image assets from your production domain.

## Verification Process

After deployment, verify that the image appears correctly in the Stripe checkout:

1. Submit the signup form to create a checkout session
2. Observe the checkout page and confirm the FlingPing.co logo appears
3. Verify the image loads without any console errors

## Troubleshooting

If the image doesn't appear in the Stripe checkout:

1. **Check file availability**: Ensure the image file exists at the correct path in your production environment.

2. **Verify domain configuration**: Make sure the `DOMAIN` environment variable is set correctly.

3. **Check image permissions**: The image file should be publicly accessible.

4. **Test direct image URL**: Try accessing the image directly using the URL:
   ```
   https://yourdomain.com/images/FlingPing.co_Logo_TP_Background_Removed.png
   ```

5. **Stripe logs**: Check Stripe Dashboard logs for any errors related to image loading.

## Alternative Solutions

If you encounter issues with local image hosting, you can revert to using an external image URL:

```javascript
images: [
  'https://externaldomain.com/path/to/FlingPing.co_Logo_TP_Background_Removed.png'
],
```

However, using local assets is the recommended approach as it provides more control and reliability.

## Testing

Use the provided `test-checkout.js` script to verify the checkout session creation and image integration:

```bash
node test-checkout.js
```

This script will:
1. Create a test checkout session
2. Provide a URL to the checkout page
3. Allow you to visually verify the image integration