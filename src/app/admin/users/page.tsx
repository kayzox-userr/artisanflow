"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { useSupabase } from "@/lib/supabaseProvider";

type AdminUser = {
  id: string;
  email: string | null;
  role: string | null;
};

export default function AdminUsersPage() {
  const { supabase } = useSupabase();
  const [users, setUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("users_public").select("id, email, role");
      if (!error && data) {
        setUsers(data as AdminUser[]);
      }
    })();
  }, [supabase]);

  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <div className="flex h-screen bg-gray-50 text-gray-900">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-8">
            <h2 className="text-3xl font-bold mb-6">Utilisateurs</h2>
            <table className="min-w-full bg-white rounded-xl shadow overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Rôle</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="py-2 px-4">{user.id}</td>
                    <td className="py-2 px-4">{user.email ?? "—"}</td>
                    <td className="py-2 px-4">{user.role ?? "BASIC"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

