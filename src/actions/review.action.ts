"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import { reviewService } from "@/services/review.service";

const reviewPayloadSchema = z.object({
    booking_id: z.string().uuid("Invalid booking id"),
    tutor_profile_id: z.string().uuid("Invalid tutor profile id"),
    rating: z.number().min(1).max(5),
    comment: z.string().max(500).nullable().optional(),
});

export const createReview = async (payload: {
    booking_id: string;
    tutor_profile_id: string;
    rating: number;
    comment?: string | null;
}) => {
    const parsed = reviewPayloadSchema.safeParse(payload);
    if (!parsed.success) {
        return {
            data: null,
            error: {
                message: parsed.error.issues[0]?.message ?? "Invalid data",
            },
        };
    }

    const { data, error } = await reviewService.createReview(parsed.data);
    if (error) {
        return { data: null, error };
    }
    revalidatePath("/dashboard/bookings");
    return { data, error: null };
};
