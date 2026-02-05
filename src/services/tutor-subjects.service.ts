import { env } from "@/env";
import { cookies } from "next/headers";

const BACKEND_URL = env.BACKEND_URL;

export const tutorSubjectsService = {
    addSubject: async function (payload: { subject_id: string }) {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${BACKEND_URL}/api/v1/tutor-subjects`, {
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
                        message: data?.message || "Failed to add subject",
                    },
                };
            }
            return { data, error: null };
        } catch (error) {
            return { data: null, error: { message: "Something went wrong" } };
        }
    },
    removeSubject: async function (subjectId: string) {
        try {
            const cookieStore = await cookies();

            const res = await fetch(
                `${BACKEND_URL}/api/v1/tutor-subjects/${subjectId}`,
                {
                    method: "DELETE",
                    headers: {
                        Cookie: cookieStore.toString(),
                    },
                },
            );

            if (res.status === 204) {
                return { data: null, error: null };
            }
            if (!res.ok) {
                const errorMsg = res.statusText || "Failed to remove subject";

                return {
                    data: null,
                    error: {
                        message: errorMsg,
                    },
                };
            }
            const data = await res.json();
            return { data, error: null };
        } catch (error) {
            return { data: null, error: { message: "Something went wrong" } };
        }
    },
};
