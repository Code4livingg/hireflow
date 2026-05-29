import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // reactStrictMode disabled: Next.js 16 App Router + strict mode causes
  // history.replaceState() to be called >100 times/10s during auth redirects,
  // triggering a browser SecurityError. Re-enable only after upgrading Next.js.
  reactStrictMode: false,
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
