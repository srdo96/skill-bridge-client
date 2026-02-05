import { tutorProfileService } from "@/services/tutor-profile.service";
import { userService } from "@/services/user.service";
import { TutorProfile, User } from "@/types";
import { TutorProfileForm } from "./tutor-profile-form";

async function getProfile(): Promise<TutorProfile | null> {
    const { data, error } = await tutorProfileService.getMyTutorProfile();
    if (error || !data) {
        return null;
    }
    if (data.data) {
        return data.data;
    }
    return data;
}

export default async function TutorProfilePage() {
    const profile = await getProfile();
    const { data } = await userService.getSession();
    const user = data?.user as User | undefined;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Tutor Profile</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your profile details and keep your tutoring
                    information up to date.
                </p>
            </div>

            <TutorProfileForm initialProfile={profile} />
        </div>
    );
}
