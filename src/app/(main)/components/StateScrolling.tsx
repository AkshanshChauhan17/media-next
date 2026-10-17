"use client";

export default function StateTextMarquee() {
  // Aap yahan states add, remove ya reorder kar sakte hain
  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir"
  ];

  return (
    <section 
      className="w-full bg-[#0a0f1c] text-white py-4 overflow-hidden relative"
      aria-label="Our service locations"
    >
      <div className="marquee-wrapper">
        {/* Pehli Copy */}
        <div className="marquee-content">
          {states.map((state, index) => (
            <div key={`first-${index}`} className="marquee-item">
              <span className="text-sm md:text-lg font-semibold uppercase tracking-widest text-gray-200">
                {state}
              </span>
              {/* Star icon separator - isko text-yellow-500 se color diya h */}
              <span className="text-yellow-500 mx-6 text-xl leading-none">✦</span>
            </div>
          ))}
        </div>
        
        {/* Dusri Copy (Seamless loop ke liye zaruri hai) */}
        <div className="marquee-content" aria-hidden="true">
          {states.map((state, index) => (
            <div key={`second-${index}`} className="marquee-item">
              <span className="text-sm md:text-lg font-semibold uppercase tracking-widest text-gray-200">
                {state}
              </span>
              <span className="text-yellow-500 mx-6 text-xl leading-none">✦</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-wrapper {
          display: flex;
          width: 100%;
        }

        .marquee-content {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          /* Speed adjust karne ke liye is '50s' ko change karein */
          animation: scroll-text 50s linear infinite;
        }

        .marquee-item {
          display: flex;
          align-items: center;
        }

        /* Hover karne par text scroll ruk jayega */
        .marquee-wrapper:hover .marquee-content {
          animation-play-state: paused;
        }

        /* Reduced motion support accessibility ke liye */
        @media (prefers-reduced-motion: reduce) {
          .marquee-content {
            animation-play-state: paused;
          }
        }

        @keyframes scroll-text {
          0% {
            transform: translateX(0);
          }
          100% {
            /* 100% shift karne se pehli list exact dusri list ki jagah le legi */
            transform: translateX(-100%);
          }
        }
      `}</style>
    </section>
  );
}