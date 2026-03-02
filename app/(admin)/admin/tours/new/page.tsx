"use client";

import { useRouter } from "next/navigation";
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
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Create Tour</h1>
      <TourForm onSubmit={handleSubmit} />
    </div>
  );
}
