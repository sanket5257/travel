"use client";

import { useRef, useEffect, useState, useCallback, useLayoutEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const tours = [
  {
    name: "Harihar Fort Trek",
    image:
      "https://images.unsplash.com/photo-1695210365465-f0c9839c362e?w=800&q=80",
    duration: "1 Day / 2 Nights",
    description:
      "Scale the iconic rock-cut steps of Harihar Fort in Nashik. Includes lunch, dinner, breakfast, trek badge, and expert leadership.",
    price: "\u20B91,500",
  },
  {
    name: "Katraj to Sinhagad",
    image:
      "https://images.unsplash.com/photo-1609232531309-25676b9b7080?w=800&q=80",
    duration: "1 Day",
    description:
      "Traverse the legendary night trail from Katraj to Sinhagad Fort\u2014one of Pune\u2019s most popular endurance treks through the Sahyadri hills.",
    price: "\u20B9444",
  },
  {
    name: "Trimbakeshwar Visit",
    image:
      "https://images.unsplash.com/photo-1719465236914-71562b2c59dd?w=800&q=80",
    duration: "2 Days / 1 Night",
    description:
      "A spiritual and scenic journey to the sacred Trimbakeshwar Jyotirlinga temple with full meals, hotel stay, and guided sightseeing.",
    price: "\u20B95,555",
  },
  {
    name: "Rajmachi Fort Trek",
    image:
      "https://images.unsplash.com/photo-1702799464926-b5fb08efe25d?w=800&q=80",
    duration: "1 Day / 1 Night",
    description:
      "Camp under the stars at Rajmachi Fort with panoramic views of the Western Ghats, fireflies in season, and a community bonfire.",
    price: "\u20B91,800",
  },
  {
    name: "Kalsubai Peak Trek",
    image:
      "https://images.unsplash.com/photo-1708867817468-9f7a7aaa0d50?w=800&q=80",
    duration: "1 Day / 1 Night",
    description:
      "Summit Maharashtra\u2019s highest peak at 1,646m. Iron ladders, rocky patches, and a breathtaking sunrise await at the top.",
    price: "\u20B91,200",
  },
  {
    name: "Harishchandragad Trek",
    image:
      "https://images.unsplash.com/photo-1708589413212-cd22902e5caf?w=800&q=80",
    duration: "2 Days / 1 Night",
    description:
      "Explore the ancient Konkan Kada cliff, Kedareshwar cave temple, and lush green valleys on this iconic Sahyadri adventure.",
    price: "\u20B92,200",
  },
  {
    name: "Kedarkantha Trek",
    image:
      "https://images.unsplash.com/photo-1681045905442-3203fb0e6111?w=800&q=80",
    duration: "5 Days / 4 Nights",
    description:
      "A perfect winter trek in Uttarakhand through snow-laden trails, pine forests, and a stunning summit at 3,800m.",
    price: "\u20B97,500",
  },
  {
    name: "Triund Trek",
    image:
      "https://images.unsplash.com/photo-1601895912784-8774950a9089?w=800&q=80",
    duration: "2 Days / 1 Night",
    description:
      "Camp at the foothills of the Dhauladhar range in Himachal with stunning views of the Kangra Valley and Himalayan peaks.",
    price: "\u20B93,500",
  },
  {
    name: "Valley of Flowers Trek",
    image:
      "https://images.unsplash.com/photo-1723871493526-79bfa8d9402e?w=800&q=80",
    duration: "6 Days / 5 Nights",
    description:
      "Walk through UNESCO-listed alpine meadows bursting with rare Himalayan wildflowers in Uttarakhand\u2019s Chamoli district.",
    price: "\u20B98,500",
  },
];

export default function TopTours() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const dirRef = useRef<1 | -1>(1);

  const [page, setPage] = useState(0);
  const [cols, setCols] = useState<1 | 2 | 3>(3);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setCols(w < 640 ? 1 : w < 1024 ? 2 : 3);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const perPage = cols;
  const maxPage = Math.max(0, tours.length - perPage);
  const totalPages = maxPage + 1;

  useEffect(() => {
    setPage((p) => Math.min(p, maxPage));
  }, [maxPage]);

  const visible = tours.slice(page, page + perPage);

  const goNext = useCallback(() => {
    dirRef.current = 1;
    setPage((p) => Math.min(p + 1, maxPage));
  }, [maxPage]);

  const goPrev = useCallback(() => {
    dirRef.current = -1;
    setPage((p) => Math.max(p - 1, 0));
  }, []);

  // Animate progress bar
  useEffect(() => {
    if (!progressRef.current) return;
    const pct = ((page + 1) / totalPages) * 100;
    gsap.to(progressRef.current, {
      width: `${pct}%`,
      duration: 0.5,
      ease: "power2.out",
    });
  }, [page, totalPages]);

  // Slide cards on page change
  useLayoutEffect(() => {
    if (!cardsRef.current) return;
    const dir = dirRef.current;
    gsap.fromTo(
      cardsRef.current.children,
      { x: dir * 120, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power3.out" }
    );
  }, [page, cols]);

  // Entrance animations
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".tours-tag", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });

      gsap.from(".tours-heading", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });

      gsap.from(".tours-desc", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.2,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToHero = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="tours"
      className="py-16 sm:py-24 xl:py-32 px-5 sm:px-8 lg:px-12 max-w-[1200px] xl:max-w-[1400px] mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-6 mb-6">
        <div>
          <span className="tours-tag inline-block border border-gray-200 rounded-full px-4 py-1.5 text-[12px] text-gray-900 tracking-wide">
            /Popular Treks
          </span>
        </div>
        <div className="sm:max-w-[480px]">
          <h2 className="tours-heading font-serif text-[2rem] sm:text-[2.75rem] xl:text-[3.25rem] leading-[1.12] text-gray-900 mb-4 sm:mb-5">
            Upcoming Adventures & Treks
          </h2>
          <p className="tours-desc text-gray-900 text-[13px] sm:text-[14px] leading-[1.7]">
            Carefully curated group treks across India with all-inclusive
            packages. Full meals, expert leaders, and unforgettable
            experiences\u2014your next adventure starts here!
          </p>
        </div>
      </div>

      {/* Progress and Pagination */}
      <div className="flex items-center justify-between mb-8 sm:mb-12">
        {/* Progress bar */}
        <div className="relative w-32 sm:w-44 h-[2px] bg-gray-200 rounded-full overflow-hidden">
          <div
            ref={progressRef}
            className="absolute top-0 left-0 h-full bg-gray-900 rounded-full"
            style={{ width: `${((page + 1) / totalPages) * 100}%` }}
          />
        </div>
        <div className="flex items-center gap-3 sm:gap-5">
          <span className="text-[13px] text-gray-300">
            <span className="text-gray-900 font-semibold">{page + 1}</span> /{" "}
            {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={goPrev}
              disabled={page === 0}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition ${
                page === 0
                  ? "border-gray-100 text-gray-200 cursor-not-allowed"
                  : "border-gray-200 text-gray-400 hover:border-gray-900 hover:text-gray-900"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goNext}
              disabled={page === totalPages - 1}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                page === totalPages - 1
                  ? "bg-gray-300 text-white cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tour Cards */}
      <div
        ref={cardsRef}
        className={`grid gap-5 sm:gap-6 ${
          cols === 1 ? "grid-cols-1" : cols === 2 ? "grid-cols-2" : "grid-cols-3"
        }`}
      >
        {visible.map((tour, i) => (
          <div key={tour.name} className="group cursor-pointer">
            {/* Image */}
            <div className={`relative rounded-[14px] overflow-hidden mb-4 h-[260px] sm:h-[300px] lg:h-[340px] xl:h-[380px] ${cols === 3 && i === 1 ? "lg:h-[420px] xl:h-[460px]" : ""}`}>
              <Image
                src={tour.image}
                alt={tour.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
              />
            </div>

            {/* Info */}
            <h3 className="text-[16px] font-semibold text-gray-900">
              {tour.name}
            </h3>

            <div className="mt-2">
              <span className="text-[13px] text-gray-900">
                {tour.duration}
              </span>
              <p className="text-gray-900 text-[13px] mt-2 leading-relaxed">
                {tour.description}
              </p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-[13px] text-gray-900">
                  From{" "}
                  <span className="font-semibold text-gray-900">
                    {tour.price}
                  </span>
                </span>
                <button
                  onClick={scrollToHero}
                  className="bg-gray-900 border border-gray-900 text-white text-[12px] font-medium px-5 py-2 rounded-full hover:bg-gray-800 transition-all duration-300"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
