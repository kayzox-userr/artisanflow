"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { SupabaseClient, Session } from "@supabase/supabase-js";
import { usePathname, useRouter } from "next/navigation";
import { supabase as supabaseClient } from "./supabaseClient";
import { determineHomeRoute, normalizeRole, type UserRole } from "./roles";

type Profile = {
  id: string;
  full_name: string | null;
  company: string | null;
  logo_url: string | null;
  role: UserRole;
};

type SupabaseContextValue = {
  supabase: SupabaseClient;
  session: Session | null;
  role: UserRole | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const SupabaseContext = createContext<SupabaseContextValue | undefined>(undefined);

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const supabase = supabaseClient;
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const hydrateProfile = useCallback(
    async (activeSession: Session | null = session) => {
      if (!activeSession?.user) {
        setProfile(null);
        setRole(null);
        return;
      }

      const userId = activeSession.user.id;
      const metadataRole = normalizeRole(activeSession.user.user_metadata?.role as string | null);

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, company, logo_url, role")
          .eq("id", userId)
          .maybeSingle();

        if (error) {
          console.error("Erreur chargement profil Supabase", error);
        }

        let ensuredProfile = data ?? null;

        if (!ensuredProfile) {
          const insertResponse = await supabase
            .from("profiles")
            .insert({
              id: userId,
              full_name: activeSession.user.user_metadata?.full_name ?? null,
              company: null,
              logo_url: null,
              role: metadataRole,
            })
            .select("id, full_name, company, logo_url, role")
            .maybeSingle();

          if (!insertResponse.error) {
            ensuredProfile = insertResponse.data;
          }
        }

        const nextRole = normalizeRole(ensuredProfile?.role ?? metadataRole);

        setProfile(
          ensuredProfile
            ? {
                id: ensuredProfile.id,
                full_name: ensuredProfile.full_name ?? null,
                company: ensuredProfile.company ?? null,
                logo_url: ensuredProfile.logo_url ?? null,
                role: nextRole,
              }
            : {
                id: userId,
                full_name: activeSession.user.user_metadata?.full_name ?? null,
                company: null,
                logo_url: null,
                role: nextRole,
              }
        );
        setRole(nextRole);

        if (activeSession.user.user_metadata?.role !== nextRole) {
          await supabase.auth
            .updateUser({
              data: { ...(activeSession.user.user_metadata ?? {}), role: nextRole },
            })
            .catch(() => undefined);
        }
      } catch (error) {
        console.error("Erreur lors de la synchronisation du profil", error);
      }
    },
    [session, supabase]
  );

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      if (event === "SIGNED_OUT") {
        setProfile(null);
        setRole(null);
        router.push("/auth/sign-in");
      }
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase, router]);

  useEffect(() => {
    if (!session?.user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfile(null);
      setRole(null);
      return;
    }
    hydrateProfile(session);
  }, [session, hydrateProfile]);

  useEffect(() => {
    if (!session || !role) return;
    if (pathname?.startsWith("/auth")) {
      router.replace(determineHomeRoute(role));
    }
  }, [session, role, pathname, router]);

  const refreshProfile = useCallback(async () => {
    await hydrateProfile(session);
  }, [hydrateProfile, session]);

  const value = useMemo(
    () => ({
      supabase,
      session,
      role,
      profile,
      loading,
      refreshProfile,
    }),
    [supabase, session, role, profile, loading, refreshProfile]
  );

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
}

export const useSupabase = () => {
  const ctx = useContext(SupabaseContext);
  if (!ctx) throw new Error("useSupabase must be used within SupabaseProvider");
  return ctx;
};
