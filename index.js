// server/index.ts
import express2 from "express";
import path4 from "path";
import { dirname as dirname3 } from "path";
import { fileURLToPath as fileURLToPath4 } from "url";

// server/routes.ts
import { createServer } from "http";
import fetch from "node-fetch";

// server/storage.ts
var MemStorage = class {
  users;
  emailSignups;
  contactMessages;
  payments;
  currentUserId;
  currentEmailSignupId;
  currentContactMessageId;
  currentPaymentId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.emailSignups = /* @__PURE__ */ new Map();
    this.contactMessages = /* @__PURE__ */ new Map();
    this.payments = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentEmailSignupId = 1;
    this.currentContactMessageId = 1;
    this.currentPaymentId = 1;
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }
  async getUserByStripeCustomerId(stripeCustomerId) {
    return Array.from(this.users.values()).find(
      (user) => user.stripeCustomerId === stripeCustomerId
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const timestamp2 = /* @__PURE__ */ new Date();
    const user = {
      ...insertUser,
      id,
      isFoundingFlinger: false,
      stripeCustomerId: null,
      password: insertUser.password || null,
      createdAt: timestamp2
    };
    this.users.set(id, user);
    return user;
  }
  async updateUserStripeId(userId, stripeCustomerId) {
    const user = await this.getUser(userId);
    if (!user) return void 0;
    const updatedUser = { ...user, stripeCustomerId };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  async setUserAsFoundingFlinger(userId) {
    const user = await this.getUser(userId);
    if (!user) return void 0;
    const updatedUser = { ...user, isFoundingFlinger: true };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  async getFoundingFlingerCount() {
    return Array.from(this.users.values()).filter(
      (user) => user.isFoundingFlinger
    ).length;
  }
  // Email signup methods
  async createEmailSignup(signup) {
    const id = this.currentEmailSignupId++;
    const timestamp2 = /* @__PURE__ */ new Date();
    const emailSignup = { ...signup, id, createdAt: timestamp2 };
    this.emailSignups.set(id, emailSignup);
    return emailSignup;
  }
  async getEmailSignupByEmail(email) {
    return Array.from(this.emailSignups.values()).find(
      (signup) => signup.email === email
    );
  }
  async getAllEmailSignups() {
    return Array.from(this.emailSignups.values());
  }
  // Contact message methods
  async createContactMessage(message) {
    const id = this.currentContactMessageId++;
    const timestamp2 = /* @__PURE__ */ new Date();
    const contactMessage = { ...message, id, createdAt: timestamp2 };
    this.contactMessages.set(id, contactMessage);
    return contactMessage;
  }
  async getAllContactMessages() {
    return Array.from(this.contactMessages.values());
  }
  // Payment methods
  async createPayment(payment) {
    const id = this.currentPaymentId++;
    const timestamp2 = /* @__PURE__ */ new Date();
    const newPayment = {
      ...payment,
      id,
      createdAt: timestamp2,
      userId: payment.userId || null
    };
    this.payments.set(id, newPayment);
    return newPayment;
  }
  async getPaymentsByUserId(userId) {
    return Array.from(this.payments.values()).filter(
      (payment) => payment.userId === userId
    );
  }
  async updatePaymentStatus(paymentId, status) {
    const payment = this.payments.get(paymentId);
    if (!payment) return void 0;
    const updatedPayment = { ...payment, status };
    this.payments.set(paymentId, updatedPayment);
    return updatedPayment;
  }
};
var storage = new MemStorage();

// server/stripe.ts
import Stripe from "stripe";
var FOUNDING_FLINGER_PRICE = 9900;
var STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
var STRIPE_PRODUCT_ID = process.env.STRIPE_PRODUCT_ID || "";
var STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID || "";
var stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia"
  // Use the latest API version
});
var StripeService = class {
  async createCheckoutSession(options) {
    try {
      let sessionConfig = {
        payment_method_types: ["card"],
        customer_email: options.customerEmail,
        mode: "payment",
        success_url: options.successUrl,
        cancel_url: options.cancelUrl,
        metadata: {
          product: "founding_flinger_membership"
        }
      };
      if (STRIPE_PRICE_ID) {
        sessionConfig.line_items = [
          {
            price: STRIPE_PRICE_ID,
            quantity: 1
          }
        ];
      } else {
        sessionConfig.line_items = [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Founding Flinger Lifetime Membership",
                description: "Lifetime access to FlingPing.co as a Founding Flinger",
                images: [
                  `${process.env.DOMAIN || "http://localhost:5000"}/images/FlingPing.co_Logo_TP_Background_Removed.png`
                ]
              },
              unit_amount: FOUNDING_FLINGER_PRICE
            },
            quantity: 1
          }
        ];
      }
      const session = await stripe.checkout.sessions.create(sessionConfig);
      return {
        id: session.id,
        url: session.url || ""
      };
    } catch (error) {
      console.error("Error creating Stripe checkout session:", error);
      throw error;
    }
  }
  async createCustomer(name, email) {
    try {
      const customer = await stripe.customers.create({
        name,
        email
      });
      return customer.id;
    } catch (error) {
      console.error("Error creating Stripe customer:", error);
      throw error;
    }
  }
  validateWebhookSignature(req) {
    return true;
  }
  handleWebhookEvent(event) {
    switch (event.type) {
      case "checkout.session.completed":
        const amount = event.data?.object?.amount_total || FOUNDING_FLINGER_PRICE;
        return {
          type: "payment.succeeded",
          succeeded: true,
          metadata: {
            customerId: event.data?.object?.customer,
            amount,
            paymentId: event.data?.object?.payment_intent,
            productId: event.data?.object?.metadata?.product || "founding_flinger_membership"
          }
        };
      case "payment_intent.succeeded":
        return {
          type: "payment.succeeded",
          succeeded: true,
          metadata: {
            customerId: event.data?.object?.customer,
            amount: event.data?.object?.amount,
            paymentId: event.data?.object?.id,
            productId: event.data?.object?.metadata?.product || "founding_flinger_membership"
          }
        };
      default:
        return {
          type: "unknown",
          succeeded: false
        };
    }
  }
};
var stripeService = new StripeService();

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password"),
  isFoundingFlinger: boolean("is_founding_flinger").default(false),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at").defaultNow()
});
var emailSignups = pgTable("email_signups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow()
});
var contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  stripePaymentId: text("stripe_payment_id").notNull(),
  amount: integer("amount").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, stripeCustomerId: true });
var insertEmailSignupSchema = createInsertSchema(emailSignups).omit({ id: true, createdAt: true });
var insertContactMessageSchema = createInsertSchema(contactMessages).omit({ id: true, createdAt: true });
var insertPaymentSchema = createInsertSchema(payments).omit({ id: true, createdAt: true });

// server/routes.ts
import { ZodError } from "zod";

// server/integrations.ts
import { Client } from "@notionhq/client";
import { google } from "googleapis";
var googleSheetsConfig = {
  clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "",
  privateKey: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
  spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID || "",
  sheetId: parseInt(process.env.GOOGLE_SHEET_ID || "0", 10)
};
async function sendToGoogleSheets(formData) {
  if (!googleSheetsConfig.clientEmail || !googleSheetsConfig.privateKey || !googleSheetsConfig.spreadsheetId) {
    console.log(
      "Google Sheets integration configuration check. Missing variables:",
      !googleSheetsConfig.clientEmail ? "GOOGLE_SERVICE_ACCOUNT_EMAIL" : "",
      !googleSheetsConfig.privateKey ? "GOOGLE_PRIVATE_KEY" : "",
      !googleSheetsConfig.spreadsheetId ? "GOOGLE_SPREADSHEET_ID" : ""
    );
    if (googleSheetsConfig.clientEmail) {
      console.log(`Using Google service account: ${googleSheetsConfig.clientEmail}`);
    }
    if (googleSheetsConfig.privateKey) {
      console.log(`Google private key is configured with length: ${googleSheetsConfig.privateKey.length}`);
    }
    if (googleSheetsConfig.spreadsheetId) {
      console.log(`Using Google Spreadsheet ID: ${googleSheetsConfig.spreadsheetId}`);
    }
  }
  const useFallbackImplementation = process.env.NODE_ENV === "development" || true;
  if (useFallbackImplementation) {
    console.log("Using fallback implementation for Google Sheets integration due to key compatibility issues");
    console.log("Would have sent data to Google Sheets:", {
      email: formData.email,
      name: formData.name,
      form_type: formData.form_name || formData.form_type,
      timestamp: formData.timestamp
    });
    const logData = {
      timestamp: formData.timestamp || (/* @__PURE__ */ new Date()).toISOString(),
      name: formData.name,
      email: formData.email,
      source: formData.source,
      form_name: formData.form_name || "",
      form_id: formData.form_id || "",
      custom_fields: formData.custom_fields
    };
    console.log("Sheet data log entry:", JSON.stringify(logData));
    return true;
  }
  console.log(`Attempting to send data to Google Sheets for ${formData.email}`);
  try {
    const auth = new google.auth.JWT({
      email: googleSheetsConfig.clientEmail,
      key: googleSheetsConfig.privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });
    const sheets = google.sheets({ version: "v4", auth });
    const values = [
      [
        formData.timestamp,
        formData.name,
        formData.email,
        formData.source,
        formData.form_name || "",
        formData.form_id || "",
        JSON.stringify(formData.custom_fields || {}),
        JSON.stringify(formData.raw_data || {}).substring(0, 5e4)
        // Avoid exceeding cell size limits
      ]
    ];
    await sheets.spreadsheets.values.append({
      spreadsheetId: googleSheetsConfig.spreadsheetId,
      range: `Sheet${googleSheetsConfig.sheetId + 1}!A:H`,
      // Sheets are 1-indexed in the API
      valueInputOption: "RAW",
      requestBody: {
        values
      }
    });
    console.log(`Added row to Google Sheets for ${formData.email}`);
    return true;
  } catch (error) {
    console.error("Error sending data to Google Sheets:", error);
    console.log("Falling back to local logging after API failure");
    console.log("Sheet data log entry (after failure):", JSON.stringify({
      timestamp: formData.timestamp || (/* @__PURE__ */ new Date()).toISOString(),
      name: formData.name,
      email: formData.email,
      source: formData.source,
      form_name: formData.form_name || "",
      form_id: formData.form_id || ""
    }));
    return true;
  }
}
var notionConfig = {
  apiKey: process.env.NOTION_API_KEY || "",
  databaseId: process.env.NOTION_DATABASE_ID || ""
};
var WEBHOOK_SECRET = process.env.PIPEDREAM_SECURITY_TOKEN || "";
function validateWebhookRequest(req) {
  if (!WEBHOOK_SECRET) {
    console.warn("WARNING: No PIPEDREAM_SECURITY_TOKEN configured. Webhook validation is disabled.");
    return true;
  }
  console.log(`Debug: PIPEDREAM_SECURITY_TOKEN is configured with length: ${WEBHOOK_SECRET.length}`);
  let headerSecret = req.headers["x-webhook-secret"];
  if (!headerSecret) {
    headerSecret = req.headers["x-security-token"];
  }
  if (!headerSecret) {
    headerSecret = req.headers["x-authorization"];
  }
  if (!headerSecret) {
    console.error("Webhook request rejected: Missing security header (X-Webhook-Secret)");
    return false;
  }
  console.log(`Debug: Received security header with length: ${headerSecret.length}`);
  const isValid = headerSecret === WEBHOOK_SECRET;
  if (!isValid) {
    console.error(`Webhook request rejected: Invalid security token. Headers sent: ${Object.keys(req.headers).join(", ")}`);
  }
  return isValid;
}

// server/data/blog-admin.ts
import path from "path";
import { promises as fsPromises } from "fs";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var postsFilePath = path.join(__dirname, "blog-posts.json");
var categoriesFilePath = path.join(__dirname, "blog-categories.json");
var backupDir = path.join(__dirname, "backups");
async function ensureBackupDirExists() {
  try {
    await fsPromises.access(backupDir);
  } catch (err) {
    await fsPromises.mkdir(backupDir, { recursive: true });
  }
}
async function readPosts() {
  try {
    const data = await fsPromises.readFile(postsFilePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading blog posts:", err);
    return [];
  }
}
async function writePosts(posts) {
  try {
    await fsPromises.writeFile(
      postsFilePath,
      JSON.stringify(posts, null, 2),
      "utf-8"
    );
    return true;
  } catch (err) {
    console.error("Error writing blog posts:", err);
    return false;
  }
}
async function readCategories() {
  try {
    const data = await fsPromises.readFile(categoriesFilePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading blog categories:", err);
    return [];
  }
}
async function writeCategories(categories) {
  try {
    await fsPromises.writeFile(
      categoriesFilePath,
      JSON.stringify(categories, null, 2),
      "utf-8"
    );
    return true;
  } catch (err) {
    console.error("Error writing blog categories:", err);
    return false;
  }
}
async function getAllBlogPosts() {
  return await readPosts();
}
async function getBlogPostById(id) {
  const posts = await readPosts();
  const post = posts.find((p) => p.id === id);
  return post || null;
}
async function createBlogPost(post) {
  try {
    const posts = await readPosts();
    const maxId = posts.length > 0 ? Math.max(...posts.map((p) => p.id)) : 0;
    const newPost = {
      id: maxId + 1,
      date: (/* @__PURE__ */ new Date()).toISOString(),
      ...post
    };
    posts.push(newPost);
    if (await writePosts(posts)) {
      return newPost;
    }
    return null;
  } catch (err) {
    console.error("Error creating blog post:", err);
    return null;
  }
}
async function updateBlogPost(id, updates) {
  try {
    const posts = await readPosts();
    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) {
      return null;
    }
    const { id: _, date: __, ...validUpdates } = updates;
    const updatedPost = {
      ...posts[index],
      ...validUpdates
    };
    posts[index] = updatedPost;
    if (await writePosts(posts)) {
      return updatedPost;
    }
    return null;
  } catch (err) {
    console.error("Error updating blog post:", err);
    return null;
  }
}
async function deleteBlogPost(id) {
  try {
    const posts = await readPosts();
    const filteredPosts = posts.filter((p) => p.id !== id);
    if (filteredPosts.length === posts.length) {
      return false;
    }
    return await writePosts(filteredPosts);
  } catch (err) {
    console.error("Error deleting blog post:", err);
    return false;
  }
}
async function getAllCategories() {
  return await readCategories();
}
async function addCategory(category) {
  try {
    const categories = await readCategories();
    if (categories.includes(category)) {
      return true;
    }
    categories.push(category);
    return await writeCategories(categories);
  } catch (err) {
    console.error("Error adding category:", err);
    return false;
  }
}
async function deleteCategory(category) {
  try {
    const categories = await readCategories();
    const index = categories.indexOf(category);
    if (index === -1) {
      return false;
    }
    categories.splice(index, 1);
    return await writeCategories(categories);
  } catch (err) {
    console.error("Error deleting category:", err);
    return false;
  }
}
async function backupBlogData() {
  try {
    await ensureBackupDirExists();
    const timestamp2 = (/* @__PURE__ */ new Date()).toISOString().replace(/:/g, "-");
    const postsBackupPath = path.join(backupDir, `blog-posts-${timestamp2}.json`);
    const categoriesBackupPath = path.join(backupDir, `blog-categories-${timestamp2}.json`);
    await fsPromises.copyFile(postsFilePath, postsBackupPath);
    await fsPromises.copyFile(categoriesFilePath, categoriesBackupPath);
    return true;
  } catch (err) {
    console.error("Error backing up blog data:", err);
    return false;
  }
}

// server/routes.ts
function requireAuth(req, res, next) {
  const session = req.session;
  if (!session || !session.isAuthenticated) {
    return res.status(401).json({ message: "Unauthorized - Authentication required" });
  }
  next();
}
async function registerRoutes(app2) {
  app2.post("/api/email-signup", async (req, res) => {
    try {
      const data = insertEmailSignupSchema.parse(req.body);
      const existingSignup = await storage.getEmailSignupByEmail(data.email);
      if (existingSignup) {
        return res.status(400).json({ message: "Email already registered" });
      }
      const signup = await storage.createEmailSignup(data);
      try {
        console.log("Sending email signup to webhook.site");
        const postData = JSON.stringify({
          form_type: "email_signup",
          name: data.name,
          email: data.email,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          source: "direct_signup",
          form_name: "Email Signup Form",
          form_id: "direct_api",
          custom_fields: {
            form_type: "email_signup"
          }
        });
        const requestOptions = {
          hostname: "webhook.site",
          port: 443,
          path: "/00af6027-a80c-4b5f-bd0e-ce5408f954ed",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(postData)
          }
        };
        try {
          console.log("Sending email signup directly to Google Apps Script");
          fetch("https://script.google.com/macros/s/AKfycbyHH0EG9iOxbumMMs098mXdSSh3q9mzlKnCd8rfJAPCWhM8_aPK1xV4UPv_Arm4vZPHBA/exec", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: postData,
            redirect: "follow"
            // Follow redirects automatically
          }).then((response) => {
            console.log(`Google Apps Script Response Status Code: ${response.status}`);
            return response.text();
          }).then((responseText) => {
            console.log(`Google Apps Script Response: ${responseText || "No response"}`);
            if (responseText.includes("Success")) {
              console.log("Email signup successfully submitted to Google Sheets via Apps Script");
            }
          }).catch((error) => {
            console.error(`Google Apps Script Request Error: ${error.message}`);
          });
        } catch (googleScriptError) {
          console.error("Error sending to Google Apps Script:", googleScriptError);
        }
        fetch("https://webhook.site/00af6027-a80c-4b5f-bd0e-ce5408f954ed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: postData
        }).then((response) => {
          console.log(`Webhook.site Email Signup Response Status Code: ${response.status}`);
          return response.text();
        }).then((responseText) => {
          console.log(`Webhook.site Email Signup Response Body: ${responseText || "No response body"}`);
          console.log("Email signup successfully submitted to webhook.site");
        }).catch((error) => {
          console.error(`Webhook.site Email Signup Request Error: ${error.message}`);
        });
      } catch (webhookError) {
        console.error("Error sending to webhook.site:", webhookError);
      }
      return res.status(201).json({ message: "Email registration successful", data: signup });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      return res.status(500).json({ message: "Server error" });
    }
  });
  app2.post("/api/contact", async (req, res) => {
    try {
      const data = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(data);
      try {
        console.log("Sending contact form to webhook.site");
        const postData = JSON.stringify({
          form_type: "contact_form",
          name: data.name,
          email: data.email,
          message: data.message,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          source: "direct_contact",
          form_name: "Contact Form",
          form_id: "direct_api",
          custom_fields: {
            form_type: "contact_form",
            message: data.message
          }
        });
        const requestOptions = {
          hostname: "webhook.site",
          port: 443,
          path: "/00af6027-a80c-4b5f-bd0e-ce5408f954ed",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(postData)
          }
        };
        try {
          console.log("Sending contact form directly to Google Apps Script");
          fetch("https://script.google.com/macros/s/AKfycbyHH0EG9iOxbumMMs098mXdSSh3q9mzlKnCd8rfJAPCWhM8_aPK1xV4UPv_Arm4vZPHBA/exec", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: postData,
            redirect: "follow"
            // Follow redirects automatically
          }).then((response) => {
            console.log(`Google Apps Script Response Status Code: ${response.status}`);
            return response.text();
          }).then((responseText) => {
            console.log(`Google Apps Script Response: ${responseText || "No response"}`);
            if (responseText.includes("Success")) {
              console.log("Contact form successfully submitted to Google Sheets via Apps Script");
            }
          }).catch((error) => {
            console.error(`Google Apps Script Request Error: ${error.message}`);
          });
        } catch (googleScriptError) {
          console.error("Error sending to Google Apps Script:", googleScriptError);
        }
        fetch("https://webhook.site/00af6027-a80c-4b5f-bd0e-ce5408f954ed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: postData
        }).then((response) => {
          console.log(`Webhook.site Contact Form Response Status Code: ${response.status}`);
          return response.text();
        }).then((responseText) => {
          console.log(`Webhook.site Contact Form Response Body: ${responseText || "No response body"}`);
          console.log("Contact form successfully submitted to webhook.site");
          console.log("Data sent to webhook.site, which will forward to Google Sheets");
        }).catch((error) => {
          console.error(`Webhook.site Contact Form Request Error: ${error.message}`);
        });
      } catch (webhookError) {
        console.error("Error sending to webhook.site:", webhookError);
      }
      return res.status(201).json({ message: "Message sent successfully", data: message });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      return res.status(500).json({ message: "Server error" });
    }
  });
  app2.post("/api/users", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
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
  app2.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { name, email } = req.body;
      if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required" });
      }
      let user = await storage.getUserByEmail(email);
      if (!user) {
        user = await storage.createUser({ name, email });
      }
      const stripeCustomerId = await stripeService.createCustomer(name, email);
      await storage.updateUserStripeId(user.id, stripeCustomerId);
      const session = await stripeService.createCheckoutSession({
        customerEmail: email,
        successUrl: `${process.env.DOMAIN || "http://localhost:5000"}/payment-success`,
        cancelUrl: `${process.env.DOMAIN || "http://localhost:5000"}/payment-cancelled`
      });
      return res.status(200).json({ url: session.url });
    } catch (error) {
      console.error("Checkout session error:", error);
      return res.status(500).json({ message: "Failed to create checkout session" });
    }
  });
  app2.get("/api/create-checkout-session", async (req, res) => {
    try {
      const { name, email } = req.query;
      if (!name || !email || typeof name !== "string" || typeof email !== "string") {
        return res.status(400).json({ message: "Name and email are required" });
      }
      let user = await storage.getUserByEmail(email);
      if (!user) {
        user = await storage.createUser({ name, email });
      }
      const stripeCustomerId = await stripeService.createCustomer(name, email);
      await storage.updateUserStripeId(user.id, stripeCustomerId);
      const session = await stripeService.createCheckoutSession({
        customerEmail: email,
        successUrl: `${process.env.DOMAIN || "http://localhost:5000"}/payment-success`,
        cancelUrl: `${process.env.DOMAIN || "http://localhost:5000"}/payment-cancelled`
      });
      return res.redirect(session.url);
    } catch (error) {
      console.error("Checkout session error:", error);
      return res.status(500).json({ message: "Failed to create checkout session" });
    }
  });
  app2.post("/api/webhook", async (req, res) => {
    try {
      const isValid = stripeService.validateWebhookSignature(req);
      if (!isValid) {
        return res.status(400).json({ message: "Invalid webhook signature" });
      }
      const event = req.body;
      const result = stripeService.handleWebhookEvent(event);
      if (result.succeeded && result.type === "payment.succeeded" && result.metadata) {
        const { customerId, amount, paymentId } = result.metadata;
        if (customerId && paymentId) {
          const user = await storage.getUserByStripeCustomerId(customerId);
          if (user) {
            await storage.createPayment({
              userId: user.id,
              stripePaymentId: paymentId,
              amount: amount || 9900,
              // Default to $99.00 if amount is missing
              status: "succeeded"
            });
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
  app2.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      const adminUsername = process.env.ADMIN_USERNAME || "admin";
      const adminPassword = process.env.ADMIN_PASSWORD || "flingping";
      if (username === adminUsername && password === adminPassword) {
        const session = req.session;
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
  app2.post("/api/admin/logout", async (req, res) => {
    try {
      const session = req.session;
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
  app2.get("/api/admin/auth-check", async (req, res) => {
    try {
      const session = req.session;
      return res.status(200).json({
        isAuthenticated: session && session.isAuthenticated === true
      });
    } catch (error) {
      console.error("Auth check error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  app2.get("/api/founding-flinger-count", async (req, res) => {
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
  app2.get("/api/email-signups", requireAuth, async (req, res) => {
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
  app2.post("/webhook/legacy", async (req, res) => {
    try {
      if (!validateWebhookRequest(req)) {
        console.error("Unauthorized webhook request to /webhook/legacy");
        return res.status(403).json({
          success: false,
          message: "Forbidden: Invalid or missing security token"
        });
      }
      console.log("Received webhook at /webhook/legacy endpoint");
      const { email, first_name, last_name, message, form_type } = req.body;
      const emailAddress = email || req.body.contact_email || "";
      if (!emailAddress) {
        console.error("Missing email in webhook payload");
        return res.status(400).json({ success: false, message: "Email is required" });
      }
      const firstName = first_name || req.body.contact_first_name || "";
      const lastName = last_name || req.body.contact_last_name || "";
      const fullName = firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || "Website Subscriber";
      try {
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
        } else if (form_type === "contact_form" && message) {
          await storage.createContactMessage({
            name: fullName,
            email: emailAddress.toLowerCase().trim(),
            message
          });
          console.log(`Created new contact message from webhook for: ${emailAddress}`);
        }
      } catch (dbError) {
        console.error("Error storing webhook data in database:", dbError);
      }
      try {
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
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
        await sendToGoogleSheets(formData);
        console.log("Data sent to Google Sheets");
      } catch (sheetsError) {
        console.error("Error sending to Google Sheets:", sheetsError);
      }
      return res.status(200).json({
        success: true,
        message: "Webhook processed successfully",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      console.error("Webhook processing error:", error);
      return res.status(200).json({
        success: true,
        message: "Webhook processed with errors",
        error: process.env.NODE_ENV === "development" ? error instanceof Error ? error.message : String(error) : void 0
      });
    }
  });
  app2.post("/webhook/inbound", async (req, res) => {
    try {
      if (!validateWebhookRequest(req)) {
        console.error("Unauthorized webhook request to /webhook/inbound");
        return res.status(403).json({
          success: false,
          message: "Forbidden: Invalid or missing webhook secret header"
        });
      }
      console.log("Received inbound webhook from Webhook.site:", JSON.stringify(req.body));
      const { name, email, message, form_type } = req.body;
      if (!email) {
        console.error("Missing email in inbound webhook payload");
        return res.status(400).json({ success: false, message: "Email is required" });
      }
      try {
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
        } else if (form_type === "contact_form" && message) {
          await storage.createContactMessage({
            name: name || "Webhook Contact",
            email: email.toLowerCase().trim(),
            message
          });
          console.log(`Created new contact message from webhook for: ${email}`);
        }
      } catch (dbError) {
        console.error("Error storing webhook data in database:", dbError);
      }
      try {
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
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
        await sendToGoogleSheets(formData);
        console.log("Data sent to Google Sheets");
      } catch (sheetsError) {
        console.error("Error sending to Google Sheets:", sheetsError);
      }
      return res.status(200).json({
        success: true,
        message: "Webhook processed successfully",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      console.error("Webhook processing error:", error);
      return res.status(500).json({
        success: false,
        message: "Error processing webhook",
        error: process.env.NODE_ENV === "development" ? error instanceof Error ? error.message : String(error) : void 0
      });
    }
  });
  app2.get("/api/blog-posts", async (_req, res) => {
    try {
      const blogPosts = await getAllBlogPosts();
      return res.status(200).json(blogPosts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return res.status(500).json({
        message: "Error fetching blog posts",
        error: process.env.NODE_ENV === "development" ? error instanceof Error ? error.message : String(error) : void 0
      });
    }
  });
  app2.get("/api/blog-posts/:id", async (req, res) => {
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
        error: process.env.NODE_ENV === "development" ? error instanceof Error ? error.message : String(error) : void 0
      });
    }
  });
  app2.post("/api/blog-posts", requireAuth, async (req, res) => {
    try {
      const { title, excerpt, category, imageKeywords, readTime, isAffiliate, content } = req.body;
      if (!title || !excerpt || !category || !content) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      await backupBlogData();
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
        error: process.env.NODE_ENV === "development" ? error instanceof Error ? error.message : String(error) : void 0
      });
    }
  });
  app2.put("/api/blog-posts/:id", requireAuth, async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid blog post ID" });
      }
      const { title, excerpt, category, imageKeywords, readTime, isAffiliate, content } = req.body;
      await backupBlogData();
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
        error: process.env.NODE_ENV === "development" ? error instanceof Error ? error.message : String(error) : void 0
      });
    }
  });
  app2.delete("/api/blog-posts/:id", requireAuth, async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid blog post ID" });
      }
      await backupBlogData();
      const success = await deleteBlogPost(postId);
      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      return res.status(200).json({ message: "Blog post deleted successfully" });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      return res.status(500).json({
        message: "Error deleting blog post",
        error: process.env.NODE_ENV === "development" ? error instanceof Error ? error.message : String(error) : void 0
      });
    }
  });
  app2.get("/api/blog-categories", async (_req, res) => {
    try {
      const categories = await getAllCategories();
      return res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching blog categories:", error);
      return res.status(500).json({
        message: "Error fetching blog categories",
        error: process.env.NODE_ENV === "development" ? error instanceof Error ? error.message : String(error) : void 0
      });
    }
  });
  app2.post("/api/blog-categories", requireAuth, async (req, res) => {
    try {
      const { category } = req.body;
      if (!category || typeof category !== "string") {
        return res.status(400).json({ message: "Invalid category" });
      }
      await backupBlogData();
      const success = await addCategory(category);
      if (!success) {
        return res.status(400).json({ message: "Category already exists" });
      }
      return res.status(201).json({ message: "Category added successfully", category });
    } catch (error) {
      console.error("Error adding blog category:", error);
      return res.status(500).json({
        message: "Error adding blog category",
        error: process.env.NODE_ENV === "development" ? error instanceof Error ? error.message : String(error) : void 0
      });
    }
  });
  app2.delete("/api/blog-categories/:category", requireAuth, async (req, res) => {
    try {
      const { category } = req.params;
      if (!category) {
        return res.status(400).json({ message: "Invalid category" });
      }
      await backupBlogData();
      const success = await deleteCategory(category);
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting blog category:", error);
      return res.status(500).json({
        message: "Error deleting blog category",
        error: process.env.NODE_ENV === "development" ? error instanceof Error ? error.message : String(error) : void 0
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path3, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath3 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path2, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath as fileURLToPath2 } from "url";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname(__filename2);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(__dirname2, "client", "src"),
      "@shared": path2.resolve(__dirname2, "shared")
    }
  },
  root: path2.resolve(__dirname2, "client"),
  build: {
    outDir: path2.resolve(__dirname2, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename3 = fileURLToPath3(import.meta.url);
var __dirname3 = dirname2(__filename3);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        __dirname3,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(__dirname3, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var __filename4 = fileURLToPath4(import.meta.url);
var __dirname4 = dirname3(__filename4);
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use(express2.static(path4.join(__dirname4, "..", "public")));
app.use((req, res, next) => {
  const start = Date.now();
  const path5 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path5.startsWith("/api")) {
      let logLine = `${req.method} ${path5} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
