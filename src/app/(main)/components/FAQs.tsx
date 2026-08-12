"use client";

import { useState } from "react";
import { PlusCircle, MinusCircle } from "lucide-react";

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What does The Media Ant do?",
      answer: "The Media Ant is a media discovery and booking platform that helps brands and agencies plan, execute, and monitor their advertising campaigns across various media channels.",
    },
    {
      question: "Why should brands work with The Media Ant?",
      answer: "We provide transparent pricing, a massive inventory of ad spaces, and data-driven insights to ensure your campaigns reach the right audience effectively and within budget.",
    },
    {
      question: "How does The Media Ant simplify media planning?",
      answer: "Our intuitive platform allows you to discover, compare, and select media options seamlessly. You can build comprehensive media plans, calculate estimates, and manage everything from a single dashboard.",
    },
    {
      question: "What types of advertising services does The Media Ant offer?",
      answer: "We offer advertising options across Digital, Television, Radio, Newspaper, Magazine, Outdoor (OOH), Cinema, Transit, and Influencer marketing.",
    },
    {
      question: "Who can advertise with The Media Ant?",
      answer: "Anyone from small local businesses and startups to large multinational corporations and advertising agencies can use our platform to run ad campaigns.",
    },
    {
      question: "What makes The Media Ant different from traditional agencies?",
      answer: "Unlike traditional agencies, we offer complete transparency in rates, self-serve tools for discovery and planning, and access to a much wider array of non-traditional media options.",
    },
    {
      question: "How do I book an ad through The Media Ant?",
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
    <section className="max-w-[1600px] px-4 py-12 md:py-20 w-full bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-[#142642] mb-10">
          FAQ's
        </h2>

        <div className="flex flex-col gap-6 md:gap-8">
          {faqs.map((faq, index) => (
            <div key={index} className="flex flex-col">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between text-left group"
              >
                <span className="text-[15px] md:text-base font-bold text-[#142642] group-hover:text-[#5B46DF] transition-colors pr-8">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <MinusCircle
                    className="w-[22px] h-[22px] text-[#5B46DF] flex-shrink-0"
                    strokeWidth={1.5}
                  />
                ) : (
                  <PlusCircle
                    className="w-[22px] h-[22px] text-[#5B46DF] flex-shrink-0"
                    strokeWidth={1.5}
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
                <p className="text-gray-600 text-[14px] md:text-[15px] leading-relaxed max-w-4xl pr-8">
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