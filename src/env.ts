import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const env = createEnv({
    client: {
        NEXT_PUBLIC_AUTH_BASE_URL: z.url().optional(),
    },
    server: { BACKEND_URL: z.url(), FRONTEND_URL: z.url(), AUTH_URL: z.url() },
    runtimeEnv: {
        NEXT_PUBLIC_AUTH_BASE_URL: process.env.NEXT_PUBLIC_AUTH_BASE_URL,
        BACKEND_URL: process.env.BACKEND_URL,
        FRONTEND_URL: process.env.FRONTEND_URL,
        AUTH_URL: process.env.AUTH_URL,
    },
});
