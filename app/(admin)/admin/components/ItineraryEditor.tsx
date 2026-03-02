"use client";

import { Plus, Trash2 } from "lucide-react";

interface ItineraryDay {
  title: string;
  items: string[];
}

interface Props {
  value: ItineraryDay[];
  onChange: (days: ItineraryDay[]) => void;
  label?: string;
}

export default function ItineraryEditor({ value, onChange, label = "Itinerary Days" }: Props) {
  const addDay = () => {
    onChange([...value, { title: "", items: [""] }]);
  };

  const removeDay = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateDayTitle = (index: number, title: string) => {
    const updated = [...value];
    updated[index] = { ...updated[index], title };
    onChange(updated);
  };

  const addItem = (dayIndex: number) => {
    const updated = [...value];
    updated[dayIndex] = { ...updated[dayIndex], items: [...updated[dayIndex].items, ""] };
    onChange(updated);
  };

  const removeItem = (dayIndex: number, itemIndex: number) => {
    const updated = [...value];
    updated[dayIndex] = {
      ...updated[dayIndex],
      items: updated[dayIndex].items.filter((_, i) => i !== itemIndex),
    };
    onChange(updated);
  };

  const updateItem = (dayIndex: number, itemIndex: number, text: string) => {
    const updated = [...value];
    const items = [...updated[dayIndex].items];
    items[itemIndex] = text;
    updated[dayIndex] = { ...updated[dayIndex], items };
    onChange(updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <button type="button" onClick={addDay} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
          <Plus className="w-4 h-4" /> Add Day
        </button>
      </div>
      <div className="space-y-4">
        {value.map((day, di) => (
          <div key={di} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={day.title}
                onChange={(e) => updateDayTitle(di, e.target.value)}
                placeholder="Day title (e.g. Day 1 – Pune to Base)"
                className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm"
              />
              <button type="button" onClick={() => removeDay(di)} className="text-red-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 ml-4">
              {day.items.map((item, ii) => (
                <div key={ii} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-300 shrink-0" />
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateItem(di, ii, e.target.value)}
                    placeholder="Timeline item"
                    className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm"
                  />
                  <button type="button" onClick={() => removeItem(di, ii)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addItem(di)} className="text-xs text-blue-600 hover:text-blue-700 ml-4">
                + Add item
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
