// Express sunucusu. Geliştirmede Vite middleware (HMR), üretimde dist statiği.
// SPA olduğu için bilinmeyen tüm yollar index.html'e döner (client-side render).
import express from "express";
import http from "http";
import compression from "compression";
import fs from "fs";
import path from "path";
import { mountApi } from "./api.js";
import "dotenv/config";

const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3000;
const root = process.cwd();

async function startServer() {
  const app = express();
  app.use(compression());
  app.use(express.json({ limit: "1mb" }));

  // Lead API + admin paneli (/panel). Vite/statik middleware'lerden ÖNCE.
  mountApi(app);

  const server = http.createServer(app);

  if (isProduction) {
    const sirv = (await import("sirv")).default;
    const dist = path.join(root, "dist");
    app.use(sirv(dist, { extensions: [] }));
    const indexHtml = fs.readFileSync(path.join(dist, "index.html"), "utf-8");
    // SPA fallback: statik dosya bulunamayan tüm yollar index.html döner.
    app.get(/.*/, (req, res) => {
      res.status(200).type("html").send(indexHtml);
    });
  } else {
    const vite = await import("vite");
    const viteServer = await vite.createServer({
      root,
      appType: "custom",
      server: { middlewareMode: true, hmr: { server } },
    });
    app.use(viteServer.middlewares);
    // Vite'ın çözmediği yollar için index.html'i HMR dönüşümüyle servis et.
    app.use(async (req, res, next) => {
      try {
        const template = await viteServer.transformIndexHtml(
          req.originalUrl,
          fs.readFileSync(path.join(root, "index.html"), "utf-8")
        );
        res.status(200).type("html").end(template);
      } catch (err) {
        viteServer.ssrFixStacktrace(err);
        next(err);
      }
    });
  }

  server.listen(port, () => {
    console.log(`Gold Clover çalışıyor → http://localhost:${port}`);
  });
}

startServer();
