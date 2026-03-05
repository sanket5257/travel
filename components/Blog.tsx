"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const defaultFilters = ["Trek/Trip Tips", "Destinations", "Travel Stories"];

const localBlogs = [
  {
    image: "/images/destinations/uttarakhand-1.jpg",
    tag: "HIMACHAL",
    category: "Destinations",
    date: "JAN 15, 2025",
    readTime: "8 MIN READ",
    title: "Into the Clouds: A First-Timer's Guide to Himalayan Treks/Trips",
    content: "Discover the magic of the Himalayas with our comprehensive guide for first-time trekkers. Learn about essential preparations, what to expect on the trail, and how to make the most of your mountain adventure.",
  },
  {
    image: "/images/blog/forts.jpg",
    tag: "MAHARASHTRA",
    category: "Travel Stories",
    date: "FEB 02, 2025",
    readTime: "6 MIN READ",
    title: "Fort Treks/Trips of the Sahyadris: History Beneath Your Feet",
    content: "Journey through time as we explore the magnificent forts of the Sahyadri range. Each fort tells a story of valor, strategy, and the rich Maratha heritage that shaped this region.",
  },
  {
    image: "/images/tours/kedarkantha.jpg",
    tag: "UTTARAKHAND",
    category: "Destinations",
    date: "DEC 20, 2024",
    readTime: "10 MIN READ",
    title: "Kedarkantha in Winter: Snow, Silence, and Summit Glory",
    content: "Experience the pristine beauty of Kedarkantha in winter. From snow-covered trails to breathtaking summit views, this trek offers an unforgettable winter wonderland experience.",
  },
  {
    image: "/images/tours/triund.jpg",
    tag: "TREK/TRIP TIPS",
    category: "Trek/Trip Tips",
    date: "NOV 10, 2024",
    readTime: "5 MIN READ",
    title: "Pack Light, Trek/Trip Far: The Ultimate Gear Checklist for Beginners",
    content: "Master the art of packing light with our essential gear checklist. Learn what to bring, what to leave behind, and how to prepare for a comfortable and safe trekking experience.",
  },
];

interface BlogItem {
  image: string;
  tag: string;
  category: string;
  date: string;
  readTime: string;
  title: string;
  content?: string;
}

export default function Blog() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [blogs, setBlogs] = useState<BlogItem[]>(localBlogs);
  const [filters, setFilters] = useState<string[]>(["All", ...defaultFilters]);
  const [selectedBlog, setSelectedBlog] = useState<BlogItem | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedBlog) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedBlog]);

  useEffect(() => {
    fetch("/api/blogs")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((b: { image: string; tag: string; category: string; date: string; read_time: string; title: string; content?: string }) => ({
            image: b.image,
            tag: b.tag,
            category: b.category,
            date: b.date,
            readTime: b.read_time,
            title: b.title,
            content: b.content,
          }));
          setBlogs(mapped);
          const categories = Array.from(new Set(mapped.map((b: BlogItem) => b.category).filter(Boolean)));
          setFilters(["All", ...categories]);
        }
      })
      .catch(() => {});
  }, []);

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
  const didDrag = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isDragging.current = true;
    didDrag.current = false;
    dragStartX.current = e.clientX;
    dragScrollLeft.current = el.scrollLeft;
    el.style.cursor = "grabbing";
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    const dx = e.clientX - dragStartX.current;
    if (Math.abs(dx) > 5) didDrag.current = true;
    if (didDrag.current) {
      e.preventDefault();
      scrollRef.current.scrollLeft = dragScrollLeft.current - dx;
    }
  }, []);

  const onPointerUp = useCallback(() => {
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
    <>
      {/* Blog Popup Modal — rendered via portal to avoid stacking context issues */}
      {selectedBlog && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setSelectedBlog(null)}
          style={{ margin: 0 }}
        >
          <div
            className="relative bg-white rounded-[20px] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedBlog(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-900 transition-colors shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image */}
            <div className="rounded-t-[20px] overflow-hidden">
              <Image
                src={selectedBlog.image}
                alt={selectedBlog.title}
                width={768}
                height={512}
                className="w-full h-auto object-contain"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[11px] font-bold tracking-wider text-[#2a6b5a]">
                  {selectedBlog.tag}
                </span>
                <span className="text-[11px] text-gray-400">{selectedBlog.date}</span>
                <span className="text-[11px] text-gray-400">&bull;</span>
                <span className="text-[11px] text-gray-400">{selectedBlog.readTime}</span>
              </div>

              <h2 className="font-serif text-[1.75rem] sm:text-[2.25rem] leading-[1.15] text-[#1a2332] mb-4">
                {selectedBlog.title}
              </h2>

              <p className="text-[14px] sm:text-[15px] leading-[1.8] text-gray-700">
                {selectedBlog.content || "Content coming soon..."}
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}

      <div
        className="bg-no-repeat relative"
        style={{ backgroundImage: "url('/images/bg/blog-bg.png')", backgroundPosition: "center bottom", backgroundSize: "100% auto" }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    <section
      ref={sectionRef}
      id="blog"
      className="py-16 sm:py-24 xl:py-32 px-5 sm:px-8 lg:px-12 max-w-[1200px] xl:max-w-[1400px] mx-auto"
    >
      <div className="rounded-[20px] sm:rounded-[28px] px-6 sm:px-10 lg:px-14 py-10 sm:py-14 lg:py-16 relative overflow-hidden">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-12 mb-8 sm:mb-10">
          <h2 className="blog-heading font-serif text-[2rem] sm:text-[2.75rem] xl:text-[3.25rem] leading-[1.12] text-[#1a2332]">
            Trail Stories
          </h2>
          <p className="blog-desc text-[#1a2332] text-[13px] sm:text-[14px] leading-[1.8] lg:max-w-[400px] lg:pt-2">
            Every Article Is Crafted To Bring You Closer To The Mountains,
            Fostering A Deeper Connection With The Trails Around Us.{" "}
            <span className="font-semibold">
              Get Inspired. Get Informed. Get Trekking/Travelling.
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
            className="hidden sm:flex lg:hidden absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#2a6b5a] items-center justify-center text-white shadow-lg hover:bg-[#235a4b] transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollRight}
            className="hidden sm:flex lg:hidden absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#2a6b5a] items-center justify-center text-white shadow-lg hover:bg-[#235a4b] transition-colors duration-300"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Cards */}
          <div
            ref={scrollRef}
            className="flex gap-5 sm:gap-6 overflow-x-auto lg:overflow-visible lg:grid lg:grid-cols-4 pb-4 lg:pb-0 scrollbar-hide cursor-grab lg:cursor-default select-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {filtered.map((blog) => (
              <div
                key={blog.title}
                className="blog-card shrink-0 w-[280px] sm:w-[320px] lg:w-auto cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!didDrag.current) {
                    setSelectedBlog(blog);
                  }
                }}
              >
                {/* Image */}
                <div className="relative w-full rounded-[12px] overflow-hidden h-[280px] sm:h-[320px] lg:h-[360px]">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 280px, 340px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-[13px] font-semibold line-clamp-2">{blog.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
      </div>
    </>
  );
}
