"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import BlogForm from "../../../components/BlogForm";

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [blog, setBlog] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/blogs/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Blog not found");
        return r.json();
      })
      .then((data) => { setBlog(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [id]);

  const handleSubmit = async (data: { title: string; image: string; tag: string; category: string; date: string; read_time: string; is_active: boolean; sort_order: number }) => {
    const res = await fetch(`/api/blogs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      router.push("/admin/blogs");
    } else {
      const err = await res.json();
      throw new Error(err.error || "Failed to update blog");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        <p className="text-sm text-gray-400">Loading blog post...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900 mb-1">Blog post not found</p>
          <p className="text-sm text-gray-500">{error || "The blog post you're looking for doesn't exist."}</p>
        </div>
        <Link href="/admin/blogs" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/admin/blogs" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Blogs
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Blog Post</h1>
        <p className="text-sm text-gray-500 mt-1">Update blog post details and cover image.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
        <BlogForm initialData={blog ?? undefined} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
