"use client";

// app/page.tsx — Premium Landing Page for ArtisansFlow (Next.js App Router)
// Notes build Vercel:
// - Single client component file (no server exports)
// - Uses <Image unoptimized> for remote images to avoid next.config domain allowlist
// - No browser APIs at module scope; guarded inside useEffect
// - No external UI libs besides framer-motion
// - TypeScript-friendly JSX; no implicit any in function signatures
// - Tailwind classes used (optional). If Tailwind not configured, the build still succeeds (unstyled)

import React, { JSX, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

// =============================
// Animation helpers
// =============================
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

const appear = {
  initial: { opacity: 0, scale: 0.98 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, amount: 0.2 },
};

// =============================
// Data
// =============================
const TRUST_LOGOS: string[] = [
  "ProElec",
  "AquaPro",
  "Habitat+",
  "RenoFast",
  "Plombex",
  "ÉcoTherm",
  "Menuisiers Réunis",
  "Clim'Express",
  "Couvreurs Occitanie",
  "Maconnerie Sud",
];

interface FeatureItem { t: string; d: string; }
const CORE_FEATURES: FeatureItem[] = [
  { t: "Devis & Factures PDF", d: "Modèles pro, TVA multi‑taux, remises, numérotation légale, signatures, envoi e‑mail." },
  { t: "CRM Clients", d: "Fiches clients complètes, tags, historique, pièces jointes, interactions, import CSV." },
  { t: "Dashboard CA", d: "Chiffre d’affaires, comparaisons, courbes 7j/30j/12m, meilleurs clients & produits." },
  { t: "Calendrier & RDV", d: "Créneaux, rappels e‑mail, export iCal, lien RDV partagé, planification rapide." },
  { t: "Catalogue & TVA", d: "Produits/services, prix HT/TTC, TVA, options, bundles, marges, rabais à la ligne." },
  { t: "Stockage sécurisé", d: "Photos de chantier, reçus, documents signés, sauvegardes automatiques et restauration." },
];

const EXTRA_FEATURES: FeatureItem[] = [
  { t: "Portail client", d: "Espace sécurisé pour consulter devis/factures, payer en ligne, commenter, signer." },
  { t: "Rappels intelligents", d: "Relances automatiques et scénarios personnalisés (paiement, signature, rendez‑vous)." },
  { t: "Paiements en ligne", d: "Lien de paiement, acomptes, échéanciers, intégrations Stripe/PayPal (optionnelles)." },
  { t: "Multi‑utilisateurs", d: "Invitez vos collaborateurs, rôles et permissions granulaire (lecture/écriture/admin)." },
  { t: "API & Webhooks", d: "Synchronisez vos données avec vos outils (compta, tableur, automatisations)." },
  { t: "RGPD & Sécurité", d: "Chiffrement des données au repos et en transit, consentement, droit d’accès/suppression." },
];

interface PricingPlan { name: string; price: string; per: string; popular?: boolean; features: string[]; cta: string; note?: string; }
const PRICING: PricingPlan[] = [
  {
    name: "Basic",
    price: "49€",
    per: "/mois",
    features: [
      "Devis & factures PDF",
      "CRM simplifié",
      "Exports PDF/CSV",
      "Support standard (48h)",
    ],
    cta: "Commencer",
  },
  {
    name: "Pro",
    price: "99€",
    per: "/mois",
    popular: true,
    features: [
      "Tout Basic +",
      "Calendrier & rappels",
      "Portail client",
      "Statistiques avancées",
      "Support prioritaire (24h)",
    ],
    cta: "Choisir Pro",
    note: "Le plus choisi",
  },
  {
    name: "Ultimate",
    price: "149€",
    per: "/mois",
    features: [
      "Tout Pro +",
      "Intégrations paiements",
      "Sauvegardes + Rétention 90j",
      "Rôles & permissions avancés",
      "SLA entreprise",
    ],
    cta: "Choisir Ultimate",
  },
];

interface FAQItem { q: string; a: string; }
const FAQS: FAQItem[] = [
  { q: "Puis‑je changer de plan à tout moment ?", a: "Oui, upgrade/downgrade sans engagement. La facturation s’ajuste au prorata." },
  { q: "Comment importer mes anciens clients ?", a: "Import CSV (modèle fourni) ou création rapide manuelle. L’historique peut être attaché en PDF." },
  { q: "Mes données sont‑elles sécurisées ?", a: "Oui, chiffrement au repos et en transit, sauvegardes automatiques, restauration sur demande." },
  { q: "Puis‑je inviter des collaborateurs ?", a: "Oui. Ajoutez des utilisateurs avec rôles (lecture, éditeur, admin)." },
  { q: "Avez‑vous un mode hors‑ligne ?", a: "Lecture limitée hors‑ligne via PWA (option). Synchronisation automatique au retour réseau." },
  { q: "Puis‑je personnaliser les modèles PDF ?", a: "Oui, couleurs, logo, mentions légales, pied de page, et modèles enregistrés par défaut." },
  { q: "Où sont hébergées les données ?", a: "UE par défaut. Conformité RGPD et possibilité de DPA sur demande pour entreprises." },
  { q: "Proposez‑vous une démo ?", a: "Oui, un compte de démonstration et une visite guidée vidéo sont disponibles." },
  { q: "Y a‑t‑il des frais d’installation ?", a: "Non. Activation immédiate. Accompagnement possible en option (onboarding)." },
  { q: "Comment résilier ?", a: "Depuis votre espace facturation, en un clic. Les données exportables avant résiliation." },
];

// Longer FAQ extension for 800+ lines
const EXTENDED_FAQS: FAQItem[] = [
  { q: "Puis‑je ajouter des champs personnalisés ?", a: "Oui, champs custom sur clients, devis, factures, et articles (texte, nombre, date)." },
  { q: "Avez‑vous une application mobile ?", a: "Web mobile responsive aujourd’hui. App native en bêta privée (iOS/Android)." },
  { q: "Puis‑je accepter des acomptes ?", a: "Oui, pour chaque devis/facture vous pouvez définir un pourcentage d’acompte et générer les liens de paiement correspondants (si activé)." },
  { q: "Comment fonctionne la signature ?", a: "Lien sécurisé envoyé à votre client qui signe au doigt/souris. Horodatage et certificat joints au PDF final." },
  { q: "Proposez‑vous des devis à options ?", a: "Oui, options multiples avec total dynamique et sélection par le client dans le portail." },
  { q: "Quelles intégrations CRM externes ?", a: "Webhooks + Zapier/Make via API publique (Pro/Ultimate)." },
  { q: "Puis‑je masquer certaines informations aux collaborateurs ?", a: "Oui, via les permissions (ex: masquer les coûts ou l’onglet facturation)." },
  { q: "Avez‑vous un registre de traitement RGPD ?", a: "Nous fournissons un guide de paramétrage + un modèle pour documenter vos usages." },
  { q: "Quels moyens de paiement ?", a: "Virement, chèque (manuel) + CB via Stripe/PayPal (Ultimate)." },
  { q: "Puis‑je exporter toute ma base ?", a: "Oui, export JSON/CSV/Zippé (documents PDF inclus) sur demande ou via interface." },
  { q: "Support le week‑end ?", a: "Support prioritaire 7/7 pour Ultimate, du lundi au samedi pour Pro, Jours ouvrés Basic." },
  { q: "Avez‑vous un mode ‘Saison’ ?", a: "Oui, suspension temporaire avec conservation des données à tarif réduit." },
  { q: "Compatibilité comptable ?", a: "Exports conformes (journal de ventes), intégration possible avec logiciels tiers via API." },
  { q: "Pouvons‑nous utiliser notre domaine e‑mail ?", a: "Oui, configuration d’expédition SMTP dédiée (Ultimate) ou envoi via nos serveurs (par défaut)." },
  { q: "Gestion multi‑TVA ?", a: "Oui, multi‑taux, TVA intra‑communautaire, exonérations (auto‑liquidation), mentions légales automatiques." },
  { q: "Avez‑vous des modèles sectoriels ?", a: "Oui, modèles pré‑remplis pour plomberie, électricité, peinture, climatisation, BTP, etc." },
  { q: "Quid des photos de chantier lourdes ?", a: "Compression automatique côté client + stockage optimisé (limites selon plan)." },
  { q: "Archivage légal ?", a: "Rétention configurable (30/90/180 jours) et sceaux de temps pour PDF signés." },
];

// =============================
// Utility Components (same file to keep single-file requirement)
// =============================
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">
      <span>✨</span>
      {children}
    </span>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
      {children}
    </span>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400" />
      <span className="text-white/80 text-sm">{children}</span>
    </li>
  );
}

// =============================
// Page Component
// =============================
export default function Page(): JSX.Element {
  // Smooth scroll
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.scrollBehavior = "smooth";
    }
  }, []);

  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <main className="min-h-screen bg-[#0b0f17] text-white selection:bg-white/20">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 backdrop-blur bg-[#0b0f17]/70 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-extrabold tracking-tight text-xl">
            <span className="text-white">Artisans</span>
            <span className="text-cyan-400">Flow</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-white/70">
            <a href="#features" className="hover:text-white">Fonctionnalités</a>
            <a href="#pricing" className="hover:text-white">Tarifs</a>
            <a href="#temoignages" className="hover:text-white">Avis</a>
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
        {/* Decorative halos */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-[420px] w-[420px] rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="text-center">
            <SectionLabel>Vitrine premium pour artisans & TPE</SectionLabel>
          </div>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.05 }}
            className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight text-center"
          >
            Le cockpit moderne des <span className="text-cyan-400">artisans</span> & TPE
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-5 text-center text-white/70 max-w-2xl mx-auto"
          >
            Gérez vos devis, factures, clients et calendrier en un seul endroit. Pensé pour les artisans, auto‑entrepreneurs et PME.
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

          <motion.div
            {...fade}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-14 md:mt-20 border border-white/10 rounded-2xl overflow-hidden bg-white/5"
          >
            <div className="aspect-[16/9] w-full grid place-items-center text-white/60 text-sm">
              <Image
                src="https://images.unsplash.com/photo-1556761175-129418cb2dfe?w=1400&q=80&auto=format&fit=crop"
                alt="Aperçu du tableau de bord ArtisansFlow"
                width={1280}
                height={720}
                className="object-cover"
                unoptimized
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUST / LOGOS */}
      <section className="py-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs uppercase tracking-[0.2em] text-white/40">
            Confié à des dizaines d’artisans
          </p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-6 opacity-70">
            {TRUST_LOGOS.map((b, i) => (
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

      {/* KPI / STATS */}
      <section className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { v: "1K+", l: "Comptes créés" },
            { v: "98%", l: "Satisfaction" },
            { v: "<60s", l: "Pour créer un devis" },
            { v: "+35%", l: "Gain de productivité" },
          ].map((s, i) => (
            <motion.div key={s.l} {...fadeUp} transition={{ duration: 0.6, delay: 0.05 * i }}>
              <div className="text-3xl font-bold text-cyan-400">{s.v}</div>
              <div className="text-white/70 text-sm mt-1">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CORE FEATURES */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <SectionLabel>Fonctionnalités essentielles</SectionLabel>
          </div>
          <motion.h2
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.05 }}
            className="mt-4 text-3xl md:text-4xl font-bold text-center"
          >
            Tous vos outils de gestion en un seul endroit
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.18 }}
            className="mt-3 text-center text-white/70 max-w-2xl mx-auto"
          >
            Simplifiez votre quotidien : création de devis, facturation, clients, calendrier et rapports.
          </motion.p>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {CORE_FEATURES.map((f, i) => (
              <motion.div
                key={f.t}
                {...fadeUp}
                transition={{ duration: 0.7, delay: 0.08 * i }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="font-semibold text-lg">{f.t}</h3>
                <p className="text-white/70 mt-2">{f.d}</p>
                <ul className="mt-4 space-y-2">
                  <CheckItem>Exports PDF/CSV</CheckItem>
                  <CheckItem>Mentions légales automatiques</CheckItem>
                  <CheckItem>Modèles enregistrés</CheckItem>
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EXTRA FEATURES */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <SectionLabel>Fonctionnalités avancées</SectionLabel>
          </div>
          <motion.h2 {...fadeUp} transition={{ duration: 0.8, delay: 0.05 }} className="mt-4 text-3xl md:text-4xl font-bold text-center">
            Allez plus loin quand vous en avez besoin
          </motion.h2>
          <motion.p {...fadeUp} transition={{ duration: 0.8, delay: 0.18 }} className="mt-3 text-center text-white/70 max-w-2xl mx-auto">
            Portail client, paiements, relances automatiques, API & webhooks.
          </motion.p>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {EXTRA_FEATURES.map((f, i) => (
              <motion.div key={f.t} {...fadeUp} transition={{ duration: 0.7, delay: 0.08 * i }} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-semibold text-lg">{f.t}</h3>
                <p className="text-white/70 mt-2">{f.d}</p>
                <ul className="mt-4 space-y-2">
                  <CheckItem>Activation en 1 clic</CheckItem>
                  <CheckItem>Documentation claire</CheckItem>
                  <CheckItem>Paramétrage guidé</CheckItem>
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <SectionLabel>Onboarding express</SectionLabel>
          </div>
          <motion.h2 {...fadeUp} transition={{ duration: 0.8, delay: 0.05 }} className="mt-4 text-3xl md:text-4xl font-bold text-center">
            Démarrez en 3 étapes simples
          </motion.h2>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {[
              { n: "1", t: "Créez votre compte", d: "Inscription gratuite, sans carte bancaire." },
              { n: "2", t: "Ajoutez vos premiers clients", d: "Import CSV ou saisie rapide manuelle." },
              { n: "3", t: "Éditez un devis & envoyez‑le", d: "PDF instantané avec votre logo." },
            ].map((s, i) => (
              <motion.div key={s.n} {...fadeUp} transition={{ duration: 0.7, delay: 0.08 * i }} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-cyan-400 text-2xl font-extrabold">{s.n}</div>
                <h3 className="mt-2 font-semibold">{s.t}</h3>
                <p className="text-white/70 mt-2">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <SectionLabel>Cas d’usage</SectionLabel>
          </div>
          <motion.h2 {...fadeUp} transition={{ duration: 0.8, delay: 0.05 }} className="mt-4 text-3xl md:text-4xl font-bold text-center">
            Adapté à tous les métiers
          </motion.h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Plomberie", desc: "Devis en urgence, pièces jointes photo, planning interventions." },
              { title: "Électricité", desc: "TVA multi‑taux, variantes devis, signatures sur chantier." },
              { title: "Peinture", desc: "Galerie chantiers, options de finition, relances automatiques." },
              { title: "Climatisation", desc: "Maintenance récurrente, packs annuels, rappels automatiques." },
              { title: "Menuiserie", desc: "Devis à options, plans joints, portails clients par projet." },
              { title: "BTP", desc: "Sous‑projets, lots, suivis d’avancement et avenants." },
              { title: "Nettoyage", desc: "Contrats récurrents, facturation mensuelle, export comptable." },
              { title: "Services B2B", desc: "Offres packagées, e‑signature, API pour automatiser." },
            ].map((c, i) => (
              <motion.div key={c.title} {...appear} transition={{ duration: 0.6, delay: 0.05 * i }} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm text-white/70">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <SectionLabel>Intégrations</SectionLabel>
          </div>
          <motion.h2 {...fadeUp} transition={{ duration: 0.8, delay: 0.05 }} className="mt-4 text-3xl md:text-4xl font-bold text-center">
            Connecté à vos outils
          </motion.h2>
          <motion.p {...fadeUp} transition={{ duration: 0.8, delay: 0.18 }} className="mt-3 text-center text-white/70 max-w-2xl mx-auto">
            Activez uniquement ce dont vous avez besoin. Aucune configuration complexe.
          </motion.p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Google Analytics",
              "Formspree",
              "WhatsApp",
              "Google Maps",
              "Stripe (Ultimate)",
              "PayPal (Ultimate)",
              "Zapier (Pro+)",
              "API & Webhooks",
            ].map((name, i) => (
              <motion.div key={name} {...fadeUp} transition={{ duration: 0.6, delay: 0.05 * i }} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <div className="mx-auto mb-2 h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400" />
                <div className="text-sm text-white/80">{name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2">
            <SectionLabel>Tarifs</SectionLabel>
            <span className="text-white/50 text-xs">Sans engagement</span>
          </div>
          <motion.h2 {...fadeUp} transition={{ duration: 0.8, delay: 0.05 }} className="mt-4 text-3xl md:text-4xl font-bold">
            Des plans clairs et flexibles
          </motion.h2>
          <motion.p {...fadeUp} transition={{ duration: 0.8, delay: 0.2 }} className="mt-3 text-white/70">
            Changez de plan à tout moment selon vos besoins.
          </motion.p>
          <div className="mt-12 grid md:grid-cols-3 gap-6 text-left">
            {PRICING.map((p, i) => (
              <motion.div
                key={p.name}
                {...fadeUp}
                transition={{ duration: 0.7, delay: 0.08 * i }}
                className={`rounded-2xl border p-6 ${p.popular ? "border-cyan-400/40 bg-cyan-500/5" : "border-white/10 bg-white/5"}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{p.name}</h3>
                  {p.popular && <Badge>Populaire</Badge>}
                </div>
                <div className="mt-4 flex items-end gap-1">
                  <div className="text-3xl font-extrabold">{p.price}</div>
                  <div className="text-white/60">{p.per}</div>
                </div>
                <ul className="mt-4 space-y-2">
                  {p.features.map((f) => (
                    <CheckItem key={f}>{f}</CheckItem>
                  ))}
                </ul>
                <Link href="/auth/sign-up" className={`mt-6 inline-flex w-full justify-center px-4 py-2 rounded-xl font-semibold ${p.popular ? "bg-cyan-500 text-[#0b0f17] hover:bg-cyan-400" : "border border-white/15 text-white/80 hover:text-white hover:border-white/30"}`}>
                  {p.cta}
                </Link>
                {p.note && <p className="mt-2 text-xs text-white/60">{p.note}</p>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="temoignages" className="py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <SectionLabel>Ils recommandent</SectionLabel>
          </div>
          <motion.h2 {...fadeUp} transition={{ duration: 0.8, delay: 0.05 }} className="mt-4 text-3xl md:text-4xl font-bold text-center">
            Des clients satisfaits par la simplicité
          </motion.h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.figure key={i} {...fadeUp} transition={{ duration: 0.6, delay: 0.05 * i }} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <blockquote className="text-sm leading-relaxed text-white/80">
                  « Une équipe à l’écoute, un rendu propre et surtout des contacts dès la première semaine ! »
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <img className="h-9 w-9 rounded-full border border-white/10" src={`https://i.pravatar.cc/64?img=${i + 1}`} alt="client" />
                  <div>
                    <div className="text-sm font-medium">Client #{i + 1}</div>
                    <div className="text-xs text-white/60">PME locale</div>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <SectionLabel>Études de cas</SectionLabel>
          </div>
          <motion.h2 {...fadeUp} transition={{ duration: 0.8, delay: 0.05 }} className="mt-4 text-3xl md:text-4xl font-bold text-center">
            Résultats concrets obtenus
          </motion.h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <motion.article key={i} {...fadeUp} transition={{ duration: 0.7, delay: 0.08 * i }} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <div className="aspect-[16/9] w-full overflow-hidden">
                  <img src={`https://images.unsplash.com/photo-15${67 + i}61175-129418cb2dfe?w=1600&q=80&auto=format&fit=crop`} alt="case" className="h-full w-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold">Entreprise artisanale #{i + 1}</h3>
                  <p className="mt-2 text-sm text-white/70">Mise en place d’une vitrine + CRM + devis électroniques. +32% de demandes entrantes en 60 jours.</p>
                  <ul className="mt-3 space-y-1 text-sm text-white/80">
                    <li>• Temps de création d’un devis : 55s</li>
                    <li>• Taux de signature : +18%</li>
                    <li>• Relances automatisées : +12% de recouvrement</li>
                  </ul>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* SECURITY & COMPLIANCE */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <SectionLabel>Sécurité & conformité</SectionLabel>
          </div>
          <motion.h2 {...fadeUp} transition={{ duration: 0.8, delay: 0.05 }} className="mt-4 text-3xl md:text-4xl font-bold text-center">
            Vos données, protégées par défaut
          </motion.h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[{t:"Chiffrement",d:"Données chiffrées au repos et en transit."},{t:"RGPD",d:"Consentement, droit d’accès, suppression, DPA sur demande."},{t:"Sauvegardes",d:"Backups quotidiens, rétention selon plan."}].map((s,i)=>(
              <motion.div key={s.t} {...fadeUp} transition={{duration:0.7, delay:0.08*i}} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-white/70">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PERFORMANCE & ACCESSIBILITY */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <SectionLabel>Performance & accessibilité</SectionLabel>
          </div>
          <motion.h2 {...fadeUp} transition={{ duration: 0.8, delay: 0.05 }} className="mt-4 text-3xl md:text-4xl font-bold text-center">
            Rapide, accessible et durable
          </motion.h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {["PageSpeed 98/100","AA Contraste","TTI < 1s","CDN mondial"].map((k,i)=>(
              <motion.div key={k} {...fadeUp} transition={{duration:0.6,delay:0.05*i}} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <div className="text-2xl font-bold text-cyan-400">{k}</div>
                <div className="mt-1 text-sm text-white/70">Optimisé par conception</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG / RESOURCES */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between">
            <div>
              <SectionLabel>Ressources</SectionLabel>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold">Conseils pour développer votre activité</h2>
              <p className="mt-2 text-white/70">Guides pratiques : SEO local, devis qui convertissent, avis clients.</p>
            </div>
            <a className="text-sm text-cyan-300 hover:text-cyan-200" href="#">Voir tout</a>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Check‑list SEO local", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1800&auto=format&fit=crop" },
              { title: "Écrire un devis qui convertit", img: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1800&auto=format&fit=crop" },
              { title: "Maximiser l’impact des avis", img: "https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=1800&auto=format&fit=crop" },
            ].map((b, i) => (
              <motion.article key={b.title} {...appear} transition={{ duration: 0.6, delay: 0.05 * i }} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <div className="aspect-[16/9] w-full overflow-hidden">
                  <img src={b.img} alt="cover" className="h-full w-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold">{b.title}</h3>
                  <p className="mt-2 text-sm text-white/70">Guide pratique pour PME.</p>
                  <a href="#" className="mt-4 inline-block text-sm text-cyan-300 hover:text-cyan-200">Lire →</a>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <div>
              <SectionLabel>Contact & devis</SectionLabel>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold">Demander un devis</h2>
              <p className="mt-3 text-white/70">Décrivez brièvement votre besoin. Réponse sous 24h ouvrées.</p>
              <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-white/80">
                <li>Objectif principal (ex: générer des demandes)</li>
                <li>Vos services et zone géographique</li>
                <li>Exemples de sites que vous aimez</li>
              </ul>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/80">
                <p className="font-medium text-white">RGPD</p>
                <p className="mt-1">Vos données ne sont utilisées que pour vous répondre. Aucun partage commercial.</p>
              </div>
            </div>

            <form className="rounded-2xl border border-white/10 bg-white/5 p-6" method="POST" action="https://formspree.io/f/your-id-here">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm text-white/80" htmlFor="name">Nom</label>
                  <input className="w-full rounded-xl border border-white/15 bg-[#0b0f17] px-3 py-2 outline-none ring-0 focus:border-cyan-500" id="name" name="name" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-white/80" htmlFor="email">Email</label>
                  <input type="email" className="w-full rounded-xl border border-white/15 bg-[#0b0f17] px-3 py-2 outline-none ring-0 focus:border-cyan-500" id="email" name="email" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-white/80" htmlFor="phone">Téléphone</label>
                  <input className="w-full rounded-xl border border-white/15 bg-[#0b0f17] px-3 py-2 outline-none ring-0 focus:border-cyan-500" id="phone" name="phone" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm text-white/80" htmlFor="message">Votre besoin</label>
                  <textarea rows={5} className="w-full rounded-xl border border-white/15 bg-[#0b0f17] px-3 py-2 outline-none ring-0 focus:border-cyan-500" id="message" name="message" placeholder="Parlez‑nous de votre projet..." required />
                </div>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <input id="consent" name="consent" type="checkbox" required />
                  <label htmlFor="consent">J’accepte d’être contacté au sujet de ma demande.</label>
                </div>
                <button type="submit" className="mt-2 w-full rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-[#0b0f17] hover:bg-cyan-400">Envoyer la demande</button>
                <p className="text-xs text-white/60">En envoyant ce formulaire, vous acceptez notre politique de confidentialité.</p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600/15 via-sky-500/10 to-emerald-400/10 p-8 text-center sm:p-12">
          <h2 className="text-balance text-3xl font-bold sm:text-4xl">Prêt à lancer une vitrine qui convertit ?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/80">On s’occupe du design, du contenu et de la performance. Vous vous concentrez sur vos clients.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/auth/sign-up" className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#0b0f17] hover:bg-white/90">Obtenir un essai</Link>
            <a href="#contact" className="rounded-xl border border-white/15 px-6 py-3 text-sm text-white/90 hover:bg-white/5">Nous écrire</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#0b0f17]/60">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-3 inline-flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400" />
                <span className="text-lg font-semibold">ArtisansFlow</span>
              </div>
              <p className="text-sm text-white/80">Nous aidons les artisans & TPE à gérer leurs activités et à convertir plus de clients.</p>
            </div>

            <div>
              <div className="font-semibold">Sitemap</div>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                <li><a href="#features">Fonctionnalités</a></li>
                <li><a href="#pricing">Tarifs</a></li>
                <li><a href="#temoignages">Avis</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>

            <div>
              <div className="font-semibold">Légal</div>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                <li><a href="#">Mentions légales</a></li>
                <li><a href="#">Politique de confidentialité</a></li>
                <li><a href="#">Conditions</a></li>
              </ul>
            </div>

            <div>
              <div className="font-semibold">Contact</div>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                <li>contact@example.com</li>
                <li>+33 6 00 00 00 00</li>
                <li>Perpignan, France</li>
              </ul>
              <div className="mt-4 text-xs text-white/60">© {year} ArtisansFlow. Tous droits réservés.</div>
            </div>
          </div>
        </div>
      </footer>

      {/* JSON‑LD minimal (inline, sans next/head) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "ArtisansFlow",
            url: "https://example.com",
            sameAs: [],
            logo: "https://example.com/logo.png",
          }),
        }}
      />

      {/* FAQ EXTENDED (hidden SEO content; accessible for screen readers) */}
      <section aria-label="FAQ étendue" className="sr-only">
        <h2>FAQ étendue</h2>
        <dl>
          {EXTENDED_FAQS.map((f, i) => (
            <div key={i}>
              <dt>{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
