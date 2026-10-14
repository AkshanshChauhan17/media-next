"use client";

import { useEffect, useRef, useState } from "react";
import { X, MoveHorizontal, Scan } from "lucide-react";

export default function PanoViewerModal({ 
  hoarding, 
  onClose 
}: { 
  hoarding: {
    pano_image_1?: string;
    pano_image_2?: string;
    pano_image_3?: string;
    pano_image_4?: string;
    pano_image_5?: string;
    hoarding_id_string: string;
    location: string;
  }, 
  onClose: () => void 
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const images = [
    hoarding.pano_image_1,
    hoarding.pano_image_2,
    hoarding.pano_image_3,
    hoarding.pano_image_4,
    hoarding.pano_image_5
  ].filter(Boolean);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
      setScrollProgress(progress);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    if (scrollRef.current) {
      setStartX(e.pageX - scrollRef.current.offsetLeft);
      setScrollLeft(scrollRef.current.scrollLeft);
    }
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  if (images.length === 0) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
        <div className="text-center text-white">
          <Scan className="w-16 h-16 mx-auto mb-4 text-gray-500" />
          <h2 className="text-2xl font-black mb-2">No Panoramic Data</h2>
          <p className="text-gray-400 mb-6">180° view is not available for this space yet.</p>
          <button onClick={onClose} className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full font-bold transition-colors">
            Close Viewer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black overflow-hidden animate-in fade-in duration-300 select-none">
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-50 pointer-events-none">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-[#C58B24] text-black px-3 py-1 rounded text-xs font-black tracking-widest uppercase flex items-center gap-1.5">
              <Scan className="w-4 h-4" /> Live 180° FOV
            </span>
            <span className="text-white/50 text-xs font-mono tracking-widest">{hoarding.hoarding_id_string}</span>
          </div>
          <h2 className="text-white font-black text-2xl max-w-lg leading-tight shadow-black drop-shadow-lg pointer-events-auto">
            {hoarding.location}
          </h2>
        </div>
        
        <button onClick={onClose} className="pointer-events-auto bg-white/10 hover:bg-white/20 p-3 rounded-full text-white backdrop-blur-md transition-colors border border-white/10">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute top-1/2 left-6 -translate-y-1/2 z-40 text-white/30 flex flex-col items-center gap-2 pointer-events-none">
        <div className="w-px h-16 bg-gradient-to-b from-transparent to-white/30"></div>
        <span className="font-mono text-xs rotate-180" style={{ writingMode: 'vertical-rl' }}>LEFT WING</span>
        <div className="w-px h-16 bg-gradient-to-t from-transparent to-white/30"></div>
      </div>

      <div className="absolute top-1/2 right-6 -translate-y-1/2 z-40 text-white/30 flex flex-col items-center gap-2 pointer-events-none">
        <div className="w-px h-16 bg-gradient-to-b from-transparent to-white/30"></div>
        <span className="font-mono text-xs rotate-180" style={{ writingMode: 'vertical-rl' }}>RIGHT WING</span>
        <div className="w-px h-16 bg-gradient-to-t from-transparent to-white/30"></div>
      </div>

      <div className="flex-1 w-full flex items-center justify-center relative">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`w-full overflow-x-auto flex snap-x snap-mandatory hide-scrollbar ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
        >
          {images.map((img, idx) => (
            <div key={idx} className="min-w-[85vw] md:min-w-[60vw] h-[60vh] md:h-[75vh] snap-center px-2 flex-shrink-0 relative group">
              <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 relative pointer-events-none">
                <img 
                  src={img} 
                  alt={`Pano ${idx + 1}`} 
                  draggable={false}
                  className="w-full h-full object-cover pointer-events-none select-none" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none"></div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-white/50 text-xs tracking-[0.2em] pointer-events-none">
                  SECTOR {idx + 1}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4 w-full max-w-md px-6 pointer-events-none">
        <div className="flex items-center gap-2 text-white/60 bg-black/50 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
          <MoveHorizontal className="w-5 h-5 animate-pulse" />
          <span className="text-sm font-bold tracking-widest uppercase">Drag to Pan</span>
        </div>

        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#C58B24] rounded-full transition-all duration-100 ease-out"
            style={{ width: `${Math.max(5, scrollProgress)}%` }}
          ></div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}