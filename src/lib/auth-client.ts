import { env } from "@/env";
import { createAuthClient } from "better-auth/react";

const baseURL = env.NEXT_PUBLIC_AUTH_BASE_URL;

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    ...(baseURL ? { baseURL } : {}),
});
