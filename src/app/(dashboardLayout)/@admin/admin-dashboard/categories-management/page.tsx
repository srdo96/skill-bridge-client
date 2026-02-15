import { categoryService } from "@/services/category.service";
import { Category } from "@/types";
import { columns } from "./columns";
import { DataTable } from "./data-table";

interface CategoriesPageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
    }>;
}

async function getData(
    page: number,
    limit: number,
): Promise<{
    categories: Category[];
    total: number;
    totalPages: number;
    page: number;
    limit: number;
}> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });
    const { data, error } = await categoryService.getAllCategories(
        params.toString(),
    );
    if (error) {
        return { categories: [], total: 0, totalPages: 1, page, limit };
    }

    const payload = data?.data ?? data;
    const meta = data?.meta ?? payload?.meta;

    return {
        categories: payload?.categories ?? payload?.data ?? payload ?? [],
        total: Number(meta?.total ?? payload?.total ?? 0),
        totalPages: Number(meta?.totalPages ?? payload?.totalPages ?? 1),
        page: Number(meta?.page ?? payload?.page ?? page),
        limit: Number(meta?.limit ?? payload?.limit ?? limit),
    };
}
export default async function page({ searchParams }: CategoriesPageProps) {
    const { page: pageParam, limit: limitParam } = await searchParams;
    const page = Math.max(1, Number(pageParam) || 1);
    const limit = Math.max(1, Number(limitParam) || 10);
    const data = await getData(page, limit);

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">Category Management</h1>
            <DataTable
                columns={columns}
                data={data.categories}
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
