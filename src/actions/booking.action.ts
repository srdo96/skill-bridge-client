"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import { bookingService } from "@/services/booking.service";

const bookingPayloadSchema = z.object({
    tutor_profile_id: z.string().uuid("Invalid tutor profile id"),
    subject_id: z.string().uuid("Invalid subject id"),
    day_of_week: z.string().min(1, "Day of week is required"),
    start_time: z.string().min(1, "Start time is required"),
    end_time: z.string().min(1, "End time is required"),
});

const bookingIdSchema = z.string().uuid("Invalid booking id");

export const createBooking = async (payload: {
    tutor_profile_id: string;
    subject_id: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
}) => {
    const parsed = bookingPayloadSchema.safeParse(payload);
    if (!parsed.success) {
        return {
            data: null,
            error: {
                message: parsed.error.issues[0]?.message ?? "Invalid data",
            },
        };
    }

    const { data, error } = await bookingService.createBooking(parsed.data);
    if (error) {
        return { data: null, error };
    }
    revalidatePath("/dashboard/bookings");
    return { data, error: null };
};

export const cancelBooking = async (bookingId: string) => {
    const parsed = bookingIdSchema.safeParse(bookingId);
    if (!parsed.success) {
        return {
            data: null,
            error: {
                message: parsed.error.issues[0]?.message ?? "Invalid data",
            },
        };
    }

    const { data, error } = await bookingService.cancelBooking(parsed.data);
    if (error) {
        return { data: null, error };
    }
    revalidatePath("/dashboard/bookings");
    return { data, error: null };
};

export const completeBooking = async (bookingId: string) => {
    const parsed = bookingIdSchema.safeParse(bookingId);
    if (!parsed.success) {
        return {
            data: null,
            error: {
                message: parsed.error.issues[0]?.message ?? "Invalid data",
            },
        };
    }

    const { data, error } = await bookingService.completeBooking(parsed.data);
    if (error) {
        return { data: null, error };
    }
    revalidatePath("/dashboard/bookings");
    revalidatePath("/tutor-dashboard");
    revalidatePath("/admin-dashboard/bookings-management");
    return { data, error: null };
};
