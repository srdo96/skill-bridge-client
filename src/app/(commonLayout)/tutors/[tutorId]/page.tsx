import { Star } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { userService } from "@/services/user.service";
import { Availability, Review, TutorSubject } from "@/types";

type TutorDetailsPageProps = {
    params: Promise<{ tutorId: string }>;
};

export default async function TutorDetailsPage({
    params,
}: TutorDetailsPageProps) {
    const { tutorId } = await params;
    const { data, error } = await userService.getUserTutorById(tutorId);
    console.log("this is data", data);
    if (error || !data?.data) {
        return (
            <div className="space-y-4">
                <h1 className="text-2xl font-semibold">Tutor not found</h1>
                <p className="text-sm text-muted-foreground">
                    The tutor you are looking for does not exist or is no longer
                    available.
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
    const reviews: Review[] = profile?.reviews ?? [];
    const availabilities: Availability[] = profile?.availabilities ?? [];

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-4">
                    <Avatar className="h-20 w-20">
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
                            <h1 className="text-3xl font-semibold">
                                {tutor.name}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {tutor.email}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                            <div className="flex items-center gap-1 font-medium">
                                <Star className="h-4 w-4 text-yellow-500" />
                                {profile?.avg_rating ?? 0}
                                <span className="text-muted-foreground">
                                    ({reviews.length} reviews)
                                </span>
                            </div>
                            <Badge variant="secondary">{tutor.status}</Badge>
                        </div>
                        {subjects.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {subjects.map((subject: TutorSubject) => (
                                    <Badge
                                        key={subject.subject_id}
                                        variant="outline"
                                    >
                                        {subject.subject.name}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-base">
                            Book a session
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-3 text-sm">
                            <div>
                                <p className="text-muted-foreground">
                                    Hourly rate
                                </p>
                                <p className="text-lg font-semibold">
                                    ${profile?.hourly_rate ?? 0}/hr
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">
                                    Experience
                                </p>
                                <p className="font-medium">
                                    {profile?.year_of_experience ?? 0} years
                                </p>
                            </div>
                        </div>
                        <Button className="w-full">Request booking</Button>
                        <Button className="w-full" variant="outline" asChild>
                            <Link href="/tutors">Back to tutors</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            About the tutors
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-muted-foreground">Phone</p>
                                <p className="font-medium">
                                    {tutor.phone ?? "Not provided"}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">
                                    Member since
                                </p>
                                <p className="font-medium">
                                    {new Date(
                                        tutor.createdAt,
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <p className="text-muted-foreground">
                                Availability
                            </p>
                            {availabilities.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    Availability not set.
                                </p>
                            ) : (
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {availabilities.map(
                                        (slot: Availability) => (
                                            <div
                                                key={slot.availability_id}
                                                className="rounded-md border px-3 py-2"
                                            >
                                                <p className="font-medium">
                                                    {slot.day_of_week}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {slot.start_time} -{" "}
                                                    {slot.end_time}
                                                </p>
                                            </div>
                                        ),
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Subjects taught
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {subjects.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No subjects have been added yet.
                            </p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {subjects.map((subject: TutorSubject) => (
                                    <Badge
                                        key={subject.subject_id}
                                        variant="secondary"
                                    >
                                        {subject.subject.name}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {reviews.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No reviews yet.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review: Review) => (
                                <div
                                    key={review.review_id}
                                    className="space-y-2 rounded-md border px-4 py-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1 text-sm font-medium">
                                                <Star className="h-4 w-4 text-yellow-500" />
                                                {review.rating}
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                {review.student?.name ??
                                                    "Anonymous student"}
                                            </span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(
                                                review.created_at,
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {review.comment && (
                                        <p className="text-sm">
                                            {review.comment}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
