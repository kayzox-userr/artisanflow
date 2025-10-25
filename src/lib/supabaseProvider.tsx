"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { SupabaseClient, Session } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient"; // ✅ client préconfiguré

// Création du contexte global Supabase
const Context = createContext<{ supabase: SupabaseClient; session: Session | null }>({
  supabase,
  session: null,
});

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Vérifie si Supabase est bien configuré
      if (!supabase) {
        throw new Error("⚠️ Supabase non initialisé !");
      }

      // Récupère la session utilisateur si elle existe
      supabase.auth
        .getSession()
        .then(({ data }) => setSession(data.session))
        .catch((err) => {
          console.error("Erreur Supabase:", err);
          setError("Impossible de récupérer la session Supabase.");
        });

      // Écoute les changements de session (login / logout)
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) =>
        setSession(session)
      );

      return () => {
        listener.subscription.unsubscribe();
      };
    } catch (err: any) {
      console.error("Erreur d'initialisation Supabase:", err.message);
      setError("⚠️ Erreur de configuration Supabase.");
    }
  }, []);

  // 💡 Si erreur → afficher une jolie alerte
  if (error) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#fff4f4",
          color: "#b91c1c",
          fontFamily: "Inter, sans-serif",
          flexDirection: "column",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🚨 Erreur Supabase</h2>
        <p>{error}</p>
        <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#7f1d1d" }}>
          Vérifie ton fichier <code>.env.local</code> et redémarre le serveur.
        </p>
      </div>
    );
  }

  return <Context.Provider value={{ supabase, session }}>{children}</Context.Provider>;
}

export const useSupabase = () => useContext(Context);
