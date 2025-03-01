import { 
  users, emailSignups, contactMessages, payments,
  type User, type InsertUser,
  type EmailSignup, type InsertEmailSignup,
  type ContactMessage, type InsertContactMessage,
  type Payment, type InsertPayment
} from "@shared/schema";

// Modify the interface with any CRUD methods you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByStripeCustomerId(stripeCustomerId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeId(userId: number, stripeCustomerId: string): Promise<User | undefined>;
  setUserAsFoundingFlinger(userId: number): Promise<User | undefined>;
  getFoundingFlingerCount(): Promise<number>;
  
  // Email signup methods
  createEmailSignup(signup: InsertEmailSignup): Promise<EmailSignup>;
  getEmailSignupByEmail(email: string): Promise<EmailSignup | undefined>;
  getAllEmailSignups(): Promise<EmailSignup[]>;
  
  // Contact message methods
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getAllContactMessages(): Promise<ContactMessage[]>;
  
  // Payment methods
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentsByUserId(userId: number): Promise<Payment[]>;
  updatePaymentStatus(paymentId: number, status: string): Promise<Payment | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private emailSignups: Map<number, EmailSignup>;
  private contactMessages: Map<number, ContactMessage>;
  private payments: Map<number, Payment>;
  currentUserId: number;
  currentEmailSignupId: number;
  currentContactMessageId: number;
  currentPaymentId: number;

  constructor() {
    this.users = new Map();
    this.emailSignups = new Map();
    this.contactMessages = new Map();
    this.payments = new Map();
    this.currentUserId = 1;
    this.currentEmailSignupId = 1;
    this.currentContactMessageId = 1;
    this.currentPaymentId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }
  
  async getUserByStripeCustomerId(stripeCustomerId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.stripeCustomerId === stripeCustomerId
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const timestamp = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      isFoundingFlinger: false,
      stripeCustomerId: null,
      password: insertUser.password || null,
      createdAt: timestamp
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserStripeId(userId: number, stripeCustomerId: string): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user, stripeCustomerId };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async setUserAsFoundingFlinger(userId: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user, isFoundingFlinger: true };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getFoundingFlingerCount(): Promise<number> {
    return Array.from(this.users.values()).filter(
      (user) => user.isFoundingFlinger
    ).length;
  }

  // Email signup methods
  async createEmailSignup(signup: InsertEmailSignup): Promise<EmailSignup> {
    const id = this.currentEmailSignupId++;
    const timestamp = new Date();
    const emailSignup: EmailSignup = { ...signup, id, createdAt: timestamp };
    this.emailSignups.set(id, emailSignup);
    return emailSignup;
  }

  async getEmailSignupByEmail(email: string): Promise<EmailSignup | undefined> {
    return Array.from(this.emailSignups.values()).find(
      (signup) => signup.email === email
    );
  }

  async getAllEmailSignups(): Promise<EmailSignup[]> {
    return Array.from(this.emailSignups.values());
  }

  // Contact message methods
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentContactMessageId++;
    const timestamp = new Date();
    const contactMessage: ContactMessage = { ...message, id, createdAt: timestamp };
    this.contactMessages.set(id, contactMessage);
    return contactMessage;
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }

  // Payment methods
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const id = this.currentPaymentId++;
    const timestamp = new Date();
    const newPayment: Payment = { 
      ...payment,
      id, 
      createdAt: timestamp,
      userId: payment.userId || null
    };
    this.payments.set(id, newPayment);
    return newPayment;
  }

  async getPaymentsByUserId(userId: number): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(
      (payment) => payment.userId === userId
    );
  }

  async updatePaymentStatus(paymentId: number, status: string): Promise<Payment | undefined> {
    const payment = this.payments.get(paymentId);
    if (!payment) return undefined;
    
    const updatedPayment = { ...payment, status };
    this.payments.set(paymentId, updatedPayment);
    return updatedPayment;
  }
}

export const storage = new MemStorage();
