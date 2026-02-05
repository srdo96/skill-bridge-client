import { tutorProfileService } from "@/services/tutor-profile.service";
import { userService } from "@/services/user.service";
import { TutorProfile, User } from "@/types";
import { AccountProfileForm } from "./account-profile-form";

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

export default async function TutorAccountPage() {
    const profile = await getProfile();
    const { data } = await userService.getSession();
    const user = data?.user as User | undefined;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Tutor Account</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your account details and keep your information up to
                    date.
                </p>
            </div>
            {user && <AccountProfileForm user={user} />}
        </div>
    );
}
