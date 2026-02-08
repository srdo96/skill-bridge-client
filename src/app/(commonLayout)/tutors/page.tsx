import { Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { userService } from "@/services/user.service";
import { User } from "@/types";
import Link from "next/link";

export default async function TutorsPage() {
    const { data, error } = await userService.getAllUser(
        "role=TUTOR&status=ACTIVE&tutorProfiles=true",
    );
    console.log("datasss", data);
    const tutors: User[] = data.data;
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold">Browse Tutors</h1>
                <p className="text-sm text-muted-foreground">
                    Find the right tutor by subject, availability, and budget.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Input placeholder="Search by name or subject" />
                        <Input placeholder="Subject (e.g. Math)" />
                        <Input placeholder="Min rating (e.g. 4.5)" />
                        <Input placeholder="Max price (e.g. 25)" />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {["Weekdays", "Weekend", "Morning", "Evening"].map(
                            (label) => (
                                <Badge key={label} variant="secondary">
                                    {label}
                                </Badge>
                            ),
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button type="button">Apply Filters</Button>
                        <Button type="button" variant="outline">
                            Reset
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing {tutors.length} tutors
                </p>
                <Button variant="outline">Sort by Rating</Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {tutors?.map((tutor: any) => (
                    <Card key={tutor.id} className="h-full">
                        <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage
                                            src={tutor?.image ?? ""}
                                            alt={tutor.name}
                                        />
                                        <AvatarFallback>
                                            {tutor.name
                                                .split(" ")
                                                .map((part: any) => part[0])
                                                .join("")
                                                .slice(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-lg">
                                            {tutor.name}
                                        </CardTitle>
                                        {/* <p className="text-sm text-muted-foreground">
                                            {tutor.title}
                                        </p> */}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-sm font-medium">
                                        <Star className="h-4 w-4 text-yellow-500" />
                                        {tutor.tutorProfiles?.avg_rating}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {tutor.reviews} reviews
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                {/* {tutor?.bio ?? ""} */}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {tutor.tutorProfiles?.tutorSubjects.map(
                                    (subject: any) => (
                                        <Badge
                                            key={subject.subject_id}
                                            variant="secondary"
                                        >
                                            {subject.subject.name}
                                        </Badge>
                                    ),
                                )}
                            </div>
                            <Separator />
                            <div className="grid gap-3 text-sm sm:grid-cols-2">
                                <div>
                                    <p className="text-muted-foreground">
                                        Hourly rate
                                    </p>
                                    <p className="font-medium">
                                        ${tutor.tutorProfiles?.hourly_rate}/hr
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">
                                        Availability
                                    </p>
                                    <p className="font-medium">
                                        {tutor?.tutorProfiles?.availabilities
                                            .map(
                                                (availability: any) =>
                                                    availability.day_of_week,
                                            )
                                            .join(", ")}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button asChild className="flex-1">
                                    <Link href={`/tutors/${tutor.id}`}>
                                        View Profile
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
