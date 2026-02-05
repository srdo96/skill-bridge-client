import {
    CalendarCheck,
    CheckCircle2,
    ClipboardList,
    DollarSign,
    Star,
    Timer,
    XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardService } from "@/services/dashboard.service";
import { BookingStatus } from "@/types/user.types";

type TutorDashboardData = {
    bookings: {
        total: number;
        byStatus: Record<string, number>;
    };
    totalEarnings: number;
    reviews: {
        total: number;
        avgRating: number;
    };
};

const statusOrder = [
    BookingStatus.CONFIRMED,
    BookingStatus.COMPLETED,
    BookingStatus.CANCELLED,
];

const statusVariants: Record<
    BookingStatus,
    "warning" | "success" | "destructive"
> = {
    [BookingStatus.CONFIRMED]: "warning",
    [BookingStatus.COMPLETED]: "success",
    [BookingStatus.CANCELLED]: "destructive",
};

const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-US").format(value);

const formatRating = (value: number) =>
    new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 1,
        minimumFractionDigits: 1,
    }).format(value);

export default async function TutorDashboard() {
    const { data, error } = await dashboardService.getTutorDashboardData();
    console.log("data", data);
    const dashboard: TutorDashboardData = data ?? {
        bookings: { total: 0, byStatus: {} },
        totalEarnings: 0,
        reviews: { total: 0, avgRating: 0 },
    };
    const statusEntries = Object.entries(dashboard.bookings.byStatus || {});
    const orderedStatuses = statusOrder.map((status) => ({
        status,
        count: dashboard.bookings.byStatus?.[status] ?? 0,
    }));
    const extraStatuses = statusEntries
        .filter(([status]) => !statusOrder.includes(status as BookingStatus))
        .map(([status, count]) => ({ status, count }));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Tutor Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                    Overview of your bookings, earnings, and reviews.
                </p>
            </div>

            <div className="space-y-3">
                <h2 className="text-lg font-semibold">Stats</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Bookings
                            </CardTitle>
                            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {error
                                    ? "--"
                                    : formatNumber(dashboard.bookings.total)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {error
                                    ? "Failed to load bookings"
                                    : "All booking requests"}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Earnings
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {error
                                    ? "--"
                                    : formatNumber(dashboard.totalEarnings)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {error
                                    ? "Failed to load earnings"
                                    : "Lifetime tutoring earnings"}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Reviews
                            </CardTitle>
                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {error
                                    ? "--"
                                    : formatNumber(dashboard.reviews.total)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {error
                                    ? "Failed to load reviews"
                                    : "Total reviews received"}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Average Rating
                            </CardTitle>
                            <Star className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {error
                                    ? "--"
                                    : formatRating(dashboard.reviews.avgRating)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {error
                                    ? "Failed to load rating"
                                    : "Average rating across reviews"}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="space-y-3">
                <h2 className="text-lg font-semibold">Sessions</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Sessions
                            </CardTitle>
                            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {error
                                    ? "--"
                                    : formatNumber(dashboard.bookings.total)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {error
                                    ? "Failed to load sessions"
                                    : "All sessions booked"}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Upcoming Sessions
                            </CardTitle>
                            <Timer className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {error
                                    ? "--"
                                    : formatNumber(
                                          dashboard.bookings.byStatus?.[
                                              BookingStatus.CONFIRMED
                                          ] ?? 0,
                                      )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {error
                                    ? "Failed to load sessions"
                                    : "Confirmed upcoming sessions"}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Completed Sessions
                            </CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {error
                                    ? "--"
                                    : formatNumber(
                                          dashboard.bookings.byStatus?.[
                                              BookingStatus.COMPLETED
                                          ] ?? 0,
                                      )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {error
                                    ? "Failed to load sessions"
                                    : "Sessions finished"}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Cancelled Sessions
                            </CardTitle>
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {error
                                    ? "--"
                                    : formatNumber(
                                          dashboard.bookings.byStatus?.[
                                              BookingStatus.CANCELLED
                                          ] ?? 0,
                                      )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {error
                                    ? "Failed to load sessions"
                                    : "Sessions cancelled"}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
