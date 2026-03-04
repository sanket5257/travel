import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST() {
  try {
    // Try to select the new columns - if they exist, migration already done
    const { error: checkError } = await supabaseAdmin
      .from("tours")
      .select("safety_measures,cancellation_policy")
      .limit(1);

    if (!checkError) {
      return NextResponse.json({ message: "Columns already exist" });
    }

    // Columns don't exist - add them via raw SQL using supabase rpc
    // Since we can't run raw SQL via the REST API, we'll use a workaround:
    // Insert a dummy value to force column creation won't work either.
    // Instead, let's return instructions
    return NextResponse.json({
      message: "Columns do not exist yet. Please run this SQL in Supabase dashboard:",
      sql: "ALTER TABLE tours ADD COLUMN IF NOT EXISTS safety_measures text[] DEFAULT '{}'; ALTER TABLE tours ADD COLUMN IF NOT EXISTS cancellation_policy text[] DEFAULT '{}';"
    }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Migration failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
