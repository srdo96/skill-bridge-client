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
            const res = await fetch(
                `${BACKEND_URL}/api/v1/users?role=TUTOR&status=ACTIVE&tutorProfiles=true`,
                {
                    headers: { Cookie: cookieStore.toString() },
                    cache: "no-cache",
                },
            );

            const data = await res.json();
            return { data, error: null };
        } catch (error) {
            return { data: null, error: { message: "Something went wrong" } };
        }
    },

    getUserById: async function (id: string) {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${BACKEND_URL}/api/v1/users/${id}`, {
                headers: { Cookie: cookieStore.toString() },
                cache: "no-cache",
            });

            if (!res.ok) {
                return { data: null, error: { message: "User not found" } };
            }

            const data = await res.json();
            return { data, error: null };
        } catch (error) {
            return { data: null, error: { message: "Something went wrong" } };
        }
    },
    getUserTutorById: async function (id: string) {
        try {
            const cookieStore = await cookies();
            const res = await fetch(
                `${BACKEND_URL}/api/v1/users/public/${id}`,
                {
                    headers: { Cookie: cookieStore.toString() },
                    cache: "no-cache",
                },
            );

            if (!res.ok) {
                return { data: null, error: { message: "User not found" } };
            }

            const data = await res.json();
            return { data, error: null };
        } catch (error) {
            return { data: null, error: { message: "Something went wrong" } };
        }
    },

    banUser: async function (id: string) {
        try {
            console.log("banUser", id);
            const cookieStore = await cookies();
            const res = await fetch(`${BACKEND_URL}/api/v1/users/${id}/ban`, {
                method: "PATCH",
                headers: { Cookie: cookieStore.toString() },
                cache: "no-cache",
            });
            console.log("res", res);
            if (!res.ok) {
                return { data: null, error: { message: "Failed to ban user" } };
            }

            const data = await res.json();
            return { data, error: null };
        } catch (error) {
            return { data: null, error: { message: "Something went wrong" } };
        }
    },
    unbanUser: async function (id: string) {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${BACKEND_URL}/api/v1/users/${id}/unban`, {
                method: "PATCH",
                headers: { Cookie: cookieStore.toString() },
                cache: "no-cache",
            });
            if (!res.ok) {
                return {
                    data: null,
                    error: { message: "Failed to unban user" },
                };
            }

            const data = await res.json();
            return { data, error: null };
        } catch (error) {
            return { data: null, error: { message: "Something went wrong" } };
        }
    },
    updateMyProfile: async function (
        payload: {
            name: string;
            phone?: string;
            image?: string;
        },
        user_id: string,
    ) {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${BACKEND_URL}/api/v1/users/${user_id}`, {
                method: "PATCH",
                headers: {
                    Cookie: cookieStore.toString(),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) {
                return {
                    data: null,
                    error: {
                        message: data?.message || "Failed to update profile",
                    },
                };
            }
            return { data, error: null };
        } catch (error) {
            return { data: null, error: { message: "Something went wrong" } };
        }
    },
};
