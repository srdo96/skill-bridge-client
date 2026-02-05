import { categoryService } from "@/services/category.service";
import { Category } from "@/types";
import { CreateCategorySubjectForms } from "../create-forms";

async function getData(): Promise<Category[]> {
    const { data, error } = await categoryService.getAllCategories();
    if (error) {
        return [];
    }
    return data.data;
}

export default async function page() {
    const data = await getData();
    return (
        <div className="space-y-6">
            <CreateCategorySubjectForms categories={data} />
        </div>
    );
}
