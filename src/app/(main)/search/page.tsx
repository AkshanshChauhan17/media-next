import { getHoardingsByBudget } from "@/actions/media";
import Link from "next/link";
import { Search, MapPin, IndianRupee, Ruler, Image as ImageIcon } from "lucide-react";

type HoardingResult = {
  id: string | number;
  image_url?: string | null;
  location: string;
  city: string;
  media_type: string;
  base_price: number | string;
  size: string;
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ budget?: string }>;
}) {
  const params = await searchParams;
  const budget = Number(params.budget) || 0;

  let results: HoardingResult[] = [];
  if (budget > 0) {
    const res = await getHoardingsByBudget(budget);
    if (res.success && res.data && Array.isArray(res.data)) {
      results = res.data as HoardingResult[];
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-[#243839] mb-2 flex items-center gap-3">
              <Search className="w-8 h-8 text-[#C58B24]" />
              Campaign Planning Results
            </h1>
            <p className="text-gray-500 font-medium">
              Showing best available premium spaces under <span className="font-bold text-[#0A4D28]">₹{budget.toLocaleString('en-IN')}</span>
            </p>
          </div>
          
          <Link 
            href="/"
            className="px-6 py-3 bg-[#0A4D28]/10 text-[#0A4D28] font-bold rounded-xl hover:bg-[#0A4D28]/20 transition-colors whitespace-nowrap"
          >
            Modify Budget
          </Link>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((item) => (
              <Link 
                key={item.id} 
                href={`/media/${item.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col h-full"
              >
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  {item.image_url ? (
                    <img 
                      src={item.image_url} 
                      alt={item.location} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                      <span className="text-xs font-bold uppercase tracking-wider">No Image</span>
                    </div>
                  )}
                  
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-black text-[#0A4D28] shadow-sm flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5" />
                    {Number(item.base_price).toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <div className="inline-block px-2.5 py-1 bg-[#C58B24]/10 text-[#C58B24] text-[10px] font-black uppercase tracking-widest rounded-md mb-3 w-max">
                    {item.media_type}
                  </div>
                  
                  <h3 className="text-lg font-black text-[#243839] mb-1 line-clamp-1">
                    {item.city}
                  </h3>
                  
                  <p className="text-sm font-medium text-gray-500 flex-grow line-clamp-2 mb-4 flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                    {item.location}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-[#243839]">
                      <Ruler className="w-4 h-4 text-gray-400" />
                      {item.size}
                    </div>
                    <span className="text-xs font-bold text-[#0A4D28] hover:underline">
                      View Details &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-black text-[#243839] mb-2">No spaces found</h3>
            <p className="text-gray-500 font-medium max-w-md">
              We could not find any premium ad spaces within your budget of ₹{budget.toLocaleString('en-IN')}. Try increasing your budget or exploring all spaces.
            </p>
            <Link 
              href="/"
              className="mt-8 px-8 py-3.5 bg-[#243839] text-white font-black rounded-xl hover:bg-black transition-colors"
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}