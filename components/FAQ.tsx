"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus, X } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: "Do you offer customizable travel itineraries?",
    answer:
      "Yes! We specialize in creating personalized itineraries tailored to your preferences. Whether you're interested in cultural landmarks, outdoor adventures, or unique experiences, our team will help craft the perfect journey.",
  },
  {
    question: "What is the best time to visit Japan?",
    answer:
      "Japan is beautiful year-round, but the most popular seasons are spring (March–May) for cherry blossoms and autumn (September–November) for vibrant foliage. Summer offers festivals, while winter is ideal for skiing and hot springs.",
  },
  {
    question: "Are your tours guided?",
    answer:
      "Yes, all our tours come with experienced, English-speaking guides who are passionate about sharing Japan's culture, history, and hidden gems. Private and small-group options are available.",
  },
  {
    question: "Do you provide assistance with visas?",
    answer:
      "Absolutely. We provide guidance on visa requirements and documentation to ensure a smooth application process. Our team will walk you through every step based on your nationality and travel plans.",
  },
  {
    question: "What is included in the trip cost?",
    answer:
      "Our packages typically include accommodation, guided tours, transportation within Japan, select meals, and entrance fees. International flights and travel insurance are not included but can be arranged upon request.",
  },
];

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    const trigger = sectionRef.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".faq-label",
        { y: 20, opacity: 0 },
        { scrollTrigger: { trigger, start: "top 80%", once: true }, y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      );

      gsap.fromTo(
        ".faq-heading",
        { y: 50, opacity: 0 },
        { scrollTrigger: { trigger, start: "top 75%", once: true }, y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.15 }
      );

      gsap.fromTo(
        ".faq-subtitle",
        { y: 30, opacity: 0 },
        { scrollTrigger: { trigger, start: "top 75%", once: true }, y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.3 }
      );

      gsap.fromTo(
        ".faq-item",
        { y: 30, opacity: 0 },
        { scrollTrigger: { trigger, start: "top 70%", once: true }, y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power3.out", delay: 0.4 }
      );

      gsap.fromTo(
        ".faq-image",
        { scale: 1.05, opacity: 0 },
        { scrollTrigger: { trigger, start: "top 70%", once: true }, scale: 1, opacity: 1, duration: 1, ease: "power3.out", delay: 0.3 }
      );

      gsap.fromTo(
        ".faq-cta-card",
        { y: 40, opacity: 0 },
        { scrollTrigger: { trigger, start: "top 50%", once: true }, y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.6 }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="py-16 sm:py-24 xl:py-32 px-5 sm:px-8 lg:px-12 max-w-[1200px] xl:max-w-[1400px] mx-auto"
    >
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Left Column */}
        <div>
          <span className="faq-label inline-block border border-gray-200 rounded-full px-4 py-1.5 text-[12px] text-gray-900 tracking-wide mb-5 sm:mb-7">
            /FAQs
          </span>

          <h2 className="faq-heading font-serif text-[2rem] sm:text-[2.75rem] xl:text-[3.25rem] leading-[1.12] text-gray-900 mb-4">
            Explore our FAQ section for{" "}
            <span className="text-gray-400">answers on trip planning.</span>
          </h2>

          <p className="faq-subtitle text-gray-500 text-[14px] sm:text-[15px] leading-[1.7] max-w-[520px] mb-8 sm:mb-10">
            We&apos;re here to help! Browse our FAQ section to get all the
            information you need to plan your perfect trip
          </p>

          {/* Accordion */}
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="faq-item border border-gray-200 rounded-2xl px-6 py-5 transition-all duration-300"
              >
                <button
                  onClick={() => toggle(i)}
                  className="flex items-center justify-between w-full text-left gap-4"
                >
                  <span className="text-[15px] sm:text-[16px] font-medium text-gray-900">
                    {faq.question}
                  </span>
                  <span className="shrink-0 w-6 h-6 flex items-center justify-center">
                    {openIndex === i ? (
                      <X className="w-[18px] h-[18px] text-gray-500" />
                    ) : (
                      <Plus className="w-[18px] h-[18px] text-gray-500" />
                    )}
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    openIndex === i
                      ? "grid-rows-[1fr] opacity-100 mt-3"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-gray-500 text-[13px] sm:text-[14px] leading-[1.7]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column — Image + CTA Card */}
        <div className="relative hidden lg:block">
          <div className="faq-image relative w-full h-[520px] xl:h-[600px] rounded-2xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1532236204992-f5e85c024202?w=800&q=80"
              alt="Aerial view of a busy crosswalk in Japan"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 0vw, 50vw"
            />
          </div>

          {/* Still Have Questions card */}
          <div className="faq-cta-card absolute bottom-6 right-6 bg-white rounded-2xl p-6 sm:p-7 max-w-[280px] shadow-lg">
            <h3 className="font-serif text-[1.25rem] sm:text-[1.4rem] text-gray-900 leading-tight mb-2">
              Still Have Questions?
            </h3>
            <p className="text-gray-500 text-[13px] leading-[1.7] mb-5">
              Need more help planning your perfect Japan journey? Our team is
              here to assist you with any questions or special requests
            </p>
            <a
              href="#contact"
              className="inline-block border border-gray-900 rounded-full px-6 py-2.5 text-[13px] font-medium text-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-300"
            >
              Contact us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
