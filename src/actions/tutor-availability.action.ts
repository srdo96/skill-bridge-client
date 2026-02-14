"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import { tutorAvailabilityService } from "@/services/tutor-availability.service";

const availabilitySchema = z
    .object({
        day_of_week: z.string().min(1, "Day of week is required"),
        start_time: z.string().min(1, "Start time is required"),
        end_time: z.string().min(1, "End time is required"),
    })
    .refine((data) => data.end_time > data.start_time, {
        message: "End time must be after start time",
        path: ["end_time"],
    });

const availabilityIdSchema = z.string().uuid("Invalid availability id");

export const createAvailability = async (payload: {
    day_of_week: string;
    start_time: string;
    end_time: string;
}) => {
    const parsed = availabilitySchema.safeParse(payload);
    if (!parsed.success) {
        return {
            data: null,
            error: {
                message: parsed.error.issues[0]?.message ?? "Invalid data",
            },
        };
    }

    const { data, error } = await tutorAvailabilityService.createAvailability(
        parsed.data,
    );
    if (error) {
        return { data: null, error };
    }
    revalidatePath("/tutor-dashboard/tutor-availability");
    return { data, error: null };
};

export const deleteAvailability = async (availabilityId: string) => {
    const parsed = availabilityIdSchema.safeParse(availabilityId);
    if (!parsed.success) {
        return {
            data: null,
            error: {
                message: parsed.error.issues[0]?.message ?? "Invalid data",
            },
        };
    }

    const { data, error } = await tutorAvailabilityService.deleteAvailability(
        parsed.data,
    );
    if (error) {
        return { data: null, error };
    }
    revalidatePath("/tutor-dashboard/tutor-availability");
    return { data, error: null };
};
