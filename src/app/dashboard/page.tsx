"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { useSupabase } from "@/lib/supabaseProvider";
import { ROLE_FEATURE_LIMIT, ROLE_LABEL, ROLE_TO_PLAN_FEATURES, type UserRole } from "@/lib/roles";

type PeriodKey = "7d" | "6m" | "1y";

type InvoiceRow = {
  id: string;
  total_ttc: number | null;
  status: string | null;
  date: string | null;
};

type ChartPoint = {
  label: string;
  total: number;
};

const PERIOD_LABELS: Record<PeriodKey, string> = {
  "7d": "7 jours",
  "6m": "6 mois",
  "1y": "1 an",
};

const quickLinks = [
  { title: "Clients", description: "Gère ton CRM premium", href: "/dashboard/clients" },
  { title: "Statistiques", description: "Analyse ton activité", href: "/dashboard/stats" },
  { title: "Paramètres", description: "Logo, identité, équipe", href: "/dashboard/settings" },
];

const buildSeries = (period: PeriodKey): ChartPoint[] => {
  const today = new Date();
  const series: ChartPoint[] = [];

  if (period === "7d") {
    for (let i = 6; i >= 0; i -= 1) {
      const point = new Date(today);
      point.setDate(today.getDate() - i);
      series.push({
        label: point.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" }),
        total: 0,
      });
    }
    return series;
  }

  const months = period === "6m" ? 6 : 12;
  for (let i = months - 1; i >= 0; i -= 1) {
    const point = new Date(today.getFullYear(), today.getMonth() - i, 1);
    series.push({ label: point.toLocaleDateString("fr-FR", { month: "short" }), total: 0 });
  }
  return series;
};

const aggregateInvoices = (rows: InvoiceRow[], period: PeriodKey): ChartPoint[] => {
  const baseSeries = buildSeries(period);
  const map = new Map<string, number>();
  baseSeries.forEach((point) => map.set(point.label, 0));

  rows.forEach((row) => {
    if (!row.date) return;
    const date = new Date(row.date);
    const key =
      period === "7d"
        ? date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" })
        : date.toLocaleDateString("fr-FR", { month: "short" });

    if (!map.has(key)) return;
    map.set(key, (map.get(key) ?? 0) + (row.total_ttc ?? 0));
  });

  return baseSeries.map((point) => ({ label: point.label, total: map.get(point.label) ?? 0 }));
};

export default function DashboardPage() {
  const { supabase, session, role } = useSupabase();
  const [period, setPeriod] = useState<PeriodKey>("7d");
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    pendingInvoices: 0,
    invoicesCount: 0,
  });

  const fetchRevenue = useCallback(async () => {
    if (!session?.user) return;
    setLoading(true);
    const now = new Date();
    const fromDate = new Date(now);

    if (period === "7d") {
      fromDate.setDate(now.getDate() - 7);
    } else if (period === "6m") {
      fromDate.setMonth(now.getMonth() - 6);
    } else {
      fromDate.setFullYear(now.getFullYear() - 1);
    }

    const { data, error } = await supabase
      .from("invoices")
      .select("id, total_ttc, status, date")
      .eq("org_id", session.user.id)
      .gte("date", fromDate.toISOString())
      .order("date", { ascending: true });

    if (!error && data) {
      setChartData(aggregateInvoices(data as InvoiceRow[], period));
      const paid = data.filter((invoice) => invoice.status === "paid");
      const pending = data.filter((invoice) => invoice.status === "pending");
      const sum = paid.reduce((acc, invoice) => acc + (invoice.total_ttc ?? 0), 0);
      setMetrics({ totalRevenue: sum, pendingInvoices: pending.length, invoicesCount: data.length });
    }

    setLoading(false);
  }, [period, session, supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRevenue();
  }, [fetchRevenue]);

  useEffect(() => {
    if (!session?.user) return;
    const channel = supabase
      .channel("invoices-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "invoices", filter: `org_id=eq.${session.user.id}` },
        () => fetchRevenue()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRevenue, session, supabase]);

  const planFeaturesPreview = useMemo(() => {
    const safeRole: UserRole = role ?? "BASIC";
    return ROLE_TO_PLAN_FEATURES[safeRole].slice(0, 3);
  }, [role]);

  return (
    <AuthGuard>
      <div className="flex h-screen bg-gray-50 text-gray-900">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-6"
            >
              <div>
                <p className="text-sm text-gray-500">Vue d&rsquo;ensemble</p>
                <h2 className="text-3xl font-bold">Tableau de bord</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow">
                  <p className="text-sm text-gray-500">Revenus encaissés</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {metrics.totalRevenue.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow">
                  <p className="text-sm text-gray-500">Factures en attente</p>
                  <p className="text-3xl font-bold text-yellow-500 mt-2">{metrics.pendingInvoices}</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow">
                  <p className="text-sm text-gray-500">Factures sur la période</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{metrics.invoicesCount}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Chiffre d&rsquo;affaires</p>
                    <h3 className="text-2xl font-semibold">Évolution {PERIOD_LABELS[period]}</h3>
                  </div>
                  <div className="flex gap-2">
                    {(Object.keys(PERIOD_LABELS) as PeriodKey[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => setPeriod(key)}
                        className={`rounded-full px-4 py-1 text-sm font-semibold transition ${
                          period === key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {PERIOD_LABELS[key]}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-72 mt-6">
                  {loading ? (
                    <div className="h-full flex items-center justify-center text-gray-500">Chargement...</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="label" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip formatter={(value: number) => `${value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}`} />
                        <Area type="monotone" dataKey="total" stroke="#2563eb" fillOpacity={1} fill="url(#revenueGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow p-6">
                  <h3 className="text-xl font-semibold">Ton plan {role ? ROLE_LABEL[role] : "BASIC"}</h3>
                  <p className="text-sm text-gray-500">
                    {ROLE_FEATURE_LIMIT[role ?? "BASIC"] === Number.POSITIVE_INFINITY
                      ? "Accès complet à toutes les fonctionnalités."
                      : `${ROLE_FEATURE_LIMIT[role ?? "BASIC"]} fonctionnalités incluses.`}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-gray-600">
                    {planFeaturesPreview.map((feature) => (
                      <li key={feature}>• {feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-2xl shadow p-6">
                  <h3 className="text-xl font-semibold">Raccourcis</h3>
                  <div className="mt-4 grid gap-4">
                    {quickLinks.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        className="rounded-xl border border-gray-200 px-4 py-3 hover:border-blue-500 transition"
                      >
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
