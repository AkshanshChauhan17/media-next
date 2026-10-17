// "use client";

// import Link from "next/link";
// import { useEffect, useRef, useState } from "react";
// import { ArrowRight, BarChart3, Target, Zap } from "lucide-react";
// import Image from "next/image";

// export default function AgencyPartner() {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [scrollProgress, setScrollProgress] = useState(0);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (!containerRef.current) return;
      
//       const rect = containerRef.current.getBoundingClientRect();
//       const windowHeight = window.innerHeight;
      
//       // Calculate scroll progress (0 to 1) for THIS specific section
//       // 0 = section viewport ke bottom se touch hua
//       // 1 = section viewport ke top se bahar nikal gaya
//       const totalScrollDistance = windowHeight + rect.height;
//       const currentScroll = windowHeight - (rect.top)*2;
      
//       let progress = currentScroll / totalScrollDistance;
      
//       // Range ko 0 se 1 ke beech lock kar diya
//       progress = Math.max(0, Math.min(1, progress));
//       setScrollProgress(progress);
//     };

//     window.addEventListener("scroll", handleScroll);
//     handleScroll(); // Initial check on load
    
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // 3 images hain, toh progress ko 3 hisso mein batna hai (0-0.33, 0.34-0.66, 0.67-1.0)
//   // Math.min(2, ...) ensure karega ki index max 2 tak hi jaye (0, 1, 2)
//   const activeImageIndex = Math.min(2, Math.floor(scrollProgress * 3));

//   // YAHAN APNI 3 BILLBOARD IMAGES KE NAAM DAAL DO JINME ADS LAGE HUE HAIN
//   const billboardImages = [
//     "/billboard-ad1.png", 
//     "/billboard-ad2.png", 
//     "/billboard-ad3.png", 
//   ];

//   return (
//     <section 
//       ref={containerRef}
//       className="max-w-[1600px] bg-[#F8FAFC] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full border-y border-gray-200 relative"
//     >
//       <div className="bg-white rounded-[32px] relative overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[500px] md:min-h-[600px] border border-gray-200 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
        
//         {/* Background Pattern for Light Theme */}
//         <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none" 
//              style={{ 
//                backgroundImage: 'radial-gradient(#E5A93D 1px, transparent 1px)', 
//                backgroundSize: '32px 32px',
//                maskImage: 'linear-gradient(to right, transparent, black)'
//              }} 
//         />
        
//         <div className="relative z-10 p-8 md:p-14 lg:p-20 max-w-2xl flex flex-col items-start text-left w-full md:w-1/2">
//           <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6">
//             <Zap className="w-3.5 h-3.5" fill="currentColor" /> Premium Agencies
//           </div>
          
//           <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0B111A] mb-6 leading-[1.1] tracking-tighter">
//             Elevate Your <br/>
//             <span className="text-[#E5A93D]">Advertising Game</span>
//           </h2>
          
//           <p className="text-gray-500 text-lg md:text-xl leading-relaxed mb-10 font-medium max-w-lg">
//             Join the elite network of agencies dominating the outdoor advertising space. Secure prime billboard locations and maximize client reach.
//           </p>
          
//           <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
//             <Link
//               href="/agency-partner"
//               className="bg-[#0B111A] hover:bg-[#1A222C] transition-colors text-white font-bold text-base px-8 py-4 rounded-2xl shadow-[0_10px_30px_rgba(11,17,26,0.2)] tracking-wide flex items-center justify-center gap-3 group"
//             >
//               Start Dominating
//               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//             </Link>
//           </div>

//           <div className="flex items-center gap-6 mt-10 pt-10 border-t border-gray-100 w-full">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200">
//                 <BarChart3 className="w-5 h-5 text-gray-600" />
//               </div>
//               <div className="text-sm">
//                 <p className="font-bold text-[#0B111A]">Maximum Impact</p>
//                 <p className="text-gray-500 font-medium text-xs">High traffic zones</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200">
//                 <Target className="w-5 h-5 text-gray-600" />
//               </div>
//               <div className="text-sm">
//                 <p className="font-bold text-[#0B111A]">Prime Spots</p>
//                 <p className="text-gray-500 font-medium text-xs">Exclusive inventory</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Dynamic Image Container */}
//         <div className="relative z-10 w-full md:w-1/2 flex justify-center items-center p-8 md:p-14 h-[400px] md:h-full bg-gray-50 md:bg-transparent overflow-hidden">
//           <div className="relative w-full max-w-[600px] aspect-square transform transition-transform duration-700">
//             {billboardImages.map((src, index) => (
//               <div 
//                 key={index}
//                 className="absolute inset-0 transition-opacity duration-1000 ease-in-out drop-shadow-2xl"
//                 style={{ 
//                   opacity: activeImageIndex === index ? 1 : 0,
//                   zIndex: activeImageIndex === index ? 10 : 0,
//                 }}
//               >
//                 {/* 
//                   Humne object-contain use kiya hai taaki tumhari puri image fit ho. 
//                   Agar image stretch lag rahi ho toh object-cover try kar lena. 
//                 */}
//                 <Image
//                   src={src}
//                   alt={`Billboard Display ${index + 1}`}
//                   fill
//                   className="object-contain"
//                   priority={index === 0} 
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//       </div>
//     </section>
//   );
// }

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function AgencyPartner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress (0 to 1) for THIS specific section
      const totalScrollDistance = windowHeight + rect.height;
      const currentScroll = windowHeight - rect.top; 
      
      let progress = currentScroll / totalScrollDistance;
      
      // Range ko 0 se 1 ke beech lock kar diya
      progress = Math.max(0, Math.min(1, progress));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check on load
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3 images hain, toh progress ko 3 hisso mein batna hai
  const activeImageIndex = Math.min(2, Math.floor(scrollProgress * 3));

  // YAHAN APNI 3 BILLBOARD IMAGES KE NAAM DAAL DO
  const billboardImages = [
    "/billboard-ad1.png", 
    "/billboard-ad2.png", 
    "/billboard-ad3.png", 
  ];

  return (
    <section 
      ref={containerRef}
      className="max-w-[1600px] bg-white mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full border-y border-gray-200 relative"
    >
      <div className="bg-[#F8FAFC] rounded-[32px] relative overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[500px] md:min-h-[600px] border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        
        {/* Background Pattern for Light Theme */}
        <div className="absolute top-0 right-0 w-full h-full opacity-40 pointer-events-none" 
             style={{ 
               backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', 
               backgroundSize: '32px 32px',
               maskImage: 'linear-gradient(to left, black, transparent)'
             }} 
        />
        
        {/* Left Content Area (Light Theme) */}
        <div className="relative z-10 p-4 md:p-14 lg:p-20 max-w-2xl flex flex-col items-start text-left w-full md:w-1/2">
          
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] md:text-[11px] font-bold uppercase tracking-wide mb-6">
            YOUR OUTDOOR ADVERTISING MARKETPLACE
          </div>
          
          {/* Main Heading */}
          <h2 className="text-[32px] sm:text-5xl lg:text-6xl font-bold text-[#0F2537] mb-6 leading-[1.15] tracking-tight">
            Every Ad Space. <br/>
            <span className="text-[#E5A93D] block mt-1">One Platform.</span>
          </h2>
          
          {/* Description */}
          <p className="text-gray-600 text-base md:text-lg lg:text-[19px] leading-relaxed mb-10 font-medium max-w-[480px]">
            Discover, compare and book outdoor advertising spaces across billboards, buses, autos and more — with greater transparency from booking to execution.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-4 w-full sm:max-w-[340px]">
            <Link
              href="/media"
              className="bg-[#E5A93D] hover:bg-[#F2B950] transition-colors text-[#0B111A] font-bold text-base px-6 py-4 rounded-xl flex items-center justify-center gap-2 shadow-sm"
            >
              Explore Ad Spaces <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link
              href="/auth"
              className="bg-white hover:bg-gray-50 border border-gray-300 transition-colors text-[#0F2537] font-bold text-base px-6 py-4 rounded-xl flex items-center justify-center shadow-sm"
            >
              List Your Ad Space
            </Link>
          </div>
        </div>

        {/* Dynamic Image Container (Right Side) */}
        <div className="relative z-10 w-full md:w-1/2 flex justify-center items-center p-8 md:p-14 h-[400px] md:h-full overflow-hidden">
          <div className="relative w-full max-w-[600px] aspect-square transform transition-transform duration-700">
            {billboardImages.map((src, index) => (
              <div 
                key={index}
                className="absolute inset-0 transition-opacity duration-1000 ease-in-out drop-shadow-xl"
                style={{ 
                  opacity: activeImageIndex === index ? 1 : 0,
                  zIndex: activeImageIndex === index ? 10 : 0,
                }}
              >
                <Image
                  src={src}
                  alt={`Billboard Display ${index + 1}`}
                  fill
                  className="object-contain"
                  priority={index === 0} 
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}