"use client";

import { useState } from "react";
import { PlusCircle, MinusCircle } from "lucide-react";

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What does BookmyadSpace do?",
      answer: "BookmyadSpace is a media discovery and booking platform that helps brands and agencies plan, execute, and monitor their advertising campaigns across various media channels.",
    },
    {
      question: "Why should brands work with BookmyadSpace?",
      answer: "We provide transparent pricing, a massive inventory of ad spaces, and data-driven insights to ensure your campaigns reach the right audience effectively and within budget.",
    },
    {
      question: "How does BookmyadSpace simplify media planning?",
      answer: "Our intuitive platform allows you to discover, compare, and select media options seamlessly. You can build comprehensive media plans, calculate estimates, and manage everything from a single dashboard.",
    },
    {
      question: "What types of advertising services does BookmyadSpace offer?",
      answer: "We offer advertising options across Digital, Television, Radio, Newspaper, Magazine, Outdoor (OOH), Cinema, Transit, and Influencer marketing.",
    },
    {
      question: "Who can advertise with BookmyadSpace?",
      answer: "Anyone from small local businesses and startups to large multinational corporations and advertising agencies can use our platform to run ad campaigns.",
    },
    {
      question: "What makes BookmyadSpace different from traditional agencies?",
      answer: "Unlike traditional agencies, we offer complete transparency in rates, self-serve tools for discovery and planning, and access to a much wider array of non-traditional media options.",
    },
    {
      question: "How do I book an ad through BookmyadSpace?",
      answer: "Simply search for your desired media option, review the rates and details, add it to your media plan, and submit the plan for execution. Our team will handle the rest.",
    },
    {
      question: "Are advertising rates negotiable?",
      answer: "The rates displayed are highly competitive and standardized. However, for large volume bookings or long-term campaigns, our media planners can help negotiate the best possible deals.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-[1600px] px-4 py-12 md:py-20 w-full bg-white mx-auto">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-[#243839] mb-10">
          FAQ's
        </h2>

        <div className="flex flex-col gap-6">
          {faqs.map((faq, index) => (
            <div key={index} className="flex flex-col border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between text-left group"
              >
                <span className="text-[15px] md:text-base font-bold text-[#243839] group-hover:text-[#0A4D28] transition-colors pr-8">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <MinusCircle
                    className="w-[22px] h-[22px] text-[#C58B24] group-hover:text-[#0A4D28] transition-colors flex-shrink-0"
                    strokeWidth={2}
                  />
                ) : (
                  <PlusCircle
                    className="w-[22px] h-[22px] text-[#C58B24] group-hover:text-[#0A4D28] transition-colors flex-shrink-0"
                    strokeWidth={2}
                  />
                )}
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "max-h-[500px] opacity-100 mt-4"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-[#243839]/80 text-[14px] md:text-[15px] leading-relaxed max-w-4xl pr-8 font-medium">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}