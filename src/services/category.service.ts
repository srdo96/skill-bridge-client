import { env } from "@/env";
import { cookies } from "next/headers";

const BACKEND_URL = env.BACKEND_URL;

export const categoryService = {
    getAllCategories: async function () {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${BACKEND_URL}/api/v1/categories`, {
                headers: { Cookie: cookieStore.toString() },
                cache: "no-cache",
            });
            const data = await res.json();
            return { data, error: null };
        } catch (error) {
            return { data: null, error: { message: "Something went wrong" } };
        }
    },
    createCategory: async function (payload: {
        name: string;
        desc?: string;
        img_url?: string;
    }) {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${BACKEND_URL}/api/v1/categories`, {
                method: "POST",
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
                        message: data?.message || "Failed to create category",
                    },
                };
            }
            return { data, error: null };
        } catch (error) {
            return { data: null, error: { message: "Something went wrong" } };
        }
    },
    createSubject: async function (payload: {
        name: string;
        desc?: string;
        img_url?: string;
        category_id: string;
    }) {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${BACKEND_URL}/api/v1/subjects`, {
                method: "POST",
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
                        message: data?.message || "Failed to create subject",
                    },
                };
            }
            return { data, error: null };
        } catch (error) {
            return { data: null, error: { message: "Something went wrong" } };
        }
    },
};
