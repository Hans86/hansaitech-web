/**
 * Hansaitech Auth Worker
 * Protects /about, /services, /portfolio, /contact behind login.
 * Public: /, /login, /assets/*, /css/*, /js/*
 */

const SESSION_KEY = "ht_session";
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours
const ADMIN_USER = "admin";
// SHA-256 of admin password (set via Cloudflare env: ADMIN_PASSWORD_HASH)
const FALLBACK_HASH = "25590b6b8da81c16d29832d0a77e95cf1cd51e41dd36fecdec146d15a1bab241";

const PROTECTED = ["/about", "/services", "/portfolio", "/contact"];

// ── Crypto helpers ─────────────────────────────────────────────
async function sha256hex(text) {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text)
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacSign(payload, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

async function createToken(secret) {
  const payload = JSON.stringify({ u: ADMIN_USER, exp: Date.now() + SESSION_DURATION });
  const b64 = btoa(payload);
  const sig = await hmacSign(payload, secret);
  return `${b64}.${sig}`;
}

async function verifyToken(token, secret) {
  try {
    const dot = token.lastIndexOf(".");
    const b64 = token.slice(0, dot);
    const sig = token.slice(dot + 1);
    const payload = atob(b64);
    const expectedSig = await hmacSign(payload, secret);
    if (sig !== expectedSig) return false;
    const { exp } = JSON.parse(payload);
    return Date.now() < exp;
  } catch {
    return false;
  }
}

// ── Cookie helpers ─────────────────────────────────────────────
function getCookie(request, name) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setSessionCookie(token) {
  const maxAge = SESSION_DURATION / 1000;
  return `${SESSION_KEY}=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`;
}

function clearSessionCookie() {
  return `${SESSION_KEY}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

// ── Route handlers ─────────────────────────────────────────────
async function handleLogin(request, env) {
  const secret = env.SESSION_SECRET || "ht-secret-change-in-cloudflare";
  const passwordHash = (env.ADMIN_PASSWORD_HASH || FALLBACK_HASH).trim();

  const form = await request.formData();
  const username = (form.get("username") || "").trim();
  const password = form.get("password") || "";

  const inputHash = await sha256hex(password);

  if (username === ADMIN_USER && inputHash === passwordHash) {
    const token = await createToken(secret);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/about",
        "Set-Cookie": setSessionCookie(token),
      },
    });
  }

  return new Response(null, {
    status: 302,
    headers: { Location: "/login?error=1" },
  });
}

function handleLogout() {
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/login",
      "Set-Cookie": clearSessionCookie(),
    },
  });
}

// ── Main fetch ─────────────────────────────────────────────────
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const secret = env.SESSION_SECRET || "ht-secret-change-in-cloudflare";

    // POST /login
    if (path === "/login" && request.method === "POST") {
      return handleLogin(request, env);
    }

    // GET /logout
    if (path === "/logout") {
      return handleLogout();
    }

    // Check protected routes
    const isProtected = PROTECTED.some(
      (p) => path === p || path === p + ".html" || path.startsWith(p + "/")
    );

    if (isProtected) {
      const token = getCookie(request, SESSION_KEY);
      if (!token || !(await verifyToken(token, secret))) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("next", path);
        return Response.redirect(loginUrl.toString(), 302);
      }
    }

    // Serve static assets
    return env.ASSETS.fetch(request);
  },
};
