import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    async rewrites() {
        const authBaseUrl =
            process.env.AUTH_URL ??
            process.env.BACKEND_URL ??
            process.env.NEXT_PUBLIC_BACKEND_URL;

        if (!authBaseUrl) {
            return [];
        }

        const normalizedAuthBaseUrl = authBaseUrl.replace(/\/$/, "");

        return [
            {
                source: "/api/auth/:path*",
                destination: `${normalizedAuthBaseUrl}/api/auth/:path*`,
            },
        ];
    },
};

export default nextConfig;
