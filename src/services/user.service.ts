import { env } from "@/env";
import { cookies } from "next/headers";

const BACKEND_URL = env.BACKEND_URL;

export const userService = {
    getSession: async function () {
        try {
            const cookieStore = await cookies();

            const res = await fetch(`${BACKEND_URL}/api/auth/get-session`, {
                headers: { Cookie: cookieStore.toString() },
                cache: "no-store",
            });

            const session = await res.json();

            if (session === null) {
                return { data: null, error: { message: "Session is missing" } };
            }
            return { data: session, error: null };
        } catch (error) {
            console.error(error);
            return { data: null, error: { message: "Something went wrong!" } };
        }
    },
    getAllUser: async function () {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${BACKEND_URL}/api/v1/users`, {
                headers: { Cookie: cookieStore.toString() },
                cache: "no-cache",
            });

            const data = await res.json();
            return { data, error: null };
        } catch (error) {
            return { data: null, error: { message: "Something went wrong" } };
        }
    },
};
