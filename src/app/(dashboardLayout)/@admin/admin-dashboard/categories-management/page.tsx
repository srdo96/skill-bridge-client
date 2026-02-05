import { categoryService } from "@/services/category.service";
import { Category } from "@/types";
import { columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Category[]> {
    const { data, error } = await categoryService.getAllCategories();
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
