"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Phone, Menu, X } from "lucide-react";
import gsap from "gsap";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Treks", href: "#tours" },
  { label: "Destinations", href: "#destinations" },
  { label: "About Us", href: "#about" },
  { label: "Reviews", href: "#testimonials" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#hero");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!navRef.current) return;
    gsap.from(navRef.current, {
      y: -80,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.3,
    });
  }, []);

  // Switch to dark mode when scrolled past hero
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.7);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    setActive(href);
    setOpen(false);

    if (href === "#hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-3 left-3 right-3 md:left-6 md:right-6 xl:left-10 xl:right-10 2xl:left-14 2xl:right-14 z-50 transition-colors duration-300`}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => handleClick(e, "#hero")}
          className="shrink-0"
        >
          <Image
            src="/logo.png"
            alt="To The Moon Wayfarer"
            width={56}
            height={56}
            className={`transition-all duration-300 ${scrolled ? "" : "brightness-0 invert"}`}
          />
        </a>

        {/* Center Nav Links (Desktop) */}
        <div className={`hidden md:flex items-center gap-0.5 backdrop-blur-md rounded-full p-1.5 border transition-colors duration-300 ${scrolled ? "bg-gray-100/80 border-gray-200" : "bg-white/10 border-white/10"}`}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ${
                active === link.href
                  ? scrolled ? "bg-gray-900 text-white" : "bg-white text-gray-900"
                  : scrolled ? "text-gray-600 hover:bg-gray-200/60" : "text-white/90 hover:bg-white/10"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right Side (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#about"
            onClick={(e) => handleClick(e, "#about")}
            className={`flex items-center gap-2 backdrop-blur-md text-[13px] font-medium px-5 py-2.5 rounded-full border transition-colors duration-300 ${scrolled ? "bg-gray-900 text-white border-gray-900 hover:bg-gray-800" : "bg-white/10 text-white/90 border-white/10 hover:bg-white/20"}`}
          >
            <Phone className="w-[14px] h-[14px]" />
            Contact Us
          </a>
        </div>

        {/* Mobile Right: Contacts + Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href="#about"
            onClick={(e) => handleClick(e, "#about")}
            className={`flex items-center gap-1.5 backdrop-blur-md text-[12px] font-medium px-4 py-2.5 rounded-full border transition-colors duration-300 ${scrolled ? "bg-gray-900 text-white border-gray-900" : "bg-white/10 text-white border-white/10"}`}
          >
            <Phone className="w-3.5 h-3.5" />
            Contacts
          </a>
          <button
            onClick={() => setOpen(!open)}
            className={`w-10 h-10 rounded-full backdrop-blur-md border flex items-center justify-center transition-colors duration-300 ${scrolled ? "bg-gray-100 border-gray-200 text-gray-900" : "bg-white/10 border-white/10 text-white"}`}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden mt-3 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className={`px-4 py-3 rounded-xl text-[14px] font-medium transition-all ${
                  active === link.href
                    ? "bg-white text-gray-900"
                    : "text-white/90 hover:bg-white/10"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
