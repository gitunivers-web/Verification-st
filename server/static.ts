import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  
  // Only serve static files if the build directory exists
  // For separated deployments (frontend on Vercel, backend on Render), 
  // the client files won't exist on the backend server
  if (!fs.existsSync(distPath)) {
    console.log(`Client build directory not found at ${distPath} - skipping static file serving`);
    return;
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
