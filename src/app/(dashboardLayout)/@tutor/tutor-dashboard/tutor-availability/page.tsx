import { tutorProfileService } from "@/services/tutor-profile.service";
import { Availability } from "@/types";
import { TutorAvailabilityForm } from "./tutor-availability-form";

async function getAvailabilities(): Promise<Availability[]> {
    const { data, error } = await tutorProfileService.getMyTutorProfile();
    if (error || !data) {
        return [];
    }
    const profile = data.data ?? data;
    return profile?.availabilities ?? [];
}

export default async function TutorAvailabilityPage() {
    const availabilities = await getAvailabilities();
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Tutor Availability</h1>
                <p className="text-sm text-muted-foreground">
                    Add and manage your weekly availability schedule.
                </p>
            </div>
            <TutorAvailabilityForm availabilities={availabilities} />
        </div>
    );
}
