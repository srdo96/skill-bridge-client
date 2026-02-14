"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import { categoryService } from "@/services/category.service";

const categorySchema = z.object({
    name: z.string().min(1, "Category name is required").max(120),
    desc: z.string().max(500).optional(),
    img_url: z.url().optional(),
});

const subjectSchema = z.object({
    name: z.string().min(1, "Subject name is required").max(120),
    desc: z.string().max(500).optional(),
    img_url: z.url().optional(),
    category_id: z.string().uuid("Invalid category id"),
});

export const createCategory = async (payload: {
    name: string;
    desc?: string;
    img_url?: string;
}) => {
    const parsed = categorySchema.safeParse(payload);
    if (!parsed.success) {
        return {
            data: null,
            error: {
                message: parsed.error.issues[0]?.message ?? "Invalid data",
            },
        };
    }
    const { data, error } = await categoryService.createCategory(parsed.data);
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
    const parsed = subjectSchema.safeParse(payload);
    if (!parsed.success) {
        return {
            data: null,
            error: {
                message: parsed.error.issues[0]?.message ?? "Invalid data",
            },
        };
    }
    const { data, error } = await categoryService.createSubject(parsed.data);
    if (error) {
        return { data: null, error };
    }
    revalidatePath(
        "/admin-dashboard/categories-management/create-categories-subjects",
    );
    return { data, error: null };
};
