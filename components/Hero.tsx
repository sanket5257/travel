"use client";

import { useRef, useEffect, useState, useCallback, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";

const slides = [
  {
    image: "/img/home1.jpg",
    destination: "Sahyadris",
    subtitle: "Western Ghats",
    title: "Chase Horizons. Conquer Trails.",
    description: "Curated group adventures across India\u2019s most stunning landscapes. Safe, affordable, and unforgettable.",
    rating: "4.9",
    cardImage: "/img/home1.jpg",
  },
  {
    image: "/img/home2.jpg",
    destination: "Himalayas",
    subtitle: "High Altitude Treks",
    title: "Where the Mountains Meet the Sky",
    description: "Trek through ancient trails, snow-capped passes, and valleys that take your breath away in every sense.",
    rating: "4.9",
    cardImage: "/img/home2.jpg",
  },
  {
    image: "/img/home3.jpg",
    destination: "Maharashtra",
    subtitle: "Fort Treks",
    title: "Conquer Historic Forts & Ridges",
    description: "Scale legendary Maratha forts with carved steps, rock-cut caves, and panoramic views of the Sahyadri range.",
    rating: "4.8",
    cardImage: "/img/home3.jpg",
  },
  {
    image: "/img/home4.jpeg",
    destination: "Nashik",
    subtitle: "Spiritual & Adventure",
    title: "Trails That Tell Ancient Stories",
    description: "From the sacred Trimbakeshwar temple to the rugged Sahyadri peaks\u2014discover where spirituality meets adventure.",
    rating: "4.8",
    cardImage: "/img/home4.jpeg",
  },
];

function StarIcon() {
  return (
    <svg className="w-3 h-3 text-yellow-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

const CARD_W = 192 + 12; // card width + gap

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const textRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const diveRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const currentRef = useRef(0);
  const hasEnteredRef = useRef(false);

  const [bgSlide, setBgSlide] = useState(0);
  const [stripPos, setStripPos] = useState(0);

  // Queue: 4 cards (2 full + half peek + 1 offscreen for slide-in)
  const queue = [1, 2, 3, 4].map((offset) => slides[(stripPos + offset) % slides.length]);

  // Entrance
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.4 });

    if (imagesRef.current[0]) {
      gsap.set(imagesRef.current[0], { clipPath: "inset(0% 0% 0% 0%)" });
      tl.from(imagesRef.current[0], { scale: 1.4, duration: 3, ease: "expo.out" });
    }

    tl.from(headingRef.current, { y: 120, opacity: 0, duration: 1.4, ease: "expo.out" }, "-=2.5")
      .from(subRef.current, { y: 60, opacity: 0, duration: 1, ease: "expo.out" }, "-=1")
      .from(btnRef.current, { y: 40, opacity: 0, duration: 0.8, ease: "expo.out" }, "-=0.7")
      .from(stripRef.current, { x: 300, opacity: 0, duration: 1.2, ease: "expo.out" }, "-=1.2");

    return () => { tl.kill(); };
  }, []);

  // Mark entrance done
  useEffect(() => { hasEnteredRef.current = true; }, []);

  // Auto-advance strip: first card fades out, strip slides left, then snap with new content
  const advanceStrip = useCallback(() => {
    if (isAnimating.current || !stripRef.current) return;
    isAnimating.current = true;

    const firstCard = stripRef.current.children[0];
    if (firstCard) gsap.to(firstCard, { opacity: 0, duration: 0.5, ease: "power2.out" });

    gsap.to(stripRef.current, {
      x: -CARD_W, duration: 0.65, ease: "power3.inOut",
      onComplete: () => {
        setStripPos(prev => (prev + 1) % slides.length);
        isAnimating.current = false;
      },
    });
  }, []);

  // Auto-advance every 4s
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnimating.current) advanceStrip();
    }, 4000);
    return () => clearInterval(timer);
  }, [advanceStrip]);

  // After stripPos changes: snap strip back, reset first card opacity
  useLayoutEffect(() => {
    if (!stripRef.current || !hasEnteredRef.current) return;
    gsap.killTweensOf(stripRef.current);
    const firstCard = stripRef.current.children[0];
    if (firstCard) { gsap.killTweensOf(firstCard); gsap.set(firstCard, { opacity: 1 }); }
    gsap.set(stripRef.current, { x: 0 });
  }, [stripPos]);

  // Click card: enter that world
  const goTo = useCallback((next: number) => {
    const cur = currentRef.current;
    if (isAnimating.current || next === cur) return;
    isAnimating.current = true;

    const nextEl = imagesRef.current[next];
    const curEl = imagesRef.current[cur];
    if (!nextEl || !curEl) { isAnimating.current = false; return; }

    // Text slides out
    if (textRef.current) {
      gsap.to(textRef.current, { y: 40, opacity: 0, duration: 0.45, ease: "power3.in" });
    }

    // World transition — everything overlaps, no gaps
    const tl = gsap.timeline({
      onComplete: () => { isAnimating.current = false; },
    });

    tl.to(curEl, { scale: 2, duration: 0.5, ease: "power3.in" });
    tl.to(diveRef.current, { opacity: 1, duration: 0.3, ease: "power2.in" }, 0.15);
    tl.to(flashRef.current, { opacity: 0.12, duration: 0.06 }, 0.45);

    tl.call(() => {
      gsap.set(nextEl, { clipPath: "inset(0% 0% 0% 0%)", scale: 1.15, zIndex: 2 });
      gsap.set(curEl, { zIndex: 0 });
      currentRef.current = next;
      setBgSlide(next);
      setStripPos(next);
    });

    tl.to(nextEl, { scale: 1, duration: 0.8, ease: "expo.out" });
    tl.to(flashRef.current, { opacity: 0, duration: 0.25 }, "<");
    tl.to(diveRef.current, { opacity: 0, duration: 0.5, ease: "power2.out" }, "<");

    tl.call(() => {
      gsap.set(curEl, { clipPath: "inset(0% 0% 0% 100%)", scale: 1, zIndex: 0 });
    });
  }, []);

  // Text animation on bgSlide change (click only)
  useLayoutEffect(() => {
    if (!textRef.current || !hasEnteredRef.current) return;
    gsap.killTweensOf(textRef.current);
    gsap.fromTo(textRef.current,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    );
  }, [bgSlide]);

  const scrollToTours = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector("#tours")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative mx-2 sm:mx-3 xl:mx-5 mt-2 rounded-[20px] sm:rounded-[28px] overflow-hidden h-[85vh] sm:h-[93vh]"
    >
      {/* BG Images */}
      {slides.map((slide, i) => (
        <div
          key={slide.destination}
          ref={(el) => { imagesRef.current[i] = el; }}
          className="absolute inset-0"
          style={{
            clipPath: i === 0 ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 0% 100%)",
            zIndex: i === 0 ? 2 : 0,
            willChange: "clip-path, transform",
          }}
        >
          <Image src={slide.image} alt={slide.destination} fill className="object-cover" priority={i === 0} sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/5" />
        </div>
      ))}

      {/* Dive vignette */}
      <div
        ref={diveRef}
        className="absolute inset-0 z-[3] pointer-events-none opacity-0"
        style={{
          background: [
            "radial-gradient(ellipse 60% 50% at 50% 50%, transparent 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.85) 65%, #000 85%)",
            "radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.3) 70%)",
          ].join(", "),
        }}
      />

      {/* Flash overlay */}
      <div
        ref={flashRef}
        className="absolute inset-0 z-[4] pointer-events-none opacity-0 bg-white"
      />

      {/* Card strip — flush right, cards emerge from screen edge */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:block overflow-hidden w-[520px] xl:w-[560px]"
      >
        <div ref={stripRef} className="flex flex-row items-center gap-3 w-max">
          {queue.map((s, i) => (
            <div
              key={i}
              onClick={() => goTo((stripPos + i + 1) % slides.length)}
              className="shrink-0 w-[192px] rounded-[12px] border p-2.5 cursor-pointer hover:scale-[1.03] transition-transform duration-300 bg-white/[0.08] backdrop-blur-xl border-white/15"
            >
              <div className="relative w-full h-[145px] rounded-[8px] overflow-hidden mb-2.5">
                <Image src={s.cardImage} alt={s.destination} fill className="object-cover" sizes="192px" />
              </div>
              <div className="px-1 pb-0.5">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className="text-[13px] font-semibold truncate text-white/80">
                    {s.destination}
                  </h3>
                  <div className="flex items-center gap-1">
                    <StarIcon />
                    <span className="text-[10px] text-white/50 font-medium">{s.rating}</span>
                  </div>
                </div>
                <p className="text-[10px] text-white/30">{s.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content — center-left */}
      <div className="relative z-10 h-full flex flex-col justify-center px-5 sm:px-12 xl:px-20 2xl:px-28 pb-10 pointer-events-none">
        <div ref={textRef} className="max-w-[520px] xl:max-w-[620px] pointer-events-auto">
          <h1 ref={headingRef} className="font-serif text-[2.2rem] sm:text-[3rem] lg:text-[3.8rem] xl:text-[4.5rem] 2xl:text-[5rem] leading-[1.08] text-white mb-3 sm:mb-5">
            {slides[bgSlide].title}
          </h1>
          <p ref={subRef} className="text-white/60 text-[13px] sm:text-[15px] xl:text-[16px] leading-relaxed max-w-[440px] xl:max-w-[480px] mb-6 sm:mb-8">
            {slides[bgSlide].description}
          </p>
          <div ref={btnRef}>
            <button
              onClick={scrollToTours}
              className="flex items-center gap-4 bg-gray-900 sm:bg-white text-white sm:text-gray-900 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-[13px] sm:text-[14px] font-semibold hover:opacity-90 transition-all shrink-0 group"
            >
              Explore Adventures
              <span className="text-[11px] tracking-[0.25em] group-hover:tracking-[0.35em] transition-all">&gt;&gt;&gt;</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
