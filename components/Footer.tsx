"use client";

import { useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Facebook, Instagram, Globe, Phone } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const footerNav = [
  { label: "Home", href: "/#hero" },
  { label: "About Us", href: "/#about" },
  { label: "Treks", href: "/#tours" },
  { label: "Blog", href: "/#blog" },
  { label: "Reviews", href: "/#testimonials" },
  { label: "Contact", href: "/#contact" },
];

const footerLinks = {
  Explore: [
    { label: "Upcoming Treks", href: "/#tours" },
    { label: "Fort Treks", href: "/#tours" },
    { label: "Himalayan Treks", href: "/#tours" },
  ],
  "About Us": [
    { label: "Our Story", href: "/#about" },
    { label: "Testimonials", href: "/#testimonials" },
    { label: "Trek Leaders", href: "/#about" },
    { label: "Safety Policy", href: "/#about" },
  ],
  Support: [
    { label: "FAQs", href: "/#about" },
    { label: "Contact Us", href: "/#contact" },
    { label: "Booking Policy", href: "/#tours" },
    { label: "WhatsApp Us", href: "/#contact" },
  ],
};

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { y: 50, opacity: 0 },
          {
            scrollTrigger: { trigger: ctaRef.current, start: "top 85%" },
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
          }
        );
      }

      gsap.fromTo(
        ".footer-col",
        { y: 30, opacity: 0 },
        {
          scrollTrigger: { trigger: ".footer-links", start: "top 90%" },
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();

    if (!isHome) {
      router.push(href);
      return;
    }

    if (href === "/#hero" || href === "#hero" || href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const selector = href.startsWith("/") ? href.slice(1) : href;
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer ref={footerRef} className="relative">
      {/* ── CTA + Mountain Image ── */}
      <div
        className="relative bg-bottom bg-cover bg-no-repeat pb-[35%] sm:pb-[30%] lg:pb-[25%]"
        style={{ backgroundImage: "url('/img/footer.png')" }}
      >
        {/* CTA content */}
        <div
          ref={ctaRef}
          className="relative z-10 flex flex-col items-center text-center px-5 sm:px-8 pt-16 sm:pt-24 xl:pt-32 pb-8 sm:pb-12"
        >
          <h2 className="font-serif text-[2rem] sm:text-[2.75rem] lg:text-[3.25rem] xl:text-[3.75rem] leading-[1.1] text-gray-900 mb-5 sm:mb-6">
            Lace Up, Your Next
            <br />
            Adventure Awaits!
          </h2>
          <p className="text-gray-500 text-[14px] sm:text-[15px] leading-[1.75] max-w-[520px] mb-8 sm:mb-10">
            Explore the unexplored. From Sahyadri forts to Himalayan summits,
            your next story begins with a single step. Let&apos;s trek together.
          </p>
          <button
            onClick={() => {
              const el = document.querySelector("#contact");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-3 border border-gray-900 text-gray-900 px-8 py-3.5 rounded-full text-[13px] font-semibold tracking-wide uppercase hover:bg-gray-900 hover:text-white transition-colors"
          >
            Book a Trek
            <span className="text-[11px]">&rarr;</span>
          </button>
        </div>
        {/* Dark gradient overlay to blend into footer */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-gray-950 to-transparent" />
      </div>

      {/* ── Dark Footer Section ── */}
      <div className="bg-gray-950 text-white">
        <div className="footer-links max-w-[1200px] xl:max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-16 pt-12 sm:pt-16 pb-10 sm:pb-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 sm:gap-8">
            {/* Brand Column */}
            <div className="footer-col col-span-2 sm:col-span-1">
              <a
                href="#hero"
                onClick={(e) => handleClick(e, "#hero")}
                className="inline-block mb-5"
              >
                <Image
                  src="/logo.png"
                  alt="To The Moon Wayfarer"
                  width={48}
                  height={48}
                  className="brightness-0 invert"
                />
              </a>
              <p className="text-[12px] text-white/40 leading-[1.7] max-w-[220px] mb-5">
                To The Moon Wayfarer — your gateway to unforgettable treks
                across India. All rights reserved.
              </p>
              <p className="text-[11px] text-white/25 mb-5">
                &copy; 2026 To The Moon Wayfarer.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition"
                >
                  <Facebook className="w-3.5 h-3.5" />
                </a>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="footer-col">
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/50 mb-5 sm:mb-6">
                  {title}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        onClick={(e) => handleClick(e, link.href)}
                        className="text-[13px] text-white/35 hover:text-white transition"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="max-w-[1200px] xl:max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-16 py-5 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Footer Nav Links */}
            <div className="hidden sm:flex items-center gap-1 bg-white/5 rounded-full p-1.5">
              {footerNav.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  className="px-4 py-1.5 rounded-full text-[12px] text-white/50 font-medium hover:text-white hover:bg-white/10 transition-all"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right side */}
            <div className="hidden sm:flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-white/40 text-[12px]">
                <Globe className="w-3.5 h-3.5" />
                ENG
              </span>
              <a
                href="#contact"
                onClick={(e) => handleClick(e, "#contact")}
                className="flex items-center gap-1.5 text-white/40 text-[12px] hover:text-white transition"
              >
                <Phone className="w-3.5 h-3.5" />
                Contact Us
              </a>
            </div>

            {/* Mobile copyright */}
            <span className="sm:hidden text-[11px] text-white/30">
              &copy; 2026 To The Moon Wayfarer. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
