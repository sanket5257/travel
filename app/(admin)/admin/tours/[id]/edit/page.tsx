"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import TourForm from "../../../components/TourForm";

export default function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [tour, setTour] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/tours/${id}`)
      .then((r) => r.json())
      .then((data) => { setTour(data); setLoading(false); });
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

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Tour</h1>
      <TourForm initialData={tour ?? undefined} onSubmit={handleSubmit} />
    </div>
  );
}
