"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface Blog {
  id: string;
  title: string;
  image: string;
  tag: string;
  category: string;
  date: string;
  is_active: boolean;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    const res = await fetch("/api/blogs");
    const data = await res.json();
    setBlogs(data);
    setLoading(false);
  };

  useEffect(() => { fetchBlogs(); }, []);

  const deleteBlog = async (id: string) => {
    if (!confirm("Delete this blog?")) return;
    await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    fetchBlogs();
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blogs</h1>
          <p className="text-sm text-gray-500 mt-1">{blogs.length} posts</p>
        </div>
        <Link href="/admin/blogs/new" className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition">
          <Plus className="w-4 h-4" /> Add Blog
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Post</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Tag</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {blogs.map((blog) => (
              <tr key={blog.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      {blog.image && <Image src={blog.image} alt={blog.title} fill className="object-cover" sizes="48px" />}
                    </div>
                    <p className="font-medium text-gray-900 text-sm line-clamp-1">{blog.title}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{blog.category}</td>
                <td className="px-6 py-4"><span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">{blog.tag}</span></td>
                <td className="px-6 py-4 text-sm text-gray-600">{blog.date}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${blog.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                    {blog.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/blogs/${blog.id}/edit`} className="p-2 text-gray-400 hover:text-gray-600 transition">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => deleteBlog(blog.id)} className="p-2 text-gray-400 hover:text-red-600 transition">
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
