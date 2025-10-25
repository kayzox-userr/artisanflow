"use client";

import { useState } from "react";
import { useSupabase } from "@/lib/supabaseProvider";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignUp() {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      alert("Compte créé ! Vérifie ton e-mail pour valider ton inscription.");
      router.push("/auth/sign-in");
    }

    setLoading(false);
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Créer un compte</h2>

        <input
          type="email"
          placeholder="Adresse e-mail"
          className="w-full p-2 border rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full p-2 border rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <button
          onClick={handleSignUp}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Création..." : "Créer un compte"}
        </button>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Déjà un compte ?{" "}
          <a href="/auth/sign-in" className="text-blue-600 hover:underline">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
}
