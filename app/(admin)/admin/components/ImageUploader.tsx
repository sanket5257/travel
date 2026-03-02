"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploader({ value, onChange, label = "Image" }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) onChange(data.url);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {value ? (
        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 group bg-gray-50">
          <Image src={value} alt={label} fill className="object-cover" sizes="400px" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-48 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2.5 hover:border-gray-400 hover:bg-gray-50/50 transition-all disabled:opacity-50 group"
        >
          {uploading ? (
            <Loader2 className="w-7 h-7 text-gray-400 animate-spin" />
          ) : (
            <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
              <Upload className="w-5 h-5 text-gray-500" />
            </div>
          )}
          <div className="text-center">
            <span className="text-sm font-medium text-gray-600">{uploading ? "Uploading..." : "Click to upload"}</span>
            <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP</p>
          </div>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      {!value && (
        <div className="mt-2.5 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="url"
            placeholder="Or paste image URL and press Enter"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-shadow"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onChange(e.currentTarget.value);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
