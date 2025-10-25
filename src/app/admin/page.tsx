"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { useSupabase } from "@/lib/supabaseProvider";

type ConnectionPoint = {
  label: string;
  value: number;
};

type AdminMetrics = {
  totalUsers: number;
  totalRevenue: number;
  monthlySales: number;
  monthlyRevenue: number;
  annualRevenue: number;
  activeUsers: number;
};

const initialMetrics: AdminMetrics = {
  totalUsers: 0,
  totalRevenue: 0,
  monthlySales: 0,
  monthlyRevenue: 0,
  annualRevenue: 0,
  activeUsers: 0,
};

const buildConnectionsSeries = (): ConnectionPoint[] => {
  const today = new Date();
  const series: ConnectionPoint[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const point = new Date(today);
    point.setDate(today.getDate() - i);
    series.push({
      label: point.toLocaleDateString("fr-FR", { weekday: "short" }),
      value: 0,
    });
  }
  return series;
};

export default function AdminPage() {
  const { supabase } = useSupabase();
  const [metrics, setMetrics] = useState<AdminMetrics>(initialMetrics);
  const [connections, setConnections] = useState<ConnectionPoint[]>(buildConnectionsSeries());
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [annualExtraExpenses, setAnnualExtraExpenses] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    const now = new Date();
    const firstDayMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);

    const [usersCountResponse, invoicesResponse, activityResponse] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase
        .from("invoices")
        .select("org_id, total_ttc, status, date")
        .gte("date", yearAgo.toISOString()),
      supabase
        .from("user_activity")
        .select("logged_at")
        .gte("logged_at", weekAgo.toISOString())
        .order("logged_at", { ascending: true }),
    ]);

    const invoices = (invoicesResponse.data ?? []) as Array<{
      org_id: string | null;
      total_ttc: number | null;
      status: string | null;
      date: string | null;
    }>;

    const paidInvoices = invoices.filter((invoice) => invoice.status === "paid");
    const totalRevenue = paidInvoices.reduce((acc, invoice) => acc + (invoice.total_ttc ?? 0), 0);
    const monthlySales = invoices.filter((invoice) => invoice.date && new Date(invoice.date) >= firstDayMonth).length;
    const monthlyRevenue = paidInvoices
      .filter((invoice) => invoice.date && new Date(invoice.date) >= firstDayMonth)
      .reduce((acc, invoice) => acc + (invoice.total_ttc ?? 0), 0);
    const annualRevenue = paidInvoices.reduce((acc, invoice) => acc + (invoice.total_ttc ?? 0), 0);
    const activeUsers = new Set(
      invoices
        .filter((invoice) => invoice.date && new Date(invoice.date) >= thirtyDaysAgo)
        .map((invoice) => invoice.org_id)
        .filter(Boolean)
    ).size;

    setMetrics({
      totalUsers: usersCountResponse.count ?? 0,
      totalRevenue,
      monthlySales,
      monthlyRevenue,
      annualRevenue,
      activeUsers,
    });

    const connectionsSeries = buildConnectionsSeries();
    const byDay = new Map(connectionsSeries.map((point) => [point.label, 0] as const));

    (activityResponse.data ?? []).forEach((row) => {
      const loggedAt = row.logged_at ? new Date(row.logged_at) : null;
      if (!loggedAt) return;
      const label = loggedAt.toLocaleDateString("fr-FR", { weekday: "short" });
      if (!byDay.has(label)) return;
      byDay.set(label, (byDay.get(label) ?? 0) + 1);
    });

    setConnections(connectionsSeries.map((point) => ({ label: point.label, value: byDay.get(point.label) ?? 0 })));
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const profitMonthly = metrics.monthlyRevenue - monthlyExpenses;
  const profitAnnual = metrics.annualRevenue - (monthlyExpenses * 12 + annualExtraExpenses);

  const exportAsCSV = () => {
    const rows = [
      ["total_users", metrics.totalUsers],
      ["total_revenue", metrics.totalRevenue],
      ["monthly_sales", metrics.monthlySales],
      ["monthly_revenue", metrics.monthlyRevenue],
      ["annual_revenue", metrics.annualRevenue],
      ["active_users", metrics.activeUsers],
      ["profit_monthly", profitMonthly],
      ["profit_annual", profitAnnual],
    ];
    const csvContent = ["metric,value", ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `artisansflow-admin-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportAsPDF = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Rapport Admin ArtisansFlow", 14, 20);
    doc.setFontSize(11);
    const entries: Array<[string, number]> = [
      ["Utilisateurs", metrics.totalUsers],
      ["Revenus totaux", metrics.totalRevenue],
      ["Ventes mensuelles", metrics.monthlySales],
      ["Revenus mensuels", metrics.monthlyRevenue],
      ["Revenus annuels", metrics.annualRevenue],
      ["Utilisateurs actifs", metrics.activeUsers],
      ["Profit mensuel", profitMonthly],
      ["Profit annuel", profitAnnual],
    ];
    let y = 35;
    entries.forEach(([label, value]) => {
      doc.text(`${label}: ${value.toLocaleString("fr-FR")}`, 14, y);
      y += 8;
    });
    doc.save(`artisansflow-admin-${Date.now()}.pdf`);
  };

  const handleCSVExpenses = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const total = text
      .split("\n")
      .map((line) => line.split(",").pop() ?? "0")
      .reduce((acc, value) => acc + (Number(value) || 0), 0);
    setAnnualExtraExpenses(total);
  };

  const connectionsAverage = useMemo(() => {
    if (!connections.length) return 0;
    const sum = connections.reduce((acc, point) => acc + point.value, 0);
    return Math.round(sum / connections.length);
  }, [connections]);

  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <div className="flex h-screen bg-gray-50 text-gray-900">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm text-gray-500">Vue globale</p>
                  <h2 className="text-3xl font-bold">Admin ArtisansFlow</h2>
                </div>
                <div className="flex gap-3">
                  <button onClick={exportAsCSV} className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold">
                    Export CSV
                  </button>
                  <button onClick={exportAsPDF} className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white">
                    Export PDF
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow">
                  <p className="text-sm text-gray-500">Utilisateurs</p>
                  <p className="text-3xl font-bold">{metrics.totalUsers}</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow">
                  <p className="text-sm text-gray-500">Chiffre d&rsquo;affaires global</p>
                  <p className="text-3xl font-bold text-green-600">
                    {metrics.totalRevenue.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow">
                  <p className="text-sm text-gray-500">Utilisateurs actifs</p>
                  <p className="text-3xl font-bold text-blue-600">{metrics.activeUsers}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Connexions quotidiennes</p>
                      <h3 className="text-xl font-semibold">Moyenne {connectionsAverage} / jour</h3>
                    </div>
                    <button onClick={fetchAnalytics} className="text-sm text-blue-600 hover:underline">
                      Actualiser
                    </button>
                  </div>
                  <div className="mt-6 grid grid-cols-7 gap-3 text-center">
                    {connections.map((point) => (
                      <div key={point.label} className="flex flex-col items-center">
                        <div className="h-24 w-3 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="bg-blue-600 w-full"
                            style={{ height: `${Math.min(point.value * 20, 100)}%` }}
                          />
                        </div>
                        <p className="mt-2 text-xs text-gray-500">{point.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Dépenses mensuelles</p>
                    <input
                      type="number"
                      value={monthlyExpenses}
                      onChange={(e) => setMonthlyExpenses(Number(e.target.value) || 0)}
                      className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:outline-none"
                      placeholder="0 €"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Importer des dépenses (CSV)</p>
                    <input type="file" accept=".csv" onChange={handleCSVExpenses} className="mt-2 text-sm" />
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">Bénéfice mensuel estimé</p>
                    <p className="text-2xl font-semibold">
                      {profitMonthly.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bénéfice annuel estimé</p>
                    <p className="text-2xl font-semibold text-green-600">
                      {profitAnnual.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow">
                  <p className="text-sm text-gray-500">Ventes mensuelles</p>
                  <h3 className="text-4xl font-bold text-gray-900">{metrics.monthlySales}</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Revenus ce mois-ci : {metrics.monthlyRevenue.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow">
                  <p className="text-sm text-gray-500">Revenus annuels</p>
                  <h3 className="text-4xl font-bold text-gray-900">
                    {metrics.annualRevenue.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                  </h3>
                </div>
              </div>

              {loading && <p className="text-sm text-gray-500">Chargement des données...</p>}
            </motion.div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
