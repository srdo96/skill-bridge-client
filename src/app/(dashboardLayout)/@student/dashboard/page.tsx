import { CalendarCheck, CheckCircle2, Timer, XCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardService } from "@/services/dashboard.service";
import { BookingStatus } from "@/types/user.types";

type StudentDashboardData = {
    bookings: {
        total: number;
        byStatus: Record<string, number>;
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

export default async function StudentDashboard() {
    const { data, error } = await dashboardService.getStudentDashboardData();
    const dashboard: StudentDashboardData = data ?? {
        bookings: { total: 0, byStatus: {} },
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
                <h1 className="text-2xl font-semibold">Student Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                    Track your upcoming sessions and booking history.
                </p>
            </div>

            <div className="space-y-3">
                <h2 className="text-lg font-semibold">Overview</h2>
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
                                    : "All tutoring bookings"}
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
                                    : "Confirmed sessions"}
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
                                    : "Sessions completed"}
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
