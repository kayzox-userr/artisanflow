"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSupabase } from "@/lib/supabaseProvider";
import { ROLE_ACCESS, type FeatureKey } from "@/lib/roles";

const navLinks: Array<{ href: string; label: string; feature: FeatureKey }> = [
  { href: "/dashboard", label: "Dashboard", feature: "dashboard" },
  { href: "/dashboard/clients", label: "Clients", feature: "clients" },
  { href: "/dashboard/stats", label: "Statistiques", feature: "stats" },
  { href: "/dashboard/settings", label: "Paramètres", feature: "settings" },
  { href: "/admin", label: "Admin", feature: "admin" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { role } = useSupabase();
  const allowedFeatures = role ? ROLE_ACCESS[role] : ROLE_ACCESS.BASIC;

  return (
    <aside className="w-64 h-screen bg-gray-900 text-gray-100 flex flex-col shadow-lg">
      <div className="px-6 py-4 border-b border-gray-700 text-2xl font-bold">ArtisansFlow</div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navLinks
          .filter((link) => allowedFeatures.includes(link.feature))
          .map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 rounded-md text-sm font-medium transition ${
                pathname === link.href ? "bg-blue-600 text-white" : "hover:bg-gray-800 text-gray-300"
              }`}
            >
              {link.label}
            </Link>
          ))}
      </nav>
      <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
        © {new Date().getFullYear()} ArtisansFlow
      </div>
    </aside>
  );
}

