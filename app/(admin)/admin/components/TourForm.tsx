"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import ImageUploader from "./ImageUploader";
import ItineraryEditor from "./ItineraryEditor";
import InclusionsEditor from "./InclusionsEditor";

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

interface ItineraryDay {
  title: string;
  items: string[];
}

interface TourData {
  name: string;
  slug: string;
  image: string;
  gallery: string[];
  duration: string;
  description: string;
  price: number;
  price_display: string;
  date: string;
  inclusions: string[];
  itinerary_title: string;
  itinerary_days: ItineraryDay[];
  itinerary_sections: ItineraryDay[];
  qr_image: string;
  trip_info: Record<string, string>;
  is_active: boolean;
  sort_order: number;
}

interface Props {
  initialData?: Partial<TourData>;
  onSubmit: (data: TourData) => Promise<void>;
}

const tripInfoFields = [
  { key: "departure", label: "Departure", placeholder: "Pune" },
  { key: "arrival", label: "Arrival", placeholder: "Pune" },
  { key: "best_season", label: "Best Season", placeholder: "Oct – Mar" },
  { key: "trek_lead", label: "Trek Lead", placeholder: "Expert Guide" },
  { key: "language", label: "Language", placeholder: "Hindi, English" },
  { key: "meals", label: "Meals", placeholder: "Included" },
  { key: "transport", label: "Transport", placeholder: "Included" },
  { key: "difficulty", label: "Difficulty", placeholder: "Moderate" },
  { key: "walking", label: "Walking", placeholder: "5–8 Hours" },
  { key: "group_size", label: "Group Size", placeholder: "Max 25" },
];

const defaultData: TourData = {
  name: "",
  slug: "",
  image: "",
  gallery: [],
  duration: "",
  description: "",
  price: 0,
  price_display: "",
  date: "",
  inclusions: [],
  itinerary_title: "",
  itinerary_days: [],
  itinerary_sections: [],
  qr_image: "",
  trip_info: {},
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

export default function TourForm({ initialData, onSubmit }: Props) {
  const [form, setForm] = useState<TourData>({ ...defaultData, ...initialData });
  const [submitting, setSubmitting] = useState(false);
  const [slugManual, setSlugManual] = useState(false);

  useEffect(() => {
    if (!slugManual) {
      setForm((prev) => ({ ...prev, slug: toSlug(prev.name) }));
    }
  }, [form.name, slugManual]);

  const update = <K extends keyof TourData>(key: K, value: TourData[K]) => {
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
      <Section title="Basic Information" description="Tour name, slug, duration, and pricing details.">
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-shadow"
                placeholder="Tour name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => {
                  setSlugManual(true);
                  update("slug", e.target.value);
                }}
                required
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm font-mono focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-shadow"
                placeholder="auto-generated-slug"
              />
              {slugManual && (
                <button
                  type="button"
                  onClick={() => {
                    setSlugManual(false);
                    update("slug", toSlug(form.name));
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 mt-1.5 font-medium"
                >
                  Reset to auto-generated
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration</label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => update("duration", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-shadow"
                placeholder="e.g. 3 Days / 2 Nights"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => update("price", Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-shadow"
                placeholder="0"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price Display</label>
              <input
                type="text"
                value={form.price_display}
                onChange={(e) => update("price_display", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-shadow"
                placeholder="e.g. 1,666 Rs/-"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
            <input
              type="text"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-shadow"
              placeholder="e.g. 15th - 17th March 2026"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-shadow resize-none"
              placeholder="Tour description..."
            />
          </div>
        </div>
      </Section>

      {/* Trek Images */}
      <Section title="Trek Images" description="Upload 4 images: 1 for the homepage card, 3 for the booking details page gallery.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ImageUploader
            value={form.image}
            onChange={(url) => update("image", url)}
            label="Homepage Card Image"
          />
          <ImageUploader
            value={form.gallery[0] || ""}
            onChange={(url) => {
              const g = [...form.gallery];
              g[0] = url;
              update("gallery", g);
            }}
            label="Detail Page — Main (large left)"
          />
          <ImageUploader
            value={form.gallery[1] || ""}
            onChange={(url) => {
              const g = [...form.gallery];
              g[1] = url;
              update("gallery", g);
            }}
            label="Detail Page — Top Right"
          />
          <ImageUploader
            value={form.gallery[2] || ""}
            onChange={(url) => {
              const g = [...form.gallery];
              g[2] = url;
              update("gallery", g);
            }}
            label="Detail Page — Bottom Right"
          />
        </div>
      </Section>

      {/* Trip Info */}
      <Section title="Trip Info" description="These values appear in the Trip Info grid on the booking page. Leave blank to use defaults.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tripInfoFields.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
              <input
                type="text"
                value={form.trip_info[key] || ""}
                onChange={(e) => {
                  const updated = { ...form.trip_info };
                  if (e.target.value) {
                    updated[key] = e.target.value;
                  } else {
                    delete updated[key];
                  }
                  update("trip_info", updated);
                }}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-shadow"
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Inclusions */}
      <Section title="Inclusions" description="What's included in this tour package.">
        <InclusionsEditor value={form.inclusions} onChange={(items) => update("inclusions", items)} />
      </Section>

      {/* Itinerary */}
      <Section title="Itinerary" description="Day-by-day breakdown of the tour.">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Itinerary Title</label>
            <input
              type="text"
              value={form.itinerary_title}
              onChange={(e) => update("itinerary_title", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-shadow"
              placeholder="e.g. Your Adventure Awaits"
            />
          </div>
          <ItineraryEditor value={form.itinerary_days} onChange={(days) => update("itinerary_days", days)} />
          <ItineraryEditor
            value={form.itinerary_sections}
            onChange={(sections) => update("itinerary_sections", sections)}
            label="Extra Sections"
          />
        </div>
      </Section>

      {/* QR Code & Settings */}
      <Section title="Payment & Settings" description="QR code for payments, tour visibility, and sort order.">
        <div className="space-y-6">
          <div className="max-w-sm">
            <ImageUploader value={form.qr_image} onChange={(url) => update("qr_image", url)} label="QR Code Image" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <input
                type="checkbox"
                id="is_active"
                checked={form.is_active}
                onChange={(e) => update("is_active", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <div>
                <label htmlFor="is_active" className="text-sm font-medium text-gray-900 cursor-pointer">
                  Active
                </label>
                <p className="text-xs text-gray-500">Tour is visible on the website</p>
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
          {submitting ? "Saving..." : initialData ? "Update Tour" : "Create Tour"}
        </button>
      </div>
    </form>
  );
}
