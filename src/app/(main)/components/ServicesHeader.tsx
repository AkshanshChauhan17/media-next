import { motion } from "framer-motion";

export default function ServicesHeader() {
  return (
    <div className="w-full flex flex-col items-center justify-center mt-20">
      {/* Main Heading Animation */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <h3 className="text-[#E5A93D] text-sm md:text-base font-bold tracking-[0.2em] uppercase mb-4 flex items-center justify-center gap-3">
          <span className="w-12 h-[2px] bg-[#E5A93D]/50 rounded-full"></span>
          Our Services
          <span className="w-12 h-[2px] bg-[#E5A93D]/50 rounded-full"></span>
        </h3>
        
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-tight">
          Explore Premium <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5A93D] to-[#F2B950]">
            Advertising Spaces
          </span>
        </h2>
      </motion.div>
    </div>
  );
}