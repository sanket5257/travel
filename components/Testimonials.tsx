"use client";

import { useRef, useEffect, useState, useCallback, useLayoutEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSwipe } from "@/hooks/useSwipe";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    name: "Amit K.",
    site: "Mumbai",
    quote:
      "Booking my trip was so easy! Everything from transport to meals was seamless, and the treks were absolutely enjoyable. The team made every moment feel special. Great service!",
  },
  {
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    name: "Sneha P.",
    site: "Bangalore",
    quote:
      "The organization was top-notch. From the moment we started to the farewell bonfire, everything was stress-free. The trek leaders were so friendly and made us feel completely safe.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    name: "Rahul M.",
    site: "Delhi",
    quote:
      "Punctual transfers, well-planned routes, and an incredible group vibe. I\u2019ve done many treks but this team truly stands out. Already booked my next adventure with them!",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const dirRef = useRef<1 | -1>(1);
  const [active, setActive] = useState(1); // Middle avatar is always active
  const hasAnimatedEntrance = useRef(false);

  const current = testimonials[active];

  // Reorder so active person is always in the middle
  const orderedAvatars = [
    testimonials[(active - 1 + testimonials.length) % testimonials.length],
    testimonials[active],
    testimonials[(active + 1) % testimonials.length],
  ];

  // Colour-split the quote and animate words
  const renderQuote = () => {
    if (!quoteRef.current) return;
    const words = current.quote.split(" ");
    const total = words.length;

    quoteRef.current.innerHTML = words
      .map((word, i) => {
        const progress = i / total;
        const lightness = Math.round(10 + progress * 50);
        const color = `hsl(0, 0%, ${lightness}%)`;
        return `<span class="inline-block overflow-hidden"><span class="quote-word inline-block" style="color:${color}">${word}</span></span>`;
      })
      .join(" ");
  };

  // Entrance scroll animation (runs once)
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".testi-tag", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });

      // Initial quote render + word animation on scroll
      renderQuote();
      if (quoteRef.current) {
        gsap.from(quoteRef.current.querySelectorAll(".quote-word"), {
          scrollTrigger: { trigger: quoteRef.current, start: "top 75%" },
          y: 50,
          opacity: 0,
          duration: 0.7,
          stagger: 0.025,
          ease: "power3.out",
          onComplete: () => {
            hasAnimatedEntrance.current = true;
          },
        });
      }

      gsap.from(".testi-avatars", {
        scrollTrigger: { trigger: ".testi-avatars", start: "top 88%" },
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });

      gsap.from(".testi-name", {
        scrollTrigger: { trigger: ".testi-name", start: "top 92%" },
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.3,
      });
    }, sectionRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Slide quote on avatar click (skip first render)
  useLayoutEffect(() => {
    if (!hasAnimatedEntrance.current) return;
    if (!quoteRef.current) return;

    const dir = dirRef.current;

    // Slide out old content
    gsap.to(quoteRef.current, {
      x: dir * -60,
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        renderQuote();
        // Slide in new content
        gsap.fromTo(
          quoteRef.current,
          { x: dir * 60, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, ease: "power3.out" }
        );
      },
    });

    // Slide the name too
    gsap.fromTo(
      ".testi-name",
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "power3.out", delay: 0.3 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const handleSelect = (index: number) => {
    if (index === active) return;
    dirRef.current = index > active ? 1 : -1;
    setActive(index);
  };

  const goNext = useCallback(() => {
    dirRef.current = 1;
    setActive((prev) => (prev + 1) % testimonials.length);
  }, []);

  const goPrev = useCallback(() => {
    dirRef.current = -1;
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useSwipe(quoteRef, { onSwipeLeft: goNext, onSwipeRight: goPrev });

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasAnimatedEntrance.current) return;
      dirRef.current = 1;
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="py-16 sm:py-28 xl:py-36 px-5 sm:px-8 lg:px-12 max-w-[1200px] xl:max-w-[1400px] mx-auto text-center overflow-hidden"
    >
      <span className="testi-tag inline-block border border-gray-200 rounded-full px-4 py-1.5 text-[12px] text-gray-900 tracking-wide mb-8 sm:mb-14">
        /What Trekkers Say
      </span>

      <div
        ref={quoteRef}
        className="font-serif text-[1.4rem] sm:text-[1.8rem] lg:text-[2.4rem] xl:text-[2.8rem] leading-[1.3] sm:leading-[1.25] max-w-[900px] xl:max-w-[1050px] mx-auto mb-8 sm:mb-10"
      />

      {/* Arrows */}
      <div className="flex items-center justify-center gap-3 mb-10 sm:mb-14">
        <button
          onClick={() => handleSelect((active - 1 + testimonials.length) % testimonials.length)}
          className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-900 hover:text-gray-900 transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleSelect((active + 1) % testimonials.length)}
          className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-gray-800 transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Avatars */}
      <div className="testi-avatars flex items-center justify-center gap-4 sm:gap-6 mb-6">
        {orderedAvatars.map((person, i) => {
          const isCenter = i === 1;
          return (
            <button
              key={person.name}
              onClick={() => {
                const originalIndex = testimonials.indexOf(person);
                handleSelect(originalIndex);
              }}
              className={`relative overflow-hidden rounded-2xl shadow-md transition-all duration-500 ${
                isCenter
                  ? "w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44 shadow-xl"
                  : "w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 opacity-80 hover:opacity-100"
              }`}
            >
              <Image
                src={person.image}
                alt={person.name}
                fill
                className={`object-cover transition-all duration-500 ${
                  isCenter ? "" : "grayscale"
                }`}
                sizes="(max-width: 640px) 112px, 160px"
              />
            </button>
          );
        })}
      </div>

      {/* Name */}
      <div className="testi-name">
        <p className="text-[15px] font-semibold text-gray-900">
          {current.name}
        </p>
        <p className="text-[12px] text-gray-900 mt-0.5">{current.site}</p>
      </div>
    </section>
  );
}
