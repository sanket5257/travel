"use client";

import { useRef, useEffect, useState, useCallback, useLayoutEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSwipe } from "@/hooks/useSwipe";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    num: "01",
    image:
      "https://images.unsplash.com/photo-1618805714320-f8825019c1be?w=800&q=80",
    alt: "Expert trek leader guiding a group through Western Ghats",
    text: "Professionally managed treks led by friendly, experienced leaders who know every trail, every shortcut, and every story along the way.",
  },
  {
    num: "02",
    image:
      "https://i.pinimg.com/736x/90/55/d6/9055d6357c94ce7bf2c1c074ebad1943.jpg",
    alt: "Safe camping setup at Kedarkantha base",
    text: "Safety-first approach with basic first aid kits, proper gear checks, and well-planned routes\u2014so you can trek with complete peace of mind.",
  },
  {
    num: "03",
    image:
      "https://images.unsplash.com/photo-1660269040593-63eb316ac8d2?w=800&q=80",
    alt: "Lush green Western Ghats monsoon trail",
    text: "High-quality adventures at affordable prices\u2014because incredible experiences shouldn\u2019t break the bank. Full meals, stays, and transport included.",
  },
  {
    num: "04",
    image:
      "https://i.pinimg.com/736x/cd/4a/52/cd4a5200a2aaa899045c77c2818e20d9.jpg",
    alt: "Community of trekkers at Kalsubai summit",
    text: "Community-driven adventures that build confidence, connection, and lifelong memories. Every trip is a chance to make friends for life.",
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [page, setPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const dirRef = useRef<1 | -1>(1);

  // Determine items per page based on screen size
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const perPage = isMobile ? 1 : 2;
  const totalPages = Math.ceil(features.length / perPage);

  // Clamp page when switching between mobile/desktop
  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages - 1));
  }, [totalPages]);

  const visibleFeatures = features.slice(
    page * perPage,
    page * perPage + perPage
  );

  const goNext = useCallback(() => {
    dirRef.current = 1;
    setPage((p) => Math.min(p + 1, totalPages - 1));
  }, [totalPages]);

  const goPrev = useCallback(() => {
    dirRef.current = -1;
    setPage((p) => Math.max(p - 1, 0));
  }, []);

  useSwipe(cardsRef, { onSwipeLeft: goNext, onSwipeRight: goPrev });

  // Animate progress bar on page change
  useEffect(() => {
    if (!progressRef.current) return;
    const pct = ((page + 1) / totalPages) * 100;
    gsap.to(progressRef.current, {
      width: `${pct}%`,
      duration: 0.5,
      ease: "power2.out",
    });
  }, [page, totalPages]);

  // Slide cards horizontally on page change
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const prevPageRef = useRef(page);

  useLayoutEffect(() => {
    if (!cardsRef.current) return;
    // Only animate when page actually changed (not on isMobile flip)
    if (prevPageRef.current === page) return;
    prevPageRef.current = page;

    // Kill any in-flight tween before starting a new one
    if (tweenRef.current) tweenRef.current.kill();

    const dir = dirRef.current;
    const children = cardsRef.current.children;
    tweenRef.current = gsap.fromTo(
      children,
      { x: dir * 120, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power3.out" }
    );
  }, [page, isMobile]);

  // Entrance animations
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".about-tag", {
        scrollTrigger: { trigger: headerRef.current, start: "top 80%" },
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });

      gsap.from(".about-heading", {
        scrollTrigger: { trigger: headerRef.current, start: "top 75%" },
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.15,
      });

      gsap.from(".about-desc", {
        scrollTrigger: { trigger: headerRef.current, start: "top 75%" },
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.3,
      });

      gsap.from(".about-btn", {
        scrollTrigger: { trigger: headerRef.current, start: "top 75%" },
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.45,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToDestinations = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.querySelector("#destinations");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="bg-no-repeat"
      style={{ backgroundImage: "url('https://adven-theme.myshopify.com/cdn/shop/files/section-bgimage3.png?v=1620832615')", backgroundPosition: "center bottom -50px" }}
    >
    <section
      ref={sectionRef}
      id="about"
      className="py-16 sm:py-24 xl:py-32 px-5 sm:px-8 lg:px-12 max-w-[1200px] xl:max-w-[1400px] mx-auto"
    >
      {/* Header */}
      <div ref={headerRef} className="mb-10 sm:mb-16">
        <span className="about-tag inline-block border border-gray-200 rounded-full px-4 py-1.5 text-[12px] text-gray-900 tracking-wide mb-5 sm:mb-7">
          /About Us
        </span>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 sm:gap-12">
          <div>
            <h2 className="about-heading font-serif text-[2rem] sm:text-[2.75rem] xl:text-[3.25rem] leading-[1.12] text-gray-900 mb-4">
              Why Travel With Us?
            </h2>
            <p className="about-desc text-gray-900 text-[14px] sm:text-[15px] leading-[1.7] max-w-[480px]">
              Safe, affordable, and transformative travel that builds confidence,
              connection, and lifelong memories across India.
            </p>
          </div>
          <button
            onClick={scrollToDestinations}
            className="about-btn flex items-center gap-3 bg-gray-900 text-white px-7 py-3.5 rounded-full text-[13px] font-medium hover:bg-gray-800 transition-colors shrink-0 self-start sm:self-auto"
          >
            Learn More
            <span className="text-[10px] tracking-[0.25em]">&gt;&gt;&gt;</span>
          </button>
        </div>
      </div>

      {/* Feature Cards */}
      <div
        ref={cardsRef}
        className={`grid gap-8 sm:gap-10 mb-12 overflow-hidden ${
          perPage === 2 ? "grid-cols-2" : "grid-cols-1"
        }`}
      >
        {visibleFeatures.map((f) => (
          <div key={f.num} className="border border-gray-200 rounded-[20px] p-5 sm:p-6 xl:p-7">
            <div className="flex items-start justify-between gap-3 mb-5 sm:mb-6">
              <div className="relative w-[160px] sm:w-[210px] xl:w-[260px] h-[120px] sm:h-[145px] xl:h-[175px] rounded-xl overflow-hidden shrink-0">
                <Image
                  src={f.image}
                  alt={f.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 160px, 210px"
                />
              </div>
              <span className="font-serif text-[2rem] sm:text-[2.5rem] xl:text-[3rem] text-gray-900 leading-none">
                {f.num}
              </span>
            </div>
            <p className="text-gray-900 text-[15px] sm:text-[16px] font-medium leading-[1.7]">
              {f.text}
            </p>
          </div>
        ))}
      </div>

      {/* Progress & Navigation */}
      <div ref={controlsRef} className="flex items-center justify-between">
        {/* Progress bar */}
        <div className="relative w-32 sm:w-44 h-[2px] bg-gray-200 rounded-full overflow-hidden">
          <div
            ref={progressRef}
            className="absolute top-0 left-0 h-full bg-gray-900 rounded-full"
            style={{ width: `${((page + 1) / totalPages) * 100}%` }}
          />
        </div>

        {/* Arrows */}
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
    </section>
    </div>
  );
}
