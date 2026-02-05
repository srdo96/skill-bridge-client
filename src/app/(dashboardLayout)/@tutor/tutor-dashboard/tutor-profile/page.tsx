import { tutorProfileService } from "@/services/tutor-profile.service";
import { TutorProfile } from "@/types";
import { AlertTriangle } from "lucide-react";
import { TutorProfileForm } from "./tutor-profile-form";

async function getProfile(): Promise<TutorProfile | null> {
    const { data, error } = await tutorProfileService.getMyTutorProfile();
    console.log({ data, error });
    if (!data?.success) {
        return null;
    }

    return data.data.tutorProfiles;
}

export default async function TutorProfilePage() {
    const profile = await getProfile();

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
        </div>
    );
}
