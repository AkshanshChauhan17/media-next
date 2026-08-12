import Link from "next/link";
import { Phone, CheckCircle2, Users, Handshake, ExternalLink } from "lucide-react";

export default function Footer() {
  const topLinks = [
    { name: "Contact Us", icon: Phone, href: "/contact" },
    { name: "About Us", icon: CheckCircle2, href: "/about" },
    { name: "Our Clients", icon: Users, href: "/clients" },
    { name: "Agency Partner", icon: Handshake, href: "/agency" },
  ];

  const usefulLinks = [
    "Your Guide to The Media Ant", "Become an Agency Partner",
    "Terms and Condition", "List your Media",
    "Testimonials", "Privacy Policy",
    "Deals", "Careers"
  ];

  const tools = [
    "Campaign Brief", "ROAS Calculator",
    "MASH", "Ads",
    "Marketing Calculators", "Media Recommendation",
    "AI Marketing Tools", "AI Creative Generator",
    "Budget Estimator"
  ];

  const followLinks = [
    "Blog", "Facebook",
    "Twitter", "LinkedIn",
    "Instagram", "Pinterest",
    "Quora", "Press"
  ];

  const industries = [
    "Shopping & Retail", "Fashion & Lifestyle",
    "Food & Restaurant", "Travel & Tourism",
    "FMCG", "Entertainment",
    "Finance", "Education & Skill",
    "Healthcare", "Home Decor & Construction",
    "Engineering"
  ];

  const advertisingCategories = [
    {
      title: "Popular in Digital Advertising",
      links: ["CPC Advertising", "CPM Advertising", "Performance Marketing", "MX Player Advertising"]
    },
    {
      title: "Popular in Television Advertising",
      links: ["DD National Advertising", "Sun TV Advertising", "Star Vijay Advertising", "Tamil TV Channels"]
    },
    {
      title: "Popular in Radio Advertising",
      links: ["Radio Mirchi Advertising", "Telugu Radio Advertising", "Red FM Advertising", "Big FM Advertising"]
    },
    {
      title: "Popular in Airport Advertising",
      links: ["Air India Advertising", "Mumbai Airport Advertising", "Delhi Airport", "SpiceJet Advertising"]
    }
  ];

  return (
    <footer className="w-full bg-[#171136] text-white pt-12 pb-8 px-4 md:px-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 pb-8 border-b border-white/10">
          {topLinks.map((item, index) => (
            <div key={item.name} className="flex items-center gap-4 md:gap-8">
              <Link href={item.href} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <item.icon className="w-5 h-5 text-[#FFD166]" strokeWidth={2} />
                <span className="font-semibold text-sm md:text-base tracking-wide">{item.name}</span>
              </Link>
              {index < topLinks.length - 1 && (
                <span className="text-white/20 hidden md:block">|</span>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 py-12 border-b border-white/10">
          <div>
            <h4 className="font-bold text-lg mb-6">Useful Links</h4>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              {usefulLinks.map((link) => (
                <Link key={link} href="#" className="text-gray-400 hover:text-white text-[13px] transition-colors">
                  {link}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Tools</h4>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              {tools.map((link) => (
                <Link key={link} href="#" className="text-gray-400 hover:text-white text-[13px] transition-colors">
                  {link}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Follow</h4>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              {followLinks.map((link) => (
                <a key={link} href="#" className="text-gray-400 hover:text-white text-[13px] transition-colors flex items-center gap-1.5 group">
                  {link}
                  <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Popular Industries</h4>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              {industries.map((link) => (
                <Link key={link} href="#" className="text-gray-400 hover:text-white text-[13px] transition-colors">
                  {link}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-10 pb-6">
          {advertisingCategories.map((category) => (
            <div key={category.title}>
              <h4 className="font-bold text-[15px] mb-5">{category.title}</h4>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                {category.links.map((link) => (
                  <Link key={link} href="#" className="text-gray-400 hover:text-white text-[13px] transition-colors">
                    {link}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}