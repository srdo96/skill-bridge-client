import { userService } from "@/services/user.service";
import { columns } from "./columns";
import { DataTable } from "./data-table";

type UserManagementProps = {
    searchParams?: {
        role?: string;
    };
};

async function getData(): Promise<any[]> {
    const { data, error } = await userService.getAllUser();
    console.log("users data", data);

    if (error) {
        return [];
    }

    return data?.data ?? [];
}

export default async function UserManagement({
    searchParams,
}: UserManagementProps) {
    const data = await getData();

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    );
}
