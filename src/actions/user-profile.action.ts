"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import { userService } from "@/services/user.service";

const updateProfileSchema = z.object({
    name: z.string().min(1, "Name is required").max(80),
    phone: z.string().min(7).max(20).optional(),
    image: z.url().optional(),
});

const userIdSchema = z.string().min(10, "Invalid user id");

export const updateUserProfile = async (
    payload: {
        name: string;
        phone?: string;
        image?: string;
    },
    user_id: string,
) => {
    const payloadParsed = updateProfileSchema.safeParse(payload);
    const idParsed = userIdSchema.safeParse(user_id);
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

    const { data, error } = await userService.updateMyProfile(
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
