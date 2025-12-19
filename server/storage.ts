import { type User, type InsertUser, type Verification, type InsertVerification, type VerificationStatus, type NovaStats } from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

let hashPasswordCache: Promise<string> | null = null;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByVerificationToken(token: string): Promise<User | undefined>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  createUser(user: InsertUser & { verificationToken?: string }): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  getVerification(id: string): Promise<Verification | undefined>;
  getVerificationsByEmail(email: string): Promise<Verification[]>;
  getVerificationsByUserId(userId: string): Promise<Verification[]>;
  getAllVerifications(): Promise<Verification[]>;
  createVerification(verification: InsertVerification & { userId?: string; isRegisteredUser?: boolean }): Promise<Verification>;
  updateVerificationStatus(id: string, status: VerificationStatus): Promise<Verification | undefined>;
  
  // Nova AI Engine state
  getNovaStats(): NovaStats;
  updateNovaStats(stats: Partial<NovaStats>): NovaStats;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private verifications: Map<string, Verification>;
  private novaStats: NovaStats;

  constructor() {
    this.users = new Map();
    this.verifications = new Map();
    
    // Initialize Nova AI Engine state with baseline values
    this.novaStats = {
      codesAnalyzed: 2847391,
      fraudsDetected: 12847,
      todayIncrement: 0,
      lastResetDate: new Date().toDateString(),
      processingPower: 87,
    };
    
    // Seed admin user (async initialization)
    this.seedAdmin().catch(err => console.error("[STORAGE] Failed to seed admin:", err));
  }
  
  private async seedAdmin() {
    const adminId = randomUUID();
    const adminPassword = process.env.ADMIN_PASSWORD 
      ? await hashPassword(process.env.ADMIN_PASSWORD) 
      : await hashPassword(randomUUID().split('-')[0]);
    const adminUser: User = {
      id: adminId,
      firstName: "Admin",
      lastName: "Koupon Trust",
      email: process.env.ADMIN_EMAIL || "admin@koupontrust.com",
      password: adminPassword,
      role: "admin",
      emailVerified: true,
      verificationToken: null,
      resetToken: null,
      resetTokenExpiry: null,
      createdAt: new Date(),
    };
    this.users.set(adminId, adminUser);
    console.log("[STORAGE] Admin user seeded");
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.verificationToken === token,
    );
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.resetToken === token && user.resetTokenExpiry && new Date(user.resetTokenExpiry) > new Date(),
    );
  }

  async createUser(insertUser: InsertUser & { verificationToken?: string }): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      firstName: insertUser.firstName,
      lastName: insertUser.lastName,
      email: insertUser.email,
      password: insertUser.password,
      role: "user",
      emailVerified: false,
      verificationToken: insertUser.verificationToken || null,
      resetToken: null,
      resetTokenExpiry: null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getVerification(id: string): Promise<Verification | undefined> {
    return this.verifications.get(id);
  }

  async getVerificationsByEmail(email: string): Promise<Verification[]> {
    return Array.from(this.verifications.values()).filter(
      (v) => v.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async getVerificationsByUserId(userId: string): Promise<Verification[]> {
    return Array.from(this.verifications.values()).filter(
      (v) => v.userId === userId,
    );
  }

  async getAllVerifications(): Promise<Verification[]> {
    return Array.from(this.verifications.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createVerification(data: InsertVerification & { userId?: string; isRegisteredUser?: boolean }): Promise<Verification> {
    const id = randomUUID();
    const verification: Verification = {
      id,
      userId: data.userId || null,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      couponType: data.couponType,
      amount: data.amount,
      couponCode: data.couponCode,
      status: "pending",
      isRegisteredUser: data.isRegisteredUser || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.verifications.set(id, verification);
    return verification;
  }

  async updateVerificationStatus(id: string, status: VerificationStatus): Promise<Verification | undefined> {
    const verification = this.verifications.get(id);
    if (!verification) return undefined;
    const updated = { ...verification, status, updatedAt: new Date() };
    this.verifications.set(id, updated);
    return updated;
  }

  // Nova AI Engine state management
  getNovaStats(): NovaStats {
    // Check if we need to reset daily counter
    const today = new Date().toDateString();
    if (this.novaStats.lastResetDate !== today) {
      this.novaStats.todayIncrement = 0;
      this.novaStats.lastResetDate = today;
    }
    return { ...this.novaStats };
  }

  updateNovaStats(stats: Partial<NovaStats>): NovaStats {
    this.novaStats = { ...this.novaStats, ...stats };
    return { ...this.novaStats };
  }
}

export const storage = new MemStorage();
