import { ChevronDown, Filter, MapPin, IndianRupee, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ConsultationBanner from "../../components/ConsultationBanner"; 
import { getCategoryDetails, getMediaInventory } from "@/actions/media";

interface Category {
  id: number;
  name: string;
  slug: string;
  seo_heading?: string;
  seo_paragraphs?: string[] | string;
  seo_table_data?: { option: string; reach: string; price: string }[] | string;
}

interface MediaItem {
  id: number;
  category_id: number;
  title: string;
  slug: string;
  location_city: string | null;
  price: number | null;
  image_url: string | null;
  created_at: Date | string;
}

export default async function CategoryListingPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.categorySlug;

  const categoryData = await getCategoryDetails(categorySlug);
  
  if (!categoryData) {
    notFound();
  }

  const category = categoryData as Category;

  const inventoryData = await getMediaInventory(category.id);
  const mediaItems = inventoryData as MediaItem[];

  const filterLocations = Array.from(
    new Set(mediaItems.map((item) => item.location_city))
  ).filter((loc): loc is string => Boolean(loc));

  const filterCategories = [
    "Digital",
    "Television",
    "Outdoor",
    "Influencer",
    "Magazine",
    "Radio",
  ];

  const parsedParagraphs = typeof category.seo_paragraphs === 'string' 
    ? JSON.parse(category.seo_paragraphs) 
    : category.seo_paragraphs || [];

  const parsedTableData = typeof category.seo_table_data === 'string'
    ? JSON.parse(category.seo_table_data)
    : category.seo_table_data || [];

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-4 py-3 text-[13px] text-gray-500 font-medium">
          <Link href="/" className="hover:text-[#0A4D28] transition-colors">
            Home
          </Link>
          <span className="mx-2">›</span>
          <span className="text-[#243839] font-semibold">{category.name}</span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 py-6 md:py-8 flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-[280px] shrink-0 hidden lg:block">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sticky top-24">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
              <Filter className="w-5 h-5 text-[#C58B24]" />
              <h2 className="font-bold text-[#243839] text-lg">Filters</h2>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-[#243839] text-[15px] mb-3">
                Categories
              </h3>
              <div className="flex flex-col gap-2.5">
                {filterCategories.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-[#0A4D28] focus:ring-[#0A4D28] cursor-pointer"
                    />
                    <span className="text-[14px] text-gray-600 font-medium group-hover:text-[#0A4D28] transition-colors">
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {filterLocations.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-[#243839] text-[15px] mb-3">
                  Location
                </h3>
                <div className="flex flex-col gap-2.5">
                  {filterLocations.map((loc) => (
                    <label
                      key={loc}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-[#0A4D28] focus:ring-[#0A4D28] cursor-pointer"
                      />
                      <span className="text-[14px] text-gray-600 font-medium group-hover:text-[#0A4D28] transition-colors">
                        {loc}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1 w-full">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-[28px] font-bold text-[#243839] mb-1 tracking-tight">
                {category.name}
              </h1>
              <p className="text-gray-500 text-sm font-medium">
                Showing {mediaItems.length} results
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button className="lg:hidden flex items-center justify-center gap-2 bg-gray-50 border border-gray-200 text-[#243839] hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-semibold flex-1 transition-colors">
                <Filter className="w-4 h-4 text-[#C58B24]" /> Filters
              </button>
              <div className="relative flex-1 md:w-[200px]">
                <select className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm font-semibold text-[#243839] focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/20 focus:border-[#0A4D28] transition-all cursor-pointer">
                  <option>Sort by Popularity</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 mb-10">
            {mediaItems.length > 0 ? (
              mediaItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-[0_8px_20px_rgba(10,77,40,0.08)] hover:-translate-y-1 hover:border-[#C58B24]/40 transition-all duration-300 flex flex-col group"
                >
                  <div className="w-full h-[180px] bg-gray-50 flex items-center justify-center relative overflow-hidden group-hover:bg-[#0A4D28]/5 transition-colors">
                    <div className="absolute top-3 left-3 z-10 bg-[#0A4D28] text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-sm uppercase tracking-wider">
                      {category.name}
                    </div>
                    {item.image_url ? (
                      <img 
                        src={item.image_url} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <LayoutGrid className="w-10 h-10 text-gray-300 group-hover:text-[#0A4D28]/30 transition-colors" />
                    )}
                  </div>

                  <div className="p-4 md:p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-[#243839] text-[16px] leading-snug mb-3 group-hover:text-[#0A4D28] transition-colors">
                      {item.title}
                    </h3>

                    <div className="mt-auto flex flex-col gap-3">
                      <div className="flex items-center gap-1.5 text-gray-500 text-[13px] font-medium">
                        <MapPin className="w-4 h-4 text-[#C58B24]" />
                        <span>{item.location_city || "Pan India"}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-1">
                        <div className="flex items-center text-[#243839] font-bold">
                          <IndianRupee className="w-4 h-4" />
                          <span className="text-[18px]">
                            {item.price
                              ? item.price.toLocaleString("en-IN")
                              : "On Request"}
                          </span>
                        </div>
                        <Link
                          href={`/item/${item.slug}`}
                          className="text-[#C58B24] text-[13px] font-bold hover:text-[#0A4D28] transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-500 font-medium bg-white rounded-xl border border-gray-100">
                No media options available in this category yet.
              </div>
            )}
          </div>

          {mediaItems.length > 0 && (
            <div className="flex justify-center mb-12">
              <button className="bg-[#C58B24] hover:bg-[#0A4D28] text-white px-10 py-3 rounded-lg text-sm font-bold shadow-sm transition-colors tracking-wide">
                LOAD MORE
              </button>
            </div>
          )}

          <div className="mb-12">
            <ConsultationBanner />
          </div>

          {category.seo_heading && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-10 mb-12">
              <h2 className="text-2xl font-bold text-[#243839] mb-6">
                {category.seo_heading}
              </h2>

              <div className="flex flex-col gap-4 text-[15px] text-[#243839]/80 font-medium leading-relaxed mb-8">
                {parsedParagraphs.map((para: string, idx: number) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              {parsedTableData.length > 0 && (
                <>
                  <h3 className="text-xl font-bold text-[#243839] mb-4">
                    Top Options & Rates
                  </h3>

                  <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="p-4 border-b border-gray-200 font-bold text-[#243839] text-sm">
                            Media Option
                          </th>
                          <th className="p-4 border-b border-gray-200 font-bold text-[#243839] text-sm">
                            Reach
                          </th>
                          <th className="p-4 border-b border-gray-200 font-bold text-[#243839] text-sm">
                            Estimated Price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedTableData.map((row: { option: string; reach: string; price: string }, idx: number) => (
                          <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                            <td className="p-4 border-b border-gray-100 text-sm font-bold text-[#0A4D28]">
                              {row.option}
                            </td>
                            <td className="p-4 border-b border-gray-100 text-sm text-[#243839]/80 font-medium">
                              {row.reach}
                            </td>
                            <td className="p-4 border-b border-gray-100 text-sm text-[#243839] font-bold">
                              {row.price}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}