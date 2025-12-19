import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  emailVerified: boolean("email_verified").notNull().default(false),
  verificationToken: text("verification_token"),
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const verifications = pgTable("verifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  couponType: text("coupon_type").notNull(),
  amount: integer("amount").notNull(),
  couponCode: text("coupon_code").notNull(),
  status: text("status").notNull().default("pending"),
  isRegisteredUser: boolean("is_registered_user").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  role: true,
  emailVerified: true,
  verificationToken: true,
  resetToken: true,
  resetTokenExpiry: true,
  createdAt: true,
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token requis"),
  password: z.string()
    .min(12, "Le mot de passe doit contenir au moins 12 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
});

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export const passwordSchema = z.string()
  .min(12, "Le mot de passe doit contenir au moins 12 caractères")
  .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
  .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
  .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre");

export const registerSchema = insertUserSchema.extend({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: passwordSchema,
});

export const insertVerificationSchema = createInsertSchema(verifications).omit({
  id: true,
  userId: true,
  status: true,
  isRegisteredUser: true,
  createdAt: true,
  updatedAt: true,
});

export const verificationFormSchema = insertVerificationSchema.extend({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  couponType: z.string().min(1, "Veuillez sélectionner un type de coupon"),
  amount: z.number().min(1, "Le montant doit être supérieur à 0"),
  couponCode: z.string().min(4, "Le code coupon doit contenir au moins 4 caractères"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertVerification = z.infer<typeof insertVerificationSchema>;
export type Verification = typeof verifications.$inferSelect;
export type VerificationStatus = "pending" | "valid" | "invalid" | "already_used";

// Nova AI Engine shared state (centralized simulation)
export interface NovaStats {
  codesAnalyzed: number;
  fraudsDetected: number;
  todayIncrement: number;
  lastResetDate: string;
  processingPower: number;
}
