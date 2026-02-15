import { bookingService } from "@/services/booking.service";
import { Booking } from "@/types";
import { columns } from "./columns";
import { DataTable } from "./data-table";

interface BookingsPageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
    }>;
}

async function getData(
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
    const { data, error } = await bookingService.getAllBookings(
        params.toString(),
    );
    if (error) {
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
export default async function page({ searchParams }: BookingsPageProps) {
    const { page: pageParam, limit: limitParam } = await searchParams;
    const page = Math.max(1, Number(pageParam) || 1);
    const limit = Math.max(1, Number(limitParam) || 10);
    const data = await getData(page, limit);

    return (
        <div>
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
        </div>
    );
}
