"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import { tutorProfileService } from "@/services/tutor-profile.service";

const tutorProfileSchema = z.object({
    hourly_rate: z.number().min(1, "Hourly rate must be greater than 0"),
    year_of_experience: z
        .number()
        .min(0, "Experience cannot be negative")
        .max(60, "Experience seems invalid"),
});

const tutorProfileIdSchema = z.string().uuid("Invalid tutor profile id");

export const createTutorProfile = async (payload: {
    hourly_rate: number;
    year_of_experience: number;
}) => {
    const parsed = tutorProfileSchema.safeParse(payload);
    if (!parsed.success) {
        return {
            data: null,
            error: {
                message: parsed.error.issues[0]?.message ?? "Invalid data",
            },
        };
    }

    const { data, error } = await tutorProfileService.createTutorProfile(
        parsed.data,
    );
    if (error) {
        return { data: null, error };
    }
    revalidatePath("/tutor-profile");
    revalidatePath("/tutor-dashboard/tutor-profile");
    return { data, error: null };
};

export const getMyTutorProfile = async () => {
    const { data, error } = await tutorProfileService.getMyTutorProfile();
    if (error) {
        return { data: null, error };
    }
    return { data, error: null };
};

export const updateTutorProfile = async (
    payload: {
        hourly_rate: number;
        year_of_experience: number;
    },
    tutor_profile_id: string,
) => {
    const payloadParsed = tutorProfileSchema.safeParse(payload);
    const idParsed = tutorProfileIdSchema.safeParse(tutor_profile_id);
    if (!payloadParsed.success || !idParsed.success) {
        return {
            data: null,
            error: {
                message:
                    payloadParsed.error?.issues[0]?.message ??
                    idParsed.error?.issues[0]?.message ??
                    "Invalid data",
            },
        };
    }

    const { data, error } = await tutorProfileService.updateTutorProfile(
        payloadParsed.data,
        idParsed.data,
    );
    if (error) {
        return { data: null, error };
    }
    revalidatePath("/tutor-profile");
    revalidatePath("/tutor-dashboard/tutor-profile");
    return { data, error: null };
};

export const setTutorFeatured = async (
    tutor_profile_id: string,
    is_featured: boolean,
) => {
    const idParsed = tutorProfileIdSchema.safeParse(tutor_profile_id);
    if (!idParsed.success) {
        return {
            data: null,
            error: {
                message: idParsed.error.issues[0]?.message ?? "Invalid data",
            },
        };
    }

    const { data, error } = await tutorProfileService.updateTutorProfile(
        { is_featured },
        idParsed.data,
    );
    if (error) {
        return { data: null, error };
    }
    revalidatePath("/admin-dashboard/users-management");
    return { data, error: null };
};
