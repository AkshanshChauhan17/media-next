"use client";

export default function StateMarquee() {
  return (
    <section
      className="relative w-full overflow-hidden py-3 sm:py-5"
      aria-label="Our service locations"
    >
      {/* Sirf ek single div jo infinite background scroll handle karega */}
      <div className="w-full h-[100px] marquee-bg hover:[animation-play-state:paused] motion-reduce:animate-none" />

      <style jsx>{`
        .marquee-bg {
          background-image: url('/state_strip.png');
          background-repeat: repeat-x;
          
          /* 
            "auto 100px" ka matlab height fix 100px rahegi aur 
            width image ke hisaab se auto adjust hogi (stretch nahi hogi).
          */
          background-size: auto 100px;
          
          /* Animation speed yahan se adjust karein (e.g., 10s ya 20s) */
          animation: seamless-bg-scroll 15s linear infinite;
        }

        @keyframes seamless-bg-scroll {
          0% {
            background-position: 0 0;
          }
          100% {
            /* 
              Aapki 2100x600 image ke hisaab se 100px height par uski natural width 350px hoti hai.
              Isliye hum exactly -350px translate kar rahe hain taaki perfect loop bane bina gap ke.
              (Agar aap koi aur image lagate ho aur jhatka feel ho, toh is -350px ko thoda badha/ghata lena)
            */
            background-position: -350px 0;
          }
        }
      `}</style>
    </section>
  );
}