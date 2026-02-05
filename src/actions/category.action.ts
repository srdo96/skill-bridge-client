"use server";

import { revalidatePath } from "next/cache";

import { categoryService } from "@/services/category.service";

export const createCategory = async (payload: {
    name: string;
    desc?: string;
    img_url?: string;
}) => {
    const { data, error } = await categoryService.createCategory(payload);
    if (error) {
        return { data: null, error };
    }
    revalidatePath("/admin-dashboard/categories-management");
    return { data, error: null };
};

export const createSubject = async (payload: {
    name: string;
    desc?: string;
    img_url?: string;
    category_id: string;
}) => {
    const { data, error } = await categoryService.createSubject(payload);
    if (error) {
        return { data: null, error };
    }
    revalidatePath(
        "/admin-dashboard/categories-management/create-categories-subjects",
    );
    return { data, error: null };
};
