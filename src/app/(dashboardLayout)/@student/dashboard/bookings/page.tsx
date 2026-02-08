import { bookingService } from "@/services/booking.service";
import { Booking } from "@/types";
import { DataTable } from "../../../@admin/admin-dashboard/bookings-management/data-table";
import { columns } from "./columns";

async function getBookings(): Promise<Booking[]> {
    const { data, error } = await bookingService.getMyBookings();
    if (error || !data) {
        return [];
    }
    if (Array.isArray(data.data)) {
        return data.data;
    }
    return Array.isArray(data) ? data : [];
}

export default async function StudentBookingsPage() {
    const bookings = await getBookings();

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
                <DataTable columns={columns} data={bookings} />
            </div>
        </div>
    );
}
