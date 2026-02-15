import {
    BookOpen,
    Calendar,
    Clock,
    DollarSign,
    GraduationCap,
    Search,
    Star,
    Users,
} from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { userService } from "@/services/user.service";
import { User } from "@/types";

import { Hero } from "@/components/modules/homePage/hero";
import { dashboardService } from "@/services/dashboard.service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
    const { data } = await userService.getAllUser(
        "role=TUTOR&status=ACTIVE&tutorProfiles=true&isFeatured=true",
    );
    const { data: stats } = await dashboardService.getHomePageStats();

    const featuredTutors: User[] = data?.data ?? [];
    const statsData = stats?.data ?? {};
    const {
        totalTutors = 0,
        totalSubjects = 0,
        totalSessionsCompleted = 0,
        totalStudents = 0,
    } = statsData;

    return (
        <div>
            {/* Hero */}
            <Hero
                heading="Find Your Perfect Tutor on SkillBridge"
                description="Connect with expert tutors, book personalized sessions, and master any subject at your own pace. Whether it's math, science, or languages — we've got you covered."
                buttons={{
                    primary: { text: "Browse Tutors", url: "/tutors" },
                    secondary: { text: "Get Started", url: "/register" },
                }}
            />

            {/* Stats Strip */}
            <section className="border-y bg-muted/50">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                        <div className="flex flex-col items-center gap-1 text-center">
                            <Users className="h-6 w-6 text-primary" />
                            <span className="text-2xl font-bold">
                                {totalTutors}+
                            </span>
                            <span className="text-sm text-muted-foreground">
                                Active Tutors
                            </span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-center">
                            <Users className="h-6 w-6 text-primary" />
                            <span className="text-2xl font-bold">
                                {totalStudents}+
                            </span>
                            <span className="text-sm text-muted-foreground">
                                Active Tutors
                            </span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-center">
                            <BookOpen className="h-6 w-6 text-primary" />
                            <span className="text-2xl font-bold">
                                {totalSubjects}+
                            </span>
                            <span className="text-sm text-muted-foreground">
                                Subjects
                            </span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-center">
                            <GraduationCap className="h-6 w-6 text-primary" />
                            <span className="text-2xl font-bold">
                                {totalSessionsCompleted}+
                            </span>
                            <span className="text-sm text-muted-foreground">
                                Sessions Completed
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Tutors */}
            <section className="py-16">
                <div className="container mx-auto px-4 space-y-10">
                    <div className="text-center space-y-2">
                        <Badge variant="secondary" className="mb-2">
                            <Star className="mr-1 h-3 w-3" />
                            Handpicked by SkillBridge
                        </Badge>
                        <h2 className="text-3xl font-bold">Featured Tutors</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Our top-rated tutors with outstanding track records
                            and proven results. Book a session and experience
                            the difference.
                        </p>
                    </div>

                    {featuredTutors.length === 0 ? (
                        <div className="text-center py-12 space-y-4">
                            <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
                            <p className="text-muted-foreground">
                                No featured tutors available right now. Check
                                back soon!
                            </p>
                            <Button asChild>
                                <Link href="/tutors">Browse All Tutors</Link>
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {featuredTutors.slice(0, 6).map((tutor) => {
                                    const profile = tutor.tutorProfiles;
                                    const initials = tutor.name
                                        .split(" ")
                                        .map((part) => part[0])
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase();

                                    return (
                                        <Card
                                            key={tutor.id}
                                            className="group relative overflow-hidden transition-shadow hover:shadow-lg"
                                        >
                                            {/* Featured ribbon */}
                                            <div className="absolute top-4 right-4">
                                                <Badge variant="warning">
                                                    <Star className="mr-1 h-3 w-3" />
                                                    Featured
                                                </Badge>
                                            </div>

                                            <CardHeader className="pb-2">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-14 w-14 border-2 border-primary/20">
                                                        <AvatarImage
                                                            src={
                                                                tutor.image ??
                                                                ""
                                                            }
                                                            alt={tutor.name}
                                                        />
                                                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                            {initials}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="space-y-1">
                                                        <CardTitle className="text-lg">
                                                            {tutor.name}
                                                        </CardTitle>
                                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                            <span className="font-medium text-foreground">
                                                                {Number(
                                                                    profile?.avg_rating ??
                                                                        0,
                                                                ).toFixed(1)}
                                                            </span>
                                                            <span>rating</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardHeader>

                                            <CardContent className="space-y-4">
                                                {/* Subjects */}
                                                {profile?.tutorSubjects &&
                                                    profile.tutorSubjects
                                                        .length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {profile.tutorSubjects
                                                                .slice(0, 4)
                                                                .map(
                                                                    (
                                                                        subject,
                                                                    ) => (
                                                                        <Badge
                                                                            key={
                                                                                subject.subject_id
                                                                            }
                                                                            variant="secondary"
                                                                            className="text-xs"
                                                                        >
                                                                            {
                                                                                subject
                                                                                    .subject
                                                                                    .name
                                                                            }
                                                                        </Badge>
                                                                    ),
                                                                )}
                                                            {profile
                                                                .tutorSubjects
                                                                .length > 4 && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs"
                                                                >
                                                                    +
                                                                    {profile
                                                                        .tutorSubjects
                                                                        .length -
                                                                        4}{" "}
                                                                    more
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    )}

                                                <Separator />

                                                {/* Stats */}
                                                <div className="grid grid-cols-2 gap-3 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="h-4 w-4 text-green-500" />
                                                        <div>
                                                            <p className="text-muted-foreground text-xs">
                                                                Rate
                                                            </p>
                                                            <p className="font-semibold">
                                                                $
                                                                {
                                                                    profile?.hourly_rate
                                                                }
                                                                /hr
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-blue-500" />
                                                        <div>
                                                            <p className="text-muted-foreground text-xs">
                                                                Experience
                                                            </p>
                                                            <p className="font-semibold">
                                                                {
                                                                    profile?.year_of_experience
                                                                }{" "}
                                                                yrs
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Availability preview */}
                                                {profile?.availabilities &&
                                                    profile.availabilities
                                                        .length > 0 && (
                                                        <div className="flex items-start gap-2 text-sm">
                                                            <Calendar className="h-4 w-4 mt-0.5 text-purple-500 shrink-0" />
                                                            <p className="text-muted-foreground leading-snug">
                                                                {profile.availabilities
                                                                    .slice(0, 3)
                                                                    .map(
                                                                        (a) =>
                                                                            a.day_of_week
                                                                                .charAt(
                                                                                    0,
                                                                                )
                                                                                .toUpperCase() +
                                                                            a.day_of_week
                                                                                .slice(
                                                                                    1,
                                                                                )
                                                                                .toLowerCase(),
                                                                    )
                                                                    .join(", ")}
                                                                {profile
                                                                    .availabilities
                                                                    .length >
                                                                    3 &&
                                                                    ` +${profile.availabilities.length - 3} more`}
                                                            </p>
                                                        </div>
                                                    )}
                                            </CardContent>

                                            <CardFooter>
                                                <Button
                                                    asChild
                                                    className="w-full"
                                                >
                                                    <Link
                                                        href={`/tutors/${tutor.id}`}
                                                    >
                                                        View Profile
                                                    </Link>
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    );
                                })}
                            </div>

                            {featuredTutors.length > 6 && (
                                <div className="text-center">
                                    <Button asChild variant="outline" size="lg">
                                        <Link href="/tutors">
                                            View All Tutors
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 bg-muted">
                <div className="container mx-auto px-4 space-y-10">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold">How It Works</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Getting started with SkillBridge is quick and easy.
                        </p>
                    </div>
                    <div className="grid gap-8 sm:grid-cols-3">
                        {[
                            {
                                step: "01",
                                icon: Search,
                                title: "Find a Tutor",
                                description:
                                    "Search by subject, availability, budget, or rating to find the perfect match.",
                            },
                            {
                                step: "02",
                                icon: Calendar,
                                title: "Book a Session",
                                description:
                                    "Pick a time slot that works for you and confirm your booking instantly.",
                            },
                            {
                                step: "03",
                                icon: GraduationCap,
                                title: "Start Learning",
                                description:
                                    "Join your session, learn from experts, and track your progress over time.",
                            },
                        ].map((item) => (
                            <div
                                key={item.step}
                                className="relative flex flex-col items-center text-center space-y-4 p-6"
                            >
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                    <item.icon className="h-7 w-7 text-primary" />
                                </div>
                                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                                    Step {item.step}
                                </span>
                                <h3 className="text-xl font-semibold">
                                    {item.title}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-16">
                <div className="container mx-auto px-4 space-y-10">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold">
                            Why Choose SkillBridge?
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            We make tutoring simple, transparent, and effective.
                        </p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                icon: Star,
                                title: "Verified Expert Tutors",
                                description:
                                    "Every tutor is vetted for expertise, teaching ability, and professionalism.",
                            },
                            {
                                icon: Calendar,
                                title: "Flexible Scheduling",
                                description:
                                    "Book sessions that fit your schedule — mornings, evenings, or weekends.",
                            },
                            {
                                icon: DollarSign,
                                title: "Transparent Pricing",
                                description:
                                    "See hourly rates upfront. No hidden fees, no surprises.",
                            },
                            {
                                icon: BookOpen,
                                title: "Wide Subject Range",
                                description:
                                    "From math and science to languages and test prep — find your subject.",
                            },
                            {
                                icon: Users,
                                title: "Personalized Learning",
                                description:
                                    "One-on-one sessions tailored to your learning style and goals.",
                            },
                            {
                                icon: GraduationCap,
                                title: "Track Your Progress",
                                description:
                                    "Review past sessions, ratings, and feedback all in one dashboard.",
                            },
                        ].map((feature) => (
                            <Card
                                key={feature.title}
                                className="text-center transition-shadow hover:shadow-md"
                            >
                                <CardContent className="pt-6 space-y-3">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                        <feature.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-semibold">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 text-center space-y-6">
                    <h2 className="text-3xl font-bold">
                        Ready to Start Learning?
                    </h2>
                    <p className="max-w-xl mx-auto text-primary-foreground/80">
                        Join thousands of students who are already learning with
                        SkillBridge. Sign up today and book your first session.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Button
                            asChild
                            size="lg"
                            variant="secondary"
                            className="w-full sm:w-auto"
                        >
                            <Link href="/register">Sign Up Free</Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                        >
                            <Link href="/tutors">Browse Tutors</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
