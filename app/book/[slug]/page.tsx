import { notFound } from "next/navigation";
import { getTourBySlug, getAllSlugs } from "@/lib/tours";

import BookingPageContent from "@/components/BookingPageContent";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);
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
  const tour = getTourBySlug(slug);
  if (!tour) notFound();

  return (
    <main className="min-h-screen bg-white">
      
      <BookingPageContent tour={tour} />
    </main>
  );
}
