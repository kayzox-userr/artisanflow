"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/lib/supabaseProvider";
import { determineHomeRoute, ROLE_ORDER, type UserRole } from "@/lib/roles";

type AuthGuardProps = {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
};

export default function AuthGuard({ children, allowedRoles = ROLE_ORDER }: AuthGuardProps) {
  const router = useRouter();
  const { supabase, session, role, loading } = useSupabase();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (loading) return;

    const checkAuth = async () => {
      if (!session) {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          router.push("/auth/sign-in");
          return;
        }
      }

      if (allowedRoles.length && role && !allowedRoles.includes(role)) {
        router.replace(determineHomeRoute(role));
        return;
      }

      setChecking(false);
    };

    checkAuth();
  }, [allowedRoles, loading, role, router, session, supabase]);

  if (loading || checking || (allowedRoles.length && !role)) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p>Chargement...</p>
      </div>
    );
  }

  return <>{children}</>;
}
