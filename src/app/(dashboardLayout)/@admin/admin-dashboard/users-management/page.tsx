// export default function UserManagement() {
//     return (
//         <div className="h-[calc(100vh-100px)] flex items-center justify-center">
//             UserManagement
//         </div>
//     );
// }

import { columns, Payment } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Payment[]> {
    // Fetch data from your API here.
    return [
        {
            id: "728ed52f",
            amount: 100,
            status: "pending",
            email: "m@example.com",
        },
        // ...
    ];
}

export default async function DemoPage() {
    const data = await getData();

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    );
}
