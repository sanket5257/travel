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

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>
      {children}
    </div>
  );
}

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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <Section title="Basic Information" description="Blog post title, category, and metadata.">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              required
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-shadow"
              placeholder="Blog title"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-shadow"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tag</label>
              <input
                type="text"
                value={form.tag}
                onChange={(e) => update("tag", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-shadow"
                placeholder="e.g. Adventure, Nature"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
              <input
                type="text"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-shadow"
                placeholder="e.g. March 2, 2026"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Read Time</label>
              <input
                type="text"
                value={form.read_time}
                onChange={(e) => update("read_time", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-shadow"
                placeholder="e.g. 5 min read"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Cover Image */}
      <Section title="Cover Image" description="The main image displayed on the blog card.">
        <div className="max-w-md">
          <ImageUploader value={form.image} onChange={(url) => update("image", url)} label="Cover Image" />
        </div>
      </Section>

      {/* Settings */}
      <Section title="Settings" description="Visibility and ordering options.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <input
              type="checkbox"
              id="blog_is_active"
              checked={form.is_active}
              onChange={(e) => update("is_active", e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
            />
            <div>
              <label htmlFor="blog_is_active" className="text-sm font-medium text-gray-900 cursor-pointer">
                Active
              </label>
              <p className="text-xs text-gray-500">Post is visible on the website</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Sort Order</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => update("sort_order", Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-shadow"
              min={0}
            />
            <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
          </div>
        </div>
      </Section>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {submitting ? "Saving..." : initialData ? "Update Blog" : "Create Blog"}
        </button>
      </div>
    </form>
  );
}
