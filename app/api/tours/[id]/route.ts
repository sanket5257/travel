import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from("tours")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

const TOUR_COLUMNS = new Set([
  "name", "slug", "image", "gallery", "duration", "description",
  "price", "price_display", "date", "inclusions", "exclusions", "itinerary_title",
  "itinerary_days", "itinerary_sections", "qr_image", "trip_info",
  "safety_measures", "cancellation_policy", "faq", "trekking_stories",
  "hero_image", "pdf_url", "is_active", "sort_order",
]);

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const raw = await request.json();
    const body: Record<string, unknown> = {};
    for (const key of Object.keys(raw)) {
      if (TOUR_COLUMNS.has(key)) body[key] = raw[key];
    }
    let { data, error } = await supabaseAdmin
      .from("tours")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    // If pdf_url column doesn't exist in schema cache, retry without it
    if (error && error.message.includes("pdf_url")) {
      delete body.pdf_url;
      ({ data, error } = await supabaseAdmin
        .from("tours")
        .update(body)
        .eq("id", id)
        .select()
        .single());
    }

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to update tour" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { error } = await supabaseAdmin
    .from("tours")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
