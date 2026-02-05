"use server";

import { revalidatePath } from "next/cache";

import { tutorSubjectsService } from "@/services/tutor-subjects.service";

export const addTutorSubject = async (payload: { subject_id: string }) => {
    const { data, error } = await tutorSubjectsService.addSubject(payload);
    if (error) {
        return { data: null, error };
    }
    revalidatePath("/tutor-dashboard/tutor-subjects");
    return { data, error: null };
};

export const removeTutorSubject = async (subjectId: string) => {
    const { data, error } = await tutorSubjectsService.removeSubject(subjectId);
    if (error) {
        return { data: null, error };
    }
    revalidatePath("/tutor-dashboard/tutor-subjects");
    return { data, error: null };
};
