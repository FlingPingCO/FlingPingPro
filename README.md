# FlingPing.co Platform

A cutting-edge sexual health platform providing inclusive, private, and accessible digital health communication through innovative technology and user-centric design.

## Tech Stack

- **Frontend:** React with Tailwind CSS for styling
- **Backend:** Node.js with Express
- **Data Storage:** In-memory database with webhook backup
- **Payments:** Stripe integration
- **Form Data Collection:** webhook.site integration
- **Authentication:** Custom user auth system

## Key Features

- Email signup form with data collection
- Contact form with data collection
- Founding Flinger membership with Stripe payments
- Webhook integration for form data backup
- User account management

## Project Structure

- `client/` - Frontend React application
- `server/` - Backend Express server
- `shared/` - Shared types and schemas
- `public/` - Static assets

## Integration Documentation

- [Stripe Integration](./STRIPE-INTEGRATION.md)
- [Webhook Integration](./WEBHOOK-INTEGRATION.md)
- [Webhook Test Report](./WEBHOOK-TEST-REPORT.md)

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Access the application at:
   ```
   http://localhost:5000
   ```

## Environment Variables

The following environment variables are used:

- `STRIPE_SECRET_KEY` - Stripe API secret key
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `DOMAIN` - Domain for redirects (defaults to http://localhost:5000)

## Development Guidelines

1. All new endpoints should follow the pattern in `server/routes.ts`
2. All new components should be added to `client/src/components`
3. Shared types should be defined in `shared/schema.ts`
4. Use the existing storage patterns in `server/storage.ts`

## Webhook Integration

The application integrates with webhook.site for form data collection:

- Webhook URL: `https://webhook.site/00af6027-a80c-4b5f-bd0e-ce5408f954ed`
- Two form types are supported: Email Signup and Contact Form
- All form submissions are stored in both the primary storage and sent to webhook.site
- See [Webhook Integration](./WEBHOOK-INTEGRATION.md) for detailed documentation

## License

Proprietary - All rights reserved