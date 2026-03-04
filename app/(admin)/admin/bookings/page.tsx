"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Loader2, CalendarCheck, AlertCircle, Search, Download, X, ChevronDown } from "lucide-react";
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
  transaction_id?: string | null;
  address?: string | null;
  emergency_contact?: string | null;
}

const statusFilters = ["all", "pending", "confirmed", "cancelled"] as const;

/* ── Excel export (pure CSV with .xlsx-friendly BOM) ── */
function downloadExcel(bookings: Booking[], filename: string) {
  const headers = [
    "Full Name", "Email", "Phone", "Tour", "Travelers",
    "Amount (₹)", "Status", "Transaction ID", "Address",
    "Emergency Contact", "Booking Date",
  ];

  const escape = (v: string) => {
    if (v.includes(",") || v.includes('"') || v.includes("\n")) {
      return `"${v.replace(/"/g, '""')}"`;
    }
    return v;
  };

  const rows = bookings.map((b) => [
    escape(b.full_name),
    escape(b.email),
    escape(b.phone),
    escape(b.tour_name),
    String(b.num_travelers),
    String(b.total_amount),
    b.status,
    escape(b.transaction_id || ""),
    escape(b.address || ""),
    escape(b.emergency_contact || ""),
    new Date(b.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
  ]);

  const csv = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [tourFilter, setTourFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings?status=all");
      if (!res.ok) throw new Error("Failed to load bookings");
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  // Unique tour names for dropdown
  const tourNames = useMemo(() => {
    const names = [...new Set(bookings.map((b) => b.tour_name))].sort();
    return names;
  }, [bookings]);

  // Client-side filtering
  const filtered = useMemo(() => {
    let result = bookings;

    if (statusFilter !== "all") {
      result = result.filter((b) => b.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.full_name.toLowerCase().includes(q) ||
          b.email.toLowerCase().includes(q) ||
          b.phone.includes(q) ||
          (b.transaction_id && b.transaction_id.toLowerCase().includes(q))
      );
    }

    if (tourFilter !== "all") {
      result = result.filter((b) => b.tour_name === tourFilter);
    }

    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      result = result.filter((b) => new Date(b.created_at) >= from);
    }

    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      result = result.filter((b) => new Date(b.created_at) <= to);
    }

    return result;
  }, [bookings, statusFilter, search, tourFilter, dateFrom, dateTo]);

  const hasActiveFilters = search || tourFilter !== "all" || dateFrom || dateTo;

  const clearFilters = () => {
    setSearch("");
    setTourFilter("all");
    setDateFrom("");
    setDateTo("");
    setStatusFilter("all");
  };

  // Stats
  const stats = useMemo(() => {
    const total = filtered.reduce((s, b) => s + b.total_amount, 0);
    const travelers = filtered.reduce((s, b) => s + b.num_travelers, 0);
    const pending = filtered.filter((b) => b.status === "pending").length;
    const confirmed = filtered.filter((b) => b.status === "confirmed").length;
    return { total, travelers, pending, confirmed };
  }, [filtered]);

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-shadow bg-white";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? "Loading..." : `${filtered.length} of ${bookings.length} booking${bookings.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={() => downloadExcel(filtered, `bookings-${new Date().toISOString().slice(0, 10)}.csv`)}
          disabled={loading || filtered.length === 0}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-40 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          Export Excel
        </button>
      </div>

      {/* Stats Cards */}
      {!loading && bookings.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-3.5">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Revenue</p>
            <p className="text-lg font-bold text-gray-900">&#8377;{stats.total.toLocaleString("en-IN")}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-3.5">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Travelers</p>
            <p className="text-lg font-bold text-gray-900">{stats.travelers}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-3.5">
            <p className="text-[11px] font-semibold text-yellow-600 uppercase tracking-wider mb-1">Pending</p>
            <p className="text-lg font-bold text-gray-900">{stats.pending}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-3.5">
            <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider mb-1">Confirmed</p>
            <p className="text-lg font-bold text-gray-900">{stats.confirmed}</p>
          </div>
        </div>
      )}

      {/* Status Tabs */}
      <div className="flex gap-2 mb-4">
        {statusFilters.map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === f
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone, txn ID..."
              className={`${inputClass} pl-9`}
            />
          </div>

          {/* Tour Filter */}
          <div className="relative">
            <select
              value={tourFilter}
              onChange={(e) => setTourFilter(e.target.value)}
              className={`${inputClass} appearance-none pr-9`}
            >
              <option value="all">All Tours</option>
              {tourNames.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Date From */}
          <div>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className={inputClass}
              title="From date"
            />
          </div>

          {/* Date To */}
          <div className="flex gap-2">
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className={inputClass}
              title="To date"
            />
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-900 hover:border-gray-400 transition"
                title="Clear all filters"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-400">Loading bookings...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-sm text-gray-500">{error}</p>
          <button onClick={fetchBookings} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Try again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 bg-white rounded-xl border border-gray-200">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
            <CalendarCheck className="w-7 h-7 text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900 mb-1">No bookings found</p>
            <p className="text-sm text-gray-500">
              {hasActiveFilters ? "Try adjusting your filters." : "Bookings will appear here when customers submit them."}
            </p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2">
                Clear filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tour</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Travelers</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 text-sm">{b.full_name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{b.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-[180px] truncate">{b.tour_name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-sm font-medium text-gray-700">{b.num_travelers}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">&#8377;{b.total_amount.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4"><StatusBadge status={b.status} /></td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{new Date(b.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
