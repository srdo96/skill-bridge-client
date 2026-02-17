// import { columns } from "@/app/(dashboardLayout)/@admin/admin-dashboard/bookings-management/columns";
import { DataTable } from "@/app/(dashboardLayout)/@admin/admin-dashboard/bookings-management/data-table";
import { bookingService } from "@/services/booking.service";
import { Booking } from "@/types";
import { columns } from "./columns";

interface StudentBookingsPageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
    }>;
}

async function getBookings(
    page: number,
    limit: number,
): Promise<{
    bookings: Booking[];
    total: number;
    totalPages: number;
    page: number;
    limit: number;
}> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });
    const { data, error } = await bookingService.getMyBookings(
        params.toString(),
    );
    if (error || !data) {
        return { bookings: [], total: 0, totalPages: 1, page, limit };
    }

    const payload = data?.data ?? data;
    return {
        bookings: payload?.bookings ?? [],
        total: Number(payload?.total ?? 0),
        totalPages: Number(payload?.totalPages ?? 1),
        page: Number(payload?.page ?? page),
        limit: Number(payload?.limit ?? limit),
    };
}

export default async function StudentBookingsPage({
    searchParams,
}: StudentBookingsPageProps) {
    const { page: pageParam, limit: limitParam } = await searchParams;
    const page = Math.max(1, Number(pageParam) || 1);
    const limit = Math.max(1, Number(limitParam) || 10);
    const data = await getBookings(page, limit);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Booking Management</h1>
                <p className="text-sm text-muted-foreground">
                    Review your booking status.
                </p>
            </div>

            <div className="space-y-3">
                <h2 className="text-lg font-semibold">Booking List</h2>
                <DataTable
                    columns={columns}
                    data={data.bookings}
                    serverPagination={{
                        page: data.page,
                        limit: data.limit,
                        totalPages: data.totalPages,
                        total: data.total,
                    }}
                />
                {/* <DataTable
                    columns={columns}
                    data={data.bookings}
                    serverPagination={{
                        page: data.page,
                        limit: data.limit,
                        totalPages: data.totalPages,
                        total: data.total,
                    }}
                /> */}
            </div>
        </div>
    );
}
