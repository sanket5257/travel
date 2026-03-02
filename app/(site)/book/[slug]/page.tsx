import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import BookingPageContent from "@/components/BookingPageContent";
import type { Tour } from "@/lib/tours";
import type { DbTour } from "@/lib/supabase/types";

function dbTourToTour(t: DbTour): Tour {
  return {
    id: t.id,
    name: t.name,
    slug: t.slug,
    image: t.image,
    gallery: t.gallery || [],
    duration: t.duration,
    description: t.description,
    price: t.price_display,
    date: t.date || undefined,
    inclusions: t.inclusions || undefined,
    itineraryTitle: t.itinerary_title || undefined,
    itineraryDays: t.itinerary_days || undefined,
    itinerarySections: t.itinerary_sections || undefined,
    qrImage: t.qr_image || undefined,
    tripInfo: t.trip_info || undefined,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: tour } = await supabaseAdmin
    .from("tours")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!tour) return {};
  return {
    title: `Book ${tour.name} — To The Moon Wayfarer`,
    description: tour.description,
  };
}

export default async function BookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: dbTour } = await supabaseAdmin
    .from("tours")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!dbTour) notFound();

  const tour = dbTourToTour(dbTour as DbTour);

  return (
    <main className="min-h-screen bg-white">
      <BookingPageContent tour={tour} />
    </main>
  );
}
