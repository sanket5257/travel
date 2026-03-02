"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Loader2 } from "lucide-react";
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

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/bookings/${id}`)
      .then((r) => r.json())
      .then((data) => { setBooking(data); setLoading(false); });
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

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  if (!booking) return <div className="text-center py-20 text-gray-500">Booking not found</div>;

  return (
    <div>
      <button onClick={() => router.push("/admin/bookings")} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Bookings
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">Booking Details</h1>
          <StatusBadge status={booking.status} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-xs text-gray-400 mb-1">Full Name</p>
            <p className="text-sm font-medium text-gray-900">{booking.full_name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Email</p>
            <p className="text-sm text-gray-900">{booking.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Phone</p>
            <p className="text-sm text-gray-900">{booking.phone}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Emergency Contact</p>
            <p className="text-sm text-gray-900">{booking.emergency_contact || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Tour</p>
            <p className="text-sm font-medium text-gray-900">{booking.tour_name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Travelers</p>
            <p className="text-sm text-gray-900">{booking.num_travelers}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Total Amount</p>
            <p className="text-sm font-bold text-gray-900">₹{booking.total_amount.toLocaleString("en-IN")}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Address</p>
            <p className="text-sm text-gray-900">{booking.address || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Transaction ID</p>
            <p className="text-sm text-gray-900">{booking.transaction_id || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Submitted</p>
            <p className="text-sm text-gray-900">{new Date(booking.created_at).toLocaleString()}</p>
          </div>
        </div>

        {booking.payment_screenshot_url && (
          <div className="mb-8">
            <p className="text-xs text-gray-400 mb-2">Payment Screenshot</p>
            <div className="relative w-full max-w-md h-64 rounded-lg overflow-hidden border border-gray-200">
              <Image src={booking.payment_screenshot_url} alt="Payment" fill className="object-contain" sizes="400px" />
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 pt-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Update Status</p>
          <div className="flex gap-3">
            {(["pending", "confirmed", "cancelled"] as const).map((s) => (
              <button
                key={s}
                onClick={() => updateStatus(s)}
                disabled={updating || booking.status === s}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 ${
                  booking.status === s
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
