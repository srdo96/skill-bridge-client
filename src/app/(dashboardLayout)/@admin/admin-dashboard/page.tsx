import {
    BookOpen,
    CalendarCheck,
    GraduationCap,
    LayoutGrid,
    Shield,
    Star,
    Users,
    UserX,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardService } from "@/services/dashboard.service";

const stats = [
    {
        label: "Total Users",
        key: "totalUsers",
        icon: Users,
        description: "All registered users",
    },
    {
        label: "Active Users",
        key: "activeUsers",
        icon: Shield,
        description: "Currently active accounts",
    },
    {
        label: "Banned Users",
        key: "bannedUsers",
        icon: UserX,
        description: "Accounts with BAN status",
    },
    {
        label: "Tutors",
        key: "totalTutors",
        icon: GraduationCap,
        description: "Users with tutor profiles",
    },
    {
        label: "Students",
        key: "totalStudents",
        icon: Users,
        description: "Users with student role",
    },
    {
        label: "Categories",
        key: "totalCategories",
        icon: LayoutGrid,
        description: "Subject categories",
    },
    {
        label: "Subjects",
        key: "totalSubjects",
        icon: BookOpen,
        description: "All available subjects",
    },
    {
        label: "Bookings",
        key: "totalBookings",
        icon: CalendarCheck,
        description: "Total tutoring bookings",
    },
    {
        label: "Reviews",
        key: "totalReviews",
        icon: Star,
        description: "Submitted tutor reviews",
    },
];

export default async function AdminDashboard() {
    const { data, error } = await dashboardService.getDashboardData();
    const valueFor = (key: string) => (data ? data[key].toString() : "--");
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                    Overview of platform activity and management metrics.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.label}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {valueFor(stat.key)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {error
                                    ? "Failed to load stats"
                                    : stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
