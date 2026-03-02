"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2, AlertCircle, User, MapPin, Phone, Mail, Users, CreditCard, FileText, Calendar, Hash } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";

interface Booking {
  id: string;
  tour_id: string | null;
  tour_name: string;
  full_name: string;
  email: string;
  phone: string;
  emergency_contact: string | null;
  num_travelers: number;
  address: string | null;
  total_amount: number;
  payment_screenshot_url: string | null;
  transaction_id: string | null;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
}

const infoItem = (icon: React.ReactNode, label: string, value: string | number | null) => (
  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
    <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-900 break-words">{value || "—"}</p>
    </div>
  </div>
);

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/bookings/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Booking not found");
        return r.json();
      })
      .then((data) => { setBooking(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [id]);

  const updateStatus = async (status: string) => {
    setUpdating(true);
    await fetch(`/api/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBooking((prev) => prev ? { ...prev, status: status as Booking["status"] } : null);
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        <p className="text-sm text-gray-400">Loading booking...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900 mb-1">Booking not found</p>
          <p className="text-sm text-gray-500">{error || "The booking you're looking for doesn't exist."}</p>
        </div>
        <Link href="/admin/bookings" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Back to Bookings
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/admin/bookings" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Bookings
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{booking.full_name}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Booked on {new Date(booking.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <StatusBadge status={booking.status} />
        </div>
      </div>

      {/* Info Grid */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Booking Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {infoItem(<User className="w-4 h-4 text-gray-500" />, "Full Name", booking.full_name)}
          {infoItem(<Mail className="w-4 h-4 text-gray-500" />, "Email", booking.email)}
          {infoItem(<Phone className="w-4 h-4 text-gray-500" />, "Phone", booking.phone)}
          {infoItem(<Phone className="w-4 h-4 text-gray-500" />, "Emergency Contact", booking.emergency_contact)}
          {infoItem(<MapPin className="w-4 h-4 text-gray-500" />, "Tour", booking.tour_name)}
          {infoItem(<Users className="w-4 h-4 text-gray-500" />, "Travelers", booking.num_travelers)}
          {infoItem(<CreditCard className="w-4 h-4 text-gray-500" />, "Total Amount", `₹${booking.total_amount.toLocaleString("en-IN")}`)}
          {infoItem(<FileText className="w-4 h-4 text-gray-500" />, "Address", booking.address)}
          {infoItem(<Hash className="w-4 h-4 text-gray-500" />, "Transaction ID", booking.transaction_id)}
          {infoItem(<Calendar className="w-4 h-4 text-gray-500" />, "Submitted", new Date(booking.created_at).toLocaleString("en-IN"))}
        </div>
      </div>

      {/* Payment Screenshot */}
      {booking.payment_screenshot_url && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Payment Screenshot</h2>
          <div className="relative w-full max-w-md h-72 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            <Image src={booking.payment_screenshot_url} alt="Payment" fill className="object-contain" sizes="400px" />
          </div>
        </div>
      )}

      {/* Status Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Update Status</h2>
        <div className="flex flex-wrap gap-3">
          {(["pending", "confirmed", "cancelled"] as const).map((s) => {
            const isActive = booking.status === s;
            const colorMap = {
              pending: isActive ? "bg-yellow-500 text-white ring-yellow-500/30" : "bg-white text-yellow-700 border border-yellow-200 hover:bg-yellow-50",
              confirmed: isActive ? "bg-green-600 text-white ring-green-600/30" : "bg-white text-green-700 border border-green-200 hover:bg-green-50",
              cancelled: isActive ? "bg-red-500 text-white ring-red-500/30" : "bg-white text-red-700 border border-red-200 hover:bg-red-50",
            };
            return (
              <button
                key={s}
                onClick={() => updateStatus(s)}
                disabled={updating || isActive}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-60 ${colorMap[s]} ${isActive ? "ring-2" : ""}`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            );
          })}
        </div>
        {updating && <p className="text-xs text-gray-400 mt-3">Updating status...</p>}
      </div>
    </div>
  );
}
