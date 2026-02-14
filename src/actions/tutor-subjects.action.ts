"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import { tutorSubjectsService } from "@/services/tutor-subjects.service";

const subjectPayloadSchema = z.object({
    subject_id: z.string().uuid("Invalid subject id"),
});

const subjectIdSchema = z.string().uuid("Invalid subject id");

export const addTutorSubject = async (payload: { subject_id: string }) => {
    const parsed = subjectPayloadSchema.safeParse(payload);
    if (!parsed.success) {
        return {
            data: null,
            error: {
                message: parsed.error.issues[0]?.message ?? "Invalid data",
            },
        };
    }
    const { data, error } = await tutorSubjectsService.addSubject(parsed.data);
    if (error) {
        return { data: null, error };
    }
    revalidatePath("/tutor-dashboard/tutor-subjects");
    return { data, error: null };
};

export const removeTutorSubject = async (subjectId: string) => {
    const parsed = subjectIdSchema.safeParse(subjectId);
    if (!parsed.success) {
        return {
            data: null,
            error: {
                message: parsed.error.issues[0]?.message ?? "Invalid data",
            },
        };
    }
    const { data, error } = await tutorSubjectsService.removeSubject(
        parsed.data,
    );
    if (error) {
        return { data: null, error };
    }
    revalidatePath("/tutor-dashboard/tutor-subjects");
    return { data, error: null };
};
