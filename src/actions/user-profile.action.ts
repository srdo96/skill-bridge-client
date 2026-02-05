"use server";

import { revalidatePath } from "next/cache";

import { userService } from "@/services/user.service";

export const updateUserProfile = async (payload: {
    name: string;
    phone?: string;
    image?: string;
}) => {
    const { data, error } = await userService.updateMyProfile(payload);
    if (error) {
        return { data: null, error };
    }
    revalidatePath("/tutor-profile");
    revalidatePath("/tutor-dashboard/tutor-profile");
    return { data, error: null };
};
