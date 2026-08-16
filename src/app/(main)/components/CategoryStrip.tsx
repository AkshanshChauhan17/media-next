import Link from "next/link";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { unstable_noStore as noStore } from "next/cache"; 
import { getActiveCategories } from "@/actions/media"; // 👈 Apne file path ke hisaab se change kar lena agar zaroorat ho

type Category = {
  name: string;
  slug: string;
  icon?: string;
};

export default async function CategoryStrip() {
  noStore(); 

  let categories: Category[] = [];
  
  try {
    const rows = await getActiveCategories();
    categories = rows as Category[];
  } catch (error) {
    console.error("Failed to fetch categories for strip", error);
  }

  return (
    <div className="w-full bg-[#C58B24] text-white overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 h-[46px] flex items-center justify-start xl:justify-center gap-7 md:gap-10 min-w-max">
        {categories.map((category) => {
          const iconName = category.icon || "Folder";
          const Icon = (Icons as unknown as Record<string, LucideIcon>)[iconName] ?? Icons.Folder;

          return (
            <Link
              key={category.name}
              href={`/media/${category.slug}`}
              className="flex items-center gap-2.5 text-gray-50 hover:text-gray transition-colors group"
            >
              <Icon className="w-4 h-4 md:w-[18px] md:h-[18px] group-hover:scale-110 transition-transform" strokeWidth={2.5} />
              <span className="text-[13px] md:text-sm font-semibold tracking-wide">
                {category.name}
              </span>
            </Link>
          );
        })}

        {categories.length === 0 && (
          <span className="text-sm text-white/60 font-medium tracking-wide">Loading categories...</span>
        )}
      </div>
    </div>
  );
}