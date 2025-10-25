"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/lib/supabaseProvider";
import { ROLE_FEATURE_LIMIT, ROLE_LABEL, type UserRole } from "@/lib/roles";
import { availableSignupPlans } from "@/lib/stripePlans";

const signupPlanOptions = availableSignupPlans.map((plan) => plan.value as UserRole);

export default function SignUpPage() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [plan, setPlan] = useState<UserRole>(signupPlanOptions[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignUp(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: plan,
          full_name: fullName,
          company,
        },
      },
    });

    if (error || !data.user) {
      setError(error?.message ?? "Impossible de créer le compte");
      setLoading(false);
      return;
    }

    await supabase
      .from("profiles")
      .upsert({
        id: data.user.id,
        full_name: fullName || null,
        company: company || null,
        role: plan,
      })
      .catch(() => undefined);

    router.push("/auth/sign-in?registered=1");
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col justify-center p-16"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Bienvenue</p>
        <h1 className="text-4xl font-bold mt-6 max-w-xl">
          Lance ton espace ArtisansFlow en quelques secondes.
        </h1>
        <p className="mt-4 text-gray-300 max-w-lg">
          Choisis un plan, personnalise ton branding et commence à piloter tes clients, devis et paiements depuis une interface premium et animée.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {availableSignupPlans.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPlan(option.value as UserRole)}
              className={`rounded-xl border p-4 text-left transition ${
                plan === option.value ? "border-blue-500 bg-white/10" : "border-white/10 hover:border-white/30"
              }`}
            >
              <p className="text-sm text-gray-400">{ROLE_LABEL[option.value as UserRole]}</p>
              <p className="text-xl font-semibold text-white mt-1">{option.price} €/mois</p>
              <p className="text-xs text-gray-400 mt-2">{option.description}</p>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center bg-white text-gray-900"
      >
        <form onSubmit={handleSignUp} className="w-full max-w-md p-10">
          <p className="text-sm text-blue-600 font-semibold">Créer mon espace</p>
          <h2 className="text-3xl font-bold mt-2">Inscription ArtisansFlow</h2>
          <p className="text-sm text-gray-500 mt-2">
            Déjà membre ? <Link href="/auth/sign-in" className="text-blue-600 hover:underline">Connecte-toi</Link>
          </p>

          <div className="mt-8 space-y-4">
            <div>
              <label className="text-sm text-gray-600">Nom complet</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
                placeholder="Jane Dupont"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Entreprise (optionnel)</label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
                placeholder="Atelier Lumière"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Adresse e-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
                placeholder="ton@email.com"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Mot de passe</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-600">
            <p>Plan sélectionné : <span className="font-semibold text-gray-900">{ROLE_LABEL[plan]}</span></p>
            <p className="text-xs text-gray-500">{ROLE_FEATURE_LIMIT[plan] === Number.POSITIVE_INFINITY ? "Accès illimité" : `${ROLE_FEATURE_LIMIT[plan]} fonctionnalités incluses`}</p>
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>

          <div className="mt-6 text-center text-sm text-gray-500">
            <Link href="/" className="text-blue-600 hover:underline">
              ← Retourner sur la vitrine
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
