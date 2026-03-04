import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const toursData = [
  {
    name: "Harihar Fort Trek",
    image: "/images/tours/harihar-fort.jpg",
    duration: "1 Day / 2 Nights",
    description: "Scale the iconic rock-cut steps of Harihar Fort in Nashik. Includes lunch, dinner, breakfast, trek badge, and expert leadership.",
    price: 1666,
    price_display: "1,666 Rs/-",
    date: "28/02/2026",
    inclusions: ["Lunch", "Dinner", "Breakfast", "Our Badge", "Basic First Aid", "Trek Lead Expertise"],
    itinerary_title: "Itinerary of Harihar Fort & Trimbakeshwar",
    itinerary_days: [
      { title: "Day 0 (28/02/2026) Saturday Night", items: ["10:00 PM – Depart from Pune (SantTukaram Nagar Metro Station)", "4:00 AM – Reach Base village (Harihar base)", "4:00 – 5:00 AM – Freshen up"] },
      { title: "Day 1 (29/02/2026)", items: ["5:00 AM – Start trek – 3.5 hrs trek time", "8:30 – 9:00 AM – Reach top", "9:00 – 10:00 AM – Explore, photos, rest", "10:00 AM – Start descent", "12:30 PM – Reach base village", "12:30 – 1:30 PM – Breakfast / lunch + rest"] },
    ],
    itinerary_sections: [
      { title: "ॐ Trimbakeshwar Visit", items: ["1:45 PM – Depart for Trimbakeshwar", "3:00 PM – Reach temple", "3:00 – 5:30 PM – Darshan + local visit"] },
      { title: "Kushavartakund (Tirthraaj)", items: ["5:30 PM – Darshan"] },
      { title: "🚌 Return to Pune", items: ["5:30 PM – Start return", "9:30 – 10:00 PM – Reach Pune"] },
    ],
  },
  {
    name: "Katraj to Sinhagad",
    image: "/images/tours/katraj-sinhagad.jpg",
    duration: "1 Day",
    description: "Traverse the legendary night trail from Katraj to Sinhagad Fort\u2014one of Pune\u2019s most popular endurance treks through the Sahyadri hills.",
    price: 444,
    price_display: "444 Rs/-",
    date: "07/03/2026",
    inclusions: ["Breakfast at Sinhagad", "Trek Lead Expertise", "Basic First Aid", "Our Badge", "Group Coordination"],
    itinerary_title: "Itinerary of Katraj to Sinhagad Night Trek",
    itinerary_days: [
      { title: "Day 0 (07/03/2026) Saturday Night", items: ["11:00 PM – Assembly at Katraj Tunnel entrance", "11:30 PM – Start night trek"] },
      { title: "Day 1 (08/03/2026)", items: ["12:00 – 2:00 AM – Trek through forest trail", "2:00 – 2:30 AM – Rest stop + refreshments", "2:30 – 5:00 AM – Continue trek towards Sinhagad", "5:00 – 5:30 AM – Reach Sinhagad Fort", "5:30 – 6:00 AM – Sunrise view from fort", "6:00 – 7:00 AM – Explore fort + breakfast", "7:30 AM – Descend & depart for Pune"] },
    ],
  },
  {
    name: "Trimbakeshwar Visit",
    image: "/images/tours/trimbakeshwar.jpg",
    duration: "2 Days / 1 Night",
    description: "A spiritual and scenic journey to the sacred Trimbakeshwar Jyotirlinga temple with full meals, hotel stay, and guided sightseeing.",
    price: 5555,
    price_display: "5,555 Rs/-",
    date: "14/03/2026",
    inclusions: ["Hotel Stay (1 Night)", "Breakfast", "Lunch", "Dinner", "Transport (AC Bus)", "Guided Sightseeing", "Basic First Aid"],
    itinerary_title: "Itinerary of Trimbakeshwar Spiritual Visit",
    itinerary_days: [
      { title: "Day 1 (14/03/2026) Saturday", items: ["6:00 AM – Depart from Pune (SantTukaram Nagar Metro Station)", "9:30 AM – Reach Trimbakeshwar", "10:00 AM – 12:00 PM – Trimbakeshwar Temple Darshan", "12:00 – 1:00 PM – Lunch", "1:30 – 3:00 PM – Kushavartakund & local sightseeing", "3:30 PM – Check-in to hotel + rest", "7:00 PM – Dinner"] },
      { title: "Day 2 (15/03/2026) Sunday", items: ["7:00 AM – Breakfast", "8:00 – 10:00 AM – Brahmagiri Hill visit", "10:30 AM – Check-out", "11:00 AM – Depart for Pune", "2:30 PM – Reach Pune"] },
    ],
  },
  {
    name: "Rajmachi Fort Trek",
    image: "/images/tours/rajmachi-fort.jpg",
    duration: "1 Day / 1 Night",
    description: "Camp under the stars at Rajmachi Fort with panoramic views of the Western Ghats, fireflies in season, and a community bonfire.",
    price: 1800,
    price_display: "1,800 Rs/-",
    date: "21/03/2026",
    inclusions: ["Dinner", "Breakfast", "Tent Stay (Camping)", "Bonfire", "Trek Lead Expertise", "Basic First Aid", "Our Badge"],
    itinerary_title: "Itinerary of Rajmachi Fort Trek & Camping",
    itinerary_days: [
      { title: "Day 1 (21/03/2026) Saturday", items: ["3:00 PM – Assembly at Lonavala Station", "3:30 PM – Transfer to Udhewadi base village", "4:00 PM – Start trek to Rajmachi", "6:30 PM – Reach campsite near Rajmachi Fort", "7:00 PM – Set up tents + freshen up", "8:00 PM – Dinner", "9:00 PM – Bonfire + stargazing"] },
      { title: "Day 2 (22/03/2026) Sunday", items: ["5:30 AM – Sunrise view", "6:00 – 7:00 AM – Explore Shrivardhan & Manaranjan forts", "7:30 AM – Breakfast", "8:30 AM – Start descent", "10:30 AM – Reach base village", "11:00 AM – Depart for Lonavala / Pune"] },
    ],
  },
  {
    name: "Kalsubai Peak Trek",
    image: "/images/tours/kalsubai-peak.jpg",
    duration: "1 Day / 1 Night",
    description: "Summit Maharashtra\u2019s highest peak at 1,646m. Iron ladders, rocky patches, and a breathtaking sunrise await at the top.",
    price: 1200,
    price_display: "1,200 Rs/-",
    date: "28/03/2026",
    inclusions: ["Dinner", "Breakfast", "Transport from Pune", "Trek Lead Expertise", "Basic First Aid", "Our Badge"],
    itinerary_title: "Itinerary of Kalsubai Peak Trek",
    itinerary_days: [
      { title: "Day 0 (28/03/2026) Saturday Night", items: ["10:00 PM – Depart from Pune", "2:00 AM – Reach Bari village (base)", "2:00 – 3:00 AM – Rest + freshen up"] },
      { title: "Day 1 (29/03/2026) Sunday", items: ["3:30 AM – Start trek (night climb for sunrise)", "6:00 AM – Reach Kalsubai summit (1,646m)", "6:00 – 7:00 AM – Sunrise + photos at the peak", "7:00 AM – Start descent", "9:30 AM – Reach base village", "10:00 AM – Breakfast", "11:00 AM – Depart for Pune", "3:00 PM – Reach Pune"] },
    ],
    itinerary_sections: [
      { title: "Highlights", items: ["Iron ladders & rocky patches along the route", "Kalsubai Temple at the summit", "360° panoramic view of Sahyadri range"] },
    ],
  },
  {
    name: "Harishchandragad Trek",
    image: "/images/tours/harishchandragad.jpg",
    duration: "2 Days / 1 Night",
    description: "Explore the ancient Konkan Kada cliff, Kedareshwar cave temple, and lush green valleys on this iconic Sahyadri adventure.",
    price: 2200,
    price_display: "2,200 Rs/-",
    date: "04/04/2026",
    inclusions: ["Dinner", "Breakfast", "Lunch", "Tent Stay (Camping)", "Transport from Pune", "Trek Lead Expertise", "Basic First Aid", "Our Badge"],
    itinerary_title: "Itinerary of Harishchandragad Trek",
    itinerary_days: [
      { title: "Day 1 (04/04/2026) Saturday", items: ["5:00 AM – Depart from Pune", "9:00 AM – Reach Khireshwar village (base)", "9:30 AM – Start trek via Pachnai route", "1:00 PM – Reach Harishchandragad plateau", "1:30 PM – Lunch + rest", "3:00 – 5:00 PM – Explore Konkan Kada cliff", "5:30 PM – Visit Kedareshwar cave temple", "7:00 PM – Campfire + dinner"] },
      { title: "Day 2 (05/04/2026) Sunday", items: ["5:30 AM – Sunrise at Konkan Kada", "7:00 AM – Breakfast", "8:00 AM – Visit Saptatirtha & Harishchandreshwar temple", "9:30 AM – Start descent via Junnar route", "12:30 PM – Reach base", "1:00 PM – Depart for Pune", "5:00 PM – Reach Pune"] },
    ],
  },
  {
    name: "Kedarkantha Trek",
    image: "/images/tours/kedarkantha.jpg",
    duration: "5 Days / 4 Nights",
    description: "A perfect winter trek in Uttarakhand through snow-laden trails, pine forests, and a stunning summit at 3,800m.",
    price: 7500,
    price_display: "7,500 Rs/-",
    date: "18/04/2026",
    inclusions: ["All Meals (Veg)", "Tent Stay & Sleeping Bags", "Trek Lead & Support Staff", "First Aid & Oxygen Cylinder", "Forest Permits", "Our Badge", "Campfire Every Night"],
    itinerary_title: "Itinerary of Kedarkantha Trek, Uttarakhand",
    itinerary_days: [
      { title: "Day 1 – Dehradun to Sankri", items: ["6:00 AM – Depart from Dehradun", "3:00 PM – Reach Sankri village (6,400 ft)", "4:00 PM – Briefing + acclimatization walk", "7:00 PM – Dinner at guesthouse"] },
      { title: "Day 2 – Sankri to Juda Ka Talab", items: ["8:00 AM – Start trek through pine forests", "1:00 PM – Reach Juda Ka Talab (9,100 ft)", "2:00 PM – Lunch + camp setup", "Evening – Explore frozen lake + campfire"] },
      { title: "Day 3 – Summit Day", items: ["3:00 AM – Early start for summit push", "7:00 AM – Reach Kedarkantha summit (12,500 ft)", "7:00 – 8:00 AM – 360° Himalayan views + photos", "8:00 AM – Descent to Hargaon campsite", "2:00 PM – Reach camp + lunch + rest"] },
      { title: "Day 4 – Hargaon to Sankri", items: ["8:00 AM – Breakfast + pack up", "9:00 AM – Descend to Sankri", "1:00 PM – Reach Sankri + lunch", "Evening – Celebration + certificates"] },
      { title: "Day 5 – Sankri to Dehradun", items: ["7:00 AM – Breakfast + depart", "4:00 PM – Reach Dehradun"] },
    ],
  },
  {
    name: "Triund Trek",
    image: "/images/tours/triund.jpg",
    duration: "2 Days / 1 Night",
    description: "Camp at the foothills of the Dhauladhar range in Himachal with stunning views of the Kangra Valley and Himalayan peaks.",
    price: 3500,
    price_display: "3,500 Rs/-",
    date: "25/04/2026",
    inclusions: ["Dinner", "Breakfast", "Tent Stay & Sleeping Bags", "Trek Lead Expertise", "Basic First Aid", "Our Badge", "Campfire"],
    itinerary_title: "Itinerary of Triund Trek, Himachal Pradesh",
    itinerary_days: [
      { title: "Day 1 – McLeodganj to Triund", items: ["9:00 AM – Assembly at McLeodganj", "9:30 AM – Start trek from Galu Devi Temple", "10:30 AM – Cross Magic View Café point", "1:00 PM – Reach Triund Top (2,875m)", "1:30 PM – Lunch + set up camp", "4:00 – 6:00 PM – Explore ridge + photography", "6:00 PM – Sunset view over Kangra Valley", "8:00 PM – Dinner + campfire + stargazing"] },
      { title: "Day 2 – Triund to McLeodganj", items: ["5:30 AM – Sunrise over Dhauladhar range", "7:00 AM – Breakfast + pack up", "8:00 AM – Start descent", "10:30 AM – Reach McLeodganj", "11:00 AM – Trek ends – explore local market"] },
    ],
  },
  {
    name: "Valley of Flowers Trek",
    image: "/images/tours/valley-of-flowers.jpg",
    duration: "6 Days / 5 Nights",
    description: "Walk through UNESCO-listed alpine meadows bursting with rare Himalayan wildflowers in Uttarakhand\u2019s Chamoli district.",
    price: 8500,
    price_display: "8,500 Rs/-",
    date: "01/08/2026",
    inclusions: ["All Meals (Veg)", "Guesthouse & Tent Stay", "Trek Lead & Support Staff", "First Aid & Oxygen Cylinder", "Forest & National Park Permits", "Our Badge", "Porter/Mule Support"],
    itinerary_title: "Itinerary of Valley of Flowers Trek, Uttarakhand",
    itinerary_days: [
      { title: "Day 1 – Haridwar to Govindghat", items: ["6:00 AM – Depart from Haridwar", "5:00 PM – Reach Govindghat (1,800m)", "6:00 PM – Dinner + briefing at guesthouse"] },
      { title: "Day 2 – Govindghat to Ghangaria", items: ["7:00 AM – Start trek to Ghangaria (14 km)", "3:00 PM – Reach Ghangaria (3,049m)", "4:00 PM – Rest + acclimatize", "7:00 PM – Dinner"] },
      { title: "Day 3 – Valley of Flowers", items: ["7:00 AM – Trek to Valley of Flowers (4 km)", "9:00 AM – Enter the National Park", "9:00 AM – 3:00 PM – Explore alpine meadows & wildflowers", "4:00 PM – Return to Ghangaria", "7:00 PM – Dinner"] },
      { title: "Day 4 – Hemkund Sahib", items: ["6:00 AM – Trek to Hemkund Sahib (6 km, 4,329m)", "10:00 AM – Visit Gurudwara & sacred lake", "12:00 PM – Start descent to Ghangaria", "3:00 PM – Reach Ghangaria + rest", "7:00 PM – Dinner + campfire"] },
      { title: "Day 5 – Ghangaria to Govindghat", items: ["7:00 AM – Start descent (14 km)", "1:00 PM – Reach Govindghat", "2:00 PM – Lunch + rest", "Evening – Celebration + certificates"] },
      { title: "Day 6 – Govindghat to Haridwar", items: ["6:00 AM – Depart for Haridwar", "4:00 PM – Reach Haridwar – trek ends"] },
    ],
  },
];

const blogsData = [
  {
    title: "Into the Clouds: A First-Timer's Guide to Himalayan Treks",
    image: "/images/destinations/uttarakhand-1.jpg",
    tag: "HIMACHAL",
    category: "Destinations",
    date: "JAN 15, 2025",
    read_time: "8 MIN READ",
  },
  {
    title: "Fort Treks of the Sahyadris: History Beneath Your Feet",
    image: "/images/blog/forts.jpg",
    tag: "MAHARASHTRA",
    category: "Travel Stories",
    date: "FEB 02, 2025",
    read_time: "6 MIN READ",
  },
  {
    title: "Kedarkantha in Winter: Snow, Silence, and Summit Glory",
    image: "/images/tours/kedarkantha.jpg",
    tag: "UTTARAKHAND",
    category: "Destinations",
    date: "DEC 20, 2024",
    read_time: "10 MIN READ",
  },
  {
    title: "Pack Light, Trek Far: The Ultimate Gear Checklist for Beginners",
    image: "/images/tours/triund.jpg",
    tag: "TREK TIPS",
    category: "Trek Tips",
    date: "NOV 10, 2024",
    read_time: "5 MIN READ",
  },
];

export async function POST() {
  try {
    // Check if already seeded
    const { data: existing } = await supabaseAdmin
      .from("tours")
      .select("id")
      .limit(1);
    if (existing && existing.length > 0) {
      return NextResponse.json({ message: "Already seeded" }, { status: 200 });
    }

    // Seed tours
    const tourRows = toursData.map((t, i) => ({
      name: t.name,
      slug: toSlug(t.name),
      image: t.image,
      gallery: [],
      duration: t.duration,
      description: t.description,
      price: t.price,
      price_display: t.price_display,
      date: t.date || null,
      inclusions: t.inclusions || [],
      itinerary_title: t.itinerary_title || null,
      itinerary_days: t.itinerary_days || [],
      itinerary_sections: t.itinerary_sections || [],
      qr_image: null,
      is_active: true,
      sort_order: i,
    }));

    const { error: toursErr } = await supabaseAdmin
      .from("tours")
      .insert(tourRows);
    if (toursErr) throw toursErr;

    // Seed blogs
    const blogRows = blogsData.map((b, i) => ({
      title: b.title,
      image: b.image,
      tag: b.tag,
      category: b.category,
      date: b.date,
      read_time: b.read_time,
      is_active: true,
      sort_order: i,
    }));

    const { error: blogsErr } = await supabaseAdmin
      .from("blogs")
      .insert(blogRows);
    if (blogsErr) throw blogsErr;

    return NextResponse.json({ message: "Seeded successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Seed failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
