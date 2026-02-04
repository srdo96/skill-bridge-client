"use server";

import { revalidatePath } from "next/cache";

import { userService } from "@/services/user.service";

export const banUser = async (id: string) => {
    const { data, error } = await userService.banUser(id);
    if (error) {
        return { data: null, error: error };
    }
    if (data) {
        revalidatePath("/admin-dashboard/users-management");
        return { data, error: null };
    }
};

export const unbanUser = async (id: string) => {
    const { data, error } = await userService.unbanUser(id);
    if (error) {
        return { data: null, error: error };
    }
    if (data) {
        revalidatePath("/admin-dashboard/users-management");
        return { data, error: null };
    }
};
