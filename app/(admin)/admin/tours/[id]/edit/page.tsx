"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import TourForm from "../../../components/TourForm";

export default function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [tour, setTour] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/tours/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Tour not found");
        return r.json();
      })
      .then((data) => { setTour(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [id]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    const res = await fetch(`/api/tours/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      router.push("/admin/tours");
    } else {
      const err = await res.json();
      throw new Error(err.error || "Failed to update tour");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        <p className="text-sm text-gray-400">Loading tour...</p>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900 mb-1">Tour not found</p>
          <p className="text-sm text-gray-500">{error || "The tour you're looking for doesn't exist."}</p>
        </div>
        <Link href="/admin/tours" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Back to Tours
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/admin/tours" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Tours
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Tour</h1>
        <p className="text-sm text-gray-500 mt-1">Update tour details, images, itinerary, and more.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
        <TourForm initialData={tour ?? undefined} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
