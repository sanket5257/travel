"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TourForm from "../../components/TourForm";

export default function NewTourPage() {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    const res = await fetch("/api/tours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      router.push("/admin/tours");
    } else {
      const err = await res.json();
      throw new Error(err.error || "Failed to create tour");
    }
  };

  return (
    <div>
      <Link href="/admin/tours" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Tours
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create Tour</h1>
        <p className="text-sm text-gray-500 mt-1">Add a new trek with images, itinerary, pricing, and trip details.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
        <TourForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
