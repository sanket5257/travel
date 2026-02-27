"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const destinations = [
  {
    country: "Maharashtra",
    count: 12,
    images: [
      "https://images.unsplash.com/photo-1708867817468-9f7a7aaa0d50?w=600&q=80",
      "https://images.unsplash.com/photo-1619260584294-8a4e63f5ade5?w=600&q=80",
    ],
  },
  {
    country: "Himachal",
    count: 8,
    images: [
      "https://images.unsplash.com/photo-1601895912784-8774950a9089?w=600&q=80",
      "https://images.unsplash.com/photo-1709907153050-a668b4473c47?w=600&q=80",
    ],
  },
  {
    country: "Uttarakhand",
    count: 6,
    images: [
      "https://images.unsplash.com/photo-1643984953314-8ca84ac57a49?w=600&q=80",
      "https://images.unsplash.com/photo-1681446009293-21839c6cfe92?w=600&q=80",
    ],
  },
];

export default function Destinations() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".dest-tag", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });

      gsap.from(".dest-heading", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });

      gsap.from(".dest-right", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2,
      });

      if (cardsRef.current) {
        gsap.from(cardsRef.current.children, {
          scrollTrigger: { trigger: cardsRef.current, start: "top 80%" },
          y: 80,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToTours = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.querySelector("#tours");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="destinations"
      className="py-16 sm:py-24 xl:py-32 px-5 sm:px-8 lg:px-12 max-w-[1200px] xl:max-w-[1400px] mx-auto"
    >
      {/* Header */}
      <div className="mb-10 sm:mb-14">
        <span className="dest-tag inline-block border border-gray-200 rounded-full px-4 py-1.5 text-[12px] text-gray-900 tracking-wide mb-5 sm:mb-7">
          /Explore Regions
        </span>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 sm:gap-12">
          <h2 className="dest-heading font-serif text-[2rem] sm:text-[2.75rem] xl:text-[3.25rem] leading-[1.12] text-gray-900 max-w-[420px] xl:max-w-[500px]">
            Discover Adventure Regions
          </h2>
          <div className="dest-right sm:max-w-[340px] sm:text-right">
            <p className="text-gray-900 text-[13px] sm:text-[14px] leading-[1.7] mb-4 sm:mb-5">
              From the Western Ghats to the Himalayas, explore India's most
              stunning trek regions with adventures for every skill level.
            </p>
            <button
              onClick={scrollToTours}
              className="inline-flex items-center gap-3 bg-gray-900 text-white border border-gray-900 px-6 py-3 rounded-full text-[13px] font-medium hover:bg-gray-800 transition-all duration-300"
            >
              View All Adventures
              <span className="text-[10px] tracking-[0.25em]">
                &gt;&gt;&gt;
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Destination Cards */}
      <div
        ref={cardsRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
      >
        {destinations.map((dest) => (
          <div key={dest.country} className="group cursor-pointer">
            {/* ---- Mobile Card: single full-bleed image with overlay ---- */}
            <div className="block sm:hidden relative rounded-[14px] overflow-hidden">
              <div className="relative w-full h-[360px]">
                <Image
                  src={dest.images[0]}
                  alt={`${dest.country} scenery`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
              </div>
              {/* Badge */}
              <span className="absolute top-4 left-4 z-10 bg-white text-gray-900 text-[11px] font-semibold px-3.5 py-1.5 rounded-full shadow-sm">
                {dest.count} Treks
              </span>
              {/* Country */}
              <h3 className="absolute bottom-5 left-5 text-[20px] font-semibold text-white z-10">
                {dest.country}
              </h3>
            </div>

            {/* ---- Desktop Card: gray container + two images + name below ---- */}
            <div className="hidden sm:block relative bg-gray-50/80 rounded-[14px] p-2.5 hover:shadow-xl hover:shadow-gray-200/60 transition-all duration-500">
              {/* Badge */}
              <span className="absolute top-5 left-5 z-10 bg-white text-gray-900 text-[11px] font-semibold px-3.5 py-1.5 rounded-full shadow-sm">
                {dest.count} Treks
              </span>
              {/* Two Images */}
              <div className="flex gap-2 mb-3">
                <div className="relative w-1/2 h-[230px] xl:h-[280px] rounded-[10px] overflow-hidden">
                  <Image
                    src={dest.images[0]}
                    alt={`${dest.country} scenery`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="200px"
                  />
                </div>
                <div className="relative w-1/2 h-[230px] xl:h-[280px] rounded-[10px] overflow-hidden">
                  <Image
                    src={dest.images[1]}
                    alt={`${dest.country} culture`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="200px"
                  />
                </div>
              </div>
              {/* Country Name */}
              <h3 className="text-[16px] font-semibold text-gray-900 px-2 pb-2">
                {dest.country}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
