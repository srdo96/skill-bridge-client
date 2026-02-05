"use server";

import { revalidatePath } from "next/cache";

import { tutorAvailabilityService } from "@/services/tutor-availability.service";

export const createAvailability = async (payload: {
    day_of_week: string;
    start_time: string;
    end_time: string;
}) => {
    const { data, error } =
        await tutorAvailabilityService.createAvailability(payload);
    if (error) {
        return { data: null, error };
    }
    revalidatePath("/tutor-dashboard/tutor-availability");
    return { data, error: null };
};

export const deleteAvailability = async (availabilityId: string) => {
    const { data, error } =
        await tutorAvailabilityService.deleteAvailability(availabilityId);
    if (error) {
        return { data: null, error };
    }
    revalidatePath("/tutor-dashboard/tutor-availability");
    return { data, error: null };
};
