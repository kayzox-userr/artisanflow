"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import AuthGuard from "@/components/AuthGuard";
import { useSupabase } from "@/lib/supabaseProvider";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { supabase, session } = useSupabase();
  const [profile, setProfile] = useState({
    full_name: "",
    company: "",
    logo_url: "",
  });

  useEffect(() => {
    if (!session) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, company, logo_url")
        .eq("id", session.user.id)
        .maybeSingle();
      if (data) setProfile({
        full_name: data.full_name || "",
        company: data.company || "",
        logo_url: data.logo_url || "",
      });
    })();
  }, [session, supabase]);

  async function save() {
    if (!session) return;
    await supabase
      .from("profiles")
      .upsert({ id: session.user.id, ...profile });
  }

  return (
    <AuthGuard>
      <div className="flex h-screen bg-gray-50 text-gray-900">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-8">
            <motion.h2
              className="text-3xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Paramètres
            </motion.h2>
            <div className="bg-white rounded-xl p-6 shadow max-w-xl">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom complet</label>
                  <input
                    className="w-full mt-1 p-2 border rounded"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Entreprise</label>
                  <input
                    className="w-full mt-1 p-2 border rounded"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Logo (URL)</label>
                  <input
                    className="w-full mt-1 p-2 border rounded"
                    value={profile.logo_url}
                    onChange={(e) => setProfile({ ...profile, logo_url: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={save}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

