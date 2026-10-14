import Link from "next/link";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { unstable_noStore as noStore } from "next/cache"; 
import { getActiveCategories } from "@/actions/media";

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
    console.error(error);
  }

  return (
    <div className="w-full bg-[#243839] text-white overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] shadow-md border-b border-gray-800">
      <div className="max-w-[1600px] mx-auto px-6 h-[54px] flex items-center justify-start xl:justify-center gap-8 md:gap-12 min-w-max">
        {categories.map((category) => {
          const iconName = category.icon || "LayoutGrid";
          const Icon = (Icons as unknown as Record<string, LucideIcon>)[iconName] ?? Icons.LayoutGrid;

          return (
            <Link
              key={category.name}
              href={`/media/${category.slug}`}
              className="flex items-center gap-2.5 text-gray-300 hover:text-[#C58B24] transition-all group py-1.5 px-3 rounded-lg hover:bg-white/5"
            >
              <Icon className="w-4 h-4 md:w-[18px] md:h-[18px] group-hover:scale-110 transition-transform" strokeWidth={2.5} />
              <span className="text-[13px] md:text-sm font-bold tracking-wide uppercase">
                {category.name}
              </span>
            </Link>
          );
        })}

        {categories.length === 0 && (
          <span className="text-sm text-gray-400 font-bold tracking-wide animate-pulse">
            Loading...
          </span>
        )}
      </div>
    </div>
  );
}