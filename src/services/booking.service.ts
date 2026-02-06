import { env } from "@/env";
import { cookies } from "next/headers";

const BACKEND_URL = env.BACKEND_URL;

export const bookingService = {
    getAllBookings: async function () {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${BACKEND_URL}/api/v1/admin/bookings`, {
                headers: { Cookie: cookieStore.toString() },
                cache: "no-cache",
            });
            const data = await res.json();
            return { data, error: null };
        } catch (error) {
            return { data: null, error: { message: "Something went wrong" } };
        }
    },
    getMyBookings: async function () {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${BACKEND_URL}/api/v1/bookings/`, {
                headers: { Cookie: cookieStore.toString() },
                cache: "no-cache",
            });
            const data = await res.json();
            if (!res.ok) {
                return {
                    data: null,
                    error: {
                        message: data?.message || "Failed to load bookings",
                    },
                };
            }
            return { data, error: null };
        } catch (error) {
            return { data: null, error: { message: "Something went wrong" } };
        }
    },
};
