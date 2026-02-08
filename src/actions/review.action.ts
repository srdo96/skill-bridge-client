"use server";

import { revalidatePath } from "next/cache";

import { reviewService } from "@/services/review.service";

export const createReview = async (payload: {
    booking_id: string;
    tutor_profile_id: string;
    rating: number;
    comment?: string | null;
}) => {
    const { data, error } = await reviewService.createReview(payload);
    if (error) {
        return { data: null, error };
    }
    revalidatePath("/dashboard/bookings");
    return { data, error: null };
};
