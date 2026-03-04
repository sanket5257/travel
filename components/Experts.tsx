"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { leaders } from "@/lib/leaders";
import type { Leader } from "@/lib/leaders";

gsap.registerPlugin(ScrollTrigger);

const PRIMARY = "#111827";

export function LeaderCard({
  leader,
}: {
  leader: Leader;
}) {
  return (
    <div className="leader-card group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
      <div className="px-6 pt-8 pb-6 flex flex-col items-center text-center flex-1">
        <div
          className="w-[120px] h-[120px] rounded-full p-[3px] mb-5"
          style={{
            background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY}80)`,
          }}
        >
          <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 relative">
            <Image
              src={leader.image}
              alt={leader.name}
              fill
              className="object-cover"
              sizes="120px"
            />
          </div>
        </div>

        <h3 className="text-[17px] font-bold text-gray-900 mb-1">
          {leader.name}
        </h3>
        <span
          className="text-[13px] font-semibold mb-3"
          style={{ color: PRIMARY }}
        >
          {leader.role}
        </span>

        <p className="text-[13px] text-gray-500 leading-[1.7] flex-1">
          {leader.description}
        </p>
      </div>

      <div
        className="flex items-center justify-center rounded-b-2xl"
        style={{ backgroundColor: PRIMARY }}
      >
        <Link
          href={leader.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-11 text-white/80 hover:text-white transition-colors border-r border-white/20"
          aria-label={`WhatsApp ${leader.name}`}
        >
          <Phone className="w-[18px] h-[18px]" />
        </Link>
        <Link
          href={leader.email}
          className="flex items-center justify-center w-12 h-11 text-white/80 hover:text-white transition-colors"
          aria-label={`Email ${leader.name}`}
        >
          <Mail className="w-[18px] h-[18px]" />
        </Link>
      </div>
    </div>
  );
}

export default function TrekkingLeaders() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".leaders-heading", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
      gsap.from(".leader-card", {
        scrollTrigger: { trigger: ".leader-card", start: "top 80%" },
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
      id="leaders"
      className="py-16 sm:py-24 xl:py-32 px-5 sm:px-8 lg:px-12 max-w-[1200px] xl:max-w-[1400px] mx-auto"
    >
      <div className="leaders-heading text-center mb-12 sm:mb-16">
        <h2 className="font-serif text-[2rem] sm:text-[2.75rem] xl:text-[3.25rem] leading-[1.12] text-gray-900 mb-3">
          Our Trekking Leaders
        </h2>
        <div
          className="mx-auto w-12 h-[3px] rounded-full"
          style={{ backgroundColor: PRIMARY }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {leaders.map((leader) => (
          <LeaderCard key={leader.name} leader={leader} />
        ))}
      </div>

      <div className="text-center mt-10">
        <Link
          href="/leaders"
          className="inline-flex items-center gap-2 border border-gray-900 text-gray-900 px-7 py-3 rounded-full text-[13px] font-semibold tracking-wide hover:bg-gray-900 hover:text-white transition-colors"
        >
          View All
        </Link>
      </div>
    </section>
  );
}
