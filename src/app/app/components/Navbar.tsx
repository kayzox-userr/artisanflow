"use client";

import { useSupabase } from "@/lib/supabaseProvider";

export default function Navbar() {
  const { supabase, session } = useSupabase();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="w-full h-16 bg-white shadow flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-gray-800">Bienvenue 👋</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {session?.user?.email || "Utilisateur"}
        </span>
        <button
          onClick={handleLogout}
          className="px-3 py-1 text-sm bg-gray-900 text-white rounded hover:bg-gray-800"
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
}
