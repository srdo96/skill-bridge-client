import { env } from "@/env";
import { cookies } from "next/headers";

const BACKEND_URL = env.BACKEND_URL;

export const dashboardService = {
    getDashboardData: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${BACKEND_URL}/api/v1/dashboard/stats`, {
                headers: { Cookie: cookieStore.toString() },
            });
            const data = await res.json();
            if (!data.success) {
                return { data: null, error: { message: data.message } };
            }
            return { data: data.data, error: null };
        } catch (error) {
            console.error(error);
            return { data: null, error: { message: "Something went wrong!" } };
        }
    },
    getTutorDashboardData: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${BACKEND_URL}/api/v1/dashboard/stats`, {
                headers: { Cookie: cookieStore.toString() },
            });
            const data = await res.json();

            if (!res.ok || data?.success === false) {
                return {
                    data: null,
                    error: {
                        message:
                            data?.message || "Failed to load tutor dashboard",
                    },
                };
            }

            return { data: data?.data ?? data, error: null };
        } catch (error) {
            console.error(error);
            return { data: null, error: { message: "Something went wrong!" } };
        }
    },
    getStudentDashboardData: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${BACKEND_URL}/api/v1/dashboard/stats`, {
                headers: { Cookie: cookieStore.toString() },
            });
            const data = await res.json();

            if (!res.ok || data?.success === false) {
                return {
                    data: null,
                    error: {
                        message:
                            data?.message || "Failed to load student dashboard",
                    },
                };
            }

            return { data: data?.data ?? data, error: null };
        } catch (error) {
            console.error(error);
            return { data: null, error: { message: "Something went wrong!" } };
        }
    },
    getHomePageStats: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(
                `${BACKEND_URL}/api/v1/dashboard/landing-page-stats`,
                {
                    headers: { Cookie: cookieStore.toString() },
                },
            );
            const data = await res.json();
            if (!res.ok || data?.success === false) {
                return {
                    data: null,
                    error: {
                        message:
                            data?.message ||
                            "Failed to load landing page stats",
                    },
                };
            }
            return { data: data, error: null };
        } catch (error) {
            console.error(error);
            return { data: null, error: { message: "Something went wrong!" } };
        }
    },
};
