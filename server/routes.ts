import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { registerSchema, loginSchema, verificationFormSchema, type VerificationStatus } from "@shared/schema";
import { sendVerificationEmail, sendAdminNotification, sendStatusUpdateEmail } from "./email";
import { createHash, randomBytes } from "crypto";

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string; role: string };
}

const connectedClients = new Set<WebSocket>();

function broadcastUpdate(type: string, data: unknown) {
  const message = JSON.stringify({ type, data });
  connectedClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function broadcastOnlineCount() {
  broadcastUpdate("online_count", { count: connectedClients.size });
}

function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Non autorisé" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [id, email, role] = decoded.split("|");
    req.user = { id, email, role };
    next();
  } catch {
    return res.status(401).json({ error: "Token invalide" });
  }
}

function adminMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Accès refusé" });
  }
  next();
}

function createAuthToken(user: { id: string; email: string; role: string }): string {
  return Buffer.from(`${user.id}|${user.email}|${user.role}`).toString("base64");
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
    connectedClients.add(ws);
    console.log("[WS] Client connected, total:", connectedClients.size);
    
    ws.send(JSON.stringify({ type: "online_count", data: { count: connectedClients.size } }));
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

  app.post("/api/auth/register", async (req, res) => {
    try {
      const result = registerSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.errors[0].message });
      }

      const { firstName, lastName, email, password } = result.data;

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Un compte existe déjà avec cet email" });
      }

      const verificationToken = generateToken();
      const hashedPassword = hashPassword(password);

      const user = await storage.createUser({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        verificationToken,
      });

      await sendVerificationEmail(email, firstName, verificationToken);

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

      if (!user || user.password !== hashPassword(password)) {
        return res.status(401).json({ error: "Email ou mot de passe incorrect" });
      }

      if (!user.emailVerified && user.role !== "admin") {
        return res.status(401).json({ error: "Veuillez d'abord vérifier votre email" });
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

      res.json({ message: "Email vérifié avec succès" });
    } catch (error) {
      console.error("[AUTH] Email verification error:", error);
      res.status(500).json({ error: "Erreur lors de la vérification" });
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
      });
    } catch (error) {
      console.error("[AUTH] Get user error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.post("/api/verifications", async (req, res) => {
    try {
      const result = verificationFormSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.errors[0].message });
      }

      let userId: string | undefined;
      let isRegisteredUser = false;

      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        try {
          const token = authHeader.split(" ")[1];
          const decoded = Buffer.from(token, "base64").toString("utf-8");
          const [id] = decoded.split("|");
          userId = id;
          isRegisteredUser = true;
        } catch {}
      }

      const verification = await storage.createVerification({
        ...result.data,
        userId,
        isRegisteredUser,
      });

      await sendAdminNotification(verification);

      broadcastUpdate("new_verification", verification);

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

      await sendStatusUpdateEmail(verification);

      broadcastUpdate("verification_updated", verification);

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
