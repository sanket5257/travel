"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X, Clock, Users, Calendar } from "lucide-react";
import gsap from "gsap";

interface Tour {
  name: string;
  image: string;
  duration: string;
  description: string;
  price: string;
}

interface TrekModalProps {
  tour: Tour;
  onClose: () => void;
}

export default function TrekModal({ tour, onClose }: TrekModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Entrance animation & body scroll lock
  useEffect(() => {
    document.body.style.overflow = "hidden";

    if (overlayRef.current && cardRef.current) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      gsap.fromTo(
        cardRef.current,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, ease: "power3.out" }
      );
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in booking the "${tour.name}" trek (${tour.price}). Please share more details.`
  );

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        ref={cardRef}
        className="bg-white rounded-[20px] w-full max-w-[960px] overflow-y-auto max-h-[90vh] relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
        >
          <X className="w-4 h-4 text-gray-700" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Left — Trek Details */}
          <div className="p-6 sm:p-8">
            <div className="relative rounded-[14px] overflow-hidden h-[220px] sm:h-[260px] mb-5">
              <Image
                src={tour.image}
                alt={tour.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 480px"
              />
            </div>

            <h2 className="font-serif text-[1.5rem] sm:text-[1.75rem] text-gray-900 leading-tight mb-3">
              {tour.name}
            </h2>

            <span className="inline-flex items-center gap-1.5 border border-gray-200 rounded-full px-3 py-1 text-[12px] text-gray-700 mb-4">
              <Clock className="w-3.5 h-3.5" />
              {tour.duration}
            </span>

            <p className="text-gray-500 text-[14px] leading-[1.7] mb-5">
              {tour.description}
            </p>

            <p className="text-[13px] text-gray-500">
              From{" "}
              <span className="text-[1.25rem] font-semibold text-gray-900">
                {tour.price}
              </span>{" "}
              per person
            </p>
          </div>

          {/* Right — Booking Form */}
          <div className="border-t md:border-t-0 md:border-l border-gray-200 p-6 sm:p-8">
            <h3 className="font-serif text-[1.25rem] sm:text-[1.5rem] text-gray-900 mb-5">
              Book This Trek
            </h3>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition"
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="number"
                    min={1}
                    max={20}
                    defaultValue={1}
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-[14px] text-gray-900 outline-none focus:border-gray-400 transition"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-[14px] text-gray-900 outline-none focus:border-gray-400 transition"
                  />
                </div>
              </div>

              <textarea
                placeholder="Any message or special requests..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition resize-none"
              />

              <a
                href={`https://wa.me/919876543210?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-gray-900 text-white px-7 py-3.5 rounded-full text-[13px] font-medium hover:bg-gray-800 transition-colors"
              >
                Book via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
