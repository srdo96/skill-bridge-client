import Link from "next/link";
import { redirect } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Roles } from "@/constants/roles";
import { userService } from "@/services/user.service";
import { Availability, TutorSubject } from "@/types";
import { BookingForm } from "./booking-form";

type BookingPageProps = {
    params: Promise<{ tutorId: string }>;
};

export default async function BookingPage({ params }: BookingPageProps) {
    const { tutorId } = await params;
    const { data: session } = await userService.getSession();

    if (!session?.user) {
        redirect("/login");
    }

    if (session.user.role !== Roles.student) {
        return (
            <div className="space-y-4">
                <h1 className="text-2xl font-semibold">Booking unavailable</h1>
                <p className="text-sm text-muted-foreground">
                    Only students can create tutoring bookings.
                </p>
                <Button asChild variant="outline">
                    <Link href="/tutors">Back to tutors</Link>
                </Button>
            </div>
        );
    }

    const { data, error } = await userService.getUserTutorById(tutorId);
    if (error || !data?.data) {
        return (
            <div className="space-y-4">
                <h1 className="text-2xl font-semibold">Tutor not found</h1>
                <p className="text-sm text-muted-foreground">
                    The tutor you are trying to book is not available.
                </p>
                <Button asChild variant="outline">
                    <Link href="/tutors">Back to tutors</Link>
                </Button>
            </div>
        );
    }

    const tutor = data.data;
    const profile = tutor.tutorProfiles;
    const subjects: TutorSubject[] = profile?.tutorSubjects ?? [];
    const availabilities: Availability[] = profile?.availabilities ?? [];

    if (!profile) {
        return (
            <div className="space-y-4">
                <h1 className="text-2xl font-semibold">Profile missing</h1>
                <p className="text-sm text-muted-foreground">
                    This tutor has not completed a tutor profile yet.
                </p>
                <Button asChild variant="outline">
                    <Link href="/tutors">Back to tutors</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={tutor.image ?? ""} alt={tutor.name} />
                        <AvatarFallback>
                            {tutor.name
                                .split(" ")
                                .map((part: string) => part[0])
                                .join("")
                                .slice(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-semibold">
                                Book {tutor.name}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Choose a subject and a time slot.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {subjects.map((subject) => (
                                <Badge
                                    key={subject.subject_id}
                                    variant="secondary"
                                >
                                    {subject.subject.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
                <Button variant="outline" asChild>
                    <Link href={`/tutors/${tutor.id}`}>Back to profile</Link>
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <BookingForm
                    tutorProfileId={profile.tutor_profile_id}
                    tutorName={tutor.name}
                    hourlyRate={profile.hourly_rate ?? 0}
                    subjects={subjects}
                    availabilities={availabilities}
                />

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Tutor summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Hourly rate</p>
                            <p className="text-lg font-semibold">
                                ${profile.hourly_rate ?? 0}/hr
                            </p>
                        </div>
                        <Separator />
                        <div>
                            <p className="text-muted-foreground">Experience</p>
                            <p className="font-medium">
                                {profile.year_of_experience ?? 0} years
                            </p>
                        </div>
                        <Separator />
                        <div>
                            <p className="text-muted-foreground">
                                Availability slots
                            </p>
                            <p className="font-medium">
                                {availabilities.length} slots
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
