"use client";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { motion } from "framer-motion";

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenu principal */}
      <div className="flex flex-col flex-1">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8">
          <motion.h2
            className="text-3xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Tableau de bord
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow">
              <h3 className="font-semibold text-gray-700">Clients</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">25</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow">
              <h3 className="font-semibold text-gray-700">Devis en attente</h3>
              <p className="text-3xl font-bold text-yellow-500 mt-2">7</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow">
              <h3 className="font-semibold text-gray-700">Chiffre d’affaires</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">4 820€</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
