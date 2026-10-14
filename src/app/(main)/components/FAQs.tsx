"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What does BookmyadSpace do?",
      answer:
        "BookmyadSpace is a media discovery and booking platform that helps brands and agencies plan, execute, and monitor their advertising campaigns across various media channels.",
    },
    {
      question: "Why should brands work with BookmyadSpace?",
      answer:
        "We provide transparent pricing, a massive inventory of ad spaces, and data-driven insights to ensure your campaigns reach the right audience effectively and within budget.",
    },
    {
      question: "How does BookmyadSpace simplify media planning?",
      answer:
        "Our intuitive platform allows you to discover, compare, and select media options seamlessly. You can build comprehensive media plans, calculate estimates, and manage everything from a single dashboard.",
    },
    {
      question: "What types of advertising services does BookmyadSpace offer?",
      answer:
        "We offer advertising options across Digital, Television, Radio, Newspaper, Magazine, Outdoor (OOH), Cinema, Transit, and Influencer marketing.",
    },
    {
      question: "Who can advertise with BookmyadSpace?",
      answer:
        "Anyone from small local businesses and startups to large multinational corporations and advertising agencies can use our platform to run ad campaigns.",
    },
    {
      question: "What makes BookmyadSpace different from traditional agencies?",
      answer:
        "Unlike traditional agencies, we offer complete transparency in rates, self-serve tools for discovery and planning, and access to a much wider array of non-traditional media options.",
    },
    {
      question: "How do I book an ad through BookmyadSpace?",
      answer:
        "Simply search for your desired media option, review the rates and details, add it to your media plan, and submit the plan for execution. Our team will handle the rest.",
    },
    {
      question: "Are advertising rates negotiable?",
      answer:
        "The rates displayed are highly competitive and standardized. However, for large volume bookings or long-term campaigns, our media planners can help negotiate the best possible deals.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-gray-100 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F8FAFC] border border-gray-200 text-[#0B111A] text-xs font-black uppercase tracking-[0.22em] mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-[#E5A93D]" strokeWidth={2.5} />
            Got Questions?
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-[#0B111A] tracking-tighter leading-none mb-4">
            Frequently Asked <span className="text-[#E5A93D]">Questions</span>
          </h2>

          <p className="text-gray-500 text-sm sm:text-base font-medium max-w-xl">
            Everything you need to know about planning, comparing, and booking high-impact media spaces.
          </p>
        </motion.div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`rounded-[24px] border transition-all duration-300 ${
                  isOpen
                    ? "bg-[#F8FAFC] border-[#E5A93D] shadow-[0_12px_35px_rgba(11,17,26,0.06)]"
                    : "bg-white border-gray-200/90 hover:border-gray-300 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between text-left px-6 py-5 sm:px-8 sm:py-6 gap-4 group"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xs font-black tracking-widest px-2.5 py-1 rounded-lg border transition-colors ${
                        isOpen
                          ? "bg-[#E5A93D] text-[#0B111A] border-[#E5A93D]"
                          : "bg-[#F8FAFC] text-gray-400 border-gray-200 group-hover:text-[#0B111A]"
                      }`}
                    >
                      0{index + 1}
                    </span>
                    <span
                      className={`text-base sm:text-lg font-black tracking-tight transition-colors ${
                        isOpen
                          ? "text-[#0B111A]"
                          : "text-[#0B111A]/90 group-hover:text-[#E5A93D]"
                      }`}
                    >
                      {faq.question}
                    </span>
                  </div>

                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                      isOpen
                        ? "bg-[#0B111A] text-[#E5A93D] border-[#0B111A] rotate-180"
                        : "bg-[#F8FAFC] text-[#0B111A] border-gray-200 group-hover:border-[#E5A93D] group-hover:bg-[#E5A93D]"
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="w-4 h-4" strokeWidth={2.5} />
                    ) : (
                      <Plus className="w-4 h-4" strokeWidth={2.5} />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 sm:px-8 sm:pb-7 pt-1 border-t border-gray-200/60">
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium pl-0 sm:pl-11">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}