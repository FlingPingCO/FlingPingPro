import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server, IncomingMessage } from "http";
import * as https from "https";
import fetch from 'node-fetch';
import { storage } from "./storage";
import { stripeService } from "./stripe";
import path from "path";
import fs from "fs";
import {
  insertUserSchema,
  insertEmailSignupSchema,
  insertContactMessageSchema,
} from "@shared/schema";
import { ZodError } from "zod";
import { sendToGoogleSheets, validateWebhookRequest, validateInboundWebhookRequest } from "./integrations";

// Authentication middleware for admin routes
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const session = req.session as any;
  
  if (!session || !session.isAuthenticated) {
    return res.status(401).json({ message: "Unauthorized - Authentication required" });
  }
  
  next();
}
import {
  getAllBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getAllCategories,
  addCategory,
  deleteCategory,
  backupBlogData
} from './data/blog-admin';

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
          console.log("Email signup successfully submitted to webhook.site");
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
          console.log("Contact form successfully submitted to webhook.site");
          // webhook.site will handle forwarding this data to Google Sheets
          console.log("Data sent to webhook.site, which will forward to Google Sheets");
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
  
  // Admin login endpoint
  app.post("/api/admin/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Admin credentials from environment variables with fallback
      const adminUsername = process.env.ADMIN_USERNAME || "admin";
      const adminPassword = process.env.ADMIN_PASSWORD || "flingping";
      
      // Check credentials
      if (username === adminUsername && password === adminPassword) {
        const session = req.session as any;
        session.isAuthenticated = true;
        
        return res.status(200).json({ 
          message: "Login successful",
          isAuthenticated: true
        });
      } else {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Admin logout endpoint
  app.post("/api/admin/logout", async (req: Request, res: Response) => {
    try {
      const session = req.session as any;
      session.isAuthenticated = false;
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destruction error:", err);
          return res.status(500).json({ message: "Logout failed" });
        }
        
        return res.status(200).json({ message: "Logout successful" });
      });
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Admin auth check endpoint
  app.get("/api/admin/auth-check", async (req: Request, res: Response) => {
    try {
      const session = req.session as any;
      return res.status(200).json({ 
        isAuthenticated: session && session.isAuthenticated === true 
      });
    } catch (error) {
      console.error("Auth check error:", error);
      return res.status(500).json({ message: "Server error" });
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
  app.get("/api/email-signups", requireAuth, async (req: Request, res: Response) => {
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

  // Legacy webhook handler (maintained for backward compatibility)
  app.post("/webhook/legacy", async (req: Request, res: Response) => {
    try {
      // Validate webhook request before processing
      if (!validateWebhookRequest(req)) {
        console.error('Unauthorized webhook request to /webhook/legacy');
        return res.status(403).json({ 
          success: false, 
          message: "Forbidden: Invalid or missing security token" 
        });
      }
      
      console.log("Received webhook at /webhook/legacy endpoint");
      
      // Extract data from the webhook payload
      const { email, first_name, last_name, message, form_type } = req.body;
      
      // Validate required fields
      const emailAddress = email || req.body.contact_email || '';
      if (!emailAddress) {
        console.error("Missing email in webhook payload");
        return res.status(400).json({ success: false, message: "Email is required" });
      }
      
      // Construct name
      const firstName = first_name || req.body.contact_first_name || '';
      const lastName = last_name || req.body.contact_last_name || '';
      const fullName = firstName && lastName ? `${firstName} ${lastName}` : (firstName || lastName || "Website Subscriber");
      
      // Store in our database
      try {
        // For email signups
        if (form_type === "email_signup" || !form_type) {
          const existingSignup = await storage.getEmailSignupByEmail(emailAddress);
          if (!existingSignup) {
            await storage.createEmailSignup({
              name: fullName,
              email: emailAddress.toLowerCase().trim()
            });
            console.log(`Created new email signup from webhook for: ${emailAddress}`);
          } else {
            console.log(`Webhook submission for existing email: ${emailAddress}`);
          }
        } 
        // For contact messages
        else if (form_type === "contact_form" && message) {
          await storage.createContactMessage({
            name: fullName,
            email: emailAddress.toLowerCase().trim(),
            message: message
          });
          console.log(`Created new contact message from webhook for: ${emailAddress}`);
        }
      } catch (dbError) {
        console.error("Error storing webhook data in database:", dbError);
      }
      
      // Send data to Google Sheets
      try {
        // Prepare data for Google Sheets
        const formData = {
          name: fullName,
          email: emailAddress.toLowerCase().trim(),
          source: "webhook",
          form_name: form_type || "email_signup",
          form_id: "webhook_form",
          custom_fields: {
            message: message || "",
            form_type: form_type || "email_signup"
          },
          timestamp: new Date().toISOString()
        };
        
        // Send to Google Sheets directly
        await sendToGoogleSheets(formData);
        console.log("Data sent to Google Sheets");
      } catch (sheetsError) {
        console.error("Error sending to Google Sheets:", sheetsError);
      }
      
      // Return success
      return res.status(200).json({ 
        success: true, 
        message: "Webhook processed successfully",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Webhook processing error:", error);
      // Still return 200 to avoid retries
      return res.status(200).json({ 
        success: true, 
        message: "Webhook processed with errors", 
        error: process.env.NODE_ENV === 'development' 
               ? (error instanceof Error ? error.message : String(error)) 
               : undefined
      });
    }
  });
  
  // Webhook.site inbound webhook endpoint - receives data from Webhook.site and sends to Google Sheets
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
      
      // Send data to Google Sheets
      try {
        // Prepare data for Google Sheets
        const formData = {
          name: name || "Webhook Subscriber",
          email: email.toLowerCase().trim(),
          source: "flingping_website",
          form_name: form_type || "email_signup",
          form_id: "webhook_form",
          custom_fields: {
            message: message || "",
            form_type: form_type || "email_signup"
          },
          timestamp: new Date().toISOString()
        };
        
        // Send to Google Sheets
        await sendToGoogleSheets(formData);
        console.log("Data sent to Google Sheets");
      } catch (sheetsError) {
        console.error("Error sending to Google Sheets:", sheetsError);
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
      const blogPosts = await getAllBlogPosts();
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
      
      const post = await getBlogPostById(postId);
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
  
  // Create a new blog post
  app.post("/api/blog-posts", requireAuth, async (req: Request, res: Response) => {
    try {
      // Extract blog post data from request body
      const { title, excerpt, category, imageKeywords, readTime, isAffiliate, content } = req.body;
      
      // Validate required fields
      if (!title || !excerpt || !category || !content) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Create a backup of current blog data before making changes
      await backupBlogData();
      
      // Create the new blog post
      const newPost = await createBlogPost({
        title,
        excerpt,
        category,
        imageKeywords,
        readTime: readTime || "5 min read",
        isAffiliate: !!isAffiliate,
        content
      });
      
      if (!newPost) {
        return res.status(500).json({ message: "Failed to create blog post" });
      }
      
      return res.status(201).json(newPost);
    } catch (error) {
      console.error("Error creating blog post:", error);
      return res.status(500).json({
        message: "Error creating blog post",
        error: process.env.NODE_ENV === 'development' 
               ? (error instanceof Error ? error.message : String(error)) 
               : undefined
      });
    }
  });
  
  // Update an existing blog post
  app.put("/api/blog-posts/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid blog post ID" });
      }
      
      // Extract blog post data from request body
      const { title, excerpt, category, imageKeywords, readTime, isAffiliate, content } = req.body;
      
      // Create a backup of current blog data before making changes
      await backupBlogData();
      
      // Update the blog post
      const updatedPost = await updateBlogPost(postId, {
        title,
        excerpt,
        category,
        imageKeywords,
        readTime,
        isAffiliate,
        content
      });
      
      if (!updatedPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      return res.status(200).json(updatedPost);
    } catch (error) {
      console.error("Error updating blog post:", error);
      return res.status(500).json({
        message: "Error updating blog post",
        error: process.env.NODE_ENV === 'development' 
               ? (error instanceof Error ? error.message : String(error)) 
               : undefined
      });
    }
  });
  
  // Delete a blog post
  app.delete("/api/blog-posts/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid blog post ID" });
      }
      
      // Create a backup of current blog data before making changes
      await backupBlogData();
      
      // Delete the blog post
      const success = await deleteBlogPost(postId);
      
      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      return res.status(200).json({ message: "Blog post deleted successfully" });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      return res.status(500).json({
        message: "Error deleting blog post",
        error: process.env.NODE_ENV === 'development' 
               ? (error instanceof Error ? error.message : String(error)) 
               : undefined
      });
    }
  });

  // Blog categories endpoint
  app.get("/api/blog-categories", async (_req: Request, res: Response) => {
    try {
      const categories = await getAllCategories();
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
  
  // Create a new blog category
  app.post("/api/blog-categories", requireAuth, async (req: Request, res: Response) => {
    try {
      const { category } = req.body;
      
      if (!category || typeof category !== 'string') {
        return res.status(400).json({ message: "Invalid category" });
      }
      
      // Create a backup of current blog data before making changes
      await backupBlogData();
      
      // Add the new category
      const success = await addCategory(category);
      
      if (!success) {
        return res.status(400).json({ message: "Category already exists" });
      }
      
      return res.status(201).json({ message: "Category added successfully", category });
    } catch (error) {
      console.error("Error adding blog category:", error);
      return res.status(500).json({
        message: "Error adding blog category",
        error: process.env.NODE_ENV === 'development' 
                ? (error instanceof Error ? error.message : String(error)) 
                : undefined
      });
    }
  });
  
  // Delete a blog category
  app.delete("/api/blog-categories/:category", requireAuth, async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      
      if (!category) {
        return res.status(400).json({ message: "Invalid category" });
      }
      
      // Create a backup of current blog data before making changes
      await backupBlogData();
      
      // Delete the category
      const success = await deleteCategory(category);
      
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting blog category:", error);
      return res.status(500).json({
        message: "Error deleting blog category",
        error: process.env.NODE_ENV === 'development' 
                ? (error instanceof Error ? error.message : String(error)) 
                : undefined
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
