"use client";

import Link from "next/link";
import { Phone, CheckCircle2, Users, Handshake, Mail } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  const contactLinks = [
    { name: "About", icon: CheckCircle2, href: "/about" },
    { name: "Careers", icon: Users, href: "/careers" },
    { name: "List Your Media", icon: Handshake, href: "/list-your-media" },
    { name: "Contact", icon: Phone, href: "/contact" },
  ];

  const exploreLinks = [
    "Terms & Conditions",
    "Privacy Policy",
    "Agency Partner",
    "Deals",
    "Testimonials",
    "Guide to BookmyadSpace",
  ];

  const tools = [
    "ROAS Calculator",
    "Campaign Brief",
    "Media Recommendation",
    "Budget Estimator",
    "AI Creative Generator",
    "Marketing Calculators",
  ];

  // Updated Ad Services based on your requirement
  const services = [
    "Hoardings",
    "Digital Screens",
    "Transit Media",
    "Flyover",
    "Metros",
    "Roadways & Volvo Buses",
    "Malls",
    "Cinema / Multiplex", // Added as extra (etc.)
  ];

  return (
    <footer className="w-full bg-[#171923] text-[#F8F9FB] pt-10 pb-6 px-4 md:px-8 border-t border-[#1E293B]">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Links */}
        <div className="flex items-center justify-between pb-8 mb-10 border-b border-[#2A3441] text-sm font-medium">
          <div className="flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-gray-500"/>
            <span className="text-gray-400">help@bookmyadspace.com</span>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            {contactLinks.map((item) => (
              <Link key={item.name} href={item.href} className="flex items-center gap-2 group transition-colors">
                <item.icon className="w-4 h-4 text-[#DAA520] group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                <span className="text-[#F8F9FB] text-sm group-hover:text-[#DAA520] transition-colors">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Contact Links */}
        <div className="grid grid-cols-2 gap-4 mb-10 sm:hidden">
          {contactLinks.map((item) => (
            <Link key={item.name} href={item.href} className="flex items-center gap-2 group transition-colors">
              <item.icon className="w-4 h-4 text-[#DAA520] group-hover:scale-110 transition-transform" strokeWidth={2.5} />
              <span className="text-[#F8F9FB] text-sm group-hover:text-[#DAA520] transition-colors">{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Link Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 mb-10 text-[13px] font-normal leading-relaxed text-gray-400">
          <div>
            <h4 className="font-bold text-[15px] mb-5 text-[#F8F9FB] tracking-tight">Explore & Legal</h4>
            <div className="flex flex-col gap-y-2.5">
              {exploreLinks.map((link) => (
                <Link key={link} href="#" className="hover:text-[#DAA520] transition-colors">
                  {link}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[15px] mb-5 text-[#F8F9FB] tracking-tight">Our Services</h4>
            <div className="flex flex-col gap-y-2.5">
              {services.map((link) => (
                <Link key={link} href="#" className="hover:text-[#DAA520] transition-colors">
                  {link}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[15px] mb-5 text-[#F8F9FB] tracking-tight">Tools & Calculators</h4>
            <div className="flex flex-col gap-y-2.5">
              {tools.map((link) => (
                <Link key={link} href="#" className="hover:text-[#DAA520] transition-colors">
                  {link}
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:pl-8">
            <h4 className="font-bold text-[15px] mb-5 text-[#F8F9FB] tracking-tight">Connect With Us</h4>
            <div className="flex flex-col gap-y-2.5">
              <Link href="#" className="hover:text-[#DAA520] transition-colors">Blog</Link>
              <Link href="#" className="hover:text-[#DAA520] transition-colors">Press</Link>
              <div className="flex items-center gap-4 pt-3.5">
                <Link href="#" className="text-gray-500 hover:text-[#F8F9FB]"><i className="fab fa-facebook-f text-lg"/></Link>
                <Link href="#" className="text-gray-500 hover:text-[#F8F9FB]"><i className="fab fa-linkedin-in text-lg"/></Link>
                <Link href="#" className="text-gray-500 hover:text-[#F8F9FB]"><i className="fab fa-instagram text-lg"/></Link>
                <Link href="#" className="text-gray-500 hover:text-[#F8F9FB]"><i className="fab fa-twitter text-lg"/></Link>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Bottom Bar */}
        <div className="text-center text-[12px] pt-6 border-t border-[#2A3441] text-gray-600">
          &copy; {year} BookmyadSpace. All rights reserved.
        </div>
      </div>
    </footer>
  );
}