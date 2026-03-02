"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

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

  const fetchTours = async () => {
    const res = await fetch("/api/tours");
    const data = await res.json();
    setTours(data);
    setLoading(false);
  };

  useEffect(() => { fetchTours(); }, []);

  const deleteTour = async (id: string) => {
    if (!confirm("Delete this tour?")) return;
    await fetch(`/api/tours/${id}`, { method: "DELETE" });
    fetchTours();
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tours</h1>
          <p className="text-sm text-gray-500 mt-1">{tours.length} tours</p>
        </div>
        <Link href="/admin/tours/new" className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition">
          <Plus className="w-4 h-4" /> Add Tour
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Tour</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Duration</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tours.map((tour) => (
              <tr key={tour.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      {tour.image && <Image src={tour.image} alt={tour.name} fill className="object-cover" sizes="48px" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{tour.name}</p>
                      <p className="text-xs text-gray-400">{tour.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{tour.duration}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{tour.price_display}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${tour.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                    {tour.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/tours/${tour.id}/edit`} className="p-2 text-gray-400 hover:text-gray-600 transition">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => deleteTour(tour.id)} className="p-2 text-gray-400 hover:text-red-600 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
