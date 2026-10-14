"use client";

import { useRef, useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Image as ImageIcon,
  ArrowUpRight,
  X,
  Clock,
  Calendar,
  User,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BlogPost {
  id: number;
  title: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  excerpt: string;
  content: string[];
  highlights: string[];
}

export default function PopularBlogPosts() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedPost]);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "How IPL Sponsorships Boost Searches: Real Success Stories from 2024",
      category: "Case Study",
      date: "May 14, 2025",
      readTime: "5 min read",
      author: "Media Strategy Team",
      excerpt:
        "Discover how strategic outdoor placements combined with IPL sponsorship moments drove a 340% spike in organic brand searches across Tier-1 and Tier-2 cities.",
      content: [
        "High-visibility sporting events like the IPL create unmatched cultural moments across India. However, brands that pair their digital and broadcast presence with strategic Out-Of-Home (OOH) billboards see exponentially higher brand recall and organic search volume.",
        "In 2024, emerging fintech and consumer brands utilized high-traffic arterial roads, airport corridors, and metro pillars to reinforce their live match messaging. Commuters who saw a brand on television the night before were greeted by bold, contextual creatives on their morning commute.",
        "By synchronizing live match milestones with dynamic digital hoardings (DOOH), advertisers turned passive viewers into active searchers, resulting in record-breaking app downloads and direct website traffic.",
      ],
      highlights: [
        "3.4x increase in direct organic search queries during match weeks",
        "68% higher brand recall when combining DOOH with sports broadcast",
        "Top performing zones: Mumbai Western Express Highway & Bengaluru MG Road",
      ],
    },
    {
      id: 2,
      title: "IPL 2025 Advertising on JioHotstar & Star Sports: A Complete Guide",
      category: "Media Buying",
      date: "June 02, 2025",
      readTime: "7 min read",
      author: "AdTech Insights",
      excerpt:
        "A comprehensive breakdown of cross-channel media planning, budget allocation, and how to amplify your sports campaigns with physical ad spaces.",
      content: [
        "Planning a high-impact campaign during the IPL season requires balancing digital streaming inventory with physical real-world dominance. With consolidated streaming ecosystems, audience attention is more concentrated than ever.",
        "Smart media planners allocate 25% to 30% of their seasonal budget toward high-frequency outdoor media in key target markets. While streaming ads capture attention during the match, large-format hoardings sustain brand authority throughout the day.",
        "This guide walks you through selecting the right mix of connected TV spots, mobile mid-rolls, and prime city-center billboards to maximize reach without overspending.",
      ],
      highlights: [
        "Optimal budget split between Digital Streaming and Outdoor Hoardings",
        "Geo-targeting strategies for regional language feeds and local city boards",
        "Real-time ROI measurement frameworks for omnichannel campaigns",
      ],
    },
    {
      id: 3,
      title: "BookmyadSpace's Blueprint for Effective Media Planning and Campaign Execution",
      category: "Blueprint",
      date: "July 19, 2025",
      readTime: "6 min read",
      author: "Planning Desk",
      excerpt:
        "Learn our proven 4-step framework to identify high-traffic locations, negotiate transparent rates, and launch nationwide outdoor campaigns in minutes.",
      content: [
        "Traditional outdoor media buying was once fragmented, slow, and opaque. Modern brands demand real-time traffic analytics, verified location imagery, and instant availability checks before committing their marketing spend.",
        "Our blueprint starts with audience mapping—identifying where your high-intent customers commute, shop, and work. Instead of buying isolated boards, we focus on corridor domination to build repetition and trust.",
        "From automated artwork specs to real-time proof-of-execution monitoring, following a structured media blueprint eliminates guesswork and ensures every rupee spent delivers measurable footfall and awareness.",
      ],
      highlights: [
        "Data-backed site selection using daily vehicular and footfall metrics",
        "End-to-end transparency on base rates, printing, and mounting costs",
        "Rapid multi-city campaign rollout in under 48 hours",
      ],
    },
    {
      id: 4,
      title: "The New Disney-Reliance Merger: What it Means for Advertisers in India",
      category: "Industry News",
      date: "August 08, 2025",
      readTime: "4 min read",
      author: "Market Watch",
      excerpt:
        "Explore how media consolidation is reshaping ad rates in India and why diversifying into outdoor and transit media is now critical for brands.",
      content: [
        "The landmark consolidation in India's broadcast and streaming landscape has created a unified powerhouse controlling major entertainment and sports rights. For advertisers, this changes the dynamics of pricing power and inventory availability.",
        "As digital and television ad slots become more competitive during peak seasons, media planners are increasingly turning to Out-Of-Home (OOH) and retail media networks to maintain cost-effective reach.",
        "Outdoor advertising remains an unskippable, ad-block-proof medium that offers 24/7 visibility in prime urban centers at a fraction of prime-time broadcast CPMs.",
      ],
      highlights: [
        "Impact of media consolidation on festive and sports ad pricing",
        "Why OOH & Transit media offer the best hedge against rising digital CPMs",
        "Emerging opportunities in programmatic DOOH across Indian metros",
      ],
    },
    {
      id: 5,
      title: "Top 10 Outdoor Advertising Trends to Watch Out For This Festive Season",
      category: "Trends",
      date: "September 12, 2025",
      readTime: "5 min read",
      author: "Creative Studio",
      excerpt:
        "From 3D anamorphic displays to hyper-local transit wraps, see how top brands are capturing festive shoppers across major Indian cities.",
      content: [
        "The festive quarter represents the biggest consumer spending wave in India. To stand out amidst the clutter, brands are pushing creative boundaries with immersive outdoor formats.",
        "Anamorphic 3D LED screens at major shopping districts, illuminated backlit gantries on flyovers, and full metro train wraps are dominating media plans this year. Consumers don't just view these ads—they film and share them on social media.",
        "Integrating QR codes, dynamic countdown timers for festive sales, and location-based store directions on mall facades are turning static awareness boards into direct conversion engines.",
      ],
      highlights: [
        "Rise of 3D anamorphic DOOH screens in high-footfall retail hubs",
        "Social-viral potential of innovative 3D cutouts and backlit hoardings",
        "Hyper-local mall & airport branding strategies for premium audiences",
      ],
    },
  ];

  return (
    <>
      <section className="w-full bg-[#F8FAFC] py-16 md:py-24 border-b border-gray-200 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 md:mb-14"
          >
            <div>
              <div className="inline-flex items-center gap-2.5 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5A93D]" />
                <span className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">
                  Insights & Guides
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-[#0B111A] tracking-tighter leading-none">
                Popular <span className="text-[#E5A93D]">Blog Posts</span>
              </h2>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={scrollLeft}
                className="w-11 h-11 bg-white rounded-full shadow-sm flex items-center justify-center hover:bg-[#0B111A] text-[#0B111A] hover:text-white transition-all duration-300 border border-gray-200 hover:border-[#0B111A] active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
              </button>
              <button
                onClick={scrollRight}
                className="w-11 h-11 bg-white rounded-full shadow-sm flex items-center justify-center hover:bg-[#0B111A] text-[#0B111A] hover:text-white transition-all duration-300 border border-gray-200 hover:border-[#0B111A] active:scale-95"
              >
                <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>
          </motion.div>

          <div className="relative group">
            <div
              ref={scrollContainerRef}
              className="flex gap-5 md:gap-7 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-8 pt-2 px-1"
            >
              {blogPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="min-w-[290px] sm:min-w-[350px] md:min-w-[390px] max-w-[390px] flex-shrink-0"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedPost(post)}
                    className="w-full h-full text-left bg-white rounded-[28px] p-3.5 cursor-pointer group/card flex flex-col justify-between border border-gray-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_24px_48px_rgba(11,17,26,0.08)] hover:-translate-y-2 hover:border-[#E5A93D]/60 transition-all duration-500"
                  >
                    <div className="w-full">
                      <div className="w-full h-[180px] md:h-[210px] bg-[#F8FAFC] rounded-[20px] relative flex flex-col items-center justify-center overflow-hidden border border-gray-100 group-hover/card:bg-gray-50 transition-colors duration-500">
                        <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover/card:scale-110 group-hover/card:border-[#E5A93D]/40 transition-all duration-500 mb-2">
                          <ImageIcon className="w-6 h-6 text-gray-400 group-hover/card:text-[#E5A93D] transition-colors duration-500" />
                        </div>
                        <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider group-hover/card:text-[#0B111A]/60 transition-colors duration-300">
                          {post.category}
                        </span>

                        <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md text-[#0B111A] border border-gray-200/80 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                          Article 0{index + 1}
                        </div>

                        <div className="absolute top-3.5 right-3.5 bg-[#0B111A]/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wide">
                          {post.readTime}
                        </div>
                      </div>

                      <h3 className="font-black text-[#0B111A] text-base md:text-lg leading-snug group-hover/card:text-[#E5A93D] transition-colors duration-300 px-2 pt-5 pb-2 line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-xs text-gray-500 font-medium px-2 pb-4 line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="w-full px-2 pb-2 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400 group-hover/card:text-[#0B111A] transition-colors">
                        Read Full Story
                      </span>
                      <div className="w-9 h-9 rounded-full bg-[#F8FAFC] border border-gray-200/80 flex items-center justify-center group-hover/card:bg-[#E5A93D] group-hover/card:border-[#E5A93D] transition-all duration-300">
                        <ArrowUpRight
                          className="w-4 h-4 text-[#0B111A] group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 transition-transform duration-300"
                          strokeWidth={2.5}
                        />
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPost(null)}
            className="fixed inset-0 z-[100] bg-[#0B111A]/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 30 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-gray-200 rounded-[32px] w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.35)] relative"
            >
              <div className="relative h-52 sm:h-64 bg-gradient-to-br from-[#0B111A] via-[#131D2B] to-[#1E293B] p-6 sm:p-10 flex flex-col justify-between shrink-0 overflow-hidden">
                <div className="absolute -right-20 -top-20 w-72 h-72 bg-[#E5A93D]/15 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between relative z-10">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5A93D] text-[#0B111A] text-xs font-black uppercase tracking-widest">
                    <Sparkles className="w-3.5 h-3.5" />
                    {selectedPost.category}
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedPost(null)}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#0B111A] flex items-center justify-center transition-all duration-200 backdrop-blur-md"
                  >
                    <X className="w-5 h-5" strokeWidth={2.5} />
                  </button>
                </div>

                <div className="relative z-10">
                  <h2 className="text-xl sm:text-3xl font-black text-white leading-tight tracking-tight mb-4">
                    {selectedPost.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-300">
                    <span className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-[#E5A93D]" />
                      {selectedPost.author}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#E5A93D]" />
                      {selectedPost.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#E5A93D]" />
                      {selectedPost.readTime}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-10 overflow-y-auto space-y-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                <p className="text-base sm:text-lg font-bold text-[#0B111A] leading-relaxed border-l-4 border-[#E5A93D] pl-4 bg-[#F8FAFC] py-3 pr-4 rounded-r-xl">
                  {selectedPost.excerpt}
                </p>

                <div className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed font-medium">
                  {selectedPost.content.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                <div className="bg-[#F8FAFC] border border-gray-200/80 rounded-2xl p-5 sm:p-6">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#0B111A] mb-4">
                    Key Takeaways
                  </h4>
                  <ul className="space-y-3">
                    {selectedPost.highlights.map((point, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-sm font-bold text-[#0B111A]"
                      >
                        <CheckCircle2 className="w-5 h-5 text-[#E5A93D] shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="px-6 sm:px-10 py-4 bg-[#F8FAFC] border-t border-gray-200 flex items-center justify-between shrink-0">
                <span className="text-xs font-bold text-gray-400">
                  BookmyadSpace Media Insights
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedPost(null)}
                  className="px-6 py-2.5 rounded-full bg-[#0B111A] hover:bg-[#E5A93D] text-white hover:text-[#0B111A] font-black text-xs uppercase tracking-widest transition-colors duration-300"
                >
                  Close Article
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}