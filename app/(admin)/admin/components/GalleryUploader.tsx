"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, GripVertical } from "lucide-react";

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
}

export default function GalleryUploader({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) urls.push(data.url);
      }
      onChange([...value, ...urls]);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleDragStart = (index: number) => {
    setDragIdx(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === index) return;
    const newUrls = [...value];
    const [dragged] = newUrls.splice(dragIdx, 1);
    newUrls.splice(index, 0, dragged);
    onChange(newUrls);
    setDragIdx(index);
  };

  const handleDragEnd = () => {
    setDragIdx(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-3">
        {value.map((url, i) => (
          <div
            key={i}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDragEnd={handleDragEnd}
            className={`relative h-32 rounded-lg overflow-hidden border border-gray-200 group cursor-move ${
              dragIdx === i ? "opacity-50" : ""
            }`}
          >
            <Image src={url} alt={`Gallery ${i + 1}`} fill className="object-cover" sizes="200px" />
            <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="w-4 h-4 text-white drop-shadow" />
            </div>
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-gray-400 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          ) : (
            <Upload className="w-5 h-5 text-gray-400" />
          )}
          <span className="text-xs text-gray-500">{uploading ? "Uploading..." : "Add images"}</span>
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
    </div>
  );
}
