# FlingPing.co Stripe Product Configuration Guide

This guide explains how to set up and configure the Stripe product (membership) for FlingPing.co and integrate it properly with your application.

## Creating the Membership Product in Stripe

1. **Log in to your Stripe Dashboard**: https://dashboard.stripe.com/

2. **Create a Product**:
   - Navigate to Products → Add Product
   - Product Information:
     - Name: "Founding Flinger Membership"
     - Description: "Exclusive founding member access to FlingPing.co with premium features"
   - Pricing Information:
     - Price: $49.99 (or your desired price)
     - Recurring: One-time (or subscription if desired)
   - Click "Save product"

3. **Note Your Product and Price IDs**:
   - After creating the product, you'll see both a Product ID (prod_XXX) and a Price ID (price_XXX)
   - These IDs are crucial for your integration

## Configuring Environment Variables

Add the following environment variables to your Hostinger configuration:

```
STRIPE_PRODUCT_ID=prod_XXX      # Replace with your actual Product ID
STRIPE_PRICE_ID=price_XXX       # Replace with your actual Price ID
```

## Updating Your Checkout Integration

The current checkout integration in your code should be updated to use these specific product and price IDs. Here's how to update the relevant code:

### 1. Update `server/stripe.ts`:

```typescript
// In the createCheckoutSession method:
async createCheckoutSession(options: CreateSessionOptions): Promise<StripeSession> {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID, // Use the environment variable
        quantity: 1,
      },
    ],
    mode: 'payment', // or 'subscription' if recurring
    customer_email: options.customerEmail,
    success_url: options.successUrl,
    cancel_url: options.cancelUrl,
    metadata: {
      product: 'founding_flinger_membership'
    }
  });

  return {
    id: session.id,
    url: session.url || ''
  };
}
```

### 2. In Your Frontend Modal Component:

Update your `PaymentModal.tsx` component to properly explain the membership product:

```tsx
// Add clear information about what the customer is purchasing
<div className="text-center mb-4">
  <h3 className="text-lg font-bold">Founding Flinger Membership</h3>
  <p className="text-sm text-gray-600">
    Join as a founding member for $49.99 and get exclusive access to premium features.
  </p>
</div>
```

## Testing Your Product Integration

After setting up the product in Stripe and updating your code:

1. **Test with Stripe Test Mode**:
   - Ensure your Stripe Dashboard is in "Test Mode"
   - Use Stripe test card numbers (e.g., 4242 4242 4242 4242) for testing

2. **Verify Successful Payments**:
   - Check that successful payments appear in your Stripe Dashboard
   - Verify users are properly marked as "Founding Flingers" in your system
   - Confirm success page appears after payment

3. **Verify Webhooks**:
   - Test that your webhook endpoint properly processes the payment success events
   - Ensure customer records are updated correctly

## Production Checklist

Before going live with payments:

1. **Switch to Live Mode in Stripe**: Toggle from test mode to live mode
2. **Update Environment Variables**: Ensure all Stripe-related variables point to live credentials
3. **Update Webhook Endpoints**: Configure live webhook endpoints in your Stripe Dashboard
4. **Update Success/Cancel URLs**: Make sure these point to your production URLs
5. **Test End-to-End**: Make a small real payment to verify everything works in production

## Troubleshooting Common Issues

### Payment Button Not Working
- Check browser console for JavaScript errors
- Verify Stripe public key is correctly loaded
- Ensure price ID is valid

### Payment Succeeded But User Not Updated
- Check webhook logs in Stripe Dashboard
- Verify webhook endpoint is correctly handling events
- Look for errors in your server logs

### Missing or Incorrect Product Information
- Verify product and price IDs in environment variables
- Check Stripe Dashboard for correct product configuration

## Additional Resources

- [Stripe Checkout Documentation](https://stripe.com/docs/checkout)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Testing Stripe Payments](https://stripe.com/docs/testing)