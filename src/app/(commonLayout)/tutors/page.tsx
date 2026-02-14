import { Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { categoryService } from "@/services/category.service";
import { userService } from "@/services/user.service";
import { Category, User } from "@/types";
import Link from "next/link";
import TutorFilters from "./tutor-filters";

interface TutorsPageProps {
    searchParams: Promise<{
        search?: string;
        category?: string;
        minRating?: string;
        maxPrice?: string;
    }>;
}

export default async function TutorsPage({ searchParams }: TutorsPageProps) {
    const { search, category, minRating, maxPrice } = await searchParams;

    const params = new URLSearchParams(
        "role=TUTOR&status=ACTIVE&tutorProfiles=true",
    );
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (minRating) params.set("minRating", minRating);
    if (maxPrice) params.set("maxPrice", maxPrice);

    const [{ data }, { data: categoryData }] = await Promise.all([
        userService.getAllUser(params.toString()),
        categoryService.getAllCategories(),
    ]);
    console.log("Category Data", categoryData);

    const tutors: User[] = data?.data ?? [];
    const categories: Category[] = categoryData?.data ?? [];
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold">Browse Tutors</h1>
                <p className="text-sm text-muted-foreground">
                    Find the right tutor by subject, availability, and budget.
                </p>
            </div>

            <TutorFilters categories={categories} />

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
