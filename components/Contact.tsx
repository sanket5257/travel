"use client";

import { useRef, useEffect, useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const infoCards = [
  {
    icon: Phone,
    label: "Mobile",
    value: "+91 86053 21035",
  },
  {
    icon: Phone,
    label: "WhatsApp",
    value: "+91 98600 10521",
  },
  {
    icon: Mail,
    label: "Email",
    value: "tothemoonwayfarer@gmail.com",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Mumbai, Maharashtra",
  },
];

const trekOptions = [
  "Select a trek",
  "Kalsubai Summit",
  "Harishchandragad",
  "Rajgad Fort",
  "Kedarkantha",
  "Hampta Pass",
  "Other",
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".contact-tag", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });

      gsap.from(".contact-heading", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.15,
      });

      gsap.from(".contact-desc", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.3,
      });

      gsap.from(".contact-info-card", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.4,
      });

      gsap.from(".contact-form-card", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.3,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-16 sm:py-24 xl:py-32 px-5 sm:px-8 lg:px-12 max-w-[1200px] xl:max-w-[1400px] mx-auto"
    >
      <div className="grid lg:grid-cols-2 items-start gap-10 lg:gap-14">
        {/* Left Column */}
        <div>
          <span className="contact-tag inline-block border border-gray-200 rounded-full px-4 py-1.5 text-[12px] text-gray-900 tracking-wide mb-5 sm:mb-7">
            /Contact Us
          </span>

          <h2 className="contact-heading font-serif text-[2rem] sm:text-[2.75rem] xl:text-[3.25rem] leading-[1.12] text-gray-900 mb-4">
            Get in Touch
          </h2>

          <p className="contact-desc text-gray-500 text-[14px] sm:text-[15px] leading-[1.7] max-w-[440px] mb-8 sm:mb-10">
            Have questions about an upcoming trek or want to plan a custom
            adventure? Reach out and we&apos;ll get back to you within 24 hours.
          </p>

          <div className="flex flex-col gap-4">
            {infoCards.map((card) => (
              <div
                key={card.label}
                className="contact-info-card flex items-center gap-4 border border-gray-200 rounded-[20px] p-5 sm:p-6"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <card.icon className="w-[18px] h-[18px] text-gray-700" />
                </div>
                <div>
                  <p className="text-[12px] text-gray-400 mb-0.5">
                    {card.label}
                  </p>
                  <p className="text-[14px] sm:text-[15px] font-medium text-gray-900">
                    {card.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column — Form */}
        <div className="contact-form-card border border-gray-200 rounded-[20px] p-6 sm:p-8 xl:p-10 lg:mt-[160px]">
          {submitted ? (
            <div className="flex flex-col items-center justify-center text-center h-full py-10">
              <CheckCircle className="w-12 h-12 text-teal-500 mb-4" />
              <h3 className="font-serif text-[1.5rem] sm:text-[1.75rem] text-gray-900 mb-2">
                Message Sent!
              </h3>
              <p className="text-gray-500 text-[14px] leading-[1.7] max-w-[320px]">
                Thank you for reaching out. Our team will get back to you within
                24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 text-[13px] font-medium text-gray-900 underline underline-offset-2 hover:text-gray-600 transition"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <h3 className="font-serif text-[1.25rem] sm:text-[1.5rem] text-gray-900 mb-1">
                Send a Message
              </h3>

              <div className="grid sm:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition"
                />
                <select
                  defaultValue=""
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-900 outline-none focus:border-gray-400 transition appearance-none bg-white"
                >
                  <option value="" disabled>
                    Select a trek
                  </option>
                  {trekOptions.slice(1).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                placeholder="Your Message"
                rows={4}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition resize-none"
              />

              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-gray-900 text-white px-7 py-3.5 rounded-full text-[13px] font-medium hover:bg-gray-800 transition-colors self-start"
              >
                <Send className="w-[14px] h-[14px]" />
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
