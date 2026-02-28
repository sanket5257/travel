"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Globe, Phone } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const footerNav = [
  { label: "Home", href: "#hero" },
  { label: "About Us", href: "#about" },
  { label: "Destinations", href: "#destinations" },
  { label: "Treks", href: "#tours" },
  { label: "Blog", href: "#blog" },
  { label: "Reviews", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const footerLinks = {
  Explore: [
    { label: "Upcoming Treks", href: "#tours" },
    { label: "Destinations", href: "#destinations" },
    { label: "Fort Treks", href: "#tours" },
    { label: "Himalayan Treks", href: "#tours" },
  ],
  "About Us": [
    { label: "Our Story", href: "#about" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Trek Leaders", href: "#about" },
    { label: "Safety Policy", href: "#about" },
  ],
  Support: [
    { label: "FAQs", href: "#about" },
    { label: "Contact Us", href: "#contact" },
    { label: "Booking Policy", href: "#tours" },
    { label: "WhatsApp Us", href: "#contact" },
  ],
};

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          scrollTrigger: { trigger: ctaRef.current, start: "top 85%" },
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });
      }

      gsap.from(".footer-col", {
        scrollTrigger: { trigger: footerRef.current, start: "top 90%" },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    if (href === "#hero" || href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer ref={footerRef} className="bg-gray-950 text-white">
      {/* CTA Section */}
      <div
        ref={ctaRef}
        className="px-5 sm:px-8 lg:px-12 xl:px-16 pt-16 sm:pt-20 xl:pt-28 pb-10 sm:pb-14 max-w-[1200px] xl:max-w-[1400px] mx-auto"
      >
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 sm:gap-10 mb-8 sm:mb-10">
          <h2 className="font-serif text-[1.75rem] sm:text-[2.5rem] lg:text-[3rem] xl:text-[3.5rem] leading-[1.1] max-w-[500px] xl:max-w-[600px]">
            Lace Up, Your Next Adventure Awaits!
          </h2>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 bg-white text-gray-900 px-7 py-3.5 rounded-full text-[13px] font-semibold hover:bg-gray-100 transition-colors shrink-0 self-start sm:self-auto"
          >
            Book a Trek
            <span className="text-[10px] tracking-[0.25em]">&gt;&gt;&gt;</span>
          </button>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-6 mb-12 sm:mb-16">
          {["Instagram", "WhatsApp", "YouTube"].map((social) => (
            <a
              key={social}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-[13px] text-white/40 hover:text-white transition underline underline-offset-2"
            >
              {social}
            </a>
          ))}
        </div>

        {/* Link Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-6 mb-12 sm:mb-16">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="footer-col">
              <h4 className="text-[13px] font-semibold text-white/90 mb-4 sm:mb-5">
                {title}
              </h4>
              <ul className="space-y-2.5 sm:space-y-3">
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
        <div className="px-5 sm:px-8 lg:px-12 xl:px-16 py-5 sm:py-6 max-w-[1200px] xl:max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => handleClick(e, "#hero")}
            className="shrink-0"
          >
            <Image
              src="/logo.png"
              alt="To The Moon Wayfarer"
              width={48}
              height={48}
              className="brightness-0 invert"
            />
          </a>

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
            &copy; 2025 To The Moon Wayfarer. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
