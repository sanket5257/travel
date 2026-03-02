"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Loader2, Map, AlertCircle } from "lucide-react";

interface Tour {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  price_display: string;
  duration: string;
  is_active: boolean;
  sort_order: number;
}

export default function AdminToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchTours = async () => {
    try {
      const res = await fetch("/api/tours");
      if (!res.ok) throw new Error("Failed to load tours");
      const data = await res.json();
      setTours(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTours(); }, []);

  const deleteTour = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This action cannot be undone.`)) return;
    setDeleting(id);
    await fetch(`/api/tours/${id}`, { method: "DELETE" });
    setDeleting(null);
    fetchTours();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tours</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? "Loading..." : `${tours.length} tour${tours.length !== 1 ? "s" : ""} total`}
          </p>
        </div>
        <Link
          href="/admin/tours/new"
          className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Tour
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-400">Loading tours...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-sm text-gray-500">{error}</p>
          <button onClick={() => { setError(""); setLoading(true); fetchTours(); }} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Try again
          </button>
        </div>
      ) : tours.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 bg-white rounded-xl border border-gray-200">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
            <Map className="w-7 h-7 text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900 mb-1">No tours yet</p>
            <p className="text-sm text-gray-500">Get started by creating your first tour.</p>
          </div>
          <Link
            href="/admin/tours/new"
            className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Tour
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tour</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tours.map((tour) => (
                <tr key={tour.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                        {tour.image && <Image src={tour.image} alt={tour.name} fill className="object-cover" sizes="48px" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{tour.name}</p>
                        <p className="text-xs text-gray-400 font-mono">{tour.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{tour.duration}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{tour.price_display}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${tour.is_active ? "bg-green-50 text-green-700 ring-1 ring-green-600/20" : "bg-gray-100 text-gray-600 ring-1 ring-gray-500/10"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${tour.is_active ? "bg-green-500" : "bg-gray-400"}`} />
                      {tour.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/tours/${tour.id}/edit`}
                        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit tour"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => deleteTour(tour.id, tour.name)}
                        disabled={deleting === tour.id}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete tour"
                      >
                        {deleting === tour.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
