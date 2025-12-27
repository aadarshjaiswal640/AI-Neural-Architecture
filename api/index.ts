import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { registerRoutes } from "../server/routes";

let app: express.Application | null = null;
let initialized = false;

async function initializeApp() {
  if (initialized && app) return app;

  app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Logging middleware
  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson: any, ...args: any[]) {
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
        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "…";
        }
        console.log(logLine);
      }
    });

    next();
  });

  // Register routes
  const httpServer = await registerRoutes(app);

  // Error handling middleware
  app.use(
    (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      console.error(err);
    }
  );

  initialized = true;
  return app;
}

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const app = await initializeApp();
    return app!(req as any, res as any);
  } catch (error) {
    console.error("Error initializing app:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
