"use server";

import { revalidatePath } from "next/cache";

import { bookingService } from "@/services/booking.service";

export const createBooking = async (payload: {
    tutor_profile_id: string;
    subject_id: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
}) => {
    const { data, error } = await bookingService.createBooking(payload);
    if (error) {
        return { data: null, error };
    }
    revalidatePath("/dashboard/bookings");
    return { data, error: null };
};

export const cancelBooking = async (bookingId: string) => {
    const { data, error } = await bookingService.cancelBooking(bookingId);
    if (error) {
        return { data: null, error };
    }
    revalidatePath("/dashboard/bookings");
    return { data, error: null };
};

export const completeBooking = async (bookingId: string) => {
    const { data, error } = await bookingService.completeBooking(bookingId);
    if (error) {
        return { data: null, error };
    }
    revalidatePath("/dashboard/bookings");
    revalidatePath("/tutor-dashboard");
    revalidatePath("/admin-dashboard/bookings-management");
    return { data, error: null };
};
