import type { Express, Request, Response, NextFunction } from "express";
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
import { sendToGoogleSheets, validateWebhookRequest, validateInboundWebhookRequest } from "./integrations";

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
      // Validate webhook request before processing
      if (!validateWebhookRequest(req)) {
        console.error('Unauthorized webhook request to /webhook/systeme');
        return res.status(403).json({ 
          success: false, 
          message: "Forbidden: Invalid or missing X-Webhook-Secret header" 
        });
      }
      
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
      
      // 1.5 Send to webhook.site for testing/debugging
      try {
        console.log("Forwarding Systeme.io webhook to webhook.site");
        
        // Prepare JSON data
        const postData = JSON.stringify({
          source: "systeme_webhook",
          timestamp: new Date().toISOString(),
          data: formData
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
        
        // Create the request
        const req = https.request(requestOptions, (res: IncomingMessage) => {
          console.log(`Webhook.site Systeme.io Forward Response Status Code: ${res.statusCode}`);
          
          let responseData = '';
          res.on('data', (chunk: Buffer) => {
            responseData += chunk;
          });
          
          res.on('end', () => {
            console.log(`Webhook.site Systeme.io Forward Response Body: ${responseData || 'No response body'}`);
          });
        });
        
        // Handle errors
        req.on('error', (e: Error) => {
          console.error(`Webhook.site Systeme.io Forward Request Error: ${e.message}`);
        });
        
        // Write data and end request
        req.write(postData);
        req.end();
        
      } catch (webhookError) {
        console.error("Error forwarding to webhook.site:", webhookError);
        // Non-blocking error - continue with success response
      }
      
      // 2. Send to Google Sheets (implementation below)
      try {
        await sendToGoogleSheets(formData);
      } catch (sheetsError) {
        console.error("Error sending to Google Sheets:", sheetsError);
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
        error: process.env.NODE_ENV === 'development' 
               ? (error instanceof Error ? error.message : String(error)) 
               : undefined
      });
    }
  });
  
  // Webhook.site inbound webhook endpoint - receives data from Webhook.site and forwards to Systeme.io
  app.post("/webhook/inbound", async (req: Request, res: Response) => {
    try {
      // Validate webhook request before processing
      if (!validateWebhookRequest(req)) {
        console.error('Unauthorized webhook request to /webhook/inbound');
        return res.status(403).json({ 
          success: false, 
          message: "Forbidden: Invalid or missing webhook secret header" 
        });
      }
      
      console.log("Received inbound webhook from Webhook.site:", JSON.stringify(req.body));
      
      // Extract data from the webhook payload
      const { name, email, message, form_type } = req.body;
      
      if (!email) {
        console.error("Missing email in inbound webhook payload");
        return res.status(400).json({ success: false, message: "Email is required" });
      }
      
      // Store in our database
      try {
        // For email signups
        if (form_type === "email_signup" || !form_type) {
          const existingSignup = await storage.getEmailSignupByEmail(email);
          if (!existingSignup) {
            await storage.createEmailSignup({
              name: name || "Webhook Subscriber",
              email: email.toLowerCase().trim()
            });
            console.log(`Created new email signup from webhook for: ${email}`);
          } else {
            console.log(`Webhook submission for existing email: ${email}`);
          }
        } 
        // For contact messages
        else if (form_type === "contact_form" && message) {
          await storage.createContactMessage({
            name: name || "Webhook Contact",
            email: email.toLowerCase().trim(),
            message: message
          });
          console.log(`Created new contact message from webhook for: ${email}`);
        }
      } catch (dbError) {
        console.error("Error storing webhook data in database:", dbError);
        // Continue processing - we don't want to fail the whole request
      }
      
      // Forward to Systeme.io API
      try {
        console.log("Forwarding data to Systeme.io API");
        
        // Check if Systeme.io API key is configured
        if (!process.env.SYSTEME_API_KEY) {
          console.log('Systeme.io API key not configured (SYSTEME_API_KEY). Using mock implementation.');
          console.log('Would have sent to Systeme.io:', {
            email: email,
            name: name,
            form_type: form_type || 'email_signup',
            timestamp: new Date().toISOString()
          });
          
          // Even without Systeme.io, save to Google Sheets
          const formData = {
            name: name || "Unknown",
            email: email,
            source: "webhook.site",
            form_name: form_type || "Unknown",
            form_id: "webhook_inbound",
            timestamp: new Date().toISOString(),
            custom_fields: {
              message: message || "",
              form_type: form_type || "email_signup"
            },
            raw_data: req.body
          };
          
          // Send to Google Sheets
          sendToGoogleSheets(formData).catch(sheetsError => {
            console.error("Error sending to Google Sheets:", sheetsError);
          });
          
          return; // Skip the actual API call
        }
        
        // Prepare data for Systeme.io
        const firstName = name ? name.split(' ')[0] : '';
        const lastName = name && name.split(' ').length > 1 ? name.split(' ').slice(1).join(' ') : '';
        
        const postData = JSON.stringify({
          email: email,
          firstName: firstName,
          lastName: lastName,
          source: "flingping_website",
          ipAddress: req.ip || "127.0.0.1",
          tags: [form_type || "email_signup"],
          customFields: {
            message: message || "",
            form_type: form_type || "email_signup",
            timestamp: new Date().toISOString()
          }
        });
        
        // Define the request options for Systeme.io API
        // Using the standard Systeme.io API endpoint
        const requestOptions = {
          hostname: 'api.systeme.io',
          path: '/api/v2/contacts',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            'X-API-Key': process.env.SYSTEME_API_KEY || ''
          }
        };
        
        console.log(`Debug: Using Systeme.io API endpoint: ${requestOptions.hostname}${requestOptions.path}`);
        
        // Create the request
        const systemeReq = https.request(requestOptions, (systemeRes: IncomingMessage) => {
          console.log(`Systeme.io API Response Status Code: ${systemeRes.statusCode}`);
          
          let responseData = '';
          systemeRes.on('data', (chunk: Buffer) => {
            responseData += chunk;
          });
          
          systemeRes.on('end', () => {
            console.log(`Systeme.io API Response Body: ${responseData || 'No response body'}`);
            
            // Forward to Google Sheets
            const formData = {
              name: name || "Unknown",
              email: email,
              source: "webhook.site",
              form_name: form_type || "Unknown",
              form_id: "webhook_inbound",
              timestamp: new Date().toISOString(),
              custom_fields: {
                message: message || "",
                form_type: form_type || "email_signup"
              },
              raw_data: req.body
            };
            
            // Send to Google Sheets
            sendToGoogleSheets(formData).catch(sheetsError => {
              console.error("Error sending to Google Sheets:", sheetsError);
            });
          });
        });
        
        // Handle errors
        systemeReq.on('error', (e: Error) => {
          console.error(`Systeme.io API Request Error: ${e.message}`);
          
          // Even if Systeme.io API fails, try to save to Google Sheets
          const formData = {
            name: name || "Unknown",
            email: email,
            source: "webhook.site",
            form_name: form_type || "Unknown",
            form_id: "webhook_inbound",
            timestamp: new Date().toISOString(),
            custom_fields: {
              message: message || "",
              form_type: form_type || "email_signup"
            },
            raw_data: req.body
          };
          
          // Send to Google Sheets
          sendToGoogleSheets(formData).catch(sheetsError => {
            console.error("Error sending to Google Sheets:", sheetsError);
          });
        });
        
        // Write data and end request
        systemeReq.write(postData);
        systemeReq.end();
        
      } catch (apiError) {
        console.error("Error forwarding to Systeme.io API:", apiError);
      }
      
      // Return success to Webhook.site
      return res.status(200).json({
        success: true,
        message: "Webhook processed successfully",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Webhook processing error:", error);
      return res.status(500).json({
        success: false,
        message: "Error processing webhook",
        error: process.env.NODE_ENV === 'development' 
               ? (error instanceof Error ? error.message : String(error)) 
               : undefined
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
