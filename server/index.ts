import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();

// Security: Use Helmet to set various HTTP headers
const isProduction = process.env.NODE_ENV === "production";
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: isProduction ? ["'self'"] : ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: isProduction ? ["'self'", "https://fonts.googleapis.com"] : ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Trop de requêtes, veuillez réessayer plus tard",
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: "Trop de tentatives de connexion, veuillez réessayer plus tard",
  skipSuccessfulRequests: true,
});

// Stricter rate limiter for password reset to prevent email spam
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password reset requests per hour
  message: "Trop de demandes de réinitialisation, veuillez réessayer plus tard",
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for verification submissions to prevent spam
const verificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 verification submissions per hour
  message: "Trop de soumissions de vérification, veuillez réessayer plus tard",
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting
app.use("/api/", limiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/forgot-password", passwordResetLimiter);
app.use("/api/auth/reset-password", authLimiter);
app.use("/api/verifications", verificationLimiter);

// CORS configuration - strict origin validation (defined early for CSRF protection)
const replitDomain = process.env.REPLIT_DEV_DOMAIN;
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  'http://localhost:5173',
  replitDomain ? `https://${replitDomain}` : null,
].filter(Boolean) as string[];

// Helper function for strict origin matching (exact match, not prefix)
const isOriginAllowed = (origin: string, allowedList: string[]): boolean => {
  const normalizedOrigin = origin.replace(/\/$/, '').toLowerCase();
  return allowedList.some(allowed => {
    const normalizedAllowed = allowed.replace(/\/$/, '').toLowerCase();
    return normalizedOrigin === normalizedAllowed;
  });
};

// CSRF Protection middleware - validates Origin header for mutative requests
const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // Skip for safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const origin = req.headers.origin;
  const referer = req.headers.referer;

  // In production, require Origin or Referer header for mutative requests
  if (isProduction) {
    if (!origin && !referer) {
      console.warn('[CSRF] Blocked request without Origin/Referer header');
      return res.status(403).json({ error: "Requête non autorisée" });
    }

    // Safely parse referer to extract origin
    let requestOrigin: string | null = origin || null;
    if (!requestOrigin && referer) {
      try {
        requestOrigin = new URL(referer).origin;
      } catch {
        console.warn('[CSRF] Blocked request with malformed Referer header');
        return res.status(403).json({ error: "Requête non autorisée" });
      }
    }

    // Validate the origin with strict matching (not prefix)
    if (requestOrigin && !isOriginAllowed(requestOrigin, allowedOrigins)) {
      console.warn('[CSRF] Blocked request from invalid origin:', requestOrigin);
      return res.status(403).json({ error: "Origine non autorisée" });
    }
  }

  next();
};

// Apply CSRF protection to all API routes
app.use("/api/", csrfProtection);

app.use(cors({
  origin: (origin, callback) => {
    // Strict CORS policy - reject requests without origin
    if (!origin) {
      if (isProduction) {
        // In production, always reject requests without origin
        return callback(new Error("CORS not allowed - missing origin"));
      }
      // In development, allow for testing purposes
      return callback(null, true);
    }
    
    // Check if origin is in allowedOrigins (strict exact match)
    const isAllowed = isOriginAllowed(origin, allowedOrigins);
    
    if (isAllowed) {
      callback(null, true);
    } else {
      if (!isProduction) console.log('[CORS] Origin not allowed:', origin);
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  // Error handler (must be last)
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    // Don't expose internal errors in production
    const message = process.env.NODE_ENV === "production" 
      ? "Une erreur est survenue" 
      : err.message || "Internal Server Error";

    res.status(status).json({ error: message });
    if (status >= 500) {
      console.error("[ERROR]", err);
    }
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
