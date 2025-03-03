import type { Express, Request, Response } from "express";
import { createServer, type Server, IncomingMessage } from "http";
import * as https from "https";
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
      
      // Send to webhook.site
      try {
        console.log("Sending email signup to webhook.site");
        
        // Prepare JSON data
        const postData = JSON.stringify({
          form_type: "email_signup",
          name: data.name,
          email: data.email,
          timestamp: new Date().toISOString()
        });
        
        // Define the request options
        const requestOptions = {
          hostname: 'webhook.site',
          port: 443,
          path: '/00af6027-a80c-4b5f-bd0e-ce5408f954ed',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        };
        
        // Create the request using imported https module
        const req = https.request(requestOptions, (res: IncomingMessage) => {
          console.log(`Webhook.site Email Signup Response Status Code: ${res.statusCode}`);
          
          let responseData = '';
          res.on('data', (chunk: Buffer) => {
            responseData += chunk;
          });
          
          res.on('end', () => {
            console.log(`Webhook.site Email Signup Response Body: ${responseData || 'No response body'}`);
          });
        });
        
        // Handle errors
        req.on('error', (e: Error) => {
          console.error(`Webhook.site Email Signup Request Error: ${e.message}`);
        });
        
        // Write data and end request
        req.write(postData);
        req.end();
        
      } catch (webhookError) {
        console.error("Error sending to webhook.site:", webhookError);
        // Non-blocking error - continue with success response
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
      
      // Send to webhook.site
      try {
        console.log("Sending contact form to webhook.site");
        
        // Prepare JSON data
        const postData = JSON.stringify({
          form_type: "contact_form",
          name: data.name,
          email: data.email,
          message: data.message,
          timestamp: new Date().toISOString()
        });
        
        // Define the request options
        const requestOptions = {
          hostname: 'webhook.site',
          port: 443,
          path: '/00af6027-a80c-4b5f-bd0e-ce5408f954ed',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        };
        
        // Create the request using imported https module
        const req = https.request(requestOptions, (res: IncomingMessage) => {
          console.log(`Webhook.site Contact Form Response Status Code: ${res.statusCode}`);
          
          let responseData = '';
          res.on('data', (chunk: Buffer) => {
            responseData += chunk;
          });
          
          res.on('end', () => {
            console.log(`Webhook.site Contact Form Response Body: ${responseData || 'No response body'}`);
          });
        });
        
        // Handle errors
        req.on('error', (e: Error) => {
          console.error(`Webhook.site Contact Form Request Error: ${e.message}`);
        });
        
        // Write data and end request
        req.write(postData);
        req.end();
        
      } catch (webhookError) {
        console.error("Error sending to webhook.site:", webhookError);
        // Non-blocking error - continue with success response
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

  // Systeme.io webhook handler
  app.post("/webhook/systeme", async (req: Request, res: Response) => {
    try {
      console.log("Received Systeme.io webhook payload:", JSON.stringify(req.body));
      
      // Extract relevant data from Systeme.io payload
      // Note: Adjust these field names based on actual Systeme.io webhook format
      const { 
        contact_email, 
        contact_first_name,
        contact_last_name,
        form_name,
        form_id,
        custom_fields,
        purchase_amount,
        ...otherFields
      } = req.body;
      
      // Validate required fields
      const email = contact_email || req.body.email || '';
      if (!email) {
        console.error("Missing email in Systeme.io webhook payload");
        return res.status(400).json({ success: false, message: "Email is required" });
      }
      
      // Construct a unified data object
      const firstName = contact_first_name || req.body.first_name || '';
      const lastName = contact_last_name || req.body.last_name || '';
      const fullName = firstName && lastName ? `${firstName} ${lastName}` : (firstName || lastName || "Systeme Subscriber");
      
      const formData = {
        name: fullName,
        email: email.toLowerCase().trim(),
        source: "systeme.io",
        form_name: form_name || "Unknown Form",
        form_id: form_id || "Unknown",
        custom_fields: custom_fields || {},
        timestamp: new Date().toISOString(),
        raw_data: req.body
      };
      
      // 1. Store in our local database
      try {
        // Check if email already exists
        const existingSignup = await storage.getEmailSignupByEmail(email);
        if (!existingSignup) {
          // Only create if it doesn't exist
          await storage.createEmailSignup({
            name: fullName,
            email: email.toLowerCase().trim()
          });
          console.log(`Created new email signup from Systeme.io for: ${email}`);
        } else {
          console.log(`Systeme.io submission for existing email: ${email}`);
        }
      } catch (dbError) {
        console.error("Error storing Systeme.io data in database:", dbError);
        // Continue processing - we don't want to fail the whole request
      }
      
      // 2. Send to Google Sheets (implementation below)
      try {
        await sendToGoogleSheets(formData);
      } catch (sheetsError) {
        console.error("Error sending to Google Sheets:", sheetsError);
      }
      
      // 3. Send to Notion (implementation below)
      try {
        await sendToNotion(formData);
      } catch (notionError) {
        console.error("Error sending to Notion:", notionError);
      }
      
      // Always return success to Systeme.io to prevent retries
      return res.status(200).json({ 
        success: true, 
        message: "Webhook received successfully",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Systeme.io webhook processing error:", error);
      // Still return 200 to avoid Systeme.io retries
      return res.status(200).json({ 
        success: true, 
        message: "Webhook processed with errors", 
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
