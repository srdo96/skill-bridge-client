import { env } from "@/env";
import { cookies } from "next/headers";

const BACKEND_URL = env.BACKEND_URL;

export const bookingService = {
    createBooking: async function (payload: {
        tutor_profile_id: string;
        subject_id: string;
        day_of_week: string;
        start_time: string;
        end_time: string;
    }) {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${BACKEND_URL}/api/v1/bookings`, {
                method: "POST",
                headers: {
                    Cookie: cookieStore.toString(),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
                cache: "no-cache",
            });
            const data = await res.json();
            console.log("data", data);
            if (!res.ok) {
                return {
                    data: null,
                    error: {
                        message: data?.message || "Failed to create booking",
                    },
                };
            }
            return { data, error: null };
        } catch (error) {
            return { data: null, error: { message: "Something went wrong" } };
        }
    },

    getAllBookings: async function (paramsString = "") {
        try {
            const cookieStore = await cookies();
            const query = paramsString ? `${paramsString}` : "";
            const res = await fetch(`${BACKEND_URL}/api/v1/bookings?${query}`, {
                headers: { Cookie: cookieStore.toString() },
                cache: "no-store",
            });
            const data = await res.json();
            return { data, error: null };
        } catch (error) {
            return { data: null, error: { message: "Something went wrong" } };
        }
    },

    getMyBookings: async function (paramsString = "") {
        try {
            const cookieStore = await cookies();
            const query = paramsString ? `${paramsString}` : "";
            const res = await fetch(`${BACKEND_URL}/api/v1/bookings?${query}`, {
                headers: { Cookie: cookieStore.toString() },
                cache: "no-store",
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

    cancelBooking: async function (bookingId: string) {
        console.log("bookingId", bookingId);
        try {
            const cookieStore = await cookies();
            const res = await fetch(
                `${BACKEND_URL}/api/v1/bookings/${bookingId}/cancel`,
                {
                    method: "PATCH",
                    headers: { Cookie: cookieStore.toString() },
                    cache: "no-cache",
                },
            );
            const data = await res.json();
            if (!res.ok) {
                return {
                    data: null,
                    error: {
                        message: data?.message || "Failed to cancel booking",
                    },
                };
            }
            return { data, error: null };
        } catch (error) {
            return { data: null, error: { message: "Something went wrong" } };
        }
    },
};
