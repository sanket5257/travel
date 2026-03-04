import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { sendStatusUpdateToCustomer } from "@/lib/email";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();

    // Fetch current status before update (for status change detection)
    let oldStatus: string | null = null;
    if (body.status) {
      const { data: current } = await supabaseAdmin
        .from("bookings")
        .select("status")
        .eq("id", id)
        .single();
      oldStatus = current?.status ?? null;
    }

    const { data, error } = await supabaseAdmin
      .from("bookings")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Send status update email if status changed
    if (oldStatus && body.status && oldStatus !== body.status) {
      sendStatusUpdateToCustomer(data, oldStatus, body.status);
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
