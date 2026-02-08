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
