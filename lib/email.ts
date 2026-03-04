import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import type { DbBooking } from "@/lib/supabase/types";

// ---------------------------------------------------------------------------
// Lazy-initialized transporter (same pattern as supabase/server.ts)
// ---------------------------------------------------------------------------
let _transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!_transporter) {
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (!user || !pass) {
      throw new Error("Missing SMTP env vars (SMTP_USER or SMTP_PASS)");
    }
    _transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }
  return _transporter;
}

// ---------------------------------------------------------------------------
// Shared HTML layout
// ---------------------------------------------------------------------------
function wrapHtml(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
  <!-- Header -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#111827;">
    <tr><td align="center" style="padding:24px;">
      <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">
        To The Moon Wayfarer
      </span>
    </td></tr>
  </table>

  <!-- Body -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;">
    <tr><td align="center" style="padding:32px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:100%;">
        <tr><td style="padding:32px 28px;">
          ${body}
        </td></tr>
      </table>
    </td></tr>
  </table>

  <!-- Footer -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;">
    <tr><td align="center" style="padding:0 16px 32px;">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:100%;">
        <tr><td align="center" style="padding:16px 0;border-top:1px solid #e5e7eb;">
          <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;">To The Moon Wayfarer</p>
          <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;">WhatsApp: +91 98600 10521 &nbsp;|&nbsp; Phone: 8605321035</p>
          <p style="margin:0;font-size:12px;color:#9ca3af;">Email: tothemoonwayfarer@gmail.com</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Helper: format currency
// ---------------------------------------------------------------------------
function formatAmount(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

// ---------------------------------------------------------------------------
// 1. Booking confirmation → Customer
// ---------------------------------------------------------------------------
export function sendBookingConfirmationToCustomer(booking: DbBooking): void {
  const html = wrapHtml(
    "Booking Confirmed — To The Moon Wayfarer",
    `
    <h2 style="margin:0 0 8px;font-size:22px;color:#111827;">Thank you for your booking!</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">
      Hi <strong>${booking.full_name}</strong>, we've received your booking. Here are the details:
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;width:140px;">Trek</td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;">${booking.tour_name}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;">Travelers</td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;">${booking.num_travelers}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;">Amount</td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;">${formatAmount(booking.total_amount)}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;">Status</td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">
          <span style="display:inline-block;padding:3px 10px;border-radius:9999px;font-size:12px;font-weight:600;background:#fef9c3;color:#854d0e;">Pending</span>
        </td>
      </tr>
      ${booking.transaction_id ? `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;">Transaction ID</td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;">${booking.transaction_id}</td>
      </tr>` : ""}
    </table>

    <p style="margin:24px 0 0;font-size:14px;color:#6b7280;">
      Our team will review your booking and confirm it shortly. If you have any questions, feel free to reach out via WhatsApp at <strong>+91 98600 10521</strong>.
    </p>
    `
  );

  getTransporter()
    .sendMail({
      from: `"To The Moon Wayfarer" <${process.env.SMTP_USER}>`,
      to: booking.email,
      subject: `Booking Received — ${booking.tour_name}`,
      html,
    })
    .catch((err) => console.error("[Email] Failed to send booking confirmation to customer:", err));
}

// ---------------------------------------------------------------------------
// 2. New booking notification → Admin
// ---------------------------------------------------------------------------
export function sendNewBookingToAdmin(booking: DbBooking): void {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.error("[Email] ADMIN_EMAIL not set, skipping admin notification");
    return;
  }

  const html = wrapHtml(
    "New Booking Received",
    `
    <h2 style="margin:0 0 8px;font-size:22px;color:#111827;">New Booking Received</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">
      A new booking has been submitted. Details below:
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;width:160px;">Trek</td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;">${booking.tour_name}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;">Full Name</td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;">${booking.full_name}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;">Email</td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">${booking.email}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;">Phone</td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">${booking.phone}</td>
      </tr>
      ${booking.emergency_contact ? `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;">Emergency Contact</td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">${booking.emergency_contact}</td>
      </tr>` : ""}
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;">Travelers</td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;">${booking.num_travelers}</td>
      </tr>
      ${booking.address ? `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;">Address</td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">${booking.address}</td>
      </tr>` : ""}
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;">Total Amount</td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;">${formatAmount(booking.total_amount)}</td>
      </tr>
      ${booking.transaction_id ? `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;">Transaction ID</td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">${booking.transaction_id}</td>
      </tr>` : ""}
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;">Payment Screenshot</td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">${booking.payment_screenshot_url ? "Uploaded" : "Not uploaded"}</td>
      </tr>
    </table>
    `
  );

  getTransporter()
    .sendMail({
      from: `"To The Moon Wayfarer" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `New Booking: ${booking.tour_name} — ${booking.full_name}`,
      html,
    })
    .catch((err) => console.error("[Email] Failed to send new booking notification to admin:", err));
}

// ---------------------------------------------------------------------------
// 3. Contact form → Admin
// ---------------------------------------------------------------------------
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  trek?: string;
  message: string;
}

export function sendContactFormToAdmin(data: ContactFormData): void {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.error("[Email] ADMIN_EMAIL not set, skipping contact form email");
    return;
  }

  const html = wrapHtml(
    "New Contact Form Message",
    `
    <h2 style="margin:0 0 8px;font-size:22px;color:#111827;">New Contact Form Message</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">
      Someone reached out via the website contact form.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;width:140px;">Name</td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;">${data.name}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;">Email</td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">${data.email}</td>
      </tr>
      ${data.phone ? `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;">Phone</td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">${data.phone}</td>
      </tr>` : ""}
      ${data.trek ? `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;">Trek Interest</td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;">${data.trek}</td>
      </tr>` : ""}
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;">Message</td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">${data.message}</td>
      </tr>
    </table>
    `
  );

  getTransporter()
    .sendMail({
      from: `"To The Moon Wayfarer" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      replyTo: data.email,
      subject: `Contact Form: ${data.name}${data.trek ? ` — ${data.trek}` : ""}`,
      html,
    })
    .catch((err) => console.error("[Email] Failed to send contact form email to admin:", err));
}

// ---------------------------------------------------------------------------
// 4. Status update → Customer
// ---------------------------------------------------------------------------
const statusStyles: Record<string, { bg: string; color: string; label: string }> = {
  confirmed: { bg: "#dcfce7", color: "#166534", label: "Confirmed" },
  cancelled: { bg: "#fee2e2", color: "#991b1b", label: "Cancelled" },
  pending: { bg: "#fef9c3", color: "#854d0e", label: "Pending" },
};

export function sendStatusUpdateToCustomer(
  booking: DbBooking,
  oldStatus: string,
  newStatus: string
): void {
  const style = statusStyles[newStatus] || statusStyles.pending;

  const html = wrapHtml(
    "Booking Status Updated — To The Moon Wayfarer",
    `
    <h2 style="margin:0 0 8px;font-size:22px;color:#111827;">Booking Status Updated</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">
      Hi <strong>${booking.full_name}</strong>, your booking status has been updated.
    </p>

    <!-- Status Banner -->
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:16px 20px;border-radius:8px;background:${style.bg};text-align:center;">
        <span style="font-size:16px;font-weight:700;color:${style.color};">${style.label}</span>
      </td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin-top:24px;">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;width:140px;">Trek</td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;">${booking.tour_name}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;">Travelers</td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;">${booking.num_travelers}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;">Amount</td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;">${formatAmount(booking.total_amount)}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;">Previous Status</td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">${oldStatus.charAt(0).toUpperCase() + oldStatus.slice(1)}</td>
      </tr>
    </table>

    ${newStatus === "confirmed" ? `
    <p style="margin:24px 0 0;font-size:14px;color:#166534;font-weight:600;">
      Your spot is confirmed! We'll share the detailed itinerary and WhatsApp group link closer to the trek date.
    </p>` : ""}
    ${newStatus === "cancelled" ? `
    <p style="margin:24px 0 0;font-size:14px;color:#6b7280;">
      If you believe this is a mistake or need help, reach out to us via WhatsApp at <strong>+91 98600 10521</strong>.
    </p>` : ""}
    `
  );

  getTransporter()
    .sendMail({
      from: `"To The Moon Wayfarer" <${process.env.SMTP_USER}>`,
      to: booking.email,
      subject: `Booking ${style.label} — ${booking.tour_name}`,
      html,
    })
    .catch((err) => console.error("[Email] Failed to send status update to customer:", err));
}
