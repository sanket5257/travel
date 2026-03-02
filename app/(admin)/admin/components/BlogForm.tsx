"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import ImageUploader from "./ImageUploader";

interface BlogData {
  title: string;
  image: string;
  tag: string;
  category: string;
  date: string;
  read_time: string;
  is_active: boolean;
  sort_order: number;
}

interface Props {
  initialData?: Partial<BlogData>;
  onSubmit: (data: BlogData) => Promise<void>;
}

const categories = ["Destinations", "Travel Stories", "Trek Tips"];

const defaultData: BlogData = {
  title: "",
  image: "",
  tag: "",
  category: "Destinations",
  date: "",
  read_time: "",
  is_active: true,
  sort_order: 0,
};

export default function BlogForm({ initialData, onSubmit }: Props) {
  const [form, setForm] = useState<BlogData>({ ...defaultData, ...initialData });
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof BlogData>(key: K, value: BlogData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          required
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
          placeholder="Blog title"
        />
      </div>

      {/* Image */}
      <ImageUploader value={form.image} onChange={(url) => update("image", url)} label="Cover Image" />

      {/* Tag */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
        <input
          type="text"
          value={form.tag}
          onChange={(e) => update("tag", e.target.value)}
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
          placeholder="e.g. Adventure, Nature"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="text"
          value={form.date}
          onChange={(e) => update("date", e.target.value)}
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
          placeholder="e.g. March 2, 2026"
        />
      </div>

      {/* Read Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Read Time</label>
        <input
          type="text"
          value={form.read_time}
          onChange={(e) => update("read_time", e.target.value)}
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
          placeholder="e.g. 5 min read"
        />
      </div>

      {/* Is Active & Sort Order */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="blog_is_active"
            checked={form.is_active}
            onChange={(e) => update("is_active", e.target.checked)}
            className="w-4 h-4 rounded border-gray-300"
          />
          <label htmlFor="blog_is_active" className="text-sm font-medium text-gray-700">
            Active
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
          <input
            type="number"
            value={form.sort_order}
            onChange={(e) => update("sort_order", Number(e.target.value))}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            min={0}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {submitting ? "Saving..." : initialData ? "Update Blog" : "Create Blog"}
        </button>
      </div>
    </form>
  );
}
