import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const PORT = 5500;
const ROOT = process.cwd();

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

// Clean URL mapping: /about → /about.html
const cleanRoutes = {
  "/about": "/about.html",
  "/services": "/services.html",
  "/portfolio": "/portfolio.html",
  "/contact": "/contact.html",
};

function safePath(urlPath) {
  const cleanPath = normalize(decodeURIComponent(urlPath)).replace(/^([.][.][/\\])+/, "");
  return join(ROOT, cleanPath);
}

const server = createServer((req, res) => {
  let reqPath = req.url === "/" ? "/index.html" : req.url.split("?")[0];

  // Resolve clean URLs
  if (cleanRoutes[reqPath]) {
    reqPath = cleanRoutes[reqPath];
  }

  const filePath = safePath(reqPath);

  if (!existsSync(filePath)) {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`<!doctype html><html><body><h1>404 Not Found</h1><p><a href="/">Back to home</a></p></body></html>`);
    return;
  }

  if (statSync(filePath).isDirectory()) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("403 Forbidden");
    return;
  }

  const ext = extname(filePath).toLowerCase();
  const type = mime[ext] || "application/octet-stream";

  try {
    const file = readFileSync(filePath);
    res.writeHead(200, { "Content-Type": type });
    res.end(file);
  } catch {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("500 Internal Server Error");
  }
});

server.listen(PORT, () => {
  console.log(`Local site running: http://localhost:${PORT}`);
});
