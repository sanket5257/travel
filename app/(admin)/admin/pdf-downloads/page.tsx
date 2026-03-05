"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, Download, AlertCircle, FileSpreadsheet } from "lucide-react";

interface PdfDownload {
  id: string;
  name: string;
  email: string;
  phone: string;
  tour_name: string;
  created_at: string;
}

export default function PdfDownloadsPage() {
  const [downloads, setDownloads] = useState<PdfDownload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const exportToExcel = useCallback(() => {
    if (downloads.length === 0) return;
    const headers = ["Name", "Email", "Phone", "Tour", "Date"];
    const rows = downloads.map((d) => [
      d.name,
      d.email,
      d.phone,
      d.tour_name,
      new Date(d.created_at).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      }),
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pdf-downloads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [downloads]);

  useEffect(() => {
    fetch("/api/pdf-downloads")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then(setDownloads)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">PDF Downloads</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? "Loading..." : `${downloads.length} lead${downloads.length !== 1 ? "s" : ""} captured`}
          </p>
        </div>
        {downloads.length > 0 && (
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export Excel
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      ) : downloads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 bg-white rounded-xl border border-gray-200">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
            <Download className="w-7 h-7 text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900 mb-1">No downloads yet</p>
            <p className="text-sm text-gray-500">Leads will appear here when users download trek PDFs.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tour</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {downloads.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{d.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{d.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{d.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{d.tour_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(d.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
