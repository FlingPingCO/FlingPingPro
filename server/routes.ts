import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server, IncomingMessage } from "http";
import * as https from "https";
import fetch from 'node-fetch';
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
        
        // Prepare JSON data with all fields needed for Google Sheets
        const postData = JSON.stringify({
          form_type: "email_signup",
          name: data.name,
          email: data.email,
          timestamp: new Date().toISOString(),
          source: "direct_signup",
          form_name: "Email Signup Form",
          form_id: "direct_api",
          custom_fields: {
            form_type: "email_signup"
          }
        });
        
        // Define the request options for webhook.site (kept for backward compatibility)
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
        
        // Also send directly to Google Apps Script using node-fetch (handles redirects)
        try {
          console.log("Sending email signup directly to Google Apps Script");
          
          // Using node-fetch to handle redirects automatically
          fetch('https://script.google.com/macros/s/AKfycbyHH0EG9iOxbumMMs098mXdSSh3q9mzlKnCd8rfJAPCWhM8_aPK1xV4UPv_Arm4vZPHBA/exec', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: postData,
            redirect: 'follow' // Follow redirects automatically
          })
          .then(response => {
            console.log(`Google Apps Script Response Status Code: ${response.status}`);
            return response.text();
          })
          .then(responseText => {
            console.log(`Google Apps Script Response: ${responseText || 'No response'}`);
            if (responseText.includes('Success')) {
              console.log("Email signup successfully submitted to Google Sheets via Apps Script");
            }
          })
          .catch(error => {
            console.error(`Google Apps Script Request Error: ${error.message}`);
          });
        } catch (googleScriptError) {
          console.error("Error sending to Google Apps Script:", googleScriptError);
        }
        
        // Create the request using node-fetch
        fetch('https://webhook.site/00af6027-a80c-4b5f-bd0e-ce5408f954ed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: postData
        })
        .then(response => {
          console.log(`Webhook.site Email Signup Response Status Code: ${response.status}`);
          return response.text();
        })
        .then(responseText => {
          console.log(`Webhook.site Email Signup Response Body: ${responseText || 'No response body'}`);
          
          // After webhook.site success, send to Systeme.io
          try {
            console.log("Sending email signup to Systeme.io");
            
            // Prepare data for Systeme.io
            const systemeData = JSON.stringify({
              email: data.email,
              firstName: data.name.split(' ')[0] || 'Subscriber',
              lastName: data.name.split(' ').slice(1).join(' ') || '',
              source: "FlingPing.co Direct Signup",
              ipAddress: req.ip || "unknown",
              customFields: {
                signupType: "email_signup",
                signupDate: new Date().toISOString(),
                origin: "website_form"
              }
            });
            
            // Send to Systeme.io using node-fetch
            fetch('https://api.systeme.io/api/contacts', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-API-Key': process.env.SYSTEME_API_KEY || '',
                'Accept': 'application/json'
              },
              body: systemeData
            })
            .then(systemeRes => {
              console.log(`Systeme.io Email Signup Response Status Code: ${systemeRes.status}`);
              return systemeRes.text();
            })
            .then(systemeResponseText => {
              console.log(`Systeme.io Email Signup Response Body: ${systemeResponseText || 'No response body'}`);
              
              // We no longer need to send directly to Google Sheets
              // webhook.site will handle forwarding this data to Google Sheets
              console.log("Data sent to webhook.site, which will forward to Google Sheets");
            })
            .catch(systemeError => {
              console.error(`Systeme.io Email Signup Request Error: ${systemeError.message}`);
            });
            
          } catch (systemeError) {
            console.error("Error sending to Systeme.io:", systemeError);
          }
        })
        .catch(error => {
          console.error(`Webhook.site Email Signup Request Error: ${error.message}`);
        });
        
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
        
        // Prepare JSON data with all fields needed for Google Sheets
        const postData = JSON.stringify({
          form_type: "contact_form",
          name: data.name,
          email: data.email,
          message: data.message,
          timestamp: new Date().toISOString(),
          source: "direct_contact",
          form_name: "Contact Form",
          form_id: "direct_api",
          custom_fields: {
            form_type: "contact_form",
            message: data.message
          }
        });
        
        // Define the request options for webhook.site (kept for backward compatibility)
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
        
        // Also send directly to Google Apps Script using node-fetch (handles redirects)
        try {
          console.log("Sending contact form directly to Google Apps Script");
          
          // Using node-fetch to handle redirects automatically
          fetch('https://script.google.com/macros/s/AKfycbyHH0EG9iOxbumMMs098mXdSSh3q9mzlKnCd8rfJAPCWhM8_aPK1xV4UPv_Arm4vZPHBA/exec', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: postData,
            redirect: 'follow' // Follow redirects automatically
          })
          .then(response => {
            console.log(`Google Apps Script Response Status Code: ${response.status}`);
            return response.text();
          })
          .then(responseText => {
            console.log(`Google Apps Script Response: ${responseText || 'No response'}`);
            if (responseText.includes('Success')) {
              console.log("Contact form successfully submitted to Google Sheets via Apps Script");
            }
          })
          .catch(error => {
            console.error(`Google Apps Script Request Error: ${error.message}`);
          });
        } catch (googleScriptError) {
          console.error("Error sending to Google Apps Script:", googleScriptError);
        }
        
        // Create the request using node-fetch
        fetch('https://webhook.site/00af6027-a80c-4b5f-bd0e-ce5408f954ed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: postData
        })
        .then(response => {
          console.log(`Webhook.site Contact Form Response Status Code: ${response.status}`);
          return response.text();
        })
        .then(responseText => {
          console.log(`Webhook.site Contact Form Response Body: ${responseText || 'No response body'}`);
          
          // After webhook.site success, send to Systeme.io
          try {
            console.log("Sending contact form to Systeme.io");
            
            // Prepare data for Systeme.io
            const systemeData = JSON.stringify({
              email: data.email,
              firstName: data.name.split(' ')[0],
              lastName: data.name.split(' ').slice(1).join(' '),
              source: "FlingPing.co Contact Form",
              ipAddress: req.ip || "unknown",
              customFields: {
                contactMessage: data.message,
                contactDate: new Date().toISOString(),
                formType: "contact_form"
              }
            });
            
            // Send to Systeme.io using node-fetch
            fetch('https://api.systeme.io/api/contacts', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-API-Key': process.env.SYSTEME_API_KEY || '',
                'Accept': 'application/json'
              },
              body: systemeData
            })
            .then(systemeRes => {
              console.log(`Systeme.io Contact Form Response Status Code: ${systemeRes.status}`);
              return systemeRes.text();
            })
            .then(systemeResponseText => {
              console.log(`Systeme.io Contact Form Response Body: ${systemeResponseText || 'No response body'}`);
              
              // We no longer need to send directly to Google Sheets
              // webhook.site will handle forwarding this data to Google Sheets
              console.log("Contact form data sent to webhook.site, which will forward to Google Sheets");
            })
            .catch(systemeError => {
              console.error(`Systeme.io Contact Form Request Error: ${systemeError.message}`);
            });
            
          } catch (systemeError) {
            console.error("Error sending to Systeme.io:", systemeError);
          }
        })
        .catch(error => {
          console.error(`Webhook.site Contact Form Request Error: ${error.message}`);
        });
        
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
        
        // Create the request using node-fetch
        fetch('https://webhook.site/00af6027-a80c-4b5f-bd0e-ce5408f954ed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: postData
        })
        .then(response => {
          console.log(`Webhook.site Systeme.io Forward Response Status Code: ${response.status}`);
          return response.text();
        })
        .then(responseText => {
          console.log(`Webhook.site Systeme.io Forward Response Body: ${responseText || 'No response body'}`);
        })
        .catch(error => {
          console.error(`Webhook.site Systeme.io Forward Request Error: ${error.message}`);
        });
        
      } catch (webhookError) {
        console.error("Error forwarding to webhook.site:", webhookError);
        // Non-blocking error - continue with success response
      }
      
      // 2. We no longer send directly to Google Sheets
      // webhook.site will handle forwarding this data to Google Sheets
      console.log("Data sent to webhook.site, which will forward to Google Sheets");
      
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
          
          // We no longer need to send directly to Google Sheets
          // webhook.site will handle forwarding this data to Google Sheets
          console.log("Data received from webhook.site, which will forward to Google Sheets");
          
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
        // Using the current working Systeme.io API endpoint
        const requestOptions = {
          hostname: 'api.systeme.io',
          path: '/api/contacts', // Using base endpoint without version
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            'X-API-Key': process.env.SYSTEME_API_KEY || '',
            'Accept': 'application/json'
          }
        };
        
        console.log(`Debug: Using Systeme.io API endpoint: ${requestOptions.hostname}${requestOptions.path}`);
        
        // Create the request using node-fetch
        fetch('https://api.systeme.io/api/contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': process.env.SYSTEME_API_KEY || '',
            'Accept': 'application/json'
          },
          body: postData
        })
        .then(response => {
          console.log(`Systeme.io API Response Status Code: ${response.status}`);
          return response.text();
        })
        .then(responseText => {
          console.log(`Systeme.io API Response Body: ${responseText || 'No response body'}`);
          
          // We no longer need to send directly to Google Sheets
          // webhook.site will handle forwarding this data to Google Sheets
          console.log("Data sent to webhook.site, which will forward to Google Sheets");
        })
        .catch(error => {
          console.error(`Systeme.io API Request Error: ${error.message}`);
          
          // We no longer need to send directly to Google Sheets
          // webhook.site will handle forwarding this data to Google Sheets even if Systeme.io fails
          console.log("Data sent to webhook.site, which will forward to Google Sheets");
        });
        
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

  // Blog posts endpoint
  app.get("/api/blog-posts", async (_req: Request, res: Response) => {
    try {
      // Sample blog posts data - in a real application, this would come from a database
      const blogPosts = [
        {
          id: 1,
          title: "5 Ways to Prioritize Your Sexual Health in 2025",
          excerpt: "Taking charge of your sexual health has never been more important. Here are our top tips for navigating a healthier, more confident you in 2025.",
          content: "Full article content would be here...",
          date: "March 1, 2025",
          category: "Health Tips",
          imageUrl: "/images/blog/sexual-health-tips.jpg",
          readTime: "4 min read",
          isAffiliate: true
        },
        {
          id: 2,
          title: "The Evolution of Health Communication: Why Privacy Matters",
          excerpt: "From awkward face-to-face conversations to anonymous digital notifications, the way we communicate about health has transformed dramatically.",
          content: "Full article content would be here...",
          date: "February 25, 2025",
          category: "Privacy",
          imageUrl: "/images/blog/health-communication.jpg",
          readTime: "6 min read",
          isAffiliate: false
        },
        {
          id: 3,
          title: "Smart Tech, Smarter Health: Digital Tools You Need to Know About",
          excerpt: "Discover the cutting-edge technology that's revolutionizing how we approach sexual health and wellness in the digital age.",
          content: "Full article content would be here...",
          date: "February 18, 2025",
          category: "Technology",
          imageUrl: "/images/blog/health-tech.jpg",
          readTime: "5 min read",
          isAffiliate: true
        },
        {
          id: 4,
          title: "Dating in 2025: Navigating Modern Relationships with Confidence",
          excerpt: "The dating landscape continues to evolve, but one thing remains constant: the importance of open communication and mutual respect.",
          content: "Full article content would be here...",
          date: "February 10, 2025",
          category: "Relationships",
          imageUrl: "/images/blog/modern-dating.jpg",
          readTime: "7 min read",
          isAffiliate: false
        },
        {
          id: 5,
          title: "The Best STI Prevention Products of 2025 [Reviewed]",
          excerpt: "Our comprehensive review of the most effective, user-friendly sexual health products on the market today.",
          content: "Full article content would be here...",
          date: "February 3, 2025",
          category: "Product Reviews",
          imageUrl: "/images/blog/prevention-products.jpg",
          readTime: "8 min read",
          isAffiliate: true
        },
        {
          id: 6,
          title: "Founding Flingers: Meet the Early Adopters Changing Health Communication",
          excerpt: "Interviews with our pioneering members who are leading the charge in revolutionizing how we think about sexual health notifications.",
          content: "Full article content would be here...",
          date: "January 28, 2025",
          category: "Community",
          imageUrl: "/images/blog/founding-flingers.jpg",
          readTime: "5 min read",
          isAffiliate: false
        }
      ];
      
      return res.status(200).json(blogPosts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return res.status(500).json({ 
        message: "Error fetching blog posts",
        error: process.env.NODE_ENV === 'development' 
               ? (error instanceof Error ? error.message : String(error)) 
               : undefined
      });
    }
  });

  // Single blog post endpoint
  app.get("/api/blog-posts/:id", async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid blog post ID" });
      }
      
      // Sample blog posts data - in a real application, this would come from a database
      const blogPosts = [
        {
          id: 1,
          title: "5 Ways to Prioritize Your Sexual Health in 2025",
          excerpt: "Taking charge of your sexual health has never been more important. Here are our top tips for navigating a healthier, more confident you in 2025.",
          content: "Full article content would be here...",
          date: "March 1, 2025",
          category: "Health Tips",
          imageUrl: "/images/blog/sexual-health-tips.jpg",
          readTime: "4 min read",
          isAffiliate: true,
          author: "Dr. Jane Smith"
        },
        {
          id: 2,
          title: "The Evolution of Health Communication: Why Privacy Matters",
          excerpt: "From awkward face-to-face conversations to anonymous digital notifications, the way we communicate about health has transformed dramatically.",
          content: "Full article content would be here...",
          date: "February 25, 2025",
          category: "Privacy",
          imageUrl: "/images/blog/health-communication.jpg",
          readTime: "6 min read",
          isAffiliate: false,
          author: "Michael Johnson"
        }
        // Other blog posts would be here...
      ];
      
      const post = blogPosts.find(post => post.id === postId);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      return res.status(200).json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      return res.status(500).json({ 
        message: "Error fetching blog post",
        error: process.env.NODE_ENV === 'development' 
               ? (error instanceof Error ? error.message : String(error)) 
               : undefined
      });
    }
  });

  // Blog categories endpoint
  app.get("/api/blog-categories", async (_req: Request, res: Response) => {
    try {
      // Sample categories - in a real application, this would be dynamically generated from the posts
      const categories = [
        "All Posts",
        "Health Tips",
        "Privacy",
        "Technology",
        "Relationships",
        "Product Reviews",
        "Community"
      ];
      
      return res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching blog categories:", error);
      return res.status(500).json({ 
        message: "Error fetching blog categories",
        error: process.env.NODE_ENV === 'development' 
               ? (error instanceof Error ? error.message : String(error)) 
               : undefined
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
