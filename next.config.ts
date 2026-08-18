import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Article covers are locally authored SVGs (no remote/user-supplied SVGs are ever served).
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
