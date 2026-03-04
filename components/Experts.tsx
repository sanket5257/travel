"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PRIMARY = "#111827";

const experts = [
  {
    name: "Sanket Patil",
    role: "Founder & Trek Lead",
    image: "/images/team/sanket.jpg",
    description:
      "Passionate trekker and outdoor enthusiast with years of experience leading groups across the Sahyadris and Himalayas.",
    whatsapp: "https://wa.me/919999999999",
    email: "mailto:sanket@tothemoonwayfarer.com",
  },
  {
    name: "Rahul Sharma",
    role: "Senior Trek Leader",
    image: "/images/team/rahul.jpg",
    description:
      "Certified mountain guide with expertise in high-altitude treks, safety protocols, and wilderness first aid.",
    whatsapp: "https://wa.me/919999999998",
    email: "mailto:rahul@tothemoonwayfarer.com",
  },
  {
    name: "Priya Deshmukh",
    role: "Trip Coordinator",
    image: "/images/team/priya.jpg",
    description:
      "Handles all logistics, itinerary planning, and ensures every trip runs smoothly from start to finish.",
    whatsapp: "https://wa.me/919999999997",
    email: "mailto:priya@tothemoonwayfarer.com",
  },
];

export default function Experts() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".experts-heading", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
      gsap.from(".expert-card", {
        scrollTrigger: { trigger: ".expert-card", start: "top 80%" },
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power3.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experts"
      className="py-16 sm:py-24 xl:py-32 px-5 sm:px-8 lg:px-12 max-w-[1200px] xl:max-w-[1400px] mx-auto"
    >
      {/* Heading */}
      <div className="experts-heading text-center mb-12 sm:mb-16">
        <h2 className="font-serif text-[2rem] sm:text-[2.75rem] xl:text-[3.25rem] leading-[1.12] text-gray-900 mb-3">
          Talk to Our Experts
        </h2>
        <div
          className="mx-auto w-12 h-[3px] rounded-full"
          style={{ backgroundColor: PRIMARY }}
        />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {experts.map((expert) => (
          <div
            key={expert.name}
            className="expert-card group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col"
          >
            {/* Card Content */}
            <div className="px-6 pt-8 pb-6 flex flex-col items-center text-center flex-1">
              {/* Avatar with ring */}
              <div
                className="w-[120px] h-[120px] rounded-full p-[3px] mb-5"
                style={{
                  background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY}80)`,
                }}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 relative">
                  <Image
                    src={expert.image}
                    alt={expert.name}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </div>
              </div>

              {/* Name & Role */}
              <h3 className="text-[17px] font-bold text-gray-900 mb-1">
                {expert.name}
              </h3>
              <span
                className="text-[13px] font-semibold mb-3"
                style={{ color: PRIMARY }}
              >
                {expert.role}
              </span>

              {/* Description */}
              <p className="text-[13px] text-gray-500 leading-[1.7] flex-1">
                {expert.description}
              </p>
            </div>

            {/* Bottom bar with contact icons */}
            <div
              className="flex items-center justify-center rounded-b-2xl"
              style={{ backgroundColor: PRIMARY }}
            >
              <Link
                href={expert.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-11 text-white/80 hover:text-white transition-colors border-r border-white/20"
                aria-label={`WhatsApp ${expert.name}`}
              >
                <Phone className="w-[18px] h-[18px]" />
              </Link>
              <Link
                href={expert.email}
                className="flex items-center justify-center w-12 h-11 text-white/80 hover:text-white transition-colors"
                aria-label={`Email ${expert.name}`}
              >
                <Mail className="w-[18px] h-[18px]" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
