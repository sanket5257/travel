import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let query = supabaseAdmin
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from("bookings")
      .insert([{
        tour_id: body.tour_id || null,
        tour_name: body.tour_name,
        full_name: body.full_name,
        email: body.email,
        phone: body.phone,
        emergency_contact: body.emergency_contact || null,
        num_travelers: body.num_travelers,
        address: body.address || null,
        total_amount: body.total_amount,
        payment_screenshot_url: body.payment_screenshot_url || null,
        transaction_id: body.transaction_id || null,
        status: "pending",
      }])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
