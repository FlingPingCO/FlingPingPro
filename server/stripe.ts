import type { Request, Response } from 'express';
import Stripe from 'stripe';

const FOUNDING_FLINGER_PRICE = 9900; // $99.00 in cents
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia', // Use the latest API version
});

export interface CreateSessionOptions {
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
}

export interface StripeSession {
  id: string;
  url: string;
}

export class StripeService {
  async createCheckoutSession(options: CreateSessionOptions): Promise<StripeSession> {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: options.customerEmail,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Founding Flinger Lifetime Membership',
                description: 'Lifetime access to FlingPing.co as a Founding Flinger',
              },
              unit_amount: FOUNDING_FLINGER_PRICE,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: options.successUrl,
        cancel_url: options.cancelUrl,
      });

      return {
        id: session.id,
        url: session.url || '',
      };
    } catch (error) {
      console.error('Error creating Stripe checkout session:', error);
      throw error;
    }
  }

  async createCustomer(name: string, email: string): Promise<string> {
    try {
      const customer = await stripe.customers.create({
        name,
        email,
      });

      return customer.id;
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw error;
    }
  }

  validateWebhookSignature(req: Request): boolean {
    // In a production environment, you should verify the webhook signature
    // with the Stripe webhook secret
    // For now we'll return true for simplicity
    return true;
  }

  handleWebhookEvent(event: any): { type: string; succeeded: boolean; metadata?: any } {
    switch (event.type) {
      case 'checkout.session.completed':
        return {
          type: 'payment.succeeded',
          succeeded: true,
          metadata: {
            customerId: event.data?.object?.customer,
            amount: FOUNDING_FLINGER_PRICE,
            paymentId: event.data?.object?.payment_intent,
          },
        };
      case 'payment_intent.succeeded':
        return {
          type: 'payment.succeeded',
          succeeded: true,
          metadata: {
            customerId: event.data?.object?.customer,
            amount: event.data?.object?.amount,
            paymentId: event.data?.object?.id,
          },
        };
      default:
        return {
          type: 'unknown',
          succeeded: false,
        };
    }
  }
}

export const stripeService = new StripeService();
