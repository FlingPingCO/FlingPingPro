import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import * as https from 'https';
import { storage } from "./storage";
import { stripeService } from "./stripe";
import {
  insertUserSchema,
  insertEmailSignupSchema,
  insertContactMessageSchema,
} from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes - all prefixed with /api
  
  // Email Signup
  app.post("/api/email-signup", async (req: Request, res: Response) => {
    try {
      const data = insertEmailSignupSchema.parse(req.body);
      
      // Check if email already exists
      const existingSignup = await storage.getEmailSignupByEmail(data.email);
      if (existingSignup) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      const signup = await storage.createEmailSignup(data);
      
      // Try with Node.js https module - TRYING BOTH URLs MENTIONED IN DOCS
      try {
        console.log("Sending email signup to Pipedream webhook - trying both URLs");
        
        // Prepare JSON data
        const postData = JSON.stringify(data);
        
        // URL 1: Try the URL from our code
        const requestOptions1 = {
          hostname: 'eodj9vlvbo65l1i.m.pipedream.net',
          port: 443,
          path: '/',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        };
        
        // Create the first request
        console.log("Trying URL 1: eodj9vlvbo65l1i.m.pipedream.net");
        const req1 = https.request(requestOptions1, (res) => {
          console.log(`Pipedream URL 1 Response Status Code: ${res.statusCode}`);
          
          let responseData = '';
          res.on('data', (chunk) => {
            responseData += chunk;
          });
          
          res.on('end', () => {
            console.log(`Pipedream URL 1 Response Body: ${responseData}`);
          });
        });
        
        // Handle errors for request 1
        req1.on('error', (e) => {
          console.error(`Pipedream URL 1 Request Error: ${e.message}`);
        });
        
        // Write data and end request 1
        req1.write(postData);
        req1.end();
        
        // URL 2: Try the URL from the documentation
        const requestOptions2 = {
          hostname: 'eod9jvlvbo6511m.m.pipedream.net',
          port: 443,
          path: '/',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        };
        
        // Create the second request
        console.log("Trying URL 2: eod9jvlvbo6511m.m.pipedream.net");
        const req2 = https.request(requestOptions2, (res) => {
          console.log(`Pipedream URL 2 Response Status Code: ${res.statusCode}`);
          
          let responseData = '';
          res.on('data', (chunk) => {
            responseData += chunk;
          });
          
          res.on('end', () => {
            console.log(`Pipedream URL 2 Response Body: ${responseData}`);
          });
        });
        
        // Handle errors for request 2
        req2.on('error', (e) => {
          console.error(`Pipedream URL 2 Request Error: ${e.message}`);
        });
        
        // Write data and end request 2
        req2.write(postData);
        req2.end();
        
      } catch (webhookError) {
        console.error("Error sending to Pipedream webhook:", webhookError);
      }
      
      return res.status(201).json({ message: "Email registration successful", data: signup });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Contact message
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const data = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(data);
      
      // Try with Node.js https module - TRYING BOTH URLs FOR CONTACT FORM
      try {
        console.log("Sending contact form to Pipedream webhook - trying both URLs");
        
        // Prepare JSON data
        const postData = JSON.stringify(data);
        
        // URL 1: Try the URL from our code
        const requestOptions1 = {
          hostname: 'eodj9vlvbo65l1i.m.pipedream.net',
          port: 443,
          path: '/',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        };
        
        // Create the first request
        console.log("Trying URL 1 for contact form: eodj9vlvbo65l1i.m.pipedream.net");
        const req1 = https.request(requestOptions1, (res) => {
          console.log(`Pipedream Contact URL 1 Response Status Code: ${res.statusCode}`);
          
          let responseData = '';
          res.on('data', (chunk) => {
            responseData += chunk;
          });
          
          res.on('end', () => {
            console.log(`Pipedream Contact URL 1 Response Body: ${responseData}`);
          });
        });
        
        // Handle errors for request 1
        req1.on('error', (e) => {
          console.error(`Pipedream Contact URL 1 Request Error: ${e.message}`);
        });
        
        // Write data and end request 1
        req1.write(postData);
        req1.end();
        
        // URL 2: Try the URL from the documentation
        const requestOptions2 = {
          hostname: 'eod9jvlvbo6511m.m.pipedream.net',
          port: 443,
          path: '/',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        };
        
        // Create the second request
        console.log("Trying URL 2 for contact form: eod9jvlvbo6511m.m.pipedream.net");
        const req2 = https.request(requestOptions2, (res) => {
          console.log(`Pipedream Contact URL 2 Response Status Code: ${res.statusCode}`);
          
          let responseData = '';
          res.on('data', (chunk) => {
            responseData += chunk;
          });
          
          res.on('end', () => {
            console.log(`Pipedream Contact URL 2 Response Body: ${responseData}`);
          });
        });
        
        // Handle errors for request 2
        req2.on('error', (e) => {
          console.error(`Pipedream Contact URL 2 Request Error: ${e.message}`);
        });
        
        // Write data and end request 2
        req2.write(postData);
        req2.end();
        
      } catch (webhookError) {
        console.error("Error sending contact form to Pipedream webhook:", webhookError);
      }
      
      return res.status(201).json({ message: "Message sent successfully", data: message });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // User registration
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const data = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      const user = await storage.createUser(data);
      return res.status(201).json({ message: "Registration successful", data: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Create Stripe checkout session for Founding Flinger membership
  app.post("/api/create-checkout-session", async (req: Request, res: Response) => {
    try {
      const { name, email } = req.body;
      if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required" });
      }
      
      // Check if user exists, or create one
      let user = await storage.getUserByEmail(email);
      if (!user) {
        user = await storage.createUser({ name, email });
      }
      
      // Create Stripe customer
      const stripeCustomerId = await stripeService.createCustomer(name, email);
      
      // Update user with Stripe customer ID
      await storage.updateUserStripeId(user.id, stripeCustomerId);
      
      // Create checkout session
      const session = await stripeService.createCheckoutSession({
        customerEmail: email,
        successUrl: `${process.env.DOMAIN || "http://localhost:5000"}/payment-success`,
        cancelUrl: `${process.env.DOMAIN || "http://localhost:5000"}/payment-cancelled`,
      });
      
      return res.status(200).json({ url: session.url });
    } catch (error) {
      console.error("Checkout session error:", error);
      return res.status(500).json({ message: "Failed to create checkout session" });
    }
  });
  
  // GET version of checkout session creation (for direct links)
  app.get("/api/create-checkout-session", async (req: Request, res: Response) => {
    try {
      const { name, email } = req.query;
      if (!name || !email || typeof name !== 'string' || typeof email !== 'string') {
        return res.status(400).json({ message: "Name and email are required" });
      }
      
      // Check if user exists, or create one
      let user = await storage.getUserByEmail(email);
      if (!user) {
        user = await storage.createUser({ name, email });
      }
      
      // Create Stripe customer
      const stripeCustomerId = await stripeService.createCustomer(name, email);
      
      // Update user with Stripe customer ID
      await storage.updateUserStripeId(user.id, stripeCustomerId);
      
      // Create checkout session
      const session = await stripeService.createCheckoutSession({
        customerEmail: email,
        successUrl: `${process.env.DOMAIN || "http://localhost:5000"}/payment-success`,
        cancelUrl: `${process.env.DOMAIN || "http://localhost:5000"}/payment-cancelled`,
      });
      
      // For GET requests, redirect directly to the Stripe checkout URL
      return res.redirect(session.url);
    } catch (error) {
      console.error("Checkout session error:", error);
      return res.status(500).json({ message: "Failed to create checkout session" });
    }
  });
  
  // Stripe webhook handler
  app.post("/api/webhook", async (req: Request, res: Response) => {
    try {
      // Verify webhook signature in a real implementation
      const isValid = stripeService.validateWebhookSignature(req);
      if (!isValid) {
        return res.status(400).json({ message: "Invalid webhook signature" });
      }
      
      const event = req.body;
      const result = stripeService.handleWebhookEvent(event);
      
      if (result.succeeded && result.type === "payment.succeeded" && result.metadata) {
        // Create a record of the payment
        const { customerId, amount, paymentId } = result.metadata;
        
        if (customerId && paymentId) {
          // Find the user with this Stripe customer ID
          const user = await storage.getUserByStripeCustomerId(customerId);
          
          if (user) {
            // Save the payment record
            await storage.createPayment({
              userId: user.id,
              stripePaymentId: paymentId,
              amount: amount || 9900, // Default to $99.00 if amount is missing
              status: 'succeeded'
            });
            
            // Mark the user as a Founding Flinger
            await storage.setUserAsFoundingFlinger(user.id);
          }
        }
      }
      
      return res.status(200).json({ received: true });
    } catch (error) {
      console.error("Webhook error:", error);
      return res.status(500).json({ message: "Webhook handler failed" });
    }
  });
  
  // Get remaining Founding Flinger spots
  app.get("/api/founding-flinger-count", async (req: Request, res: Response) => {
    try {
      const totalSpots = 250;
      const takenSpots = await storage.getFoundingFlingerCount();
      const remainingSpots = totalSpots - takenSpots;
      
      return res.status(200).json({ 
        total: totalSpots,
        taken: takenSpots,
        remaining: Math.max(0, remainingSpots)
      });
    } catch (error) {
      console.error("Count error:", error);
      return res.status(500).json({ message: "Failed to get count" });
    }
  });
  
  // Get all email sign-ups (admin endpoint)
  app.get("/api/email-signups", async (req: Request, res: Response) => {
    try {
      const signups = await storage.getAllEmailSignups();
      return res.status(200).json({ 
        count: signups.length,
        signups
      });
    } catch (error) {
      console.error("Email signup listing error:", error);
      return res.status(500).json({ message: "Failed to get email signups" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
