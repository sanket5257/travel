import { NextResponse } from "next/server";
import { sendContactFormToAdmin } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, phone, trek } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    await sendContactFormToAdmin({ name, email, message, phone, trek });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Contact API]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to send email" },
      { status: 500 }
    );
  }
}
