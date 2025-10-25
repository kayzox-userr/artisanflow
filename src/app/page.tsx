"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

/**
 * Page vitrine ArtisansFlow — Next.js 15/16 + Framer Motion (TS safe)
 * - Animations corrigées: transition passée en prop, pas dans les variants
 * - Smooth scroll
 * - Sections: Hero, Logos, Features, HowItWorks, Pricing, Proof, FAQ, CTA
 */

export default function LandingPage() {
  // défilement fluide
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.scrollBehavior = "smooth";
    }
  }, []);

  // petites helpers d’animations réutilisables
  const fadeUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
  };

  const fade = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, amount: 0.2 },
  };

  return (
    <main className="min-h-screen bg-[#0b0f17] text-white selection:bg-white/20">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 backdrop-blur bg-[#0b0f17]/70 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-extrabold tracking-tight text-xl">
            <span className="text-white">Artisans</span>
            <span className="text-cyan-400">Flow</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-white/70">
            <a href="#features" className="hover:text-white">Fonctionnalités</a>
            <a href="#pricing" className="hover:text-white">Tarifs</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/sign-in"
              className="px-4 py-2 rounded-lg border border-white/15 text-sm text-white/80 hover:text-white hover:border-white/30"
            >
              Se connecter
            </Link>
            <Link
              href="/auth/sign-up"
              className="px-4 py-2 rounded-lg bg-cyan-500 text-[#0b0f17] font-semibold hover:bg-cyan-400"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* halos */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-[420px] w-[420px] rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.05 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-center"
          >
            Le cockpit des <span className="text-cyan-400">artisans</span> & TPE
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-5 text-center text-white/70 max-w-2xl mx-auto"
          >
            Devis & factures en 1 minute, suivi du chiffre d’affaires, calendrier
            et CRM — tout-en-un. Conçu pour plombiers, électriciens, peintres,
            auto-entrepreneurs et petites équipes.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-8 flex items-center justify-center gap-3"
          >
            <Link
              href="/auth/sign-up"
              className="px-5 py-3 rounded-xl bg-cyan-500 text-[#0b0f17] font-semibold hover:bg-cyan-400"
            >
              Essai gratuit
            </Link>
            <a
              href="#pricing"
              className="px-5 py-3 rounded-xl border border-white/15 text-white/80 hover:text-white hover:border-white/30"
            >
              Voir les tarifs
            </a>
          </motion.div>

          {/* hero screenshot placeholder */}
          <motion.div
            {...fade}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-14 md:mt-20 border border-white/10 rounded-2xl overflow-hidden bg-white/5"
          >
            <div className="aspect-[16/9] w-full grid place-items-center text-white/60 text-sm">
              Aperçu du tableau de bord (CA, devis, clients…)
            </div>
          </motion.div>
        </div>
      </section>

      {/* LOGOS / SOCIAL PROOF */}
      <section className="py-10 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-xs uppercase tracking-[0.2em] text-white/40">
            Confié à des dizaines d’artisans
          </p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-6 opacity-70">
            {["ProElec", "AquaPro", "Habitat+", "RenoFast", "Plombex"].map((b, i) => (
              <motion.div
                key={b}
                {...fadeUp}
                transition={{ duration: 0.6, delay: 0.05 * i }}
                className="h-10 rounded-md bg-white/5 border border-white/10 grid place-items-center text-white/60 text-sm"
              >
                {b}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.05 }}
            className="text-3xl md:text-4xl font-bold text-center"
          >
            Tout pour gérer votre activité
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.18 }}
            className="mt-3 text-center text-white/70 max-w-2xl mx-auto"
          >
            Créez des devis/factures, centralisez vos clients, suivez le CA et
            vos rendez-vous. Simple, rapide, sécurisé.
          </motion.p>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              {
                t: "Devis & Factures PDF",
                d: "Modèles pro, TVA, numérotation légale, signature, envoi par e-mail.",
              },
              {
                t: "Dashboard CA",
                d: "Chiffre d’affaires sur 7 jours, 6 mois, 1 an. Comparaisons & tendances.",
              },
              {
                t: "CRM Clients",
                d: "Fiches clients complètes. Champs optionnels. Historique des documents.",
              },
              {
                t: "Calendrier & RDV",
                d: "Créneaux, rappels e-mail, export iCal. Synchronisé avec vos devis.",
              },
              {
                t: "Catalogue & TVA",
                d: "Articles/services, prix, TVA, devis dynamiques, remises, options.",
              },
              {
                t: "Stockage & pièces jointes",
                d: "Photos de chantier, reçus, documents. Sauvegardes automatiques.",
              },
            ].map((f, i) => (
              <motion.div
                key={f.t}
                {...fadeUp}
                transition={{ duration: 0.7, delay: 0.08 * i }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="font-semibold text-lg">{f.t}</h3>
                <p className="text-white/70 mt-2">{f.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.05 }}
            className="text-3xl md:text-4xl font-bold text-center"
          >
            Démarrez en 3 étapes
          </motion.h2>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {[
              { n: "1", t: "Créez votre compte", d: "1 minute, pas de carte bancaire." },
              { n: "2", t: "Ajoutez un client", d: "Champs optionnels, import CSV possible." },
              { n: "3", t: "Éditez un devis", d: "Générez le PDF, envoyez-le & suivez l’état." },
            ].map((s, i) => (
              <motion.div
                key={s.n}
                {...fadeUp}
                transition={{ duration: 0.7, delay: 0.08 * i }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="text-cyan-400 text-2xl font-extrabold">{s.n}</div>
                <h3 className="mt-2 font-semibold">{s.t}</h3>
                <p className="text-white/70 mt-2">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.05 }}
            className="text-3xl md:text-4xl font-bold text-center"
          >
            Des plans simples, pensés pour vous
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-3 text-center text-white/70"
          >
            Changez de plan quand vous voulez. Sans engagement.
          </motion.p>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Basic",
                price: "50€",
                per: "/mois",
                features: [
                  "Devis & factures PDF",
                  "Dashboard CA de base",
                  "CRM clients",
                  "Exports PDF/CSV",
                  "Support standard",
                ],
                cta: "Commencer",
              },
              {
                name: "Core (Pro)",
                price: "100€",
                per: "/mois",
                popular: true,
                features: [
                  "Tout Basic +",
                  "Factures / paiements",
                  "Calendrier & relances",
                  "Signatures & e-mails",
                  "Statistiques avancées",
                ],
                cta: "Choisir Core",
              },
              {
                name: "Ultimate",
                price: "150€",
                per: "/mois",
                features: [
                  "Tout Core +",
                  "Portail client & paiements en ligne",
                  "Devis dynamiques / upsell",
                  "Intégrations & sauvegardes",
                  "Support prioritaire",
                ],
                cta: "Choisir Ultimate",
              },
            ].map((p, i) => (
              <motion.div
                key={p.name}
                {...fadeUp}
                transition={{ duration: 0.7, delay: 0.08 * i }}
                className={`rounded-2xl border bg-white/5 p-6 ${
                  p.popular ? "border-cyan-400/40" : "border-white/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{p.name}</h3>
                  {p.popular && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                      Populaire
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-end gap-1">
                  <div className="text-3xl font-extrabold">{p.price}</div>
                  <div className="text-white/60">{p.per}</div>
                </div>
                <ul className="mt-4 space-y-2 text-white/80 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/sign-up"
                  className={`mt-6 inline-flex w-full justify-center px-4 py-2 rounded-xl font-semibold ${
                    p.popular
                      ? "bg-cyan-500 text-[#0b0f17] hover:bg-cyan-400"
                      : "border border-white/15 text-white/80 hover:text-white hover:border-white/30"
                  }`}
                >
                  {p.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROOF / TRUST */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h3
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.05 }}
            className="text-2xl font-bold"
          >
            Pourquoi ArtisansFlow est indispensable
          </motion.h3>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            {[
              {
                t: "Gain de temps massif",
                d: "Devis/factures en moins d’1 minute. Plus d’erreurs de TVA.",
              },
              { t: "Image pro", d: "PDF soignés, branding, signatures, portail client." },
              {
                t: "Vision claire",
                d: "Suivi du CA, des relances & des RDV en un clin d’œil.",
              },
            ].map((b, i) => (
              <motion.div
                key={b.t}
                {...fadeUp}
                transition={{ duration: 0.7, delay: 0.08 * i }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <h4 className="font-semibold">{b.t}</h4>
                <p className="text-white/70 mt-2">{b.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.05 }}
            className="text-3xl md:text-4xl font-bold text-center"
          >
            FAQ
          </motion.h2>

          <div className="mt-10 space-y-4 max-w-3xl mx-auto">
            {[
              {
                q: "Puis-je changer de plan à tout moment ?",
                a: "Oui, vous pouvez upgrader/downgrader quand vous voulez. Sans engagement.",
              },
              {
                q: "Puis-je importer mes anciens clients ?",
                a: "Oui, via un fichier CSV ou en les ajoutant manuellement.",
              },
              {
                q: "Mes données sont-elles en sécurité ?",
                a: "Oui, sauvegardes automatiques et chiffrement. Accès restreint par organisation.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.q}
                {...fadeUp}
                transition={{ duration: 0.6, delay: 0.06 * i }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="font-semibold">{item.q}</div>
                <p className="text-white/70 mt-2">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT / CTA FINAL */}
      <section id="contact" className="py-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold">Prêt à gagner du temps ?</h3>
              <p className="text-white/70 mt-1">
                Démarrez gratuitement, passez au plan supérieur quand vous voulez.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/auth/sign-up"
                className="px-5 py-3 rounded-xl bg-cyan-500 text-[#0b0f17] font-semibold hover:bg-cyan-400"
              >
                Essai gratuit
              </Link>
              <a
                href="#pricing"
                className="px-5 py-3 rounded-xl border border-white/15 text-white/80 hover:text-white hover:border-white/30"
              >
                Tarifs
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-white/60 text-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} ArtisansFlow — Tous droits réservés</p>
          <div className="flex items-center gap-5">
            <a href="#features" className="hover:text-white">Fonctionnalités</a>
            <a href="#pricing" className="hover:text-white">Tarifs</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
