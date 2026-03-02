"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import StatusBadge from "../components/StatusBadge";

interface Booking {
  id: string;
  tour_name: string;
  full_name: string;
  email: string;
  phone: string;
  num_travelers: number;
  total_amount: number;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
}

const filters = ["all", "pending", "confirmed", "cancelled"];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchBookings = async () => {
    setLoading(true);
    const res = await fetch(`/api/bookings?status=${filter}`);
    const data = await res.json();
    setBookings(data);
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, [filter]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-sm text-gray-500 mt-1">{bookings.length} bookings</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === f ? "bg-gray-900 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Tour</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Travelers</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 text-sm">{b.full_name}</p>
                    <p className="text-xs text-gray-400">{b.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{b.tour_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{b.num_travelers}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{b.total_amount.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-4"><StatusBadge status={b.status} /></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(b.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/bookings/${b.id}`} className="text-sm text-blue-600 hover:text-blue-700">View</Link>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-sm">No bookings found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
