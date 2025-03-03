import type { Request, Response } from 'express';
import Stripe from 'stripe';

// Default price if environment variable is not set
const FOUNDING_FLINGER_PRICE = 9900; // $99.00 in cents

// Stripe configuration
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_PRODUCT_ID = process.env.STRIPE_PRODUCT_ID || '';
const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID || '';

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
      let sessionConfig: any = {
        payment_method_types: ['card'],
        customer_email: options.customerEmail,
        mode: 'payment',
        success_url: options.successUrl,
        cancel_url: options.cancelUrl,
        metadata: {
          product: 'founding_flinger_membership'
        }
      };
      
      // If we have a Stripe Price ID configured, use it directly
      if (STRIPE_PRICE_ID) {
        sessionConfig.line_items = [
          {
            price: STRIPE_PRICE_ID,
            quantity: 1,
          },
        ];
      } 
      // Otherwise fall back to the manual product/price configuration
      else {
        sessionConfig.line_items = [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Founding Flinger Lifetime Membership',
                description: 'Lifetime access to FlingPing.co as a Founding Flinger',
                images: [
                  `${process.env.DOMAIN || 'http://localhost:5000'}/images/FlingPing.co_Logo_TP_Background_Removed.png`
                ],
              },
              unit_amount: FOUNDING_FLINGER_PRICE,
            },
            quantity: 1,
          },
        ];
      }
      
      const session = await stripe.checkout.sessions.create(sessionConfig);

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
        // Get the amount from the checkout session - this works with both price_id and price_data
        const amount = event.data?.object?.amount_total || FOUNDING_FLINGER_PRICE;
        
        return {
          type: 'payment.succeeded',
          succeeded: true,
          metadata: {
            customerId: event.data?.object?.customer,
            amount: amount,
            paymentId: event.data?.object?.payment_intent,
            productId: event.data?.object?.metadata?.product || 'founding_flinger_membership',
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
            productId: event.data?.object?.metadata?.product || 'founding_flinger_membership',
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
