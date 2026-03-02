"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  MapPin,
  Minus,
  Plus,
  Upload,
  ChevronDown,
  ChevronRight,
  Calendar,

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
  Users,
  User,
  Phone,
  Mail,
  ShieldAlert,
  Hash,
  Check,
  X as XIcon,

  Sun,
  Globe,
  Utensils,
  Thermometer,
  Footprints as WalkIcon,
  Send,
  type LucideIcon,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { toSlug, type Tour } from "@/lib/tours";

gsap.registerPlugin(ScrollTrigger);

const PRIMARY = "#111827"; // gray-900 — matches site palette


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

type Tab = "overview" | "itinerary" | "cost";

export default function BookingPageContent({ tour }: { tour: Tour }) {
  const [paymentFile, setPaymentFile] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [people, setPeople] = useState(1);
  const [openDay, setOpenDay] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [relatedTours, setRelatedTours] = useState<Tour[]>([]);
  const pageRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [address, setAddress] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const numericPrice = parseInt(tour.price.replace(/[^\d]/g, ""), 10) || 0;
  const totalAmount = numericPrice * people;
  const formatCurrency = (n: number) => n.toLocaleString("en-IN");

  // Fetch related tours from API
  useEffect(() => {
    fetch("/api/tours")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const related = data
            .filter((t: { name: string }) => t.name !== tour.name)
            .slice(0, 3)
            .map((t: { name: string; slug: string; image: string; duration: string; description: string; price_display: string; date?: string }) => ({
              name: t.name,
              slug: t.slug,
              image: t.image,
              duration: t.duration,
              description: t.description,
              price: t.price_display,
              date: t.date,
            }));
          setRelatedTours(related);
        }
      })
      .catch(() => {});
  }, [tour.name]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPaymentFile(file.name);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) setPaymentUrl(data.url);
    } catch {
      console.error("Upload failed");
    }
  };

  const handleSubmit = async () => {
    if (!fullName || !email || !phone) return;
    setSubmitting(true);
    setSubmitStatus("idle");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tour_id: tour.id || null,
          tour_name: tour.name,
          full_name: fullName,
          email,
          phone,
          emergency_contact: emergencyContact || null,
          num_travelers: people,
          address: address || null,
          total_amount: totalAmount,
          payment_screenshot_url: paymentUrl,
          transaction_id: transactionId || null,
        }),
      });
      if (res.ok) {
        setSubmitStatus("success");
        setFullName("");
        setEmail("");
        setPhone("");
        setEmergencyContact("");
        setAddress("");
        setTransactionId("");
        setPaymentFile(null);
        setPaymentUrl(null);
        setPeople(1);
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".tourm-hero-img", {
        scale: 1.05,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
      gsap.from(".tourm-main-img", {
        scrollTrigger: { trigger: ".tourm-main-img", start: "top 85%" },
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      });
      gsap.from(".tourm-trip-info", {
        scrollTrigger: { trigger: ".tourm-trip-info", start: "top 85%" },
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });
      gsap.from(".tourm-tabs-section", {
        scrollTrigger: { trigger: ".tourm-tabs-section", start: "top 85%" },
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
      });
      gsap.from(".tourm-enquiry", {
        scrollTrigger: { trigger: ".tourm-enquiry", start: "top 85%" },
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "itinerary", label: "Itinerary" },
    { key: "cost", label: "Cost" },
  ];

  const ti = tour.tripInfo || {};
  const tripInfo: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: Clock, label: "Duration", value: tour.duration },
    { icon: MapPin, label: "Departure", value: ti.departure || "Pune" },
    { icon: MapPin, label: "Arrival", value: ti.arrival || "Pune" },
    { icon: Sun, label: "Best Season", value: ti.best_season || "Oct \u2013 Mar" },
    { icon: Compass, label: "Trek Lead", value: ti.trek_lead || "Expert Guide" },
    { icon: Globe, label: "Language", value: ti.language || "Hindi, English" },
    { icon: Utensils, label: "Meals", value: ti.meals || "Included" },
    ...(tour.date
      ? [{ icon: Calendar, label: "Next Batch", value: tour.date }]
      : []),
    { icon: Bus, label: "Transport", value: ti.transport || "Included" },
    { icon: Thermometer, label: "Difficulty", value: ti.difficulty || "Moderate" },
    { icon: WalkIcon, label: "Walking", value: ti.walking || "5\u20138 Hours" },
    { icon: Users, label: "Group Size", value: ti.group_size || "Max 25" },
  ];

  const inputClass =
    "w-full border border-gray-200 rounded-md px-4 py-3 text-[14px] text-[#232323] placeholder:text-gray-400 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-900/10 transition bg-white";

  // Gallery images for the 3-image grid on detail page
  // gallery[0] = large left, gallery[1] = top right, gallery[2] = bottom right
  const g = tour.gallery || [];
  const galleryImages = [
    g[0] || tour.image,
    g[1] || tour.image,
    g[2] || tour.image,
  ];

  return (
    <div ref={pageRef}>
      {/* ══════ Hero Banner ══════ */}
      <div className="relative h-[220px] sm:h-[280px] lg:h-[340px] overflow-hidden">
        <Image
          src={tour.image}
          alt={tour.name}
          fill
          className="tourm-hero-img object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-5">
          <h1 className="font-serif text-white text-[2rem] sm:text-[2.75rem] xl:text-[3.25rem] text-center leading-[1.12] mb-3">
            {tour.name}
          </h1>
          <nav className="flex items-center gap-2 text-[13px] text-white/70">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/#tours" className="hover:text-white transition">
              Treks
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-medium">{tour.name}</span>
          </nav>
        </div>
      </div>

      {/* ══════ Main Content ══════ */}
      <div className="px-5 sm:px-8 lg:px-12 max-w-[1200px] mx-auto py-8 sm:py-12">
        {/* ── Image Gallery Grid ── */}
        <div className="tourm-main-img grid grid-cols-1 sm:grid-cols-[1fr_0.4fr] gap-3 mb-8 h-[240px] sm:h-[360px] lg:h-[420px]">
          {/* Large left image */}
          <div className="relative rounded-lg overflow-hidden shadow-lg">
            <Image
              src={galleryImages[0] || tour.image}
              alt={tour.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 60vw"
            />
          </div>
          {/* Two stacked right images */}
          <div className="hidden sm:grid grid-rows-2 gap-3">
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src={galleryImages[1] || tour.image}
                alt={`${tour.name} view`}
                fill
                className="object-cover object-[center_30%]"
                sizes="30vw"
              />
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src={galleryImages[2] || tour.image}
                alt={`${tour.name} detail`}
                fill
                className="object-cover object-[center_70%]"
                sizes="30vw"
              />
            </div>
          </div>
        </div>

        {/* ── Title + Days + Price Row ── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div className="flex items-start gap-4">
            <h2 className="font-serif text-[2rem] sm:text-[2.75rem] xl:text-[3.25rem] text-[#232323] leading-[1.12]">
              {tour.name}
            </h2>
            <span
              className="shrink-0 w-14 h-14 rounded-md flex flex-col items-center justify-center text-white"
              style={{ backgroundColor: PRIMARY }}
            >
              <span className="text-[1.1rem] font-bold leading-none">
                {tour.duration.match(/\d+/)?.[0] || "1"}
              </span>
              <span className="text-[10px] mt-0.5">Days</span>
            </span>
          </div>
          <div className="flex items-center gap-6 sm:text-right">
            <div>
              <p className="text-[12px] text-gray-400">From</p>
              <p className="text-[1.3rem] font-bold text-[#232323]">
                &#8377;{formatCurrency(numericPrice)}
                <span className="text-[13px] font-normal text-gray-500">
                  {" "}
                  / Person
                </span>
              </p>
            </div>
            <button
              className="text-white text-[13px] font-semibold px-6 py-3 rounded-full transition-colors whitespace-nowrap"
              style={{ backgroundColor: PRIMARY }}
              onClick={() =>
                document
                  .getElementById("enquiry-form")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              CHECK AVAILABILITY
            </button>
          </div>
        </div>

        {/* ── Trip Info Grid ── */}
        <div className="tourm-trip-info border border-gray-200 rounded-lg p-6 sm:p-8 mb-10">
          <h3 className="font-serif text-[1.15rem] text-[#232323] mb-6">
            Trip Info
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-6">
            {tripInfo.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${PRIMARY}15` }}
                >
                  <Icon className="w-[18px] h-[18px]" style={{ color: PRIMARY }} />
                </span>
                <div className="min-w-0">
                  <p className="text-[12px] text-gray-400 leading-tight">
                    {label}
                  </p>
                  <p className="text-[14px] font-semibold text-[#232323] truncate">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="tourm-tabs-section">
          <div className="flex border-b border-gray-200 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 sm:px-7 py-3.5 text-[14px] sm:text-[15px] font-semibold transition-colors relative ${
                  activeTab === tab.key
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-900 rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="mb-10">
              <h2 className="font-serif text-[1.3rem] sm:text-[1.5rem] text-[#232323] mb-4">
                Overview
              </h2>
              <p className="text-[15px] text-gray-600 leading-[1.85] mb-8">
                {tour.description}
              </p>

              {tour.inclusions && (
                <div>
                  <h3 className="font-serif text-[1.1rem] text-[#232323] mb-5">
                    Trip Highlights
                  </h3>
                  <ul className="space-y-3.5">
                    {tour.inclusions.map((item) => {
                      const Icon = getInclusionIcon(item);
                      return (
                        <li key={item} className="flex items-center gap-3">
                          <span
                            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${PRIMARY}20` }}
                          >
                            <Icon
                              className="w-3.5 h-3.5"
                              style={{ color: PRIMARY }}
                            />
                          </span>
                          <span className="text-[14px] text-gray-700">
                            {item}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Itinerary Tab */}
          {activeTab === "itinerary" && (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-[1.3rem] sm:text-[1.5rem] text-[#232323]">
                  Itinerary
                </h2>
                <button
                  onClick={() => setOpenDay(openDay === -1 ? null : -1)}
                  className="text-[13px] font-medium text-gray-900 hover:underline"
                >
                  {openDay === -1 ? "Collapse All" : "Expand All"}
                </button>
              </div>

              <div className="space-y-3">
                {tour.itineraryDays?.map((day, i) => {
                  const isOpen = openDay === i || openDay === -1;
                  const isLast =
                    i === (tour.itineraryDays?.length ?? 1) - 1;
                  const extraSections = isLast
                    ? tour.itinerarySections
                    : undefined;
                  return (
                    <div
                      key={day.title}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setOpenDay(isOpen && openDay !== -1 ? null : i)
                        }
                        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0"
                            style={{ backgroundColor: PRIMARY }}
                          >
                            {i + 1}
                          </span>
                          <span className="text-[14px] font-semibold text-[#232323] text-left">
                            {day.title}
                          </span>
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 transition-transform duration-300 shrink-0 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen ? "max-h-[1200px]" : "max-h-0"
                        }`}
                      >
                        <div className="px-5 pb-5 pt-1 ml-[52px] border-t border-gray-100">
                          <ul className="space-y-2 mt-3">
                            {day.items.map((item, j) => (
                              <li
                                key={j}
                                className="flex items-start gap-2.5"
                              >
                                <span
                                  className="w-2 h-2 rounded-full mt-[7px] shrink-0"
                                  style={{ backgroundColor: PRIMARY }}
                                />
                                <span className="text-[13px] text-gray-600 leading-[1.7]">
                                  {item}
                                </span>
                              </li>
                            ))}
                          </ul>

                          {extraSections?.map((section) => (
                            <div key={section.title} className="mt-5">
                              <h4 className="text-[13px] font-bold text-[#232323] flex items-center gap-2 mb-2">
                                <MapPin
                                  className="w-3.5 h-3.5"
                                  style={{ color: PRIMARY }}
                                />
                                {section.title}
                              </h4>
                              <ul className="space-y-2">
                                {section.items.map((sItem, sj) => (
                                  <li
                                    key={sj}
                                    className="flex items-start gap-2.5"
                                  >
                                    <span
                                      className="w-2 h-2 rounded-full mt-[7px] shrink-0"
                                      style={{ backgroundColor: PRIMARY }}
                                    />
                                    <span className="text-[13px] text-gray-600 leading-[1.7]">
                                      {sItem}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cost Tab */}
          {activeTab === "cost" && (
            <div className="mb-10">
              <h2 className="font-serif text-[1.3rem] sm:text-[1.5rem] text-[#232323] mb-6">
                Cost
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {tour.inclusions && (
                  <div>
                    <h3 className="text-[15px] font-bold text-[#232323] mb-4 flex items-center gap-2">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: PRIMARY }}
                      >
                        <Check className="w-3.5 h-3.5 text-white" />
                      </span>
                      The Cost Includes
                    </h3>
                    <ul className="space-y-3">
                      {tour.inclusions.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5"
                        >
                          <Check
                            className="w-4 h-4 mt-0.5 shrink-0"
                            style={{ color: PRIMARY }}
                          />
                          <span className="text-[14px] text-gray-600">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h3 className="text-[15px] font-bold text-[#232323] mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                      <XIcon className="w-3.5 h-3.5 text-white" />
                    </span>
                    The Cost Excludes
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Personal expenses",
                      "Travel insurance",
                      "Anything not mentioned in inclusions",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5"
                      >
                        <XIcon className="w-4 h-4 mt-0.5 shrink-0 text-red-400" />
                        <span className="text-[14px] text-gray-600">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ══════ Enquiry / Booking Form ══════ */}
        <div
          id="enquiry-form"
          className="tourm-enquiry border border-gray-200 rounded-lg p-6 sm:p-8 mb-14 scroll-mt-24"
        >
          <h3 className="font-serif text-[1.5rem] sm:text-[1.75rem] lg:text-[2rem] text-[#232323] mb-2 text-center">
            Book your spot via the form below.
          </h3>
          <p className="text-[13px] text-gray-400 mb-6 text-center">
            Trek: {tour.name}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Full Name *"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`${inputClass} pl-10`}
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="email"
                placeholder="Email Address *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="tel"
                placeholder="Contact Number *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`${inputClass} pl-10`}
              />
            </div>
            <div className="relative">
              <ShieldAlert className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="tel"
                placeholder="Emergency Contact"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          {/* Travellers + Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-[13px] font-semibold text-[#232323] mb-2">
                Number of Travellers
              </p>
              <div className="flex items-center gap-3 border border-gray-200 rounded-md px-4 py-2.5 h-[46px]">
                <button
                  type="button"
                  onClick={() => setPeople((p) => Math.max(1, p - 1))}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center transition hover:border-gray-900 hover:text-gray-900 disabled:opacity-40"
                  disabled={people <= 1}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-[16px] font-bold text-[#232323] w-8 text-center">
                  {people}
                </span>
                <button
                  type="button"
                  onClick={() => setPeople((p) => Math.min(20, p + 1))}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center transition hover:border-gray-900 hover:text-gray-900 disabled:opacity-40"
                  disabled={people >= 20}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <div className="ml-auto text-right">
                  <p className="text-[11px] text-gray-400">Total</p>
                  <p className="text-[15px] font-bold text-[#232323]">
                    &#8377;{formatCurrency(totalAmount)}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#232323] mb-2">
                Address
              </p>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                <textarea
                  placeholder="Your address"
                  rows={1}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`${inputClass} pl-10 resize-none h-[46px]`}
                />
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="border border-gray-200 rounded-md p-5 mb-6">
            <p className="text-[13px] font-semibold text-[#232323] mb-4">
              Payment
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 items-center">
              {/* QR */}
              <div className="flex justify-center">
                {tour.qrImage ? (
                  <div className="rounded-lg overflow-hidden border border-gray-200 p-1.5 bg-white">
                    <Image
                      src={tour.qrImage}
                      alt="Payment QR"
                      width={130}
                      height={130}
                      className="w-[120px] h-[120px]"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-[130px] h-[130px] rounded-lg bg-gray-50 border-2 border-dashed border-gray-200">
                    <span className="text-[12px] text-gray-400">QR Code</span>
                  </div>
                )}
              </div>

              {/* Upload + Transaction ID */}
              <div className="space-y-4">
                <label className="flex items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-gray-200 rounded-md px-4 py-4 hover:border-gray-900 hover:bg-gray-50 transition">
                  <Upload className="w-4 h-4 text-gray-400" />
                  <span className="text-[13px] text-gray-500">
                    {paymentFile || "Upload payment screenshot"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Transaction ID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
            </div>
          </div>

          {submitStatus === "success" && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
              Booking submitted successfully! We&apos;ll get back to you soon.
            </div>
          )}
          {submitStatus === "error" && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              Something went wrong. Please try again.
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting || !fullName || !email || !phone}
            className="flex items-center justify-center gap-2 text-white text-[14px] font-semibold px-8 py-3.5 rounded-full transition-colors disabled:opacity-50"
            style={{ backgroundColor: PRIMARY }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#1f2937")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = PRIMARY)
            }
          >
            <Send className="w-4 h-4" />
            {submitting ? "Submitting..." : "Submit Booking"}
          </button>
        </div>

        {/* ══════ Related Trips ══════ */}
        <div>
          <h2 className="font-serif text-[2rem] sm:text-[2.75rem] xl:text-[3.25rem] text-[#232323] leading-[1.12] mb-6">
            Related trips you might be interested in
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedTours.map((rt) => (
              <Link
                key={rt.name}
                href={`/book/${rt.slug || toSlug(rt.name)}`}
                className="group rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="relative h-[200px] overflow-hidden">
                  <Image
                    src={rt.image}
                    alt={rt.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <span
                    className="absolute top-3 right-3 text-white text-[12px] font-bold px-3 py-1 rounded-full"
                    style={{ backgroundColor: PRIMARY }}
                  >
                    &#8377;
                    {formatCurrency(
                      parseInt(rt.price.replace(/[^\d]/g, ""), 10) || 0
                    )}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-[12px] text-gray-500 mb-2">
                    <Clock className="w-3 h-3" />
                    {rt.duration}
                    {rt.date && (
                      <>
                        <span className="text-gray-300">|</span>
                        <Calendar className="w-3 h-3" />
                        {rt.date}
                      </>
                    )}
                  </div>
                  <h3 className="font-serif text-[1rem] text-[#232323] group-hover:text-gray-600 transition-colors">
                    {rt.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
