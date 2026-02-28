"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Clock,
  MapPin,
  Minus,
  Plus,
  Users,
  Upload,
  ChevronDown,
  Calendar,
  IndianRupee,
  UtensilsCrossed,
  Award,
  HeartPulse,
  Compass,
  BedDouble,
  Bus,
  Binoculars,
  Tent,
  Flame,
  TreePine,
  Footprints,
  Wind,
  ShieldCheck,
  User,
  Phone,
  Mail,
  ShieldAlert,
  Hash,
  Sunrise,
  MoonStar,
  CircleDot,
  type LucideIcon,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Tour } from "@/lib/tours";

gsap.registerPlugin(ScrollTrigger);

function getInclusionIcon(item: string): LucideIcon {
  const lower = item.toLowerCase();
  if (/lunch|dinner|breakfast|meal/i.test(lower)) return UtensilsCrossed;
  if (/badge|certificate/i.test(lower)) return Award;
  if (/first aid/i.test(lower)) return HeartPulse;
  if (/trek lead|expertise|support staff/i.test(lower)) return Compass;
  if (/hotel|guesthouse/i.test(lower)) return BedDouble;
  if (/transport|bus/i.test(lower)) return Bus;
  if (/sightseeing/i.test(lower)) return Binoculars;
  if (/tent|camping|sleeping/i.test(lower)) return Tent;
  if (/bonfire|campfire/i.test(lower)) return Flame;
  if (/forest|permit/i.test(lower)) return TreePine;
  if (/porter|mule/i.test(lower)) return Footprints;
  if (/oxygen/i.test(lower)) return Wind;
  if (/group|coordination/i.test(lower)) return Users;
  return ShieldCheck;
}

export default function BookingPageContent({ tour }: { tour: Tour }) {
  const [paymentFile, setPaymentFile] = useState<string | null>(null);
  const [people, setPeople] = useState(1);
  const [openDay, setOpenDay] = useState<number | null>(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const numericPrice = parseInt(tour.price.replace(/[^\d]/g, ""), 10) || 0;
  const totalAmount = numericPrice * people;
  const formatCurrency = (n: number) => n.toLocaleString("en-IN");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPaymentFile(file.name);
  };

  // Entrance animations
  useEffect(() => {
    if (!heroRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".hero-title", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      });
      gsap.from(".hero-badges", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.5,
      });
      gsap.from(".hero-scroll", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.8,
      });
      gsap.from(".content-left > *", {
        scrollTrigger: { trigger: contentRef.current, start: "top 80%" },
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
      });
      gsap.from(".booking-card", {
        scrollTrigger: { trigger: contentRef.current, start: "top 75%" },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2,
      });
    });

    return () => ctx.revert();
  }, []);

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900/5 transition bg-white";

  return (
    <>
      {/* Hero Section */}
      <div ref={heroRef} className="relative h-[75vh] sm:h-[80vh] min-h-[500px]">
        <Image
          src={tour.image}
          alt={tour.name}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-8 lg:px-12 pb-12 sm:pb-16 max-w-[1200px] xl:max-w-[1400px] mx-auto">
          <h1 className="hero-title font-serif text-white text-[2.25rem] sm:text-[3rem] lg:text-[3.75rem] xl:text-[4.25rem] leading-[1.1] mb-5">
            {tour.name}
          </h1>

          <div className="hero-badges flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-[13px] text-white">
              <Clock className="w-3.5 h-3.5" />
              {tour.duration}
            </span>
            {tour.date && (
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-[13px] text-white">
                <Calendar className="w-3.5 h-3.5" />
                {tour.date}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-[13px] text-white font-medium">
              <IndianRupee className="w-3.5 h-3.5" />
              {tour.price}
            </span>
          </div>
        </div>

        <div className="hero-scroll absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50">
          <span className="text-[11px] tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </div>

      {/* Main Content */}
      <div
        ref={contentRef}
        className="px-5 sm:px-8 lg:px-12 max-w-[1200px] xl:max-w-[1400px] mx-auto py-12 sm:py-16 lg:py-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
          {/* Left Column — Trek Details */}
          <div className="lg:col-span-3 content-left">
            {/* About */}
            <div className="mb-10">
              <span className="inline-block border border-gray-200 rounded-full px-4 py-1.5 text-[12px] text-gray-900 tracking-wide mb-5">
                /About This Trek
              </span>
              <p className="text-[15px] sm:text-[16px] text-gray-600 leading-[1.8]">
                {tour.description}
              </p>
            </div>

            {/* Inclusions */}
            {tour.inclusions && (
              <div className="mb-10">
                <span className="inline-block border border-gray-200 rounded-full px-4 py-1.5 text-[12px] text-gray-900 tracking-wide mb-5">
                  /What&apos;s Included
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tour.inclusions.map((item) => {
                    const Icon = getInclusionIcon(item);
                    return (
                      <div
                        key={item}
                        className="flex items-center gap-3 border border-gray-100 rounded-2xl px-4 py-3.5 bg-gray-50/50"
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[13px] sm:text-[14px] text-gray-700">
                          {item}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Itinerary */}
            {(tour.itineraryDays || tour.itinerarySections) && (
              <div>
                <span className="inline-block border border-gray-200 rounded-full px-4 py-1.5 text-[12px] text-gray-900 tracking-wide mb-5">
                  /Itinerary
                </span>
                {tour.itineraryTitle && (
                  <h2 className="font-serif text-[1.25rem] sm:text-[1.5rem] text-gray-900 leading-tight mb-8">
                    {tour.itineraryTitle}
                  </h2>
                )}

                {/* Timeline */}
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-[19px] top-6 bottom-6 w-px bg-gray-200 hidden sm:block" />

                  <div className="space-y-0">
                    {tour.itineraryDays?.map((day, i) => {
                      const isOpen = openDay === i;
                      const isLast = i === (tour.itineraryDays?.length ?? 1) - 1;
                      const DayIcon = day.title.toLowerCase().includes("night") ? MoonStar : Sunrise;
                      // Attach extra sections to the last day
                      const extraSections = isLast ? tour.itinerarySections : undefined;
                      const totalActivities = day.items.length + (extraSections?.reduce((sum, s) => sum + s.items.length, 0) ?? 0);
                      return (
                        <div key={day.title} className={`relative ${!isLast ? "pb-6" : ""}`}>
                          {/* Timeline node */}
                          <div className="hidden sm:flex absolute left-0 top-0 z-10">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${isOpen ? "bg-gray-900" : "bg-white border-2 border-gray-200"}`}>
                              {isOpen ? (
                                <DayIcon className="w-4 h-4 text-white" />
                              ) : (
                                <span className="text-[12px] font-bold text-gray-400">{i + 1}</span>
                              )}
                            </div>
                          </div>

                          {/* Card */}
                          <div className={`sm:ml-14 border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? "border-gray-900/20 shadow-md" : "border-gray-200"}`}>
                            <button
                              onClick={() => setOpenDay(isOpen ? null : i)}
                              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 transition group"
                            >
                              <div className="flex items-center gap-3">
                                {/* Mobile day number */}
                                <div className={`sm:hidden w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? "bg-gray-900" : "bg-gray-100"}`}>
                                  <span className={`text-[11px] font-bold ${isOpen ? "text-white" : "text-gray-500"}`}>{i + 1}</span>
                                </div>
                                <div className="text-left">
                                  <span className="text-[13px] sm:text-[14px] font-semibold text-gray-900 block">
                                    {day.title}
                                  </span>
                                  <span className="text-[12px] text-gray-400">
                                    {totalActivities} activities
                                  </span>
                                </div>
                              </div>
                              <ChevronDown
                                className={`w-4 h-4 text-gray-400 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180" : ""}`}
                              />
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1200px]" : "max-h-0"}`}>
                              <div className="px-5 pb-5">
                                <div className="space-y-0">
                                  {day.items.map((item, j) => {
                                    const hasMore = j < day.items.length - 1 || !!extraSections?.length;
                                    return (
                                      <div key={j} className="flex gap-3">
                                        <div className="flex flex-col items-center pt-1.5">
                                          <CircleDot className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                                          {hasMore && <div className="w-px flex-1 bg-gray-200 my-1" />}
                                        </div>
                                        <p className={`text-[13px] text-gray-600 leading-[1.7] ${hasMore ? "pb-2.5" : ""}`}>
                                          {item}
                                        </p>
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Extra sections inline */}
                                {extraSections?.map((section, si) => (
                                  <div key={section.title} className="mt-4">
                                    <div className="flex items-center gap-2 mb-2.5 pl-1">
                                      <MapPin className="w-3.5 h-3.5 text-gray-900" />
                                      <h4 className="text-[13px] font-semibold text-gray-900">
                                        {section.title}
                                      </h4>
                                    </div>
                                    <div className="space-y-0">
                                      {section.items.map((sItem, sj) => {
                                        const hasMore = sj < section.items.length - 1 || si < (extraSections.length - 1);
                                        return (
                                          <div key={sj} className="flex gap-3">
                                            <div className="flex flex-col items-center pt-1.5">
                                              <CircleDot className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                                              {hasMore && <div className="w-px flex-1 bg-gray-200 my-1" />}
                                            </div>
                                            <p className={`text-[13px] text-gray-600 leading-[1.7] ${hasMore ? "pb-2.5" : ""}`}>
                                              {sItem}
                                            </p>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column — Booking Form */}
          <div className="lg:col-span-2">
            <div className="booking-card border border-gray-200 rounded-[24px] p-6 sm:p-8 sticky top-24 shadow-sm">
              {/* Price header */}
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-serif text-[1.75rem] sm:text-[2rem] text-gray-900">
                  {tour.price}
                </span>
                <span className="text-[13px] text-gray-400">/ person</span>
              </div>
              {tour.date && (
                <p className="text-[13px] text-gray-400 mb-6 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Next batch: {tour.date}
                </p>
              )}

              <div className="w-full h-px bg-gray-200 mb-6" />

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="tel"
                      placeholder="Contact No."
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>

                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className={`${inputClass} pl-10`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <ShieldAlert className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="tel"
                      placeholder="Emergency Contact"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                    <textarea
                      placeholder="Address"
                      rows={1}
                      className={`${inputClass} pl-10 resize-none`}
                    />
                  </div>
                </div>

                {/* People selector */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-[13px] text-gray-900 font-medium">
                      <Users className="w-4 h-4 text-gray-500" />
                      Trekkers
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPeople((p) => Math.max(1, p - 1))}
                        className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-gray-900 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        disabled={people <= 1}
                      >
                        <Minus className="w-3.5 h-3.5 text-gray-700" />
                      </button>
                      <span className="text-[16px] font-semibold text-gray-900 w-7 text-center">
                        {people}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPeople((p) => Math.min(20, p + 1))}
                        className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-gray-900 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        disabled={people >= 20}
                      >
                        <Plus className="w-3.5 h-3.5 text-gray-700" />
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-[13px] text-gray-500 mb-1.5">
                      <span>
                        {tour.price} &times; {people}
                      </span>
                      <span>&#8377;{formatCurrency(totalAmount)}</span>
                    </div>
                    <div className="flex justify-between text-[15px] font-semibold text-gray-900">
                      <span>Total</span>
                      <span>&#8377;{formatCurrency(totalAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="text-center py-3">
                  <p className="text-[12px] uppercase tracking-widest text-gray-400 mb-3">
                    Scan to Pay
                  </p>
                  {tour.qrImage ? (
                    <div className="inline-block rounded-2xl overflow-hidden border border-gray-200 p-3 bg-white">
                      <Image
                        src={tour.qrImage}
                        alt="Payment QR Code"
                        width={160}
                        height={160}
                        className="w-[140px] h-[140px] sm:w-[160px] sm:h-[160px]"
                      />
                    </div>
                  ) : (
                    <div className="inline-flex items-center justify-center w-[160px] h-[160px] rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200">
                      <span className="text-[12px] text-gray-400">
                        QR Code
                      </span>
                    </div>
                  )}
                </div>

                {/* Upload */}
                <div>
                  <p className="text-[12px] text-gray-400 mb-2 text-center">
                    Upload payment screenshot
                  </p>
                  <label className="flex items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-gray-200 rounded-2xl px-5 py-4 hover:border-gray-400 hover:bg-gray-50 transition">
                    <Upload className="w-4 h-4 text-gray-400" />
                    <span className="text-[13px] text-gray-500">
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

                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Transaction ID"
                    className={`${inputClass} pl-10`}
                  />
                </div>

                <button className="bg-gray-900 text-white px-7 py-4 rounded-full text-[14px] font-medium hover:bg-gray-800 transition-colors mt-1">
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
