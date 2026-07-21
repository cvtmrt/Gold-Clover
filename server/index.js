// Express sunucusu. Geliştirmede Vite middleware (HMR), üretimde dist statiği.
// SPA olduğu için bilinmeyen tüm yollar index.html'e döner (client-side render),
// ancak rota-bazlı SEO meta (server/seo.js) enjekte edilerek servis edilir.
import express from "express";
import http from "http";
import compression from "compression";
import fs from "fs";
import path from "path";
import { mountApi } from "./api.js";
import { injectMeta } from "./seo.js";
import { hasDb } from "../db/index.js";
import { ensureSchema } from "../db/ensure-schema.js";
import "dotenv/config";

const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3000;
const root = process.cwd();

async function startServer() {
  // DB varsa tabloları açılışta garanti et (idempotent). Böylece yeni bir Railway
  // ortamında `relation ... does not exist` hatası oluşmaz.
  if (hasDb) {
    try {
      await ensureSchema();
      console.log("Veritabanı şeması hazır (leads, products).");
    } catch (err) {
      // Site yine de ayağa kalksın; sadece DB uçları hata verir.
      console.error("Veritabanı şeması hazırlanamadı:", err.message);
    }
  }

  const app = express();
  app.use(compression());
  app.use(express.json({ limit: "1mb" }));

  // Lead/ürün API + admin paneli (/panel). Vite/statik middleware'lerden ÖNCE.
  mountApi(app);

  const server = http.createServer(app);

  if (isProduction) {
    const sirv = (await import("sirv")).default;
    const dist = path.join(root, "dist");
    app.use(sirv(dist, { extensions: [] }));
    const indexHtml = fs.readFileSync(path.join(dist, "index.html"), "utf-8");
    // SPA fallback: statik dosya bulunamayan tüm yollar rota-SEO ile index.html döner.
    app.get(/.*/, (req, res) => {
      res.status(200).type("html").send(injectMeta(indexHtml, req.path));
    });
  } else {
    const vite = await import("vite");
    const viteServer = await vite.createServer({
      root,
      appType: "custom",
      server: { middlewareMode: true, hmr: { server } },
    });
    app.use(viteServer.middlewares);
    // Vite'ın çözmediği yollar için index.html'i HMR dönüşümü + SEO ile servis et.
    app.use(async (req, res, next) => {
      try {
        const template = await viteServer.transformIndexHtml(
          req.originalUrl,
          fs.readFileSync(path.join(root, "index.html"), "utf-8")
        );
        res.status(200).type("html").end(injectMeta(template, req.path));
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
