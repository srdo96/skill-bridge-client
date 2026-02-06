import { AccountProfileForm } from "@/app/(dashboardLayout)/@tutor/tutor-dashboard/tutor-account/account-profile-form";
import { userService } from "@/services/user.service";
import { User } from "@/types";

export default async function StudentProfilePage() {
    const { data } = await userService.getSession();
    const user = data?.user as User | undefined;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Profile</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your account details and contact information.
                </p>
            </div>
            {user && <AccountProfileForm user={user} />}
        </div>
    );
}
