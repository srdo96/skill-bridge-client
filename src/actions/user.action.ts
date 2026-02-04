"use server";

import { userService } from "@/services/user.service";

export const banUser = async (id: string) => {
    const { data, error } = await userService.banUser(id);
    if (error) {
        return { data: null, error: error };
    }
    if (data) {
        return { data, error: null };
    }
};
