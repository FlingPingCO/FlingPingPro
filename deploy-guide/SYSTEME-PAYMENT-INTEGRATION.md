# FlingPing.co Systeme.io Payment Integration Guide

This guide explains how to integrate Systeme.io as a payment processor for FlingPing.co's "Founding Flinger" membership.

## Overview

FlingPing.co now supports three payment integration methods in order of priority:

1. **Systeme.io Payment Link** (Recommended)
2. **Direct Stripe Payment Link** (Alternative)
3. **API-generated Stripe Checkout** (Legacy fallback)

## Systeme.io Payment Link Integration

### Benefits of Using Systeme.io for Payments

1. **All-in-one platform**: Manage payments, customers, and email marketing in one place
2. **Integrated email marketing**: Automatic follow-up sequences and customer management
3. **Built-in sales funnels**: Create complete conversion paths from signup to purchase
4. **Simplified analytics**: Track conversions and customer journey in one dashboard
5. **Consistent branding**: Maintain your brand identity across marketing and payments

### Setup Instructions

1. **Create a Payment Link in Systeme.io**:
   - Log in to your Systeme.io account
   - Navigate to "Funnels" or "Products"
   - Create a new product or select your existing "Founding Flinger Membership"
   - Set up the payment page with your branding and $99 price point
   - Configure any upsells or order bumps if desired
   - Get the shareable payment link

2. **Set the Environment Variable**:
   Add the following to your Hostinger environment configuration:

   ```
   VITE_SYSTEME_PAYMENT_LINK=https://systeme.io/funnel/share/YOUR_PAYMENT_LINK
   ```

   Replace `YOUR_PAYMENT_LINK` with the actual link from Systeme.io

3. **Test the Integration**:
   - Fill in the signup form on your website
   - Verify you're redirected to the Systeme.io payment page
   - Complete a test payment
   - Verify the user is properly recorded in both Systeme.io and your database

## Webhook Integration (Optional)

For advanced integrations, you can set up a webhook from Systeme.io to your application:

1. **Configure a Webhook in Systeme.io**:
   - Navigate to "Integrations" or "Settings" in Systeme.io
   - Set up a webhook to trigger on "Successful Payment"
   - Point it to `https://yourwebsite.com/webhook/systeme`
   - Set the security token to match your `SYSTEME_WEBHOOK_SECRET` environment variable

2. **Handle Webhook Events**:
   Your application already has a webhook endpoint at `/webhook/systeme` that can process these events.

## Troubleshooting

### Common Issues

1. **Payment Link Not Working**:
   - Verify the environment variable is set correctly
   - Check that the Systeme.io funnel/product is active
   - Test the direct link in an incognito browser

2. **User Data Not Transferring**:
   - Ensure your form is correctly submitting data to your API before redirecting
   - Check that the email addresses match between systems

3. **Webhook Integration Issues**:
   - Verify your webhook endpoint is accessible
   - Check the security token configuration
   - Look for errors in your server logs

## Additional Resources

- [Systeme.io API Documentation](https://systeme.io/api-docs)
- [Systeme.io Integration Guide](https://help.systeme.io/article/271-how-to-use-zapier-to-connect-systeme-io-with-other-apps)
- [Systeme.io Webhook Setup](https://help.systeme.io/article/259-how-to-set-up-webhooks-in-systeme-io)

## Deployment Checklist

Before deploying to production:

- [ ] Create and test your Systeme.io payment link
- [ ] Set the `VITE_SYSTEME_PAYMENT_LINK` environment variable
- [ ] Test the complete purchase flow
- [ ] Verify customer data is recorded correctly
- [ ] Configure webhooks if needed
- [ ] Test fallback payment methods (Stripe direct and API checkout)