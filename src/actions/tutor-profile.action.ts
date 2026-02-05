"use server";

import { revalidatePath } from "next/cache";

import { tutorProfileService } from "@/services/tutor-profile.service";

export const createTutorProfile = async (payload: {
    hourly_rate: number;
    year_of_experience: number;
}) => {
    const { data, error } =
        await tutorProfileService.createTutorProfile(payload);
    if (error) {
        return { data: null, error };
    }
    revalidatePath("/tutor-profile");
    revalidatePath("/tutor-dashboard/tutor-profile");
    return { data, error: null };
};

export const updateTutorProfile = async (
    payload: {
        hourly_rate: number;
        year_of_experience: number;
    },
    tutor_profile_id: string,
) => {
    const { data, error } = await tutorProfileService.updateTutorProfile(
        payload,
        tutor_profile_id,
    );
    if (error) {
        return { data: null, error };
    }
    revalidatePath("/tutor-profile");
    revalidatePath("/tutor-dashboard/tutor-profile");
    return { data, error: null };
};
