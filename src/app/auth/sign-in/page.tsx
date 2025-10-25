"use client";

import { Suspense, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSupabase } from "@/lib/supabaseProvider";
import { determineHomeRoute, normalizeRole } from "@/lib/roles";

function SignInForm() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const redirectParam = searchParams?.get("redirectTo");

  async function handleSignIn(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      setError(error?.message ?? "Identifiants invalides.");
      setLoading(false);
      return;
    }

    const profileResponse = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();

    const resolvedRole = normalizeRole(profileResponse.data?.role ?? (data.user.user_metadata?.role as string | null));

    const { error: activityError } = await supabase
      .from("user_activity")
      .insert({ user_id: data.user.id, logged_at: new Date().toISOString() });
    if (activityError) {
      console.error("Failed to log user activity", activityError);
    }

    router.push(redirectParam || determineHomeRoute(resolvedRole));
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <div className="hidden lg:flex flex-1 flex-col justify-between p-16 bg-gradient-to-br from-gray-900 to-gray-800">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-gray-400">ArtisansFlow</p>
          <h1 className="text-4xl font-bold mt-6">Reprends le contr��le de ton activitǸ.</h1>
          <p className="mt-4 text-gray-300 max-w-md">
            Connecte-toi pour retrouver tes tableaux de bord, ton CRM et tes automatisations en temps rǸel.
          </p>
        </div>
        <div className="space-y-3 text-sm text-gray-400">
          <p>{'�o"��? Authentification sǸcurisǸe Supabase'}</p>
          <p>{'�o"��? Statistiques et revenus en live'}</p>
          <p>{'�o"��? Exports premium & automation'}</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-center justify-center bg-white text-gray-900"
      >
        <form onSubmit={handleSignIn} className="w-full max-w-md p-10">
          <p className="text-sm text-blue-600 font-semibold">Heureux de te revoir 👋</p>
          <h2 className="text-3xl font-bold mt-2">Connexion �� ArtisansFlow</h2>
          <p className="text-sm text-gray-500 mt-2">
            Pas encore membre ? <Link href="/auth/sign-up" className="text-blue-600 hover:underline">CrǸe ton compte</Link>
          </p>

          <div className="mt-8 space-y-4">
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
                placeholder="�?��?��?��?��?��?��?��?�"
              />
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <div className="mt-6 text-center text-sm text-gray-500">
            <Link href="/" className="text-blue-600 hover:underline">
              ��? Retourner sur la vitrine
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
