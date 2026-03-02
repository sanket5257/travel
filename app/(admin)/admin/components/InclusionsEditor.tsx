"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

interface Props {
  value: string[];
  onChange: (items: string[]) => void;
}

export default function InclusionsEditor({ value, onChange }: Props) {
  const [input, setInput] = useState("");

  const addItem = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInput("");
    }
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Inclusions</label>
      <div className="flex flex-wrap gap-2 mb-3">
        {value.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-full">
            {item}
            <button type="button" onClick={() => removeItem(i)} className="text-gray-400 hover:text-red-500">
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem(); } }}
          placeholder="Type and press Enter to add"
          className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm"
        />
        <button type="button" onClick={addItem} className="flex items-center gap-1 px-3 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
