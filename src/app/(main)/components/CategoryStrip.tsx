import Link from "next/link";
import pool from "@/lib/db";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Category = {
  name: string;
  slug: string;
  icon?: string;
};

export default async function CategoryStrip() {
  // Fetch only ACTIVE categories from database
  let categories: Category[] = [];
  try {
    const [rows] = await pool.execute(
      "SELECT name, slug, icon FROM categories WHERE status = 'ACTIVE' ORDER BY created_at DESC"
    );
    categories = rows as Category[];
  } catch (error) {
    console.error("Failed to fetch categories for strip", error);
  }

  return (
    <div className="w-full bg-[#1a133d] text-white overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="max-w-[1600px] mx-auto px-4 h-[42px] flex items-center justify-start xl:justify-center gap-7 md:gap-9 min-w-max">
        {categories.map((category) => {
          // Dynamically map the saved icon name to the actual Lucide Component
          // If the icon is not found, default to 'Folder'
          const iconName = category.icon || "Folder";
          const Icon = (Icons as unknown as Record<string, LucideIcon>)[iconName] ?? Icons.Folder;

          return (
            <Link
              key={category.name}
              href={`/media/${category.slug}`}
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <Icon className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={2} />
              <span className="text-[13px] md:text-sm font-medium tracking-wide">
                {category.name}
              </span>
            </Link>
          );
        })}

        {/* Placeholder if database is completely empty */}
        {categories.length === 0 && (
          <span className="text-sm text-gray-400">Loading categories...</span>
        )}
      </div>
    </div>
  );
}