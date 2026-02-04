import {
    ArrowLeft,
    BadgeCheck,
    Ban,
    Calendar,
    Clock,
    DollarSign,
    Mail,
    Phone,
    Shield,
    Star,
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
import { User, UserRoles, UserStatus } from "@/types";

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

    if (!user) {
        notFound();
    }

    const isTutor = user.role === UserRoles.TUTOR;
    const tutorProfile = user.tutorProfiles;

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
