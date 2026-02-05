import { env } from "@/env";
import { cookies } from "next/headers";

const BACKEND_URL = env.BACKEND_URL;

export const tutorAvailabilityService = {
    createAvailability: async function (payload: {
        day_of_week: string;
        start_time: string;
        end_time: string;
    }) {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${BACKEND_URL}/api/v1/availabilities`, {
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
                        message:
                            data?.message || "Failed to create availability",
                    },
                };
            }
            return { data, error: null };
        } catch (error) {
            return { data: null, error: { message: "Something went wrong" } };
        }
    },
    deleteAvailability: async function (availabilityId: string) {
        try {
            const cookieStore = await cookies();
            const res = await fetch(
                `${BACKEND_URL}/api/v1/availabilities/${availabilityId}`,
                {
                    method: "DELETE",
                    headers: { Cookie: cookieStore.toString() },
                },
            );
            const data = await res.json();
            if (!res.ok) {
                return {
                    data: null,
                    error: {
                        message:
                            data?.message || "Failed to delete availability",
                    },
                };
            }
            return { data, error: null };
        } catch (error) {
            return { data: null, error: { message: "Something went wrong" } };
        }
    },
};
