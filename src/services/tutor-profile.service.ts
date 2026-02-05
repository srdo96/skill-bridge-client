import { env } from "@/env";
import { cookies } from "next/headers";

const BACKEND_URL = env.BACKEND_URL;

export const tutorProfileService = {
    getMyTutorProfile: async function () {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${BACKEND_URL}/api/v1/tutors/my-profile`, {
                headers: { Cookie: cookieStore.toString() },
                cache: "no-cache",
            });
            const data = await res.json();

            if (!res.ok) {
                return {
                    data: null,
                    error: {
                        message: data?.message || "Failed to load profile",
                    },
                };
            }

            return {
                data: data?.data?.tutorProfiles?.availabilities ?? [],
                error: null,
            };
        } catch (error) {
            return { data: null, error: { message: "Something went wrong" } };
        }
    },
    createTutorProfile: async function (payload: {
        hourly_rate: number;
        year_of_experience: number;
    }) {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${BACKEND_URL}/api/v1/tutor-profiles`, {
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
                        message: data?.message || "Failed to create profile",
                    },
                };
            }
            return { data, error: null };
        } catch (error) {
            return { data: null, error: { message: "Something went wrong" } };
        }
    },
    updateTutorProfile: async function (payload: {
        hourly_rate: number;
        year_of_experience: number;
    }) {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${BACKEND_URL}/api/v1/tutor-profiles/me`, {
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
