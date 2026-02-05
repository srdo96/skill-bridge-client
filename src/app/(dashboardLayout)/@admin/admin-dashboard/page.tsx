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

const stats = [
    {
        label: "Total Users",
        value: "--",
        icon: Users,
        description: "All registered users",
    },
    {
        label: "Active Users",
        value: "--",
        icon: Shield,
        description: "Currently active accounts",
    },
    {
        label: "Banned Users",
        value: "--",
        icon: UserX,
        description: "Accounts with BAN status",
    },
    {
        label: "Tutors",
        value: "--",
        icon: GraduationCap,
        description: "Users with tutor profiles",
    },
    {
        label: "Students",
        value: "--",
        icon: Users,
        description: "Users with student role",
    },
    {
        label: "Categories",
        value: "--",
        icon: LayoutGrid,
        description: "Subject categories",
    },
    {
        label: "Subjects",
        value: "--",
        icon: BookOpen,
        description: "All available subjects",
    },
    {
        label: "Bookings",
        value: "--",
        icon: CalendarCheck,
        description: "Total tutoring bookings",
    },
    {
        label: "Reviews",
        value: "--",
        icon: Star,
        description: "Submitted tutor reviews",
    },
];

export default function AdminDashboard() {
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
                                {stat.value}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
