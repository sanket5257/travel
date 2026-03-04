"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Clock, MapPin, Minus, Plus, Upload, ChevronDown, ChevronRight,
  Calendar, Heart, Share2, Star, Check, X as XIcon,
  Users, User, Phone, Mail, ShieldAlert, Hash, Send,
  CircleCheck, Circle, Mountain, Gauge, Footprints, Dumbbell,
} from "lucide-react";
import gsap from "gsap";
import { toSlug, type Tour } from "@/lib/tours";

/* parse "10:00 PM – Reach Base village" → { time, desc } */
function parseItem(s: string) {
  const m = s.match(/^([\d:]+\s*(?:–\s*[\d:]+)?\s*(?:AM|PM)?)\s*[–\-]\s*(.*)/i);
  return m ? { time: m[1].trim(), desc: m[2].trim() } : { time: "", desc: s };
}

export default function BookingPageContent({ tour }: { tour: Tour }) {
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [openDay, setOpenDay] = useState<number | null>(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [relatedTours, setRelatedTours] = useState<Tour[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [address, setAddress] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [paymentFile, setPaymentFile] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const people = adults + children;
  const numericPrice = parseInt(tour.price.replace(/[^\d]/g, ""), 10) || 0;
  const totalAmount = numericPrice * people;
  const fmt = (n: number) => n.toLocaleString("en-IN");

  useEffect(() => {
    fetch("/api/tours").then(r => r.json()).then(data => {
      if (Array.isArray(data)) {
        setRelatedTours(data.filter((t: { name: string }) => t.name !== tour.name).slice(0, 3).map((t: { name: string; slug: string; image: string; duration: string; description: string; price_display: string; date?: string; trip_info?: Record<string, string> | null }) => ({
          name: t.name, slug: t.slug, image: t.image, duration: t.duration, description: t.description, price: t.price_display, date: t.date, tripInfo: t.trip_info || undefined,
        })));
      }
    }).catch(() => {});
  }, [tour.name]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPaymentFile(file.name);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setPaymentUrl(data.url);
    } catch { console.error("Upload failed"); }
  };

  const handleSubmit = async () => {
    if (!fullName || !email || !phone) return;
    setSubmitting(true); setSubmitStatus("idle");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tour_id: tour.id || null, tour_name: tour.name, full_name: fullName, email, phone, emergency_contact: emergencyContact || null, num_travelers: people, address: address || null, total_amount: totalAmount, payment_screenshot_url: paymentUrl, transaction_id: transactionId || null }),
      });
      if (res.ok) { setSubmitStatus("success"); setFullName(""); setEmail(""); setPhone(""); setEmergencyContact(""); setAddress(""); setTransactionId(""); setPaymentFile(null); setPaymentUrl(null); setAdults(1); setChildren(0); setInfants(0); }
      else setSubmitStatus("error");
    } catch { setSubmitStatus("error"); }
    finally { setSubmitting(false); }
  };

  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => { gsap.from(".bp-fade", { y: 30, opacity: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" }); }, pageRef);
    return () => ctx.revert();
  }, []);

  const g = tour.gallery || [];
  const gi = [g[0] || tour.image, g[1] || tour.image, g[2] || tour.image];
  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-3.5 text-[15px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-900/10 transition bg-white";

  const Counter = ({ label, sub, value, set, min = 0 }: { label: string; sub: string; value: number; set: (v: number) => void; min?: number }) => (
    <div className="flex items-center justify-between py-3">
      <div><p className="text-[15px] font-medium text-gray-900">{label}</p><p className="text-[13px] text-gray-400">{sub}</p></div>
      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
        <button onClick={() => set(Math.max(min, value - 1))} disabled={value <= min} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-900 disabled:opacity-25 transition"><Minus className="w-4 h-4" /></button>
        <span className="w-8 text-center text-[16px] font-semibold text-gray-900">{value}</span>
        <button onClick={() => set(Math.min(20, value + 1))} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-900 transition"><Plus className="w-4 h-4" /></button>
      </div>
    </div>
  );

  return (
    <div ref={pageRef} className="pt-20 sm:pt-24 pb-0">
      <div className="max-w-[1100px] xl:max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-10">

        {/* ═══ TAGS ═══ */}
        <div className="bp-fade flex flex-wrap gap-2 mb-5">
          <span className="px-3.5 py-1.5 rounded-full bg-gray-900 text-white text-[13px] font-semibold">Popular</span>
          <span className="px-3.5 py-1.5 rounded-full border border-gray-200 text-gray-500 text-[13px]">Cancellation &amp; Refund</span>
          <span className="px-3.5 py-1.5 rounded-full border border-gray-200 text-gray-500 text-[13px]">Kids Friendly</span>
        </div>

        {/* ═══ TITLE ═══ */}
        <div className="bp-fade flex items-start justify-between gap-4 mb-2">
          <h1 className="font-serif text-[1.8rem] sm:text-[2.25rem] xl:text-[2.75rem] text-gray-900 leading-[1.15]">{tour.name}</h1>
          <div className="flex gap-2 shrink-0 mt-1">
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 transition"><Heart className="w-5 h-5" /></button>
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 transition"><Share2 className="w-5 h-5" /></button>
          </div>
        </div>

        {/* ═══ META ═══ */}
        <div className="bp-fade flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[14px] text-gray-500 mb-6">
          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{tour.tripInfo?.departure || "Pune"}</span>
          <span className="text-gray-200">|</span>
          <span>{tour.duration}</span>
          <span className="ml-auto text-[1.3rem] font-bold text-gray-900">&#8377;{fmt(numericPrice)}</span>
        </div>

        {/* ═══ GALLERY ═══ */}
        <div className="bp-fade mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-[1.15fr_0.85fr] gap-2.5 h-[260px] sm:h-[340px] lg:h-[420px]">
            <div className="relative rounded-xl overflow-hidden"><Image src={gi[0]} alt={tour.name} fill className="object-cover" sizes="55vw" priority /></div>
            <div className="hidden sm:grid grid-cols-2 grid-rows-2 gap-2.5">
              <div className="relative rounded-xl overflow-hidden"><Image src={gi[1]} alt="" fill className="object-cover" sizes="22vw" /></div>
              <div className="relative rounded-xl overflow-hidden"><Image src={gi[2]} alt="" fill className="object-cover" sizes="22vw" /></div>
              <div className="relative rounded-xl overflow-hidden"><Image src={gi[1]} alt="" fill className="object-cover" sizes="22vw" /></div>
              <div className="relative rounded-xl overflow-hidden">
                <Image src={gi[0]} alt="" fill className="object-cover" sizes="22vw" />
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            TWO-COLUMN: Content left, Sidebar right
        ═══════════════════════════════════════════ */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 mb-16">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:w-[55%] min-w-0">
            {/* Overview */}
            <div className="bp-fade mb-10">
              <h2 className="font-serif text-[1.4rem] sm:text-[1.6rem] text-gray-900 mb-4">Overview</h2>
              <p className="text-[15px] sm:text-[16px] text-gray-500 leading-[1.85]">{tour.description}</p>
            </div>

            {/* Trek Info Grid */}
            <div className="bp-fade grid grid-cols-2 gap-3.5 mb-10">
              <div className="border border-gray-200 rounded-xl p-5 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"><Mountain className="w-5 h-5 text-gray-600" /></div>
                <div><p className="text-[13px] text-gray-400 mb-0.5">Altitude</p><p className="text-[16px] font-semibold text-gray-900">{tour.tripInfo?.altitude || "–"}</p></div>
              </div>
              <div className="border border-gray-200 rounded-xl p-5 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"><Gauge className="w-5 h-5 text-gray-600" /></div>
                <div><p className="text-[13px] text-gray-400 mb-0.5">Difficulty Level</p><p className="text-[16px] font-semibold text-gray-900">{tour.tripInfo?.difficulty || "Moderate"}</p></div>
              </div>
              <div className="border border-gray-200 rounded-xl p-5 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"><Footprints className="w-5 h-5 text-gray-600" /></div>
                <div><p className="text-[13px] text-gray-400 mb-0.5">Trek Duration</p><p className="text-[16px] font-semibold text-gray-900">{tour.duration}</p></div>
              </div>
              <div className="border border-gray-200 rounded-xl p-5 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"><Dumbbell className="w-5 h-5 text-gray-600" /></div>
                <div><p className="text-[13px] text-gray-400 mb-0.5">Fitness Requirement</p><p className="text-[16px] font-semibold text-gray-900">{tour.tripInfo?.fitness || "Basic Fitness"}</p></div>
              </div>
            </div>

            {/* What's Included */}
            {tour.inclusions && (
              <div className="bp-fade mb-10">
                <h2 className="font-serif text-[1.4rem] sm:text-[1.6rem] text-gray-900 mb-5">What&apos;s Included</h2>
                <ul className="space-y-3">
                  {tour.inclusions.map(item => (
                    <li key={item} className="flex items-center gap-3"><Check className="w-5 h-5 text-gray-900 shrink-0" /><span className="text-[15px] text-gray-600">{item}</span></li>
                  ))}
                </ul>
              </div>
            )}

            {/* What's Excluded */}
            <div className="bp-fade mb-4">
              <h2 className="font-serif text-[1.4rem] sm:text-[1.6rem] text-gray-900 mb-5">What&apos;s Excluded</h2>
              <ul className="space-y-3">
                {["Personal expenses & tips", "Travel insurance", "Anything not mentioned in inclusions", "Personal trekking gear (shoes, backpack, etc.)"].map(item => (
                  <li key={item} className="flex items-center gap-3"><XIcon className="w-5 h-5 text-gray-400 shrink-0" /><span className="text-[15px] text-gray-500">{item}</span></li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="lg:w-[45%] min-w-0">
            <div className="lg:sticky lg:top-24 space-y-4">

              {/* Availability Calendar */}
              <div className="border border-gray-200 rounded-xl p-5">
                <h3 className="text-[16px] font-semibold text-gray-900 mb-3">Availability Calendar</h3>
                {tour.date && (
                  <div className="flex items-center justify-between px-3.5 py-3 rounded-lg border border-gray-900 bg-gray-50 text-[14px] font-medium text-gray-900">
                    {tour.date}
                    <CircleCheck className="w-5 h-5 text-gray-900" />
                  </div>
                )}
              </div>

              {/* Ticket */}
              <div className="border border-gray-200 rounded-xl p-5">
                <h3 className="text-[16px] font-semibold text-gray-900 mb-1">Ticket</h3>
                <Counter label="Adults" sub="Above 12 yrs old" value={adults} set={setAdults} min={1} />
                <div className="border-t border-gray-100" />
                <Counter label="Children" sub="Age 5-11 yrs old" value={children} set={setChildren} />
                <div className="border-t border-gray-100" />
                <Counter label="Infants" sub="Age 0-4 yrs old" value={infants} set={setInfants} />
              </div>

              {/* Price + Book Now */}
              <div className="border border-gray-200 rounded-xl p-5">
                <div className="space-y-2.5 mb-5">
                  <div className="flex justify-between text-[15px]"><span className="text-gray-500">Price</span><span className="text-gray-900 font-medium">&#8377;{fmt(numericPrice * people)}</span></div>
                  <div className="border-t border-gray-100 pt-2.5 flex justify-between">
                    <span className="text-[16px] font-bold text-gray-900">Total</span>
                    <span className="text-[1.15rem] font-bold text-gray-900">&#8377;{fmt(totalAmount)}</span>
                  </div>
                </div>
                <button onClick={() => setShowBookingForm(true)} className="w-full bg-gray-900 hover:bg-gray-800 text-white text-[15px] font-semibold py-3.5 rounded-full transition">
                  Book Now
                </button>
                <p className="text-[13px] text-gray-400 mt-3 text-center">Free cancellation up to 3 days before the trek</p>
              </div>

            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            FULL-WIDTH SECTIONS BELOW
        ═══════════════════════════════════════════ */}

        {/* ── Itinerary ── */}
        {tour.itineraryDays && tour.itineraryDays.length > 0 && (
          <div className="bp-fade mb-16">
            <h2 className="font-serif text-[1.4rem] sm:text-[1.6rem] text-gray-900 mb-6">Itinerary</h2>
            <div className="space-y-3">
              {tour.itineraryDays.map((day, i) => {
                const isOpen = openDay === i;
                return (
                  <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => setOpenDay(isOpen ? null : i)} className="w-full flex items-center justify-between px-5 py-4.5 hover:bg-gray-50/60 transition">
                      <span className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-md bg-gray-900 text-white text-[13px] font-bold flex items-center justify-center shrink-0">D{i + 1}</span>
                        <span className="text-[15px] font-semibold text-gray-900 text-left">{day.title}</span>
                      </span>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[900px]" : "max-h-0"}`}>
                      <div className="px-5 pb-5 border-t border-gray-100">
                        <table className="w-full mt-3">
                          <tbody>
                            {day.items.map((item, j) => {
                              const { time, desc } = parseItem(item);
                              return (
                                <tr key={j} className="border-b border-gray-50 last:border-0">
                                  <td className="py-2.5 pr-4 text-[15px] text-gray-600 leading-[1.65]">{desc || item}</td>
                                  <td className="py-2.5 text-[14px] text-gray-400 whitespace-nowrap text-right align-top font-medium">{time}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Cancellation Policy ── */}
        <div className="bp-fade mb-16">
          <h2 className="font-serif text-[1.4rem] sm:text-[1.6rem] text-gray-900 mb-4">Cancellation policy</h2>
          <p className="text-[15px] text-gray-500 leading-[1.75] mb-5">You can cancel up to 3 days in advance of the experience for a full refund.</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[
              "For a full refund, you must cancel at least 3 days before the experience\u2019s start date.",
              "This experience requires a minimum number of travelers. If it\u2019s cancelled due to low turnout, you\u2019ll be offered a different date or a full refund.",
              "External changes: Injury claims settle per trip liability provisions.",
              "Visa policy: Each region has its own specific documentation or self-declarations.",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-[9px] shrink-0" /><span className="text-[14px] text-gray-500 leading-[1.7]">{t}</span></li>
            ))}
          </ul>
        </div>

        {/* ── Safety Tips ── */}
        <div className="bp-fade mb-16">
          <h2 className="font-serif text-[1.4rem] sm:text-[1.6rem] text-gray-900 mb-4">Safety Tips</h2>
          <ul className="space-y-3">
            {["Carry sufficient water and energy snacks", "Wear proper trekking shoes with grip", "Don\u2019t litter \u2014 carry your trash back", "Follow the trek leader\u2019s instructions at all times", "Carry a basic first aid kit and any personal medication", "Inform the group leader about medical conditions"].map((t, i) => (
              <li key={i} className="flex items-start gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-[9px] shrink-0" /><span className="text-[15px] text-gray-500 leading-[1.7]">{t}</span></li>
            ))}
          </ul>
        </div>

        {/* ── Have Questions ── */}
        <div className="bp-fade mb-16">
          <h2 className="font-serif text-[1.4rem] sm:text-[1.6rem] text-gray-900 mb-4">Have questions?</h2>
          <a href="https://wa.me/919860010521" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gray-900 text-white text-[15px] font-semibold px-6 py-3 rounded-full hover:bg-gray-800 transition">
            Visit Help Center
          </a>
        </div>

        {/* ── Related Tours ── */}
        {relatedTours.length > 0 && (
          <div className="bp-fade border-t border-gray-100 pt-12 mb-16">
            <div className="flex items-center justify-between mb-7">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-gray-900 mb-1">Related Tours &amp; Packages</p>
                <h2 className="font-serif text-[1.4rem] sm:text-[1.6rem] text-gray-900">Customers also booked these tours</h2>
              </div>
              <div className="hidden sm:flex gap-2">
                <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-900 transition"><ChevronRight className="w-5 h-5 rotate-180" /></button>
                <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-900 transition"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {relatedTours.map(rt => (
                <Link key={rt.name} href={`/book/${rt.slug || toSlug(rt.name)}`} className="group cursor-pointer flex flex-col h-full">
                  <div className="relative rounded-[14px] overflow-hidden mb-4 h-[260px] sm:h-[300px] lg:h-[340px]">
                    <Image src={rt.image} alt={rt.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px" />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-900 text-[11px] font-semibold px-3 py-1 rounded-full">{rt.tripInfo?.difficulty || "Moderate"}</span>
                  </div>
                  <h3 className="text-[16px] font-semibold text-gray-900">{rt.name}</h3>
                  <div className="mt-2 flex-1 flex flex-col">
                    <span className="text-[13px] text-gray-900">{rt.duration}</span>
                    <p className="text-gray-900 text-[13px] mt-2 leading-relaxed flex-1">{rt.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-[13px] text-gray-900">From <span className="font-semibold text-gray-900">{rt.price}</span></span>
                      <span className="bg-gray-900 border border-gray-900 text-white text-[12px] font-medium px-5 py-2 rounded-full group-hover:bg-gray-800 transition-all duration-300">Book Now</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ═══ BOOKING FORM MODAL ═══ */}
      {showBookingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={e => { if (e.target === e.currentTarget) setShowBookingForm(false); }}>
          <div className="bg-white rounded-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative">
            <button onClick={() => setShowBookingForm(false)} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"><XIcon className="w-5 h-5" /></button>
            <h3 className="font-serif text-[1.5rem] text-gray-900 mb-1">Book your spot</h3>
            <p className="text-[14px] text-gray-400 mb-6">{tour.name} &middot; {people} {people === 1 ? "person" : "people"} &middot; &#8377;{fmt(totalAmount)}</p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative"><User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" /><input type="text" placeholder="Full Name *" value={fullName} onChange={e => setFullName(e.target.value)} className={`${inputClass} pl-11`} /></div>
                <div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" /><input type="email" placeholder="Email *" value={email} onChange={e => setEmail(e.target.value)} className={`${inputClass} pl-11`} /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative"><Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" /><input type="tel" placeholder="Phone *" value={phone} onChange={e => setPhone(e.target.value)} className={`${inputClass} pl-11`} /></div>
                <div className="relative"><ShieldAlert className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" /><input type="tel" placeholder="Emergency Contact" value={emergencyContact} onChange={e => setEmergencyContact(e.target.value)} className={`${inputClass} pl-11`} /></div>
              </div>
              <div className="relative"><MapPin className="absolute left-3.5 top-4 w-4.5 h-4.5 text-gray-400 pointer-events-none" /><textarea placeholder="Address" rows={2} value={address} onChange={e => setAddress(e.target.value)} className={`${inputClass} pl-11 resize-none`} /></div>
              <div className="border border-gray-200 rounded-xl p-5">
                <p className="text-[15px] font-semibold text-gray-900 mb-3">Payment</p>
                <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4 items-center">
                  {tour.qrImage ? <div className="rounded-lg border border-gray-200 p-1.5 bg-white flex justify-center"><Image src={tour.qrImage} alt="QR" width={110} height={110} /></div> : <div className="w-[110px] h-[110px] rounded-lg bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-[13px] text-gray-400">QR Code</div>}
                  <div className="space-y-3">
                    <label className="flex items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-gray-200 rounded-lg px-4 py-3.5 hover:border-gray-400 transition"><Upload className="w-5 h-5 text-gray-400" /><span className="text-[14px] text-gray-500">{paymentFile || "Upload screenshot"}</span><input type="file" accept="image/*" className="hidden" onChange={handleFileChange} /></label>
                    <div className="relative"><Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" /><input type="text" placeholder="Transaction ID" value={transactionId} onChange={e => setTransactionId(e.target.value)} className={`${inputClass} pl-11`} /></div>
                  </div>
                </div>
              </div>
              {submitStatus === "success" && <div className="p-3.5 bg-green-50 border border-green-200 rounded-lg text-green-800 text-[15px]">Booking submitted! We&apos;ll contact you soon.</div>}
              {submitStatus === "error" && <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-red-800 text-[15px]">Something went wrong. Try again.</div>}
              <button onClick={handleSubmit} disabled={submitting || !fullName || !email || !phone} className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-[16px] font-semibold py-4 rounded-full transition disabled:opacity-50">
                <Send className="w-5 h-5" />{submitting ? "Submitting..." : "Submit Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
