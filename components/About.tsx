"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Compass,
  PhoneCall,
  BadgeDollarSign,
  Download,
  MessageSquareMore,
  ThumbsUp,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ───── data ───── */

const heroImages = [
  {
    src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&q=80",
    alt: "Mountain landscape",
  },
  {
    src: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80",
    alt: "Forest trail",
  },
  {
    src: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80",
    alt: "Hiking adventure",
  },
];

const stats = [
  { value: "5000+", label: "Trekkers Community" },
  { value: "50+", label: "Successful Treks" },
  { value: "3+", label: "Years of Adventure" },
];

const timeline = [
  {
    year: "2018",
    text: "Founded with a dream to make adventure travel accessible to everyone across India.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80",
  },
  {
    year: "2019",
    text: "Expanded our trek routes to cover the Sahyadris, Himalayas, and Western Ghats.",
    image: null,
  },
  {
    year: "2021",
    text: "Crossed 5,000 happy travelers and launched community-driven group treks.",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&q=80",
  },
  {
    year: "2025",
    text: "Reached 10,000+ travelers with 95+ curated destinations nationwide.",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&q=80",
  },
  {
    year: "2028",
    text: "Our vision — becoming India's most trusted adventure travel community.",
    image: null,
  },
];

const whyChoose = [
  {
    icon: Compass,
    rightIcon: Download,
    title: "Personalized itineraries tailored to your travel dreams",
  },
  {
    icon: PhoneCall,
    rightIcon: MessageSquareMore,
    title: "24/7 on-trip assistance and expert travel support",
  },
  {
    icon: BadgeDollarSign,
    rightIcon: ThumbsUp,
    title:
      "We offer transparent, competitive pricing designed to fit your budget",
  },
];

const logos = [
  "logo ✦ ipsum",
  "⊕ Logoipsum",
  "logo ⊞ ipsum",
  "● Logoipsum",
  "❖ Logoipsum",
];

/* ───── component ───── */

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      /* fade-up utility for any .about-anim element */
      gsap.utils.toArray<HTMLElement>(".about-anim").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 85%" },
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      });

      /* image scale reveal */
      gsap.utils.toArray<HTMLElement>(".about-img-reveal").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 85%" },
          scale: 1.08,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });
      });

      /* timeline items stagger */
      gsap.utils.toArray<HTMLElement>(".tl-item").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 85%" },
          y: 30,
          opacity: 0,
          duration: 0.6,
          delay: i * 0.08,
          ease: "power3.out",
        });
      });

      /* stat counters */
      gsap.utils.toArray<HTMLElement>(".stat-num").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%" },
          y: 20,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-white pt-20 sm:pt-28 xl:pt-36"
    >
      {/* ─── 1. Hero intro ─── */}
      <div className="max-w-[1200px] xl:max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* heading + description row */}
        <div className="about-anim flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-16 mb-10 sm:mb-14">
          <h2 className="font-serif text-[2.4rem] sm:text-[3rem] xl:text-[3.8rem] leading-[1.08] text-gray-900 shrink-0 max-w-[420px]">
            Your Journey,
            <br />
            Our Passion
          </h2>
          <p className="text-gray-500 text-[14px] sm:text-[15px] leading-[1.75] max-w-[480px] md:pt-3">
            Discover the inspiring story behind us — a place where travel dreams
            come true, unforgettable journeys begin, and every destination holds
            a new adventure waiting.
          </p>
        </div>

        {/* 3 image grid */}
        <div className="about-anim grid grid-cols-1 sm:grid-cols-[1.6fr_0.7fr_0.7fr] gap-3 sm:gap-4 mb-20 sm:mb-28">
          {heroImages.map((img, i) => (
            <div
              key={i}
              className="about-img-reveal relative w-full h-[320px] sm:h-[440px] xl:h-[560px] rounded-2xl overflow-hidden"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </div>
          ))}
        </div>

        {/* ─── 2. Mission + Stats ─── */}
        <div className="about-anim flex flex-col md:flex-row md:justify-between gap-8 md:gap-16 mb-6 sm:mb-10">
          <h2 className="font-serif text-[1.8rem] sm:text-[2.2rem] xl:text-[2.6rem] leading-[1.15] text-gray-900 max-w-[380px] shrink-0">
            A Collective Of Passionate
            <br />
            Minds Driven By Purpose
          </h2>
          <div className="max-w-[500px]">
            <p className="text-gray-500 text-[14px] sm:text-[15px] leading-[1.8] mb-10">
              Travel is more than visiting new places — it&apos;s about creating
              stories that stay with you forever. At our core, we turn every
              journey into an unforgettable experience. From the very beginning,
              our mission has been to craft personalized trips that celebrate
              culture, adventure, and connection.
            </p>
            <div className="flex items-start gap-8 sm:gap-12">
              {stats.map((s) => (
                <div key={s.label} className="stat-num">
                  <span className="block font-serif text-[2rem] sm:text-[2.5rem] xl:text-[2.8rem] text-gray-900 leading-none mb-1">
                    {s.value}
                  </span>
                  <span className="text-gray-400 text-[12px] sm:text-[13px]">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      

    
     
     
    </section>
  );
}
