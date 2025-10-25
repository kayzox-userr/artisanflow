"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/lib/supabaseProvider";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/auth/sign-in");
    }
  }, [session, router]);

  return <>{children}</>;
}
