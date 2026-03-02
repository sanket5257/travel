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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          required
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
          placeholder="Tour name"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
        <input
          type="text"
          value={form.slug}
          onChange={(e) => {
            setSlugManual(true);
            update("slug", e.target.value);
          }}
          required
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm font-mono"
          placeholder="auto-generated-slug"
        />
        {slugManual && (
          <button
            type="button"
            onClick={() => {
              setSlugManual(false);
              update("slug", toSlug(form.name));
            }}
            className="text-xs text-blue-600 hover:text-blue-700 mt-1"
          >
            Reset to auto-generated
          </button>
        )}
      </div>

      {/* Trek Images — 4 slots */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Trek Images</h3>
        <p className="text-xs text-gray-500 mb-4">Upload 4 images: 1 for the homepage card, 3 for the booking details page gallery.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
        <input
          type="text"
          value={form.duration}
          onChange={(e) => update("duration", e.target.value)}
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
          placeholder="e.g. 3 Days / 2 Nights"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          rows={5}
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
          placeholder="Tour description..."
        />
      </div>

      {/* Price & Price Display */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => update("price", Number(e.target.value))}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            placeholder="0"
            min={0}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price Display</label>
          <input
            type="text"
            value={form.price_display}
            onChange={(e) => update("price_display", e.target.value)}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            placeholder="e.g. 1,666 Rs/-"
          />
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="text"
          value={form.date}
          onChange={(e) => update("date", e.target.value)}
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
          placeholder="e.g. 15th - 17th March 2026"
        />
      </div>

      {/* Trip Info */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Trip Info</h3>
        <p className="text-xs text-gray-500 mb-3">These values appear in the Trip Info grid on the booking page. Leave blank to use defaults.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tripInfoFields.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
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
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Inclusions */}
      <InclusionsEditor value={form.inclusions} onChange={(items) => update("inclusions", items)} />

      {/* Itinerary Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Itinerary Title</label>
        <input
          type="text"
          value={form.itinerary_title}
          onChange={(e) => update("itinerary_title", e.target.value)}
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
          placeholder="e.g. Your Adventure Awaits"
        />
      </div>

      {/* Itinerary Days */}
      <ItineraryEditor value={form.itinerary_days} onChange={(days) => update("itinerary_days", days)} />

      {/* Itinerary Sections */}
      <ItineraryEditor
        value={form.itinerary_sections}
        onChange={(sections) => update("itinerary_sections", sections)}
        label="Extra Sections"
      />

      {/* QR Image */}
      <ImageUploader value={form.qr_image} onChange={(url) => update("qr_image", url)} label="QR Code Image" />

      {/* Is Active & Sort Order */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_active"
            checked={form.is_active}
            onChange={(e) => update("is_active", e.target.checked)}
            className="w-4 h-4 rounded border-gray-300"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
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
          {submitting ? "Saving..." : initialData ? "Update Tour" : "Create Tour"}
        </button>
      </div>
    </form>
  );
}
