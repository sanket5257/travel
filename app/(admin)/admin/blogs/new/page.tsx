"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
      <Link href="/admin/blogs" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Blogs
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create Blog Post</h1>
        <p className="text-sm text-gray-500 mt-1">Add a new blog post with a cover image and details.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
        <BlogForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
