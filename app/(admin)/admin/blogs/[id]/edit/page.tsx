"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import BlogForm from "../../../components/BlogForm";

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [blog, setBlog] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/blogs/${id}`)
      .then((r) => r.json())
      .then((data) => { setBlog(data); setLoading(false); });
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

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Blog Post</h1>
      <BlogForm initialData={blog ?? undefined} onSubmit={handleSubmit} />
    </div>
  );
}
