import {
    ArrowLeft,
    BadgeCheck,
    Ban,
    BookOpen,
    Calendar,
    CalendarDays,
    CheckCircle,
    Clock,
    DollarSign,
    ExternalLink,
    Mail,
    MessageSquare,
    Phone,
    Shield,
    Star,
    XCircle,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { userService } from "@/services/user.service";
import {
    Availability,
    Booking,
    BookingStatus,
    Days,
    Review,
    TutorSubject,
    User,
    UserRoles,
    UserStatus,
} from "@/types";

interface UserDetailsPageProps {
    params: Promise<{ id: string }>;
}

async function getUserData(id: string): Promise<User | null> {
    const { data, error } = await userService.getUserById(id);

    if (error || !data) {
        return null;
    }

    // Handle nested response structure
    if (data.data) {
        return data.data;
    }

    return data;
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

function getRoleBadgeVariant(role: UserRoles) {
    switch (role) {
        case UserRoles.ADMIN:
            return "destructive";
        case UserRoles.TUTOR:
            return "default";
        case UserRoles.STUDENT:
            return "secondary";
        default:
            return "outline";
    }
}

function getStatusBadgeVariant(status: UserStatus) {
    return status === UserStatus.ACTIVE ? "success" : "destructive";
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default async function UserDetailsPage({
    params,
}: UserDetailsPageProps) {
    const { id } = await params;
    const user = await getUserData(id);
    console.log(user);
    if (!user) {
        notFound();
    }

    const isTutor = user.role === UserRoles.TUTOR;
    const tutorProfile = user.tutorProfiles;
    console.log({ tutorProfile });
    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Back Button */}
            <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" asChild>
                    <Link href="/admin-dashboard/users-management">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Users
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* User Profile Card */}
                <Card className="md:col-span-1">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage
                                    src={user.image || undefined}
                                    alt={user.name}
                                />
                                <AvatarFallback className="text-2xl">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <CardTitle className="text-xl">{user.name}</CardTitle>
                        <CardDescription className="flex items-center justify-center gap-2">
                            <Mail className="h-4 w-4" />
                            {user.email}
                        </CardDescription>
                        <div className="flex justify-center gap-2 mt-3">
                            <Badge variant={getRoleBadgeVariant(user.role)}>
                                <Shield className="mr-1 h-3 w-3" />
                                {user.role}
                            </Badge>
                            <Badge variant={getStatusBadgeVariant(user.status)}>
                                {user.status === UserStatus.ACTIVE ? (
                                    <BadgeCheck className="mr-1 h-3 w-3" />
                                ) : (
                                    <Ban className="mr-1 h-3 w-3" />
                                )}
                                {user.status}
                            </Badge>
                        </div>
                    </CardHeader>
                </Card>

                {/* User Details Card */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>User Information</CardTitle>
                        <CardDescription>
                            Detailed information about the user
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <InfoItem
                                icon={<Mail className="h-4 w-4" />}
                                label="Email"
                                value={user.email}
                            />
                            <InfoItem
                                icon={<Phone className="h-4 w-4" />}
                                label="Phone"
                                value={user.phone || "Not provided"}
                            />
                            <InfoItem
                                icon={<BadgeCheck className="h-4 w-4" />}
                                label="Email Verified"
                                value={user.emailVerified ? "Yes" : "No"}
                            />
                            <InfoItem
                                icon={<Shield className="h-4 w-4" />}
                                label="User ID"
                                value={user.id}
                                className="font-mono text-xs"
                            />
                        </div>

                        <Separator />

                        <div className="grid gap-4 sm:grid-cols-2">
                            <InfoItem
                                icon={<Calendar className="h-4 w-4" />}
                                label="Created At"
                                value={formatDate(user.createdAt)}
                            />
                            <InfoItem
                                icon={<Calendar className="h-4 w-4" />}
                                label="Updated At"
                                value={formatDate(user.updatedAt)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Tutor Profile Card (only for tutors) */}
                {isTutor && tutorProfile && (
                    <Card className="md:col-span-3">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-yellow-500" />
                                Tutor Profile
                            </CardTitle>
                            <CardDescription>
                                Tutor-specific information and statistics
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                <StatCard
                                    icon={
                                        <DollarSign className="h-5 w-5 text-green-500" />
                                    }
                                    label="Hourly Rate"
                                    value={`$${Number(tutorProfile.hourly_rate).toFixed(2)}`}
                                />
                                <StatCard
                                    icon={
                                        <Clock className="h-5 w-5 text-blue-500" />
                                    }
                                    label="Years of Experience"
                                    value={`${tutorProfile.year_of_experience} years`}
                                />
                                <StatCard
                                    icon={
                                        <Star className="h-5 w-5 text-yellow-500" />
                                    }
                                    label="Average Rating"
                                    value={`${Number(tutorProfile.avg_rating).toFixed(1)} / 5.0`}
                                />
                                <StatCard
                                    icon={
                                        <Calendar className="h-5 w-5 text-purple-500" />
                                    }
                                    label="Profile Created"
                                    value={new Date(
                                        tutorProfile.created_at,
                                    ).toLocaleDateString()}
                                />
                            </div>

                            <Separator className="my-6" />

                            <div className="text-sm text-muted-foreground">
                                <span className="font-medium">
                                    Profile ID:{" "}
                                </span>
                                <span className="font-mono">
                                    {tutorProfile.tutor_profile_id}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Tutor Subjects Card (only for tutors with subjects) */}
                {isTutor &&
                    tutorProfile?.tutorSubjects &&
                    tutorProfile.tutorSubjects.length > 0 && (
                        <Card className="md:col-span-3">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-indigo-500" />
                                    Teaching Subjects
                                </CardTitle>
                                <CardDescription>
                                    Subjects this tutor teaches
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <SubjectsList
                                    subjects={tutorProfile.tutorSubjects}
                                />
                            </CardContent>
                        </Card>
                    )}

                {/* Availability Card (only for tutors with availability) */}
                {isTutor &&
                    tutorProfile?.availabilities &&
                    tutorProfile.availabilities.length > 0 && (
                        <Card className="md:col-span-3">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CalendarDays className="h-5 w-5 text-blue-500" />
                                    Weekly Availability
                                </CardTitle>
                                <CardDescription>
                                    Tutor&apos;s available time slots for each
                                    day
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AvailabilitySchedule
                                    availabilities={tutorProfile.availabilities}
                                />
                            </CardContent>
                        </Card>
                    )}

                {/* Reviews Card (only for tutors with reviews) */}
                {isTutor &&
                    tutorProfile?.reviews &&
                    tutorProfile.reviews.length > 0 && (
                        <Card className="md:col-span-3">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5 text-amber-500" />
                                    Reviews ({tutorProfile.reviews.length})
                                </CardTitle>
                                <CardDescription>
                                    Student reviews and ratings
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ReviewsList reviews={tutorProfile.reviews} />
                            </CardContent>
                        </Card>
                    )}

                {/* Bookings Card (only for tutors with bookings) */}
                {isTutor &&
                    tutorProfile?.bookings &&
                    tutorProfile.bookings.length > 0 && (
                        <Card className="md:col-span-3">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-teal-500" />
                                    Bookings ({tutorProfile.bookings.length})
                                </CardTitle>
                                <CardDescription>
                                    Tutor&apos;s booking history
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <BookingsList
                                    bookings={tutorProfile.bookings}
                                />
                            </CardContent>
                        </Card>
                    )}
            </div>
        </div>
    );
}

function InfoItem({
    icon,
    label,
    value,
    className,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    className?: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="text-muted-foreground mt-0.5">{icon}</div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">
                    {label}
                </p>
                <p className={className}>{value}</p>
            </div>
        </div>
    );
}

function StatCard({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="rounded-full bg-muted p-2">{icon}</div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">
                    {label}
                </p>
                <p className="text-lg font-semibold">{value}</p>
            </div>
        </div>
    );
}

// Day order for sorting
const DAY_ORDER: Days[] = [
    Days.SATURDAY,
    Days.SUNDAY,
    Days.MONDAY,
    Days.TUESDAY,
    Days.WEDNESDAY,
    Days.THURSDAY,
    Days.FRIDAY,
];

function formatTime(time: string): string {
    // Handle both "HH:mm" and "HH:mm:ss" formats
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
}

function getDayColor(day: Days): string {
    const colors: Record<Days, string> = {
        [Days.SATURDAY]:
            "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
        [Days.SUNDAY]:
            "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        [Days.MONDAY]:
            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        [Days.TUESDAY]:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        [Days.WEDNESDAY]:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        [Days.THURSDAY]:
            "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
        [Days.FRIDAY]:
            "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
    };
    return colors[day];
}

function AvailabilitySchedule({
    availabilities,
}: {
    availabilities: Availability[];
}) {
    // Group availabilities by day
    const groupedByDay = availabilities.reduce(
        (acc, availability) => {
            const day = availability.day_of_week;
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(availability);
            return acc;
        },
        {} as Record<Days, Availability[]>,
    );

    // Sort time slots within each day
    Object.keys(groupedByDay).forEach((day) => {
        groupedByDay[day as Days].sort((a, b) =>
            a.start_time.localeCompare(b.start_time),
        );
    });

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {DAY_ORDER.map((day) => {
                const slots = groupedByDay[day];
                if (!slots || slots.length === 0) return null;

                return (
                    <div key={day} className="rounded-lg border p-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <Badge
                                className={getDayColor(day)}
                                variant="outline"
                            >
                                {day.charAt(0) + day.slice(1).toLowerCase()}
                            </Badge>
                        </div>
                        <div className="space-y-2">
                            {slots.map((slot) => (
                                <div
                                    key={slot.availability_id}
                                    className="flex items-center gap-2 text-sm"
                                >
                                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span>
                                        {formatTime(slot.start_time)} -{" "}
                                        {formatTime(slot.end_time)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function SubjectsList({ subjects }: { subjects: TutorSubject[] }) {
    return (
        <div className="flex flex-wrap gap-2">
            {subjects.map((tutorSubject) => (
                <Badge
                    key={tutorSubject.subject_id}
                    variant="secondary"
                    className="px-3 py-1 text-sm"
                >
                    <BookOpen className="mr-1.5 h-3.5 w-3.5" />
                    {tutorSubject?.subject?.name}
                </Badge>
            ))}
        </div>
    );
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`h-4 w-4 ${
                        star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                    }`}
                />
            ))}
        </div>
    );
}

function ReviewsList({ reviews }: { reviews: Review[] }) {
    // Sort reviews by date (newest first)
    const sortedReviews = [...reviews].sort(
        (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    return (
        <div className="space-y-4">
            {sortedReviews.map((review) => (
                <div
                    key={review.review_id}
                    className="rounded-lg border p-4 space-y-3"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage
                                    src={review.student?.image || undefined}
                                    alt={review.student?.name || "Student"}
                                />
                                <AvatarFallback>
                                    {review.student?.name
                                        ?.split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()
                                        .slice(0, 2) || "ST"}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">
                                    {review.student?.name ||
                                        "Anonymous Student"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(
                                        review.created_at,
                                    ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                        <StarRating rating={review.rating} />
                    </div>
                    {review.comment && (
                        <p className="text-sm text-muted-foreground">
                            {review.comment}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}

function getBookingStatusVariant(status: BookingStatus) {
    switch (status) {
        case BookingStatus.CONFIRMED:
            return "default";
        case BookingStatus.COMPLETED:
            return "success";
        case BookingStatus.CANCELLED:
            return "destructive";
        default:
            return "outline";
    }
}

function getBookingStatusIcon(status: BookingStatus) {
    switch (status) {
        case BookingStatus.CONFIRMED:
            return <Clock className="mr-1 h-3 w-3" />;
        case BookingStatus.COMPLETED:
            return <CheckCircle className="mr-1 h-3 w-3" />;
        case BookingStatus.CANCELLED:
            return <XCircle className="mr-1 h-3 w-3" />;
        default:
            return null;
    }
}

function BookingsList({ bookings }: { bookings: Booking[] }) {
    // Sort bookings by date (newest first)
    const sortedBookings = [...bookings].sort(
        (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    return (
        <div className="space-y-4">
            {sortedBookings.map((booking) => (
                <div
                    key={booking.booking_id}
                    className="rounded-lg border p-4 space-y-3"
                >
                    <div className="flex items-start justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage
                                    src={booking.student?.image || undefined}
                                    alt={booking.student?.name || "Student"}
                                />
                                <AvatarFallback>
                                    {booking.student?.name
                                        ?.split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()
                                        .slice(0, 2) || "ST"}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">
                                    {booking.student?.name || "Student"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {booking.student?.email}
                                </p>
                            </div>
                        </div>
                        <Badge
                            variant={getBookingStatusVariant(booking.status)}
                        >
                            {getBookingStatusIcon(booking.status)}
                            {booking.status}
                        </Badge>
                    </div>

                    <Separator />

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <span>
                                {booking.subject?.name || "Subject N/A"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge
                                className={getDayColor(booking.day_of_week)}
                                variant="outline"
                            >
                                {booking.day_of_week.charAt(0) +
                                    booking.day_of_week.slice(1).toLowerCase()}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>
                                {formatTime(booking.start_time)} -{" "}
                                {formatTime(booking.end_time)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span className="font-semibold">
                                ${Number(booking.price).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {booking.meeting_link && (
                        <div className="flex items-center gap-2 text-sm">
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            <a
                                href={booking.meeting_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline truncate"
                            >
                                {booking.meeting_link}
                            </a>
                        </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                        Booked on:{" "}
                        {new Date(booking.created_at).toLocaleDateString(
                            "en-US",
                            {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            },
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
