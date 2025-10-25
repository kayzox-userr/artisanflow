"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { motion } from "framer-motion";

export default function AdminAnalyticsPage() {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
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
              Analytique globale
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow">
                <h3 className="font-semibold text-gray-700">Revenus totaux</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">—</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow">
                <h3 className="font-semibold text-gray-700">Abonnés actifs</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">—</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow">
                <h3 className="font-semibold text-gray-700">Taux de conversion</h3>
                <p className="text-3xl font-bold text-yellow-500 mt-2">—</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

