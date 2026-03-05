import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "true";

  let query = supabaseAdmin
    .from("tours")
    .select("*")
    .order("sort_order", { ascending: true });

  if (!all) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

const TOUR_COLUMNS = new Set([
  "name", "slug", "image", "gallery", "duration", "description",
  "price", "price_display", "date", "inclusions", "exclusions", "itinerary_title",
  "itinerary_days", "itinerary_sections", "qr_image", "trip_info",
  "safety_measures", "cancellation_policy", "faq", "trekking_stories",
  "hero_image", "pdf_url", "is_active", "sort_order",
]);

export async function POST(request: Request) {
  try {
    const raw = await request.json();
    const body: Record<string, unknown> = {};
    for (const key of Object.keys(raw)) {
      if (TOUR_COLUMNS.has(key)) body[key] = raw[key];
    }
    const { data, error } = await supabaseAdmin
      .from("tours")
      .insert([body])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create tour" }, { status: 500 });
  }
}
