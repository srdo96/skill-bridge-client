import { userService } from "@/services/user.service";
import { columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<any[]> {
    const { data, error } = await userService.getAllUser();
    console.log("API Response:", JSON.stringify(data, null, 2));

    if (error) {
        return [];
    }

    return data.data;
}

export default async function UserManagement() {
    const data = await getData();

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    );
}
