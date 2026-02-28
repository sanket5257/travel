"use client";

import { useRef, useEffect, useState, useCallback, useLayoutEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSwipe } from "@/hooks/useSwipe";
import TrekModal from "./TrekModal";
import type { Tour } from "./TrekModal";

gsap.registerPlugin(ScrollTrigger);

const tours: Tour[] = [
  {
    name: "Harihar Fort Trek",
    image:
      "https://images.unsplash.com/photo-1695210365465-f0c9839c362e?w=800&q=80",
    duration: "1 Day / 2 Nights",
    description:
      "Scale the iconic rock-cut steps of Harihar Fort in Nashik. Includes lunch, dinner, breakfast, trek badge, and expert leadership.",
    price: "1,666 Rs/-",
    date: "28/02/2026",
    inclusions: [
      "Lunch",
      "Dinner",
      "Breakfast",
      "Our Badge",
      "Basic First Aid",
      "Trek Lead Expertise",
    ],
    itineraryTitle: "Itinerary of Harihar Fort & Trimbakeshwar",
    itineraryDays: [
      {
        title: "Day 0 (28/02/2026) Saturday Night",
        items: [
          "10:00 PM \u2013 Depart from Pune (SantTukaram Nagar Metro Station)",
          "4:00 AM \u2013 Reach Base village (Harihar base)",
          "4:00 \u2013 5:00 AM \u2013 Freshen up",
        ],
      },
      {
        title: "Day 1 (29/02/2026)",
        items: [
          "5:00 AM \u2013 Start trek \u2013 3.5 hrs trek time",
          "8:30 \u2013 9:00 AM \u2013 Reach top",
          "9:00 \u2013 10:00 AM \u2013 Explore, photos, rest",
          "10:00 AM \u2013 Start descent",
          "12:30 PM \u2013 Reach base village",
          "12:30 \u2013 1:30 PM \u2013 Breakfast / lunch + rest",
        ],
      },
    ],
    itinerarySections: [
      {
        title: "\u0950 Trimbakeshwar Visit",
        items: [
          "1:45 PM \u2013 Depart for Trimbakeshwar",
          "3:00 PM \u2013 Reach temple",
          "3:00 \u2013 5:30 PM \u2013 Darshan + local visit",
        ],
      },
      {
        title: "Kushavartakund (Tirthraaj)",
        items: ["5:30 PM \u2013 Darshan"],
      },
      {
        title: "\uD83D\uDE8C Return to Pune",
        items: [
          "5:30 PM \u2013 Start return",
          "9:30 \u2013 10:00 PM \u2013 Reach Pune",
        ],
      },
    ],
  },
  {
    name: "Katraj to Sinhagad",
    image:
      "https://images.unsplash.com/photo-1609232531309-25676b9b7080?w=800&q=80",
    duration: "1 Day",
    description:
      "Traverse the legendary night trail from Katraj to Sinhagad Fort\u2014one of Pune\u2019s most popular endurance treks through the Sahyadri hills.",
    price: "444 Rs/-",
    date: "07/03/2026",
    inclusions: [
      "Breakfast at Sinhagad",
      "Trek Lead Expertise",
      "Basic First Aid",
      "Our Badge",
      "Group Coordination",
    ],
    itineraryTitle: "Itinerary of Katraj to Sinhagad Night Trek",
    itineraryDays: [
      {
        title: "Day 0 (07/03/2026) Saturday Night",
        items: [
          "11:00 PM \u2013 Assembly at Katraj Tunnel entrance",
          "11:30 PM \u2013 Start night trek",
        ],
      },
      {
        title: "Day 1 (08/03/2026)",
        items: [
          "12:00 \u2013 2:00 AM \u2013 Trek through forest trail",
          "2:00 \u2013 2:30 AM \u2013 Rest stop + refreshments",
          "2:30 \u2013 5:00 AM \u2013 Continue trek towards Sinhagad",
          "5:00 \u2013 5:30 AM \u2013 Reach Sinhagad Fort",
          "5:30 \u2013 6:00 AM \u2013 Sunrise view from fort",
          "6:00 \u2013 7:00 AM \u2013 Explore fort + breakfast",
          "7:30 AM \u2013 Descend & depart for Pune",
        ],
      },
    ],
  },
  {
    name: "Trimbakeshwar Visit",
    image:
      "https://images.unsplash.com/photo-1719465236914-71562b2c59dd?w=800&q=80",
    duration: "2 Days / 1 Night",
    description:
      "A spiritual and scenic journey to the sacred Trimbakeshwar Jyotirlinga temple with full meals, hotel stay, and guided sightseeing.",
    price: "5,555 Rs/-",
    date: "14/03/2026",
    inclusions: [
      "Hotel Stay (1 Night)",
      "Breakfast",
      "Lunch",
      "Dinner",
      "Transport (AC Bus)",
      "Guided Sightseeing",
      "Basic First Aid",
    ],
    itineraryTitle: "Itinerary of Trimbakeshwar Spiritual Visit",
    itineraryDays: [
      {
        title: "Day 1 (14/03/2026) Saturday",
        items: [
          "6:00 AM \u2013 Depart from Pune (SantTukaram Nagar Metro Station)",
          "9:30 AM \u2013 Reach Trimbakeshwar",
          "10:00 AM \u2013 12:00 PM \u2013 Trimbakeshwar Temple Darshan",
          "12:00 \u2013 1:00 PM \u2013 Lunch",
          "1:30 \u2013 3:00 PM \u2013 Kushavartakund & local sightseeing",
          "3:30 PM \u2013 Check-in to hotel + rest",
          "7:00 PM \u2013 Dinner",
        ],
      },
      {
        title: "Day 2 (15/03/2026) Sunday",
        items: [
          "7:00 AM \u2013 Breakfast",
          "8:00 \u2013 10:00 AM \u2013 Brahmagiri Hill visit",
          "10:30 AM \u2013 Check-out",
          "11:00 AM \u2013 Depart for Pune",
          "2:30 PM \u2013 Reach Pune",
        ],
      },
    ],
  },
  {
    name: "Rajmachi Fort Trek",
    image:
      "https://images.unsplash.com/photo-1702799464926-b5fb08efe25d?w=800&q=80",
    duration: "1 Day / 1 Night",
    description:
      "Camp under the stars at Rajmachi Fort with panoramic views of the Western Ghats, fireflies in season, and a community bonfire.",
    price: "1,800 Rs/-",
    date: "21/03/2026",
    inclusions: [
      "Dinner",
      "Breakfast",
      "Tent Stay (Camping)",
      "Bonfire",
      "Trek Lead Expertise",
      "Basic First Aid",
      "Our Badge",
    ],
    itineraryTitle: "Itinerary of Rajmachi Fort Trek & Camping",
    itineraryDays: [
      {
        title: "Day 1 (21/03/2026) Saturday",
        items: [
          "3:00 PM \u2013 Assembly at Lonavala Station",
          "3:30 PM \u2013 Transfer to Udhewadi base village",
          "4:00 PM \u2013 Start trek to Rajmachi",
          "6:30 PM \u2013 Reach campsite near Rajmachi Fort",
          "7:00 PM \u2013 Set up tents + freshen up",
          "8:00 PM \u2013 Dinner",
          "9:00 PM \u2013 Bonfire + stargazing",
        ],
      },
      {
        title: "Day 2 (22/03/2026) Sunday",
        items: [
          "5:30 AM \u2013 Sunrise view",
          "6:00 \u2013 7:00 AM \u2013 Explore Shrivardhan & Manaranjan forts",
          "7:30 AM \u2013 Breakfast",
          "8:30 AM \u2013 Start descent",
          "10:30 AM \u2013 Reach base village",
          "11:00 AM \u2013 Depart for Lonavala / Pune",
        ],
      },
    ],
  },
  {
    name: "Kalsubai Peak Trek",
    image:
      "https://images.unsplash.com/photo-1708867817468-9f7a7aaa0d50?w=800&q=80",
    duration: "1 Day / 1 Night",
    description:
      "Summit Maharashtra\u2019s highest peak at 1,646m. Iron ladders, rocky patches, and a breathtaking sunrise await at the top.",
    price: "1,200 Rs/-",
    date: "28/03/2026",
    inclusions: [
      "Dinner",
      "Breakfast",
      "Transport from Pune",
      "Trek Lead Expertise",
      "Basic First Aid",
      "Our Badge",
    ],
    itineraryTitle: "Itinerary of Kalsubai Peak Trek",
    itineraryDays: [
      {
        title: "Day 0 (28/03/2026) Saturday Night",
        items: [
          "10:00 PM \u2013 Depart from Pune",
          "2:00 AM \u2013 Reach Bari village (base)",
          "2:00 \u2013 3:00 AM \u2013 Rest + freshen up",
        ],
      },
      {
        title: "Day 1 (29/03/2026) Sunday",
        items: [
          "3:30 AM \u2013 Start trek (night climb for sunrise)",
          "6:00 AM \u2013 Reach Kalsubai summit (1,646m)",
          "6:00 \u2013 7:00 AM \u2013 Sunrise + photos at the peak",
          "7:00 AM \u2013 Start descent",
          "9:30 AM \u2013 Reach base village",
          "10:00 AM \u2013 Breakfast",
          "11:00 AM \u2013 Depart for Pune",
          "3:00 PM \u2013 Reach Pune",
        ],
      },
    ],
    itinerarySections: [
      {
        title: "Highlights",
        items: [
          "Iron ladders & rocky patches along the route",
          "Kalsubai Temple at the summit",
          "360\u00B0 panoramic view of Sahyadri range",
        ],
      },
    ],
  },
  {
    name: "Harishchandragad Trek",
    image:
      "https://images.unsplash.com/photo-1708589413212-cd22902e5caf?w=800&q=80",
    duration: "2 Days / 1 Night",
    description:
      "Explore the ancient Konkan Kada cliff, Kedareshwar cave temple, and lush green valleys on this iconic Sahyadri adventure.",
    price: "2,200 Rs/-",
    date: "04/04/2026",
    inclusions: [
      "Dinner",
      "Breakfast",
      "Lunch",
      "Tent Stay (Camping)",
      "Transport from Pune",
      "Trek Lead Expertise",
      "Basic First Aid",
      "Our Badge",
    ],
    itineraryTitle: "Itinerary of Harishchandragad Trek",
    itineraryDays: [
      {
        title: "Day 1 (04/04/2026) Saturday",
        items: [
          "5:00 AM \u2013 Depart from Pune",
          "9:00 AM \u2013 Reach Khireshwar village (base)",
          "9:30 AM \u2013 Start trek via Pachnai route",
          "1:00 PM \u2013 Reach Harishchandragad plateau",
          "1:30 PM \u2013 Lunch + rest",
          "3:00 \u2013 5:00 PM \u2013 Explore Konkan Kada cliff",
          "5:30 PM \u2013 Visit Kedareshwar cave temple",
          "7:00 PM \u2013 Campfire + dinner",
        ],
      },
      {
        title: "Day 2 (05/04/2026) Sunday",
        items: [
          "5:30 AM \u2013 Sunrise at Konkan Kada",
          "7:00 AM \u2013 Breakfast",
          "8:00 AM \u2013 Visit Saptatirtha & Harishchandreshwar temple",
          "9:30 AM \u2013 Start descent via Junnar route",
          "12:30 PM \u2013 Reach base",
          "1:00 PM \u2013 Depart for Pune",
          "5:00 PM \u2013 Reach Pune",
        ],
      },
    ],
  },
  {
    name: "Kedarkantha Trek",
    image:
      "https://images.unsplash.com/photo-1681045905442-3203fb0e6111?w=800&q=80",
    duration: "5 Days / 4 Nights",
    description:
      "A perfect winter trek in Uttarakhand through snow-laden trails, pine forests, and a stunning summit at 3,800m.",
    price: "7,500 Rs/-",
    date: "18/04/2026",
    inclusions: [
      "All Meals (Veg)",
      "Tent Stay & Sleeping Bags",
      "Trek Lead & Support Staff",
      "First Aid & Oxygen Cylinder",
      "Forest Permits",
      "Our Badge",
      "Campfire Every Night",
    ],
    itineraryTitle: "Itinerary of Kedarkantha Trek, Uttarakhand",
    itineraryDays: [
      {
        title: "Day 1 \u2013 Dehradun to Sankri",
        items: [
          "6:00 AM \u2013 Depart from Dehradun",
          "3:00 PM \u2013 Reach Sankri village (6,400 ft)",
          "4:00 PM \u2013 Briefing + acclimatization walk",
          "7:00 PM \u2013 Dinner at guesthouse",
        ],
      },
      {
        title: "Day 2 \u2013 Sankri to Juda Ka Talab",
        items: [
          "8:00 AM \u2013 Start trek through pine forests",
          "1:00 PM \u2013 Reach Juda Ka Talab (9,100 ft)",
          "2:00 PM \u2013 Lunch + camp setup",
          "Evening \u2013 Explore frozen lake + campfire",
        ],
      },
      {
        title: "Day 3 \u2013 Summit Day",
        items: [
          "3:00 AM \u2013 Early start for summit push",
          "7:00 AM \u2013 Reach Kedarkantha summit (12,500 ft)",
          "7:00 \u2013 8:00 AM \u2013 360\u00B0 Himalayan views + photos",
          "8:00 AM \u2013 Descent to Hargaon campsite",
          "2:00 PM \u2013 Reach camp + lunch + rest",
        ],
      },
      {
        title: "Day 4 \u2013 Hargaon to Sankri",
        items: [
          "8:00 AM \u2013 Breakfast + pack up",
          "9:00 AM \u2013 Descend to Sankri",
          "1:00 PM \u2013 Reach Sankri + lunch",
          "Evening \u2013 Celebration + certificates",
        ],
      },
      {
        title: "Day 5 \u2013 Sankri to Dehradun",
        items: [
          "7:00 AM \u2013 Breakfast + depart",
          "4:00 PM \u2013 Reach Dehradun",
        ],
      },
    ],
  },
  {
    name: "Triund Trek",
    image:
      "https://images.unsplash.com/photo-1601895912784-8774950a9089?w=800&q=80",
    duration: "2 Days / 1 Night",
    description:
      "Camp at the foothills of the Dhauladhar range in Himachal with stunning views of the Kangra Valley and Himalayan peaks.",
    price: "3,500 Rs/-",
    date: "25/04/2026",
    inclusions: [
      "Dinner",
      "Breakfast",
      "Tent Stay & Sleeping Bags",
      "Trek Lead Expertise",
      "Basic First Aid",
      "Our Badge",
      "Campfire",
    ],
    itineraryTitle: "Itinerary of Triund Trek, Himachal Pradesh",
    itineraryDays: [
      {
        title: "Day 1 \u2013 McLeodganj to Triund",
        items: [
          "9:00 AM \u2013 Assembly at McLeodganj",
          "9:30 AM \u2013 Start trek from Galu Devi Temple",
          "10:30 AM \u2013 Cross Magic View Caf\u00E9 point",
          "1:00 PM \u2013 Reach Triund Top (2,875m)",
          "1:30 PM \u2013 Lunch + set up camp",
          "4:00 \u2013 6:00 PM \u2013 Explore ridge + photography",
          "6:00 PM \u2013 Sunset view over Kangra Valley",
          "8:00 PM \u2013 Dinner + campfire + stargazing",
        ],
      },
      {
        title: "Day 2 \u2013 Triund to McLeodganj",
        items: [
          "5:30 AM \u2013 Sunrise over Dhauladhar range",
          "7:00 AM \u2013 Breakfast + pack up",
          "8:00 AM \u2013 Start descent",
          "10:30 AM \u2013 Reach McLeodganj",
          "11:00 AM \u2013 Trek ends \u2013 explore local market",
        ],
      },
    ],
  },
  {
    name: "Valley of Flowers Trek",
    image:
      "https://images.unsplash.com/photo-1723871493526-79bfa8d9402e?w=800&q=80",
    duration: "6 Days / 5 Nights",
    description:
      "Walk through UNESCO-listed alpine meadows bursting with rare Himalayan wildflowers in Uttarakhand\u2019s Chamoli district.",
    price: "8,500 Rs/-",
    date: "01/08/2026",
    inclusions: [
      "All Meals (Veg)",
      "Guesthouse & Tent Stay",
      "Trek Lead & Support Staff",
      "First Aid & Oxygen Cylinder",
      "Forest & National Park Permits",
      "Our Badge",
      "Porter/Mule Support",
    ],
    itineraryTitle: "Itinerary of Valley of Flowers Trek, Uttarakhand",
    itineraryDays: [
      {
        title: "Day 1 \u2013 Haridwar to Govindghat",
        items: [
          "6:00 AM \u2013 Depart from Haridwar",
          "5:00 PM \u2013 Reach Govindghat (1,800m)",
          "6:00 PM \u2013 Dinner + briefing at guesthouse",
        ],
      },
      {
        title: "Day 2 \u2013 Govindghat to Ghangaria",
        items: [
          "7:00 AM \u2013 Start trek to Ghangaria (14 km)",
          "3:00 PM \u2013 Reach Ghangaria (3,049m)",
          "4:00 PM \u2013 Rest + acclimatize",
          "7:00 PM \u2013 Dinner",
        ],
      },
      {
        title: "Day 3 \u2013 Valley of Flowers",
        items: [
          "7:00 AM \u2013 Trek to Valley of Flowers (4 km)",
          "9:00 AM \u2013 Enter the National Park",
          "9:00 AM \u2013 3:00 PM \u2013 Explore alpine meadows & wildflowers",
          "4:00 PM \u2013 Return to Ghangaria",
          "7:00 PM \u2013 Dinner",
        ],
      },
      {
        title: "Day 4 \u2013 Hemkund Sahib",
        items: [
          "6:00 AM \u2013 Trek to Hemkund Sahib (6 km, 4,329m)",
          "10:00 AM \u2013 Visit Gurudwara & sacred lake",
          "12:00 PM \u2013 Start descent to Ghangaria",
          "3:00 PM \u2013 Reach Ghangaria + rest",
          "7:00 PM \u2013 Dinner + campfire",
        ],
      },
      {
        title: "Day 5 \u2013 Ghangaria to Govindghat",
        items: [
          "7:00 AM \u2013 Start descent (14 km)",
          "1:00 PM \u2013 Reach Govindghat",
          "2:00 PM \u2013 Lunch + rest",
          "Evening \u2013 Celebration + certificates",
        ],
      },
      {
        title: "Day 6 \u2013 Govindghat to Haridwar",
        items: [
          "6:00 AM \u2013 Depart for Haridwar",
          "4:00 PM \u2013 Reach Haridwar \u2013 trek ends",
        ],
      },
    ],
  },
];

export default function TopTours() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const dirRef = useRef<1 | -1>(1);

  const [page, setPage] = useState(0);
  const [cols, setCols] = useState<1 | 2 | 3>(3);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setCols(w < 640 ? 1 : w < 1024 ? 2 : 3);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const perPage = cols;
  const maxPage = Math.max(0, tours.length - perPage);
  const totalPages = maxPage + 1;

  useEffect(() => {
    setPage((p) => Math.min(p, maxPage));
  }, [maxPage]);

  const visible = tours.slice(page, page + perPage);

  const goNext = useCallback(() => {
    dirRef.current = 1;
    setPage((p) => Math.min(p + 1, maxPage));
  }, [maxPage]);

  const goPrev = useCallback(() => {
    dirRef.current = -1;
    setPage((p) => Math.max(p - 1, 0));
  }, []);

  useSwipe(cardsRef, { onSwipeLeft: goNext, onSwipeRight: goPrev });

  // Animate progress bar
  useEffect(() => {
    if (!progressRef.current) return;
    const pct = ((page + 1) / totalPages) * 100;
    gsap.to(progressRef.current, {
      width: `${pct}%`,
      duration: 0.5,
      ease: "power2.out",
    });
  }, [page, totalPages]);

  // Slide cards on page change
  useLayoutEffect(() => {
    if (!cardsRef.current) return;
    const dir = dirRef.current;
    gsap.fromTo(
      cardsRef.current.children,
      { x: dir * 120, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power3.out" }
    );
  }, [page, cols]);

  // Entrance animations
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".tours-tag", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });

      gsap.from(".tours-heading", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });

      gsap.from(".tours-desc", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.2,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="tours"
      className="py-16 sm:py-24 xl:py-32 px-5 sm:px-8 lg:px-12 max-w-[1200px] xl:max-w-[1400px] mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-6 mb-6">
        <div>
          <span className="tours-tag inline-block border border-gray-200 rounded-full px-4 py-1.5 text-[12px] text-gray-900 tracking-wide">
            /Popular Treks
          </span>
        </div>
        <div className="sm:max-w-[480px]">
          <h2 className="tours-heading font-serif text-[2rem] sm:text-[2.75rem] xl:text-[3.25rem] leading-[1.12] text-gray-900 mb-4 sm:mb-5">
            Upcoming Adventures & Treks
          </h2>
          <p className="tours-desc text-gray-900 text-[13px] sm:text-[14px] leading-[1.7]">
            Carefully curated group treks across India with all-inclusive
            packages. Full meals, expert leaders, and unforgettable
            experiences\u2014your next adventure starts here!
          </p>
        </div>
      </div>

      {/* Progress and Pagination */}
      <div className="flex items-center justify-between mb-8 sm:mb-12">
        {/* Progress bar */}
        <div className="relative w-32 sm:w-44 h-[2px] bg-gray-200 rounded-full overflow-hidden">
          <div
            ref={progressRef}
            className="absolute top-0 left-0 h-full bg-gray-900 rounded-full"
            style={{ width: `${((page + 1) / totalPages) * 100}%` }}
          />
        </div>
        <div className="flex items-center gap-3 sm:gap-5">
          <span className="text-[13px] text-gray-300">
            <span className="text-gray-900 font-semibold">{page + 1}</span> /{" "}
            {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={goPrev}
              disabled={page === 0}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition ${
                page === 0
                  ? "border-gray-100 text-gray-200 cursor-not-allowed"
                  : "border-gray-200 text-gray-400 hover:border-gray-900 hover:text-gray-900"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goNext}
              disabled={page === totalPages - 1}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                page === totalPages - 1
                  ? "bg-gray-300 text-white cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tour Cards */}
      <div
        ref={cardsRef}
        className={`grid gap-5 sm:gap-6 overflow-hidden ${
          cols === 1 ? "grid-cols-1" : cols === 2 ? "grid-cols-2" : "grid-cols-3"
        }`}
      >
        {visible.map((tour, i) => (
          <div key={tour.name} className="group cursor-pointer">
            {/* Image */}
            <div className={`relative rounded-[14px] overflow-hidden mb-4 h-[260px] sm:h-[300px] lg:h-[340px] xl:h-[380px] ${cols === 3 && i === 1 ? "lg:h-[420px] xl:h-[460px]" : ""}`}>
              <Image
                src={tour.image}
                alt={tour.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
              />
            </div>

            {/* Info */}
            <h3 className="text-[16px] font-semibold text-gray-900">
              {tour.name}
            </h3>

            <div className="mt-2">
              <span className="text-[13px] text-gray-900">
                {tour.duration}
              </span>
              <p className="text-gray-900 text-[13px] mt-2 leading-relaxed">
                {tour.description}
              </p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-[13px] text-gray-900">
                  From{" "}
                  <span className="font-semibold text-gray-900">
                    {tour.price}
                  </span>
                </span>
                <button
                  onClick={() => setSelectedTour(tour)}
                  className="bg-gray-900 border border-gray-900 text-white text-[12px] font-medium px-5 py-2 rounded-full hover:bg-gray-800 transition-all duration-300"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTour && (
        <TrekModal
          tour={selectedTour}
          onClose={() => setSelectedTour(null)}
        />
      )}
    </section>
  );
}
