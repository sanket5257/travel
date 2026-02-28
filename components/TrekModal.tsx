"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, Upload, Clock, MapPin } from "lucide-react";
import gsap from "gsap";

interface ItineraryDay {
  title: string;
  items: string[];
}

interface ItinerarySection {
  title: string;
  items: string[];
}

export interface Tour {
  name: string;
  image: string;
  duration: string;
  description: string;
  price: string;
  date?: string;
  inclusions?: string[];
  itineraryTitle?: string;
  itineraryDays?: ItineraryDay[];
  itinerarySections?: ItinerarySection[];
  qrImage?: string;
}

interface TrekModalProps {
  tour: Tour;
  onClose: () => void;
}

export default function TrekModal({ tour, onClose }: TrekModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [paymentFile, setPaymentFile] = useState<string | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPaymentFile(file.name);
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition";

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
    >
      <div
        ref={cardRef}
        className="bg-white rounded-[20px] w-full max-w-[1300px] overflow-y-auto max-h-[92vh] relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
        >
          <X className="w-4 h-4 text-gray-700" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Column 1 — Trek Info */}
          <div className="p-6 sm:p-8 lg:border-r border-gray-200">
            <div className="relative rounded-[14px] overflow-hidden h-[200px] sm:h-[240px] mb-5">
              <Image
                src={tour.image}
                alt={tour.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>

            <h2 className="font-serif text-[1.5rem] sm:text-[1.75rem] text-gray-900 leading-tight mb-2">
              {tour.name}
            </h2>

            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 text-[13px] text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                {tour.duration}
              </span>
              {tour.date && (
                <span className="inline-flex items-center gap-1.5 text-[13px] text-gray-500">
                  <MapPin className="w-3.5 h-3.5" />
                  {tour.date}
                </span>
              )}
            </div>

            <p className="text-[13px] text-gray-500 mb-5">
              From{" "}
              <span className="text-[1.25rem] font-semibold text-gray-900">
                {tour.price}
              </span>{" "}
              per person
            </p>

            {/* Inclusions */}
            {tour.inclusions && (
              <div className="border border-gray-200 rounded-[14px] p-4 sm:p-5">
                <h3 className="font-serif text-[1rem] sm:text-[1.1rem] text-gray-900 mb-3">
                  Inclusions
                </h3>
                <ul className="space-y-2">
                  {tour.inclusions.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-[13px] text-gray-600"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-900 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Column 2 — Itinerary */}
          <div className="p-6 sm:p-8 lg:border-r border-gray-200 border-t lg:border-t-0">
            {tour.itineraryTitle && (
              <h2 className="font-serif text-[1.1rem] sm:text-[1.25rem] text-gray-900 text-center mb-6 leading-tight">
                {tour.itineraryTitle}
              </h2>
            )}

            <div className="space-y-5 overflow-y-auto max-h-[55vh] lg:max-h-[65vh] pr-1 scrollbar-hide">
              {tour.itineraryDays?.map((day) => (
                <div
                  key={day.title}
                  className="border border-gray-200 rounded-[14px] p-4"
                >
                  <h3 className="text-[13px] font-semibold text-gray-900 text-center mb-2.5">
                    {day.title}
                  </h3>
                  <div className="space-y-1.5">
                    {day.items.map((item, i) => (
                      <p
                        key={i}
                        className="text-[12px] sm:text-[13px] text-gray-500 leading-[1.6] text-center"
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              {tour.itinerarySections?.map((section) => (
                <div
                  key={section.title}
                  className="border border-gray-100 rounded-[14px] p-4 bg-gray-50"
                >
                  <h3 className="text-[13px] font-semibold text-gray-900 text-center mb-2.5">
                    {section.title}
                  </h3>
                  <div className="space-y-1.5">
                    {section.items.map((item, i) => (
                      <p
                        key={i}
                        className="text-[12px] sm:text-[13px] text-gray-500 leading-[1.6] text-center"
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3 — Booking Form */}
          <div className="p-6 sm:p-8 border-t lg:border-t-0">
            <h3 className="font-serif text-[1.1rem] sm:text-[1.25rem] text-gray-900 text-center mb-5">
              Booking Form
            </h3>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className={inputClass}
              />

              <input
                type="tel"
                placeholder="Contact Number"
                className={inputClass}
              />

              <input
                type="email"
                placeholder="Email Address"
                className={inputClass}
              />

              <input
                type="tel"
                placeholder="Emergency Contact Number"
                className={inputClass}
              />

              <textarea
                placeholder="Address"
                rows={2}
                className={`${inputClass} resize-none`}
              />

              {/* QR Code */}
              <div className="text-center py-2">
                <p className="text-[13px] font-medium text-gray-900 mb-3">
                  QR For Payment
                </p>
                {tour.qrImage ? (
                  <div className="inline-block rounded-[14px] overflow-hidden border border-gray-200 p-2">
                    <Image
                      src={tour.qrImage}
                      alt="Payment QR Code"
                      width={130}
                      height={130}
                      className="w-[120px] h-[120px] sm:w-[130px] sm:h-[130px]"
                    />
                  </div>
                ) : (
                  <div className="inline-flex items-center justify-center w-[130px] h-[130px] rounded-[14px] bg-gray-100 border border-dashed border-gray-300">
                    <span className="text-[12px] text-gray-400">QR Code</span>
                  </div>
                )}
              </div>

              {/* Upload Screenshot */}
              <div className="text-center">
                <p className="text-[13px] text-gray-500 mb-2">
                  Upload a screenshot of the payment
                </p>
                <label className="inline-flex items-center gap-2 cursor-pointer border border-gray-200 rounded-full px-5 py-2.5 hover:bg-gray-50 transition">
                  <Upload className="w-4 h-4 text-gray-500" />
                  <span className="text-[13px] text-gray-600">
                    {paymentFile || "Choose file"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              <input
                type="text"
                placeholder="Transaction ID"
                className={inputClass}
              />

              <button className="flex items-center justify-center gap-2 bg-gray-900 text-white px-7 py-3.5 rounded-full text-[13px] font-medium hover:bg-gray-800 transition-colors mt-1">
                Submit Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
