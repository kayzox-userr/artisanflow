import "./globals.css";
import SupabaseProvider from "../lib/supabaseProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ArtisansFlow",
  description: "Plateforme SaaS pour artisans et TPE",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          backgroundColor: "#f4f6f8",
          color: "#111",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
