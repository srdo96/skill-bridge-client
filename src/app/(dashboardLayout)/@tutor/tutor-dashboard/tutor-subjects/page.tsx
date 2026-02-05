import { subjectService } from "@/services/subject.service";
import { tutorProfileService } from "@/services/tutor-profile.service";
import { Subject, TutorSubject } from "@/types";
import { TutorSubjectsForm } from "./tutor-subjects-form";

async function getSubjects(): Promise<Subject[]> {
    const { data, error } = await subjectService.getAllSubjects();
    if (error || !data) {
        return [];
    }
    return data.data ?? data;
}

async function getTutorSubjects(): Promise<TutorSubject[]> {
    const { data, error } = await tutorProfileService.getMyTutorProfile();
    if (error || !data) {
        return [];
    }

    const profile = data.data ?? data;
    return profile?.tutorProfiles?.tutorSubjects ?? [];
}

export default async function TutorSubjectsPage() {
    const [subjects, tutorSubjects] = await Promise.all([
        getSubjects(),
        getTutorSubjects(),
    ]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Tutor Subjects</h1>
                <p className="text-sm text-muted-foreground">
                    Add or remove subjects you can teach.
                </p>
            </div>
            <TutorSubjectsForm
                subjects={subjects}
                tutorSubjects={tutorSubjects}
            />
        </div>
    );
}
