import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, tour_name, tour_id } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("pdf_downloads")
      .insert([{ name, email, phone, tour_name, tour_id }]);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("pdf_downloads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
