"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ───── data ───── */

const stats = [
  { value: "5000+", label: "Trekkers Community" },
  { value: "50+", label: "Successful Treks & Trips" },
  { value: "3+", label: "Years of Adventure" },
  { value: "98%", label: "Customer Satisfaction Rate" },
];

const teamMembers = [
  {
    name: "Sanket Patil",
    role: "Founder & CEO",
    image: "/images/team/sanket.jpg",
  },
  {
    name: "Rahul Sharma",
    role: "Chief Trail Expert",
    image: "/images/team/rahul.jpg",
  },
  {
    name: "Priya Deshmukh",
    role: "Trip Coordinator",
    image: "/images/team/priya.jpg",
  },
  {
    name: "Amit Kulkarni",
    role: "Gear Specialist",
    image: "/images/testimonials/amit.jpg",
  },
  {
    name: "Sneha Joshi",
    role: "Adventure Planner",
    image: "/images/testimonials/sneha.jpg",
  },
  {
    name: "Rahul Verma",
    role: "Safety Expert",
    image: "/images/testimonials/rahul.jpg",
  },
];

/* ───── component ───── */

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".abt-anim").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 85%" },
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      });

      gsap.utils.toArray<HTMLElement>(".abt-img").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%" },
          scale: 1.05,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const scrollToContent = () => {
    const el = document.getElementById("about-content");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={pageRef}>
      {/* ─── Hero Banner ─── */}
      <section className="bg-white pt-20 sm:pt-24 lg:pt-28">
        {/* SVG clip-path: large top-left curve + rounded bottom corners */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <clipPath id="hero-clip" clipPathUnits="objectBoundingBox">
              <path d="M 0.18 0 L 1 0 L 1 0.94 Q 1 1, 0.97 1 L 0.03 1 Q 0 1, 0 0.94 L 0 0.24 Q 0 0, 0.18 0 Z" />
            </clipPath>
          </defs>
        </svg>

        <div className="max-w-[1200px] xl:max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          {/* Image card — full width, clip-path for shape */}
          <div
            className="relative h-[40vh] sm:h-[50vh] lg:h-[60vh] xl:h-[65vh]"
            style={{ clipPath: "url(#hero-clip)" }}
          >
            <Image
              src="/images/about/hero-1.jpg"
              alt="About Us"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/35" />
            <div className="relative z-10 flex items-center justify-center h-full px-5">
              <h1 className="font-serif text-white text-[3rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7.5rem] xl:text-[9rem] leading-[0.92] tracking-tight uppercase text-center">
                About Us
              </h1>
            </div>
          </div>

          {/* Subtitle + scroll arrow — below the image */}
          <div className="flex items-center justify-between mt-5 sm:mt-6 lg:mt-7">
            <p className="text-emerald-600 text-[11px] sm:text-[12px] lg:text-[13px] italic max-w-[300px] leading-[1.65]">
              Curated Group Adventures Across India&apos;s Most Stunning Landscapes
            </p>
            <button
              onClick={scrollToContent}
              className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-500 transition shrink-0"
            >
              <ArrowDown className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
        </div>
      </section>

      {/* ─── Big Title ─── */}
      <section
        id="about-content"
        className="bg-white pt-10 sm:pt-14 lg:pt-20 xl:pt-24 pb-12 sm:pb-16 lg:pb-20"
      >
        <div className="max-w-[1200px] xl:max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <h2 className="abt-anim font-serif text-[1.75rem] sm:text-[2.4rem] md:text-[3rem] lg:text-[3.6rem] xl:text-[4.2rem] leading-[1.08] text-gray-900">
            Discover the Thrill of Adventure with To&nbsp;The&nbsp;Moon Wayfarer
          </h2>
        </div>
      </section>

      {/* ─── About / Stats ─── */}
      <section id="our-story" className="bg-white pb-20 sm:pb-28 lg:pb-32">
        <div className="max-w-[1200px] xl:max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="abt-anim flex items-center gap-2.5 mb-3">
            <span className="w-[7px] h-[7px] rounded-full bg-emerald-500" />
            <span className="text-emerald-600 text-[13px] font-medium">
              About Us
            </span>
          </div>
          <h3 className="abt-anim font-serif text-[1.35rem] sm:text-[1.6rem] lg:text-[1.9rem] leading-[1.15] text-gray-900 mb-10 sm:mb-14">
            Get to Know About Us
          </h3>

          <div className="abt-anim grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            {/* 2×2 stats grid */}
            <div className="grid grid-cols-2">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`px-1 py-5 sm:py-7 ${i % 2 !== 0 ? "pl-5 sm:pl-8 border-l border-gray-200" : "pr-5 sm:pr-8"} ${i < 2 ? "pb-5 sm:pb-7 border-b border-gray-200" : "pt-5 sm:pt-7"}`}
                >
                  <span className="block font-serif text-[1.4rem] sm:text-[1.7rem] lg:text-[2rem] text-gray-900 leading-none mb-1.5">
                    {s.value}
                  </span>
                  <span className="text-gray-400 text-[11px] sm:text-[12px] leading-snug block">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Right description */}
            <div className="flex flex-col justify-between gap-6 lg:gap-8">
              <p className="font-serif text-[1.15rem] sm:text-[1.35rem] lg:text-[1.55rem] xl:text-[1.7rem] leading-[1.3] text-gray-900">
                Chase Horizons. Conquer Trails. Create Memories That Last a Lifetime.
              </p>
              <p className="text-gray-500 text-[13px] sm:text-[14px] leading-[1.8]">
                To The Moon Wayfarer is a Pune-based adventure travel community
                that organizes curated group treks and trips across India&apos;s
                most stunning landscapes — from the Sahyadris and Western Ghats
                to the mighty Himalayas. Led by experienced trek leaders, our
                adventures are safe, affordable, and unforgettable. We believe
                every trail has a story, and every journey builds confidence,
                connection, and lifelong memories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Our Team ─── */}
      <section id="trek-leaders" className="bg-gray-50 py-20 sm:py-28 lg:py-32">
        <div className="max-w-[1200px] xl:max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="abt-anim flex items-center gap-2.5 mb-6">
            <span className="w-[7px] h-[7px] rounded-full bg-emerald-500" />
            <span className="text-emerald-600 text-[13px] font-medium">
              Our Team
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8 sm:gap-x-6 sm:gap-y-10">
            {/* Text block – sits in the grid as one cell */}
            <div className="abt-anim col-span-2 sm:col-span-3 lg:col-span-1 flex flex-col justify-center">
              <h3 className="font-serif text-[1.35rem] sm:text-[1.6rem] lg:text-[1.9rem] leading-[1.15] text-gray-900 mb-4 sm:mb-5">
                Meet the Adventurers Behind To&nbsp;The&nbsp;Moon Wayfarer
              </h3>
              <p className="text-gray-500 text-[13px] sm:text-[14px] leading-[1.8] mb-8">
                Get to know the passionate team behind us&mdash;experienced trek
                leaders, trip coordinators, and adventure enthusiasts from Pune
                who live for the thrill of exploration and community building.
              </p>
              <a
                href="/#contact"
                className="inline-flex items-center gap-2 border border-gray-900 text-gray-900 px-6 py-3 rounded-full text-[13px] font-medium hover:bg-gray-900 hover:text-white transition-colors self-start"
              >
                Contact Our Team
              </a>
            </div>

            {/* Team members flow after text in the same grid */}
            {teamMembers.map((member) => (
              <div key={member.name} className="abt-img">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-3 bg-gray-200">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
                  />
                </div>
                <h4 className="text-gray-900 text-[14px] sm:text-[15px] font-semibold leading-tight mb-0.5">
                  {member.name}
                </h4>
                <p className="text-gray-400 text-[11px] sm:text-[12px]">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
        <div className="relative py-20 sm:py-28 lg:py-32 rounded-2xl sm:rounded-3xl overflow-hidden">
          <Image
            src="/images/destinations/himachal-2.jpg"
            alt="Forest trail"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative z-10 flex flex-col items-center text-center px-5 sm:px-8">
            <h2 className="font-serif text-white text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] leading-[1.15] mb-4 max-w-[500px]">
              Ready to Start Your Next Adventure?
            </h2>
            <p className="text-white/60 text-[13px] sm:text-[14px] leading-[1.7] max-w-[400px] mb-8">
              Join 5000+ trekkers in the To The Moon Wayfarer community.
              Safe, affordable, and unforgettable adventures await!
            </p>
            <a
              href="/#contact"
              className="inline-flex items-center gap-2 border border-white/80 text-white px-8 py-3.5 rounded-full text-[13px] font-medium hover:bg-white hover:text-gray-900 transition-colors"
            >
              Get Started Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
