"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import { userService } from "@/services/user.service";

const userIdSchema = z.string().min(10, "Invalid user id");

export const banUser = async (id: string) => {
    const parsed = userIdSchema.safeParse(id);
    if (!parsed.success) {
        return {
            data: null,
            error: {
                message: parsed.error.issues[0]?.message ?? "Invalid data",
            },
        };
    }

    const { data, error } = await userService.banUser(parsed.data);
    if (error) {
        return { data: null, error };
    }
    if (data) {
        revalidatePath("/admin-dashboard/users-management");
        return { data, error: null };
    }
    return { data: null, error: { message: "Failed to ban user" } };
};

export const unbanUser = async (id: string) => {
    const parsed = userIdSchema.safeParse(id);
    if (!parsed.success) {
        return {
            data: null,
            error: {
                message: parsed.error.issues[0]?.message ?? "Invalid data",
            },
        };
    }

    const { data, error } = await userService.unbanUser(parsed.data);
    if (error) {
        return { data: null, error };
    }
    if (data) {
        revalidatePath("/admin-dashboard/users-management");
        return { data, error: null };
    }
    return { data: null, error: { message: "Failed to unban user" } };
};
