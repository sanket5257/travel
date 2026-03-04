import type { Metadata } from "next";
import { leaders } from "@/lib/leaders";
import { LeaderCard } from "@/components/Experts";

export const metadata: Metadata = {
  title: "Our Trekking Leaders — To The Moon Wayfarer",
  description:
    "Meet the experienced trek leaders and coordinators who make every adventure safe, memorable, and fun.",
};

export default function LeadersPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="relative bg-gray-900 py-20 sm:py-28 px-5 text-center">
        <h1 className="font-serif text-white text-[2rem] sm:text-[2.75rem] xl:text-[3.25rem] leading-[1.12] mb-3">
          Our Trekking Leaders
        </h1>
        <p className="text-white/60 text-[14px] sm:text-[15px] max-w-[520px] mx-auto leading-[1.75]">
          The passionate team behind every trek. Experienced guides, safety
          experts, and coordinators dedicated to making your adventure
          unforgettable.
        </p>
      </div>

      {/* Leaders Grid */}
      <div className="px-5 sm:px-8 lg:px-12 max-w-[1200px] xl:max-w-[1400px] mx-auto py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {leaders.map((leader) => (
            <LeaderCard key={leader.name} leader={leader} />
          ))}
        </div>
      </div>
    </main>
  );
}
