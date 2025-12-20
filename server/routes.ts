import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage, comparePassword } from "./storage";
import { registerSchema, loginSchema, verificationFormSchema, forgotPasswordSchema, resetPasswordSchema, twoFactorVerifySchema, twoFactorEnableSchema, twoFactorDisableSchema, type VerificationStatus, type Verification } from "@shared/schema";
import * as OTPAuth from "otpauth";
import QRCode from "qrcode";
import { sendVerificationEmail, sendAdminNotification, sendStatusUpdateEmail, sendPasswordResetEmail } from "./email";
import { randomBytes } from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { novaSimulation } from "./nova-simulation";
import geoip from "geoip-lite";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET environment variable is required in production");
}
const JWT_SECRET_VALUE = JWT_SECRET || "dev-secret-key-change-in-production";
const JWT_EXPIRY = "7d";

// Function to detect language from client IP
function detectLanguageFromIP(clientIP: string): "fr" | "nl" | "de" | "it" | "en" {
  try {
    // Get the actual client IP (handle proxies)
    const ip = clientIP.split(',')[0].trim();
    const geo = geoip.lookup(ip);
    
    if (!geo || !geo.country) {
      return "fr"; // Default to French
    }
    
    // Map country codes to supported languages
    const countryToLanguage: { [key: string]: "fr" | "nl" | "de" | "it" | "en" } = {
      "DE": "de", "AT": "de",  // German
      "NL": "nl", "BE": "nl",  // Dutch/Flemish
      "IT": "it",              // Italian
      "FR": "fr",              // French
      "CH": "fr",              // Switzerland - default to French (mixed but covers French speakers)
      "GB": "en", "US": "en", "CA": "en", "AU": "en", "NZ": "en", "IE": "en", // English
    };
    
    return countryToLanguage[geo.country] || "fr"; // Default to French if country not mapped
  } catch (error) {
    console.warn("[GEOIP] Language detection failed, defaulting to French", error);
    return "fr";
  }
}

// Pending auth tokens for 2FA flow - ensures password was verified before OTP
interface PendingAuthEntry {
  userId: string;
  email: string;
  createdAt: number;
  expiresAt: number;
  attemptCount: number;
  lockedUntil?: number;
}

const pendingAuthTokens = new Map<string, PendingAuthEntry>();
const PENDING_AUTH_EXPIRY = 5 * 60 * 1000; // 5 minutes
const MAX_2FA_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30 * 1000; // 30 seconds

// Cleanup expired pending auth tokens every minute
setInterval(() => {
  const now = Date.now();
  for (const [token, entry] of pendingAuthTokens.entries()) {
    if (entry.expiresAt < now) {
      pendingAuthTokens.delete(token);
    }
  }
}, 60 * 1000);

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

function generatePendingAuthToken(userId: string, email: string): string {
  const token = randomBytes(32).toString("hex");
  const now = Date.now();
  pendingAuthTokens.set(token, {
    userId,
    email,
    createdAt: now,
    expiresAt: now + PENDING_AUTH_EXPIRY,
    attemptCount: 0,
  });
  return token;
}

interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string; role: string };
}

interface AuthenticatedClient {
  ws: WebSocket;
  userId?: string;
  role?: string;
}

const connectedClients = new Map<WebSocket, AuthenticatedClient>();

function broadcastUpdate(type: string, data: unknown, options?: { excludeClient?: WebSocket; targetUserId?: string; targetRole?: string }) {
  const message = JSON.stringify({ type, data });
  connectedClients.forEach((client, ws) => {
    if (ws.readyState === WebSocket.OPEN && ws !== options?.excludeClient) {
      // Filter by target user or role if specified
      if (options?.targetUserId && client.userId !== options.targetUserId && client.role !== "admin") {
        return;
      }
      if (options?.targetRole && client.role !== options.targetRole) {
        return;
      }
      ws.send(message);
    }
  });
}

function broadcastOnlineCount() {
  const message = JSON.stringify({ type: "online_count", data: { count: connectedClients.size } });
  connectedClients.forEach((_, ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  });
}

function broadcastToAll(type: string, data: unknown) {
  const message = JSON.stringify({ type, data });
  connectedClients.forEach((_, ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  });
}

function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Non autorisé" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET_VALUE) as { id: string; email: string; role: string };
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
}

function adminMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Accès refusé" });
  }
  next();
}

function createAuthToken(user: { id: string; email: string; role: string }): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET_VALUE,
    { expiresIn: JWT_EXPIRY, algorithm: "HS256" }
  );
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Health check endpoint for keeping backend awake (cron jobs)
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws) => {
    const clientData: AuthenticatedClient = { ws };
    connectedClients.set(ws, clientData);
    console.log("[WS] Client connected, total:", connectedClients.size);
    
    ws.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.type === "auth" && message.token) {
          try {
            const decoded = Buffer.from(message.token, "base64").toString("utf-8");
            const [id, _, role] = decoded.split("|");
            clientData.userId = id;
            clientData.role = role;
            console.log(`[WS] Client authenticated: ${id} (${role})`);
          } catch (e) {
            console.error("[WS] Auth token decode failed:", e);
          }
        }
      } catch (e) {
        console.error("[WS] Message parse failed:", e);
      }
    });

    broadcastOnlineCount();

    ws.on("close", () => {
      connectedClients.delete(ws);
      console.log("[WS] Client disconnected, total:", connectedClients.size);
      broadcastOnlineCount();
    });

    ws.on("error", (error) => {
      console.error("[WS] Error:", error);
      connectedClients.delete(ws);
      broadcastOnlineCount();
    });
  });

  // Initialize Nova AI Simulation service with WebSocket broadcast
  novaSimulation.setBroadcast(broadcastToAll);
  novaSimulation.start();

  // Nova AI Engine stats endpoint (public - no auth required)
  app.get("/api/nova/stats", (_req, res) => {
    const stats = novaSimulation.getStats();
    res.json(stats);
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const result = registerSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.errors[0].message });
      }

      const { firstName, lastName, email, password } = result.data;
      const language = (req.body.language || req.headers["accept-language"]?.split(",")[0]?.substring(0, 2) || "fr") as "fr" | "nl" | "de" | "it" | "en";

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Format email invalide" });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Un compte existe déjà avec cet email" });
      }

      const verificationToken = generateToken();
      const hashedPassword = await hashPassword(password);

      const user = await storage.createUser({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        verificationToken,
        language,
      });

      await sendVerificationEmail(email, firstName, verificationToken, language);

      res.status(201).json({
        message: "Inscription réussie. Veuillez vérifier votre email pour activer votre compte.",
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
      });
    } catch (error) {
      console.error("[AUTH] Registration error:", error);
      res.status(500).json({ error: "Erreur lors de l'inscription" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.errors[0].message });
      }

      const { email, password } = result.data;
      const user = await storage.getUserByEmail(email);

      if (!user || !(await comparePassword(password, user.password))) {
        return res.status(401).json({ error: "Email ou mot de passe incorrect" });
      }

      if (!user.emailVerified && user.role !== "admin") {
        return res.status(401).json({ error: "Veuillez d'abord vérifier votre email" });
      }

      // Check if 2FA is enabled - issue pending auth token instead of allowing direct 2FA verify
      if (user.twoFactorEnabled) {
        const pendingToken = generatePendingAuthToken(user.id, user.email);
        return res.json({
          requires2FA: true,
          pendingAuthToken: pendingToken,
        });
      }

      const token = createAuthToken(user);

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          twoFactorEnabled: user.twoFactorEnabled,
        },
      });
    } catch (error) {
      console.error("[AUTH] Login error:", error);
      res.status(500).json({ error: "Erreur lors de la connexion" });
    }
  });

  app.get("/api/auth/verify-email", async (req, res) => {
    try {
      const token = req.query.token as string;
      if (!token) {
        return res.status(400).json({ error: "Token manquant" });
      }

      const user = await storage.getUserByVerificationToken(token);
      if (!user) {
        return res.status(400).json({ error: "Token invalide ou expiré" });
      }

      await storage.updateUser(user.id, {
        emailVerified: true,
        verificationToken: null,
      });

      // Generate auth token to auto-login the user
      const authToken = createAuthToken(user);

      res.json({ 
        message: "Email vérifié avec succès",
        token: authToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          twoFactorEnabled: user.twoFactorEnabled,
        },
      });
    } catch (error) {
      console.error("[AUTH] Email verification error:", error);
      res.status(500).json({ error: "Erreur lors de la vérification" });
    }
  });

  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const result = forgotPasswordSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.errors[0].message });
      }

      const { email } = result.data;
      const language = (req.body.language || req.headers["accept-language"]?.split(",")[0]?.substring(0, 2) || "fr") as "fr" | "nl" | "de" | "it" | "en";
      const user = await storage.getUserByEmail(email);

      // Always return success to prevent email enumeration
      if (!user) {
        return res.json({ message: "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation." });
      }

      const resetToken = generateToken();
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

      await storage.updateUser(user.id, {
        resetToken,
        resetTokenExpiry,
      });

      await sendPasswordResetEmail(user.email, user.firstName, resetToken, language);

      res.json({ message: "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation." });
    } catch (error) {
      console.error("[AUTH] Forgot password error:", error);
      res.status(500).json({ error: "Erreur lors de la demande de réinitialisation" });
    }
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const result = resetPasswordSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.errors[0].message });
      }

      const { token, password } = result.data;
      const user = await storage.getUserByResetToken(token);

      if (!user) {
        return res.status(400).json({ error: "Token invalide ou expiré" });
      }

      const hashedPassword = await hashPassword(password);

      await storage.updateUser(user.id, {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      });

      res.json({ message: "Mot de passe réinitialisé avec succès" });
    } catch (error) {
      console.error("[AUTH] Reset password error:", error);
      res.status(500).json({ error: "Erreur lors de la réinitialisation du mot de passe" });
    }
  });

  app.get("/api/auth/me", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled,
      });
    } catch (error) {
      console.error("[AUTH] Get user error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // 2FA Setup - Generate secret and QR code
  app.post("/api/auth/2fa/setup", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      if (user.twoFactorEnabled) {
        return res.status(400).json({ error: "La 2FA est déjà activée" });
      }

      const secret = new OTPAuth.Secret();
      const totp = new OTPAuth.TOTP({
        issuer: "Koupon Trust",
        label: user.email,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: secret,
      });

      // Store secret temporarily (not enabled yet)
      await storage.updateUser(user.id, {
        twoFactorSecret: secret.base32,
        twoFactorEnabled: false,
      });

      const qrCodeUrl = await QRCode.toDataURL(totp.toString());

      res.json({
        secret: secret.base32,
        qrCode: qrCodeUrl,
      });
    } catch (error) {
      console.error("[2FA] Setup error:", error);
      res.status(500).json({ error: "Erreur lors de la configuration 2FA" });
    }
  });

  // 2FA Enable - Verify first token and enable 2FA
  app.post("/api/auth/2fa/enable", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const result = twoFactorEnableSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.errors[0].message });
      }

      const user = await storage.getUser(req.user!.id);
      if (!user || !user.twoFactorSecret) {
        return res.status(400).json({ error: "Veuillez d'abord configurer la 2FA" });
      }

      if (user.twoFactorEnabled) {
        return res.status(400).json({ error: "La 2FA est déjà activée" });
      }

      const totp = new OTPAuth.TOTP({
        secret: OTPAuth.Secret.fromBase32(user.twoFactorSecret),
        algorithm: "SHA1",
        digits: 6,
        period: 30,
      });

      const delta = totp.validate({ token: result.data.token, window: 1 });

      if (delta === null) {
        return res.status(401).json({ error: "Code invalide ou expiré" });
      }

      await storage.updateUser(user.id, {
        twoFactorEnabled: true,
      });

      res.json({ message: "Authentification à deux facteurs activée avec succès" });
    } catch (error) {
      console.error("[2FA] Enable error:", error);
      res.status(500).json({ error: "Erreur lors de l'activation de la 2FA" });
    }
  });

  // 2FA Disable
  app.post("/api/auth/2fa/disable", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const result = twoFactorDisableSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.errors[0].message });
      }

      const user = await storage.getUser(req.user!.id);
      if (!user || !user.twoFactorEnabled) {
        return res.status(400).json({ error: "La 2FA n'est pas activée" });
      }

      const totp = new OTPAuth.TOTP({
        secret: OTPAuth.Secret.fromBase32(user.twoFactorSecret!),
        algorithm: "SHA1",
        digits: 6,
        period: 30,
      });

      const delta = totp.validate({ token: result.data.token, window: 1 });

      if (delta === null) {
        return res.status(401).json({ error: "Code invalide ou expiré" });
      }

      await storage.updateUser(user.id, {
        twoFactorSecret: null,
        twoFactorEnabled: false,
      });

      res.json({ message: "Authentification à deux facteurs désactivée" });
    } catch (error) {
      console.error("[2FA] Disable error:", error);
      res.status(500).json({ error: "Erreur lors de la désactivation de la 2FA" });
    }
  });

  // 2FA Verify - For login flow (requires pending auth token from password verification)
  app.post("/api/auth/2fa/verify", async (req, res) => {
    try {
      const result = twoFactorVerifySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.errors[0].message });
      }
      
      const { pendingAuthToken, token } = result.data;

      // Validate pending auth token exists and hasn't expired
      const pendingEntry = pendingAuthTokens.get(pendingAuthToken);
      if (!pendingEntry) {
        return res.status(401).json({ error: "Session d'authentification expirée. Veuillez vous reconnecter." });
      }

      const now = Date.now();

      // Check if token is expired
      if (pendingEntry.expiresAt < now) {
        pendingAuthTokens.delete(pendingAuthToken);
        return res.status(401).json({ error: "Session d'authentification expirée. Veuillez vous reconnecter." });
      }

      // Check if locked out due to too many attempts
      if (pendingEntry.lockedUntil && pendingEntry.lockedUntil > now) {
        const remainingSeconds = Math.ceil((pendingEntry.lockedUntil - now) / 1000);
        return res.status(429).json({ 
          error: `Trop de tentatives. Réessayez dans ${remainingSeconds} secondes.` 
        });
      }

      // Get user from pending entry
      const user = await storage.getUser(pendingEntry.userId);
      if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
        pendingAuthTokens.delete(pendingAuthToken);
        return res.status(400).json({ error: "Vérification 2FA non requise" });
      }

      const totp = new OTPAuth.TOTP({
        secret: OTPAuth.Secret.fromBase32(user.twoFactorSecret),
        algorithm: "SHA1",
        digits: 6,
        period: 30,
      });

      const delta = totp.validate({ token, window: 1 });

      if (delta === null) {
        // Increment attempt count and potentially lock out
        pendingEntry.attemptCount++;
        if (pendingEntry.attemptCount >= MAX_2FA_ATTEMPTS) {
          pendingEntry.lockedUntil = now + LOCKOUT_DURATION;
          pendingEntry.attemptCount = 0; // Reset for next lockout period
        }
        return res.status(401).json({ error: "Code invalide ou expiré" });
      }

      // Success - delete pending token (single use) and issue JWT
      pendingAuthTokens.delete(pendingAuthToken);

      const authToken = createAuthToken(user);

      res.json({
        token: authToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          twoFactorEnabled: user.twoFactorEnabled,
        },
      });
    } catch (error) {
      console.error("[2FA] Verify error:", error);
      res.status(500).json({ error: "Erreur lors de la vérification 2FA" });
    }
  });

  app.post("/api/verifications", async (req, res) => {
    try {
      // Validate required fields
      const { firstName, lastName, email, couponType, amount, couponCode } = req.body;
      if (!firstName || !lastName || !email || !couponType || !amount || !couponCode) {
        return res.status(400).json({ error: "Champs obligatoires manquants" });
      }

      let userId: string | undefined;
      let isRegisteredUser = false;
      let language: "fr" | "nl" | "de" | "it" | "en" = "fr";

      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        try {
          const token = authHeader.split(" ")[1];
          const decoded = jwt.verify(token, JWT_SECRET_VALUE) as { id: string };
          userId = decoded.id;
          isRegisteredUser = true;
          // Get user's preferred language if registered
          const user = await storage.getUser(decoded.id);
          if (user && user.language) {
            language = user.language as "fr" | "nl" | "de" | "it" | "en";
          }
        } catch {}
      }

      // For unregistered users (guests), detect language from IP
      if (!isRegisteredUser) {
        const clientIP = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
        language = detectLanguageFromIP(clientIP);
      }

      // Create verification WITHOUT storing the image in DB
      const { couponImage, ...dataWithoutImage } = req.body;
      
      const verification = await storage.createVerification({
        ...dataWithoutImage,
        userId,
        isRegisteredUser,
      });

      // Send admin notification with image attached (image is in memory, not persisted)
      if (couponImage) {
        await sendAdminNotification({ ...verification, couponImage } as Verification);
      } else {
        await sendAdminNotification(verification);
      }

      // Broadcast to all admins and the user who submitted (if registered)
      broadcastUpdate("new_verification", verification, { 
        targetRole: "admin" 
      });
      if (userId) {
        broadcastUpdate("verification_created", verification, {
          targetUserId: userId
        });
      }

      res.status(201).json(verification);
    } catch (error) {
      console.error("[VERIFICATION] Create error:", error);
      res.status(500).json({ error: "Erreur lors de la soumission" });
    }
  });

  app.get("/api/verifications", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const verifications = await storage.getVerificationsByUserId(req.user!.id);
      res.json(verifications);
    } catch (error) {
      console.error("[VERIFICATION] Get user verifications error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.get("/api/verifications/:id", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const verification = await storage.getVerification(id);
      
      if (!verification) {
        return res.status(404).json({ error: "Vérification non trouvée" });
      }

      // Only allow users to view their own verifications
      if (verification.userId && verification.userId !== req.user!.id) {
        return res.status(403).json({ error: "Accès refusé" });
      }

      res.json(verification);
    } catch (error) {
      console.error("[VERIFICATION] Get single verification error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.get("/api/admin/verifications", authMiddleware, adminMiddleware, async (_req, res) => {
    try {
      const verifications = await storage.getAllVerifications();
      res.json(verifications);
    } catch (error) {
      console.error("[ADMIN] Get verifications error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.patch("/api/admin/verifications/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body as { status: VerificationStatus };

      if (!["valid", "invalid", "already_used"].includes(status)) {
        return res.status(400).json({ error: "Statut invalide" });
      }

      const verification = await storage.updateVerificationStatus(id, status);
      if (!verification) {
        return res.status(404).json({ error: "Vérification non trouvée" });
      }

      // Get user's preferred language if they are registered
      let language: "fr" | "nl" | "de" | "it" | "en" = "fr";
      if (verification.userId) {
        const user = await storage.getUser(verification.userId);
        if (user && user.language) {
          language = user.language as "fr" | "nl" | "de" | "it" | "en";
        }
      }
      
      // Send status update email to user (no image stored, so none to include)
      await sendStatusUpdateEmail(verification, language);

      // Broadcast to all admins and the user who submitted
      broadcastUpdate("verification_updated", verification, { 
        targetRole: "admin" 
      });
      if (verification.userId) {
        broadcastUpdate("verification_status_changed", verification, {
          targetUserId: verification.userId
        });
      }

      res.json(verification);
    } catch (error) {
      console.error("[ADMIN] Update verification error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.get("/api/admin/users", authMiddleware, adminMiddleware, async (_req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users.map(u => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
        emailVerified: u.emailVerified,
        createdAt: u.createdAt,
      })));
    } catch (error) {
      console.error("[ADMIN] Get users error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  return httpServer;
}
