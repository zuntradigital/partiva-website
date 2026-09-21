import type { NextConfig } from "next";

// No nonce/proxy setup here, so this follows Next.js's documented
// no-nonce CSP: 'unsafe-inline' on script-src is required because the App
// Router streams its hydration payload via inline <script> tags (not
// user-controlled content). 'unsafe-eval' is dev-only (React's debug tooling).
const isDev = process.env.NODE_ENV === "development";
// Pricing and testimonials are fetched client-side directly from the backend
// API (they're client components driven by the language/locale context, so a
// server component fetch isn't an option), so connect-src must allow it.
const backendApiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.BACKEND_API_URL || "http://localhost:5000";
// Article cover images uploaded via the Dashboard's Media Library are real
// files served from the backend's own origin (partiva-admin-backend's
// /uploads route), not a same-site path or a self-contained data: URL, so
// both the CSP and next/image's remote-image allowlist below must permit it.
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: ${backendApiUrl};
  font-src 'self';
  connect-src 'self' ${backendApiUrl};
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const backendUrl = new URL(backendApiUrl);

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // The root layout (Navbar/Footer) and pages read Dashboard-managed data
  // (visibility, nav placement, section content) on every server render, but
  // the Client Router Cache still reused a stale copy across client-side
  // <Link> navigations, so edits never appeared without a hard reload.
  // dynamic: 0 disables that cache for dynamic segments so every navigation
  // re-fetches current data from the server.
  experimental: {
    staleTimes: {
      dynamic: 0,
    },
  },
  images: {
    // Article covers are locally authored SVGs (no remote/user-supplied SVGs are ever served).
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Lets next/image optimize article cover images uploaded via the
    // Dashboard's Media Library, which are real files served from the
    // backend's own origin under /uploads/media/* -- narrowed to that one
    // path so no other backend route is treated as an image source.
    remotePatterns: [
      {
        protocol: backendUrl.protocol.replace(":", "") as "http" | "https",
        hostname: backendUrl.hostname,
        port: backendUrl.port || undefined,
        pathname: "/uploads/media/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: cspHeader },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
