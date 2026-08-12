import Link from "next/link";
import { ArrowRightCircle, Image as ImageIcon } from "lucide-react";

export default function OurClients() {
  const placeholders = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <section className="w-full">
      <div className="w-full bg-[#F8F7F9] py-4 md:py-5 border-y border-gray-100">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 flex items-center justify-between">
          <h2 className="text-[22px] md:text-2xl font-bold text-[#4B3BC3]">
            Our Clients
          </h2>
          <Link
            href="/clients"
            className="flex items-center gap-1.5 text-[#4B3BC3] hover:text-[#382991] transition-colors font-medium text-sm md:text-[15px]"
          >
            View All <ArrowRightCircle className="w-5 h-5" strokeWidth={1.5} />
          </Link>
        </div>
      </div>

      <div className="w-full bg-white py-12 md:py-20">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-12 md:gap-y-16 items-center justify-items-center">
            {placeholders.map((id) => (
              <div
                key={id}
                className="w-[140px] md:w-[160px] h-[60px] md:h-[70px] flex items-center justify-center grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 cursor-pointer"
              >
                <div className="w-full h-full bg-gray-50 border border-gray-100 rounded flex flex-col items-center justify-center gap-1">
                  <ImageIcon className="w-6 h-6 text-gray-300" />
                  <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                    Logo {id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}