import { subjectService } from "@/services/subject.service";
import { tutorProfileService } from "@/services/tutor-profile.service";
import { Availability, Subject, TutorProfile, TutorSubject } from "@/types";
import { AlertTriangle } from "lucide-react";
import { TutorAvailabilityForm } from "../tutor-availability/tutor-availability-form";
import { TutorSubjectsForm } from "../tutor-subjects/tutor-subjects-form";
import { TutorProfileForm } from "./tutor-profile-form";

async function getProfile(): Promise<TutorProfile | null> {
    const { data, error } = await tutorProfileService.getMyTutorProfile();
    if (!data?.success) {
        return null;
    }

    return data.data.tutorProfiles;
}

async function getSubjects(): Promise<Subject[]> {
    const { data, error } = await subjectService.getAllSubjects();
    if (error || !data) {
        return [];
    }
    return data.data ?? data;
}

export default async function TutorProfilePage() {
    const [profile, subjects] = await Promise.all([
        getProfile(),
        getSubjects(),
    ]);
    const tutorSubjects: TutorSubject[] = profile?.tutorSubjects ?? [];
    const availabilities: Availability[] = profile?.availabilities ?? [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Tutor Profile</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your profile details and keep your tutoring
                    information up to date.
                </p>
            </div>
            {!profile && (
                <div className="flex items-start gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900">
                    <AlertTriangle className="mt-0.5 h-4 w-4" />
                    <span>
                        Create your tutor profile to start receiving bookings.
                    </span>
                </div>
            )}

            <TutorProfileForm initialProfile={profile} />

            <div>
                <h2 className="text-xl font-semibold">Add Subject</h2>
                <p className="text-sm text-muted-foreground">
                    Add or remove subjects you can teach.
                </p>
            </div>
            <TutorSubjectsForm
                subjects={subjects}
                tutorSubjects={tutorSubjects}
            />

            <div>
                <h2 className="text-xl font-semibold">Add Availability</h2>
                <p className="text-sm text-muted-foreground">
                    Add and manage your weekly availability schedule.
                </p>
            </div>
            <TutorAvailabilityForm availabilities={availabilities} />
        </div>
    );
}
