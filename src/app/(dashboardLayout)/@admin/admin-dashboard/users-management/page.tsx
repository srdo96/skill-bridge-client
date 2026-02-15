import { userService } from "@/services/user.service";
import { User } from "@/types";
import { columns } from "./columns";
import { DataTable } from "./data-table";
// import { columns } from "./columns";

type UserManagementProps = {
    searchParams?: {
        role?: string;
    };
};

interface UsersPageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
    }>;
}

// async function getData(): Promise<any[]> {
//     const { data, error } = await userService.getAllUser();

//     if (error) {
//         return [];
//     }

//     return data?.data ?? [];
// }

async function getData(
    page: number,
    limit: number,
): Promise<{
    users: User[];
    total: number;
    totalPages: number;
    page: number;
    limit: number;
}> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });
    const { data, error } = await userService.getAllUser(params.toString());
    if (error) {
        return { users: [], total: 0, totalPages: 1, page, limit };
    }

    return {
        users: data?.data,
        total: Number(data?.meta?.total),
        totalPages: Number(data?.meta?.totalPages),
        page: Number(data?.meta?.page),
        limit: Number(data?.meta?.limit),
    };
}

export default async function UserManagement({ searchParams }: UsersPageProps) {
    const { page: pageParam, limit: limitParam } = await searchParams;
    const page = Math.max(1, Number(pageParam) || 1);
    const limit = Math.max(1, Number(limitParam) || 10);
    const data = await getData(page, limit);

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-semibold mb-4">User Management</h1>
            <DataTable
                columns={columns}
                data={data.users}
                serverPagination={{
                    page: data.page,
                    limit: data.limit,
                    totalPages: data.totalPages,
                    total: data.total,
                }}
            />
            {/* <DataTable
                columns={columns}
                data={data}
                serverPagination={{
                    page: 1,
                    limit: 10,
                    totalPages: 1,
                    total: 10,
                }}
            /> */}
        </div>
    );
}
