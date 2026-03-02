"use client";

import { useRouter } from "next/navigation";
import BlogForm from "../../components/BlogForm";

export default function NewBlogPage() {
  const router = useRouter();

  const handleSubmit = async (data: { title: string; image: string; tag: string; category: string; date: string; read_time: string; is_active: boolean; sort_order: number }) => {
    const res = await fetch("/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      router.push("/admin/blogs");
    } else {
      const err = await res.json();
      throw new Error(err.error || "Failed to create blog");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Create Blog Post</h1>
      <BlogForm onSubmit={handleSubmit} />
    </div>
  );
}
