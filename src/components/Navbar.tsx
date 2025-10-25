"use client";

import { useRouter } from "next/navigation";
import { useSupabase } from "@/lib/supabaseProvider";
import { ROLE_LABEL } from "@/lib/roles";

export default function Navbar() {
  const { supabase, session, role } = useSupabase();
  const router = useRouter();
  const planLabel = role ? ROLE_LABEL[role] : "Plan";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/auth/sign-in");
  };

  return (
    <header className="w-full h-16 bg-white shadow flex items-center justify-between px-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-800">Bienvenue</h1>
        <p className="text-xs text-gray-500">Plan {planLabel}</p>
      </div>
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

