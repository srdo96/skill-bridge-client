import { bookingService } from "@/services/booking.service";
import { Booking } from "@/types";
import { columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Booking[]> {
    const { data, error } = await bookingService.getAllBookings();
    if (error) {
        return [];
    }
    console.log(data);
    return data.data;
}
export default async function page() {
    const data = await getData();
    return (
        <div>
            <DataTable columns={columns} data={data} />
        </div>
    );
}
