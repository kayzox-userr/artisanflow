"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import AuthGuard from "@/components/AuthGuard";

export default function StatsPage() {
  return (
    <AuthGuard allowedRoles={["PRO", "ULTIMATE", "VIP", "ADMIN"]}>
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
              Statistiques
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow">
                <h3 className="font-semibold text-gray-700 mb-2">Revenus mensuels</h3>
                <div className="h-56 bg-gray-100 rounded" />
              </div>
              <div className="bg-white rounded-xl p-6 shadow">
                <h3 className="font-semibold text-gray-700 mb-2">Nouveaux clients</h3>
                <div className="h-56 bg-gray-100 rounded" />
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
