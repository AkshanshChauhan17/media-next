import { getAdminData } from "@/actions/admin";
import CategoryForm from "../CategoryForm";
import CategoryGrid from "../CategoryGrid";

export default async function CategoriesPage() {
  const { categories } = await getAdminData();

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#142642] tracking-tight mb-2">Manage Categories</h1>
        <p className="text-gray-500 font-medium">Add, edit, hide, and delete advertising categories.</p>
      </div>
      
      <div className="mb-12">
        <CategoryForm />
      </div>

      <CategoryGrid categories={categories} />
    </div>
  );
}