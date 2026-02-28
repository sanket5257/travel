"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const filters = ["All", "Trek Tips", "Destinations", "Travel Stories"];

const blogs = [
  {
    image:
      "https://images.unsplash.com/photo-1643984953314-8ca84ac57a49?w=800&q=80",
    tag: "HIMACHAL",
    category: "Destinations",
    date: "JAN 15, 2025",
    readTime: "8 MIN READ",
    title: "Into the Clouds: A First-Timer's Guide to Himalayan Treks",
  },
  {
    image:
      "https://images.unsplash.com/photo-1695210365465-f0c9839c362e?w=800&q=80",
    tag: "MAHARASHTRA",
    category: "Travel Stories",
    date: "FEB 02, 2025",
    readTime: "6 MIN READ",
    title: "Fort Treks of the Sahyadris: History Beneath Your Feet",
  },
  {
    image:
      "https://images.unsplash.com/photo-1681045905442-3203fb0e6111?w=800&q=80",
    tag: "UTTARAKHAND",
    category: "Destinations",
    date: "DEC 20, 2024",
    readTime: "10 MIN READ",
    title: "Kedarkantha in Winter: Snow, Silence, and Summit Glory",
  },
  {
    image:
      "https://images.unsplash.com/photo-1601895912784-8774950a9089?w=800&q=80",
    tag: "TREK TIPS",
    category: "Trek Tips",
    date: "NOV 10, 2024",
    readTime: "5 MIN READ",
    title: "Pack Light, Trek Far: The Ultimate Gear Checklist for Beginners",
  },
];

export default function Blog() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? blogs
      : blogs.filter((b) => b.category === activeFilter);

  const isFirstRender = useRef(true);

  // Animate cards when filter changes (skip first render — entrance handles it)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!scrollRef.current) return;
    gsap.fromTo(
      scrollRef.current.children,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power3.out" }
    );
  }, [activeFilter]);

  const scrollLeft = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: -360, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: 360, behavior: "smooth" });
  };

  // Drag-to-scroll for desktop
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragScrollLeft.current = el.scrollLeft;
    el.setPointerCapture(e.pointerId);
    el.style.cursor = "grabbing";
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const dx = e.clientX - dragStartX.current;
    scrollRef.current.scrollLeft = dragScrollLeft.current - dx;
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(".blog-heading",
        { y: 50, opacity: 0 },
        { scrollTrigger: { trigger: sectionRef.current, start: "top 75%" }, y: 0, opacity: 1, duration: 0.9, ease: "power3.out", clearProps: "all" }
      );

      gsap.fromTo(".blog-desc",
        { y: 30, opacity: 0 },
        { scrollTrigger: { trigger: sectionRef.current, start: "top 72%" }, y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.2, clearProps: "all" }
      );

      gsap.fromTo(".blog-filter",
        { y: 20, opacity: 0 },
        { scrollTrigger: { trigger: sectionRef.current, start: "top 70%" }, y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power3.out", delay: 0.3, clearProps: "all" }
      );

      gsap.fromTo(".blog-card",
        { y: 60, opacity: 0 },
        { scrollTrigger: { trigger: ".blog-cards-wrap", start: "top 82%" }, y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out", clearProps: "all" }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="blog"
      className="py-16 sm:py-24 xl:py-32 px-5 sm:px-8 lg:px-12 max-w-[1200px] xl:max-w-[1400px] mx-auto"
    >
      <div className="bg-[#e5e5dc] rounded-[20px] sm:rounded-[28px] px-6 sm:px-10 lg:px-14 py-10 sm:py-14 lg:py-16 relative overflow-hidden">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-12 mb-8 sm:mb-10">
          <h2 className="blog-heading font-serif text-[2.5rem] sm:text-[3.5rem] lg:text-[4.5rem] xl:text-[5rem] leading-[1.05] text-[#1a2332]">
            Trail Stories
          </h2>
          <p className="blog-desc text-[#1a2332] text-[13px] sm:text-[14px] leading-[1.8] lg:max-w-[400px] lg:pt-2">
            Every Article Is Crafted To Bring You Closer To The Mountains,
            Fostering A Deeper Connection With The Trails Around Us.{" "}
            <span className="font-semibold">
              Get Inspired. Get Informed. Get Trekking.
            </span>
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2.5 mb-8 sm:mb-10">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`blog-filter text-[12px] sm:text-[13px] tracking-wide px-5 py-2 rounded-full border transition-all duration-300 ${
                activeFilter === filter
                  ? "bg-[#1a2332] text-white border-[#1a2332]"
                  : "bg-transparent text-[#1a2332] border-[#1a2332]/30 hover:border-[#1a2332]/60"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Divider + Cards */}
        <div className="blog-cards-wrap relative">
          {/* Scroll Arrows */}
          <button
            onClick={scrollLeft}
            className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#2a6b5a] items-center justify-center text-white shadow-lg hover:bg-[#235a4b] transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollRight}
            className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#2a6b5a] items-center justify-center text-white shadow-lg hover:bg-[#235a4b] transition-colors duration-300"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Cards */}
          <div
            ref={scrollRef}
            className="flex gap-5 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide cursor-grab select-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {filtered.map((blog, i) => (
              <div
                key={blog.title}
                className="blog-card flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[340px] cursor-pointer group"
              >
                {/* Top line */}
                <div className="w-full h-[1px] bg-[#1a2332]/20 mb-5" />

                {/* Image */}
                <div
                  className={`relative w-full rounded-[12px] overflow-hidden mb-4 ${
                    i % 2 === 0
                      ? "h-[280px] sm:h-[320px] lg:h-[360px]"
                      : "h-[220px] sm:h-[260px] lg:h-[300px]"
                  }`}
                >
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 280px, 340px"
                  />
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[11px] tracking-wide text-[#1a2332] border border-[#1a2332]/30 rounded-full px-3 py-1">
                    {blog.tag}
                  </span>
                  <span className="text-[11px] tracking-wide text-[#1a2332]/60">
                    {blog.date}{"  "}·{"  "}{blog.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-[17px] sm:text-[19px] leading-[1.3] text-[#1a2332]">
                  {blog.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
