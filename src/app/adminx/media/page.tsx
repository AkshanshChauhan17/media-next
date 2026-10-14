// 6. src/app/admin/media/page.tsx
import { getAdminData } from "@/actions/admin";
import MediaForm from "../MediaForm";
import MediaTable from "./MediaTable";

export default async function MediaPage() {
  const { categories, mediaItems } = await getAdminData();
  const parsedMediaItems = mediaItems.map((item) => ({
    ...item,
    price: Number(item.price),
  }));

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#142642] tracking-tight mb-2">Media Inventory</h1>
        <p className="text-gray-500 font-medium">Add, update, and delete individual media advertising options.</p>
      </div>
      
      <div className="mb-12">
        <MediaForm categories={categories} />
      </div>

      <div className="w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#142642]">Manage Ads</h2>
          <p className="text-gray-500 text-sm mt-1">View, edit or delete media inventory items.</p>
        </div>
        <MediaTable mediaItems={parsedMediaItems} />
      </div>
    </div>
  );
}