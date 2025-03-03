# Payment Integration Guide for FlingPing.co

This guide covers how to configure and manage payment options for the FlingPing.co website.

## Payment Integration Options

FlingPing.co supports multiple payment integration methods, with the following priority order:

1. **Direct Stripe Payment Link** (Recommended for production)
2. **API-generated Stripe Checkout** (Default fallback)

## Configuration via Environment Variables

The payment system can be configured using environment variables in your production environment:

```
VITE_STRIPE_PRODUCT_LINK=https://buy.stripe.com/00g9Ee2HifDDety001
```

## Implementing the Direct Stripe Payment Link (Recommended)

For production deployments, we recommend using the direct Stripe payment link approach:

1. Log in to your Stripe dashboard
2. Create a product with the appropriate price ($99)
3. Generate a payment link for this product
4. Add the payment link URL to your environment variables as `VITE_STRIPE_PRODUCT_LINK`

### Steps to Enable Direct Stripe Payment Link

1. In your production environment (Hostinger), add the following environment variable:
   ```
   VITE_STRIPE_PRODUCT_LINK=https://buy.stripe.com/00g9Ee2HifDDety001
   ```

2. Make sure the `SignupForm.tsx` component has the proper code to use this link:
   ```javascript
   // In client/src/components/SignupForm.tsx
   const stripeProductLink = import.meta.env.VITE_STRIPE_PRODUCT_LINK;
   
   if (stripeProductLink) {
     window.open(stripeProductLink, '_blank');
   } else {
     window.open(`/api/create-checkout-session?name=${encodeURIComponent(data.name)}&email=${encodeURIComponent(data.email)}`, '_blank');
   }
   ```

## Fallback: API-generated Stripe Checkout

If the direct payment link is not configured, the system will automatically fall back to the API-generated Stripe checkout. This requires:

1. Stripe API keys to be properly configured
2. The `/api/create-checkout-session` endpoint to be functioning correctly

### Required Environment Variables for API Checkout

```
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

## Troubleshooting

### Direct Stripe Payment Link Not Working

If the direct Stripe payment link is not working:

1. Verify the Stripe product link is valid by opening it directly in a browser
2. Check that the environment variable is correctly set
3. Fall back to the API-generated checkout by removing the `VITE_STRIPE_PRODUCT_LINK` environment variable

### API-generated Checkout Issues

If the API-generated checkout is not working:

1. Check the Stripe API keys are correctly configured
2. Verify the server logs for any Stripe-related errors
3. Ensure the success and cancel URLs are properly set in the Stripe service configuration

## Testing the Payment Integration

Always test the payment flow after making changes:

1. Fill out the signup form with test information
2. Submit the form and verify that the payment page opens
3. Complete a test payment using Stripe test card information
4. Verify the success/cancel flows work correctly

## Switching Between Payment Methods

To switch between payment methods:

1. **To use direct Stripe payment link**: Add the `VITE_STRIPE_PRODUCT_LINK` environment variable
2. **To use API-generated checkout**: Remove the `VITE_STRIPE_PRODUCT_LINK` environment variable