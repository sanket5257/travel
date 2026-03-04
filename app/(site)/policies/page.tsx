"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ShieldCheck,
  RefreshCw,
  FileText,
  Scale,
  AlertTriangle,
  ClipboardCheck,
  MousePointerClick,
  Phone,
  Mail,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const sections = [
  {
    id: "safety",
    icon: ShieldCheck,
    title: "1. Safety Guidelines",
    items: [
      "Participants must be physically fit and medically capable of completing the selected trek.",
      "All trek leader instructions must be strictly followed at all times.",
      "Certified leaders carry first-aid kits; evacuation expenses are participant responsibility.",
      "Trekking involves natural risks, including weather changes, slippery terrain, and wildlife.",
      "Zero tolerance for alcohol, drugs, or unsafe behavior.",
      "Strict environmental responsibility and zero litter policy.",
    ],
  },
  {
    id: "refund",
    icon: RefreshCw,
    title: "2. Refund Policy",
    items: [
      "5+ days before trek: 80% refund.",
      "3\u20134 days before trek: 50% refund.",
      "0\u20132 days before trek: No refund.",
      "Organizer cancellation due to safety/weather: Full refund or transfer option.",
      "No refund for no-show, late arrival, or personal emergencies.",
    ],
  },
  {
    id: "terms",
    icon: FileText,
    title: "3. Terms & Conditions",
    items: [
      "Booking confirmed only after full payment.",
      "Participants assume inherent trekking risks voluntarily.",
      "Organizer not liable for personal negligence or lost belongings.",
      "Photos/videos may be used for marketing unless objected in writing.",
      "Jurisdiction: Maharashtra, India.",
    ],
  },
  {
    id: "liability",
    icon: Scale,
    title: "4. Legal Liability & Indemnity",
    items: [
      "Participant agrees to indemnify and hold harmless the organization from claims or damages.",
      "Participation is voluntary and at personal risk.",
      "Organizer not responsible for acts of nature or third-party actions.",
      "Participant confirms disclosure of medical conditions.",
    ],
  },
  {
    id: "risk-waiver",
    icon: AlertTriangle,
    title: "5. Risk Waiver",
    description:
      "I acknowledge trekking involves inherent risks and voluntarily agree to participate. I release To The Moon Wayfarer from liability arising from participation.",
  },
  {
    id: "declaration",
    icon: ClipboardCheck,
    title: "6. Participant Declaration",
    description:
      "I confirm that I am medically fit and agree to follow all safety instructions and guidelines.",
  },
  {
    id: "digital-consent",
    icon: MousePointerClick,
    title: "7. Digital Consent",
    description:
      "By clicking \u2018I Agree\u2019 during booking, you accept all Safety Guidelines, Refund Policy, Terms & Conditions, and Risk Waiver. This digital consent is legally binding.",
  },
];

export default function PoliciesPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".pol-fade", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: ".pol-fade", start: "top 90%" },
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="pt-28 sm:pt-32 pb-20">
      <div className="max-w-[780px] mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="pol-fade text-center mb-12 sm:mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-3">
            Official Policies & Legal Terms
          </p>
          <h1 className="font-serif text-[2rem] sm:text-[2.6rem] lg:text-[3rem] text-gray-900 leading-[1.1] mb-4">
            Policies & Risk Documentation
          </h1>
          <p className="text-[14px] sm:text-[15px] text-gray-500 leading-[1.8] max-w-[520px] mx-auto">
            To The Moon Wayfarer is committed to your safety and transparency.
            Please read through our policies before booking.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8 sm:space-y-10">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.id}
                id={section.id}
                className="pol-fade border border-gray-200 rounded-2xl p-5 sm:p-7"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-white" />
                  </span>
                  <h2 className="font-serif text-[1.15rem] sm:text-[1.3rem] text-gray-900">
                    {section.title}
                  </h2>
                </div>

                {section.items && (
                  <ul className="space-y-2.5 ml-1">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-[8px] shrink-0" />
                        <span className="text-[14px] text-gray-600 leading-[1.75]">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.description && (
                  <p className="text-[14px] text-gray-600 leading-[1.75] ml-1">
                    {section.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact */}
        <div className="pol-fade mt-12 sm:mt-14 text-center border border-gray-200 rounded-2xl p-6 sm:p-8">
          <h3 className="font-serif text-[1.1rem] text-gray-900 mb-3">
            Questions about our policies?
          </h3>
          <p className="text-[13px] text-gray-500 mb-5">
            Reach out to us anytime — we&apos;re happy to help.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:tothemoonwayfarer@gmail.com"
              className="flex items-center gap-2 text-[13px] text-gray-600 hover:text-gray-900 transition"
            >
              <Mail className="w-4 h-4" />
              tothemoonwayfarer@gmail.com
            </a>
            <a
              href="tel:8605321035"
              className="flex items-center gap-2 text-[13px] text-gray-600 hover:text-gray-900 transition"
            >
              <Phone className="w-4 h-4" />
              8605321035
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
