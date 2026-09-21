import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },
  experimental: { optimizePackageImports: ["lucide-react"] },
  async redirects() {
    // Anciennes pages fusionnées dans les guides : redirections permanentes
    // pour conserver les liens et le référencement existants.
    return [
      { source: "/recharge-a-domicile", destination: "/guides/recharge-domicile-ou-borne-publique", permanent: true },
      { source: "/recharge-rapide", destination: "/guides/recharge-ac-ou-dc", permanent: true },
      { source: "/recharge/prix", destination: "/guides/combien-coute-recharge-domicile", permanent: true },
      { source: "/recharge/recharge-ac-dc", destination: "/guides/recharge-ac-ou-dc", permanent: true },
      { source: "/recharge/puissances-de-recharge", destination: "/guides/puissance-borne-7-11-22-kw", permanent: true },
      { source: "/bornes-recharge", destination: "/recharge", permanent: true },
    ];
  },
  async headers() {
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];
    return [
      { source: "/:path*", headers: security },
      {
        // Ressources versionnées de Next : cache immuable.
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
