export const leaders = [
  {
    name: "Sanket Patil",
    role: "Founder & Trek Lead",
    image: "/images/team/sanket.jpg",
    description:
      "Passionate trekker and outdoor enthusiast with years of experience leading groups across the Sahyadris and Himalayas.",
    whatsapp: "https://wa.me/919999999999",
    email: "mailto:sanket@tothemoonwayfarer.com",
  },
  {
    name: "Rahul Sharma",
    role: "Senior Trek Leader",
    image: "/images/team/rahul.jpg",
    description:
      "Certified mountain guide with expertise in high-altitude treks, safety protocols, and wilderness first aid.",
    whatsapp: "https://wa.me/919999999998",
    email: "mailto:rahul@tothemoonwayfarer.com",
  },
  {
    name: "Priya Deshmukh",
    role: "Trip Coordinator",
    image: "/images/team/priya.jpg",
    description:
      "Handles all logistics, itinerary planning, and ensures every trip runs smoothly from start to finish.",
    whatsapp: "https://wa.me/919999999997",
    email: "mailto:priya@tothemoonwayfarer.com",
  },
];

export type Leader = (typeof leaders)[number];
