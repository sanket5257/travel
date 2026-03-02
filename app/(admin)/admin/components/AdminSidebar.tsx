"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, FileText, CalendarCheck, LogOut, Mountain } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const links = [
  { href: "/admin/tours", label: "Tours", icon: Map },
  { href: "/admin/blogs", label: "Blogs", icon: FileText },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            <Mountain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight">Admin Panel</h1>
            <p className="text-[11px] text-gray-400">To The Moon Wayfarer</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 mt-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                active
                  ? "bg-white/15 text-white font-medium shadow-sm"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className={`w-[18px] h-[18px] ${active ? "text-white" : ""}`} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all w-full"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Logout
        </button>
      </div>
    </aside>
  );
}
