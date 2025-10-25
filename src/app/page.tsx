"use client";

import Link from "next/link";
import React, { useMemo, useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionProps,
} from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Calendar,
  Mail,
  Shield,
  PieChart,
  CreditCard,
  Sparkles,
  Users,
  Star,
  HeartHandshake,
  TrendingUp,
} from "lucide-react";

/* ===========================
   ANIMATIONS UTILITAIRES
=========================== */
const fadeUp = (customDelay?: number): MotionProps => {
  const d = customDelay ?? 0.2;

  return {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: d },
    viewport: { once: true, amount: 0.2 },
  };
};

/* ===========================
   COMPOSANT TILT (3D hover)
=========================== */
function TiltCard({
  children,
  className = "",
  intensity = 12, // degré d'inclinaison max
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState<string>("perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)");

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    const rx = (py - 0.5) * -2 * intensity; // -intensity..intensity
    const ry = (px - 0.5) * 2 * intensity;
    setTransform(`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`);
  }

  function onMouseLeave() {
    setTransform("perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)");
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ transform, transformStyle: "preserve-3d", willChange: "transform" }}
      className={className}
    >
      {children}
    </div>
  );
}

/* ===========================
   PAGE
=========================== */
export default function LandingPage() {
  /* Mini calculateur de ROI */
  const [hourlyRate, setHourlyRate] = useState(50);
  const [quotesPerWeek, setQuotesPerWeek] = useState(6);
  const [timeSavedPerQuote, setTimeSavedPerQuote] = useState(20);

  const monthlyROI = useMemo(() => {
    const minutesSavedMonth = quotesPerWeek * 4 * timeSavedPerQuote;
    const hoursSavedMonth = minutesSavedMonth / 60;
    return Math.round(hoursSavedMonth * hourlyRate);
  }, [hourlyRate, quotesPerWeek, timeSavedPerQuote]);

  /* Parallaxe au scroll (halos & léger tilt global) */
  const { scrollY } = useScroll();
  const haloY1 = useSpring(useTransform(scrollY, [0, 600], [0, 120]), {
    stiffness: 50,
    damping: 20,
  });
  const haloY2 = useSpring(useTransform(scrollY, [0, 600], [0, -140]), {
    stiffness: 50,
    damping: 20,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white relative overflow-hidden">
      {/* HALOS PARALLAXE */}
      <motion.div
        style={{ y: haloY1 }}
        className="pointer-events-none absolute -top-20 -left-24 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"
      />
      <motion.div
        style={{ y: haloY2 }}
        className="pointer-events-none absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-cyan-500/10 blur-3xl"
      />

      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/5 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold">
            Artisans<span className="text-blue-500">Flow</span>
          </Link>
          <nav className="flex items-center gap-6">
            <a href="#why" className="text-white/80 hover:text-white">
              Pourquoi
            </a>
            <a href="#features" className="text-white/80 hover:text-white">
              Fonctionnalités
            </a>
            <a href="#pricing" className="text-white/80 hover:text-white">
              Tarifs
            </a>
            <a href="#faq" className="text-white/80 hover:text-white">
              FAQ
            </a>
            <Link href="/auth/sign-in" className="text-white/90 hover:text-white">
              Se connecter
            </Link>
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-700 transition"
            >
              Créer un compte <ArrowRight size={18} />
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <motion.section {...fadeUp(0)} className="mx-auto max-w-6xl px-6 pt-20 pb-24 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
          Simplifiez votre gestion. <br />
          <span className="text-blue-400">Gagnez du temps, encaissez plus vite.</span>
        </h1>
        <motion.p
          {...fadeUp(0.15)}
          className="mt-5 text-lg md:text-xl text-white/80 max-w-3xl mx-auto"
        >
          ArtisansFlow automatise vos devis, factures, relances et suivi client.
          Un seul outil pour tout gérer, même sans être expert en informatique.
        </motion.p>
        <motion.div {...fadeUp(0.3)} className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/auth/sign-up"
            className="rounded-xl bg-blue-600 px-8 py-3 text-lg font-semibold hover:bg-blue-700 transition"
          >
            Commencer gratuitement
          </Link>
          <a
            href="#why"
            className="rounded-xl border border-white/20 px-8 py-3 text-lg font-semibold hover:border-white/40 transition"
          >
            Découvrir pourquoi
          </a>
        </motion.div>
        <motion.div
          {...fadeUp(0.45)}
          className="mt-8 flex items-center justify-center gap-6 text-sm text-white/70"
        >
          <div className="flex items-center gap-2">
            <Shield size={16} /> Données sécurisées (HTTPS, backups)
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={16} /> Prise en main &lt; 10 min
          </div>
          <div className="flex items-center gap-2">
            <CreditCard size={16} /> Sans engagement
          </div>
        </motion.div>
      </motion.section>

      {/* POURQUOI */}
      <motion.section id="why" {...fadeUp(0)} className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-10">Pourquoi choisir ArtisansFlow ?</h2>
        <div className="grid md:grid-cols-3 gap-8 text-left">
          {[
            {
              icon: Clock,
              title: "Vous gagnez du temps",
              desc: "Créez vos devis et factures en 2 minutes grâce à des modèles prêts à l’emploi.",
            },
            {
              icon: CreditCard,
              title: "Vous êtes payé plus vite",
              desc: "Relances automatiques, paiements en ligne sécurisés, et rappels de factures.",
            },
            {
              icon: Shield,
              title: "Vous travaillez en sécurité",
              desc: "Données sauvegardées, chiffrées et protégées sur des serveurs européens.",
            },
          ].map((item, i) => (
            <TiltCard key={i} className="will-change-transform">
              <motion.div
                {...fadeUp(0.05 * i)}
                className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center hover:border-blue-500/30 transition"
              >
                <item.icon size={36} className="text-blue-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                <p className="text-white/80">{item.desc}</p>
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </motion.section>

      {/* CHIFFRES CLÉS */}
      <motion.section {...fadeUp(0)} className="bg-blue-600/10 border-y border-blue-500/20 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6 text-center px-6">
          {[
            { label: "Artisans inscrits", value: "2 300+" },
            { label: "Devis créés / mois", value: "15 000+" },
            { label: "Temps économisé", value: "8h / semaine" },
            { label: "Satisfaction client", value: "98%" },
          ].map((s, i) => (
            <motion.div key={i} {...fadeUp(0.05 * i)}>
              <p className="text-4xl font-extrabold text-blue-400">{s.value}</p>
              <p className="text-white/70 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* FONCTIONNALITÉS DÉTAILLÉES */}
      <motion.section id="features" {...fadeUp(0)} className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-12">Chaque fonction apporte un gain concret</h2>
        <div className="grid md:grid-cols-3 gap-8 text-left">
          {[
            {
              icon: FileText,
              title: "Devis & Facturation",
              bullets: [
                "Modèles pro, TVA auto, numérotation légale",
                "Devis ⟶ facture en 1 clic",
                "PDF + envoi e-mail pro",
              ],
              payoff: "Vous paraissez pro, vous vendez plus vite.",
            },
            {
              icon: PieChart,
              title: "Tableau de bord",
              bullets: [
                "CA par mois, impayés, top clients",
                "Filtres par activité et période",
                "Aide à la décision rapide",
              ],
              payoff: "Vous savez où vous gagnez du temps et de l’argent.",
            },
            {
              icon: Calendar,
              title: "Calendrier & RDV",
              bullets: [
                "Planifiez chantiers/interventions",
                "Rappels automatiques (e-mail)",
                "Export ICS (Google/Apple)",
              ],
              payoff: "Moins d’oublis, meilleure organisation.",
            },
            {
              icon: Users,
              title: "Gestion clients",
              bullets: [
                "Coordonnées, historique, tags",
                "Pièces jointes (photos chantier)",
                "Recherche et filtres",
              ],
              payoff: "Tout au même endroit, accessible en 2 clics.",
            },
            {
              icon: Mail,
              title: "Relances automatiques",
              bullets: [
                "Devis en attente ⟶ rappel poli",
                "Factures impayées ⟶ relances programmées",
                "Templates personnalisables",
              ],
              payoff: "Vous êtes payé plus vite, sans y penser.",
            },
            {
              icon: Shield,
              title: "Sécurité & conformité",
              bullets: [
                "HTTPS, backups, contrôle d’accès",
                "Mentions légales & TVA conformes",
                "Export complet de vos données",
              ],
              payoff: "Tranquillité d’esprit + image pro.",
            },
          ].map((f, i) => (
            <TiltCard key={f.title}>
              <motion.div
                {...fadeUp(0.05 * i)}
                className="rounded-2xl bg-white/5 border border-white/10 p-6 hover:border-blue-500/30 transition h-full flex flex-col"
              >
                <div className="flex items-center gap-3 mb-3">
                  <f.icon className="text-blue-400" />
                  <h4 className="text-xl font-semibold">{f.title}</h4>
                </div>
                <ul className="space-y-2 text-white/85">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <CheckCircle2 size={18} className="mt-0.5 text-blue-400" /> {b}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-white/70 italic">→ {f.payoff}</p>
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </motion.section>

      {/* ROI */}
      <motion.section {...fadeUp(0)} className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-8">Voyez combien vous gagnez avec ArtisansFlow</h2>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="text-left">
            <p className="text-white/80 mb-6">
              En automatisant vos tâches, vous économisez du temps chaque semaine.
              Calculez vos gains estimés en euros.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-white/70">Tarif horaire (€/h)</label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="mt-1 w-full rounded-md bg-black/30 border border-white/20 px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-white/70">Devis / semaine</label>
                <input
                  type="number"
                  value={quotesPerWeek}
                  onChange={(e) => setQuotesPerWeek(Number(e.target.value))}
                  className="mt-1 w-full rounded-md bg-black/30 border border-white/20 px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-white/70">Temps économisé / devis (min)</label>
                <input
                  type="number"
                  value={timeSavedPerQuote}
                  onChange={(e) => setTimeSavedPerQuote(Number(e.target.value))}
                  className="mt-1 w-full rounded-md bg-black/30 border border-white/20 px-3 py-2"
                />
              </div>
            </div>
          </div>
          <TiltCard>
            <div className="rounded-xl bg-blue-600/10 border border-blue-500/30 p-8">
              <p className="text-white/70">Économie estimée / mois :</p>
              <p className="text-5xl font-extrabold text-blue-400 mt-2">{monthlyROI} €</p>
              <p className="text-white/70 mt-2 text-sm">
                (Souvent &gt; au prix de l’abonnement — vous y gagnez dès le 1er mois.)
              </p>
              <Link
                href="/auth/sign-up"
                className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 transition"
              >
                Tester gratuitement
              </Link>
            </div>
          </TiltCard>
        </div>
      </motion.section>

      {/* PROCESS 1-2-3 */}
      <motion.section {...fadeUp(0)} className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h3 className="text-3xl font-bold mb-10">Comment ça marche ?</h3>
        <div className="grid md:grid-cols-3 gap-8 text-left">
          {[
            { title: "1. Créez votre compte", desc: "Paramétrez TVA, logo, coordonnées en 5 minutes." },
            { title: "2. Ajoutez clients & catalogue", desc: "Créez vos clients, services/produits et tarifs." },
            { title: "3. Envoyez devis & factures", desc: "Suivez paiements, relancez automatiquement, analysez." },
          ].map((s, i) => (
            <TiltCard key={s.title}>
              <motion.div
                {...fadeUp(0.05 * i)}
                className="rounded-2xl bg-white/5 border border-white/10 p-6"
              >
                <div className="text-4xl font-extrabold text-blue-400/80">{i + 1}</div>
                <h4 className="mt-2 text-xl font-semibold">{s.title}</h4>
                <p className="mt-1 text-white/80">{s.desc}</p>
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </motion.section>

      {/* PREUVES SOCIALES */}
      <motion.section {...fadeUp(0)} className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h3 className="text-3xl font-bold mb-10">Ils gagnent du temps chaque semaine</h3>
        <div className="grid md:grid-cols-3 gap-8 text-left">
          {[
            { name: "Karim, électricien", quote: "Je fais mes devis en 3 min, et je suis payé plus vite qu’avant.", stars: 5 },
            { name: "Sonia, plombière", quote: "Les relances auto m’ont sauvé la vie. Moins d’impayés.", stars: 5 },
            { name: "Rachid, menuisier", quote: "Tout est centralisé. J’ai enfin une vision claire de mon CA.", stars: 5 },
          ].map((t, i) => (
            <TiltCard key={i}>
              <motion.div
                {...fadeUp(0.05 * i)}
                className="rounded-2xl bg-white/5 border border-white/10 p-6 h-full flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: t.stars }).map((_, k) => (
                      <Star key={k} size={16} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="italic text-white/85">&laquo; {t.quote} &raquo;</p>
                </div>
                <p className="mt-3 text-white/70 text-sm">— {t.name}</p>
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </motion.section>

      {/* TARIFS */}
      <motion.section id="pricing" {...fadeUp(0)} className="bg-white/5 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">Des tarifs simples, sans engagement</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              {
                name: "Basic",
                price: "49€ / mois",
                desc: "L’essentiel pour démarrer votre activité.",
                features: ["Devis et factures", "Clients illimités", "Support e-mail"],
                popular: false,
              },
              {
                name: "Pro",
                price: "99€ / mois",
                desc: "Le meilleur équilibre entre puissance et simplicité.",
                features: ["Tout Basic", "Relances auto", "Statistiques avancées", "Calendrier et rappels"],
                popular: true,
              },
              {
                name: "Ultimate",
                price: "149€ / mois",
                desc: "L’expérience complète avec support prioritaire.",
                features: ["Tout Pro", "Paiement en ligne", "Comptes multiples", "Support 24/7"],
                popular: false,
              },
            ].map((p, i) => (
              <TiltCard key={i}>
                <motion.div
                  {...fadeUp(0.05 * i)}
                  className={`rounded-2xl p-8 border ${
                    p.name === "Pro" ? "border-blue-500 bg-blue-600/10" : "border-white/10 bg-white/5"
                  } flex flex-col justify-between hover:border-blue-400/40 transition`}
                >
                  <div>
                    {p.name === "Pro" && (
                      <p className="text-xs text-blue-300 mb-2 font-semibold">⭐ Le plus populaire</p>
                    )}
                    <h3 className="text-2xl font-bold">{p.name}</h3>
                    <p className="text-blue-400 text-3xl font-extrabold mt-2">{p.price}</p>
                    <p className="text-white/70 mt-1">{p.desc}</p>
                    <ul className="mt-4 space-y-2 text-white/80">
                      {p.features.map((f) => (
                        <li key={f} className="flex gap-2">
                          <CheckCircle2 size={18} className="mt-0.5 text-blue-400" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href="/auth/sign-up"
                    className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-semibold bg-blue-600 hover:bg-blue-700 transition"
                  >
                    Choisir {p.name} <ArrowRight size={18} />
                  </Link>
                </motion.div>
              </TiltCard>
            ))}
          </div>
          <p className="text-center text-white/60 text-sm mt-4">
            Pas de frais cachés. Annulable à tout moment.
          </p>
        </div>
      </motion.section>

      {/* SECTION RASSURANTE */}
      <motion.section {...fadeUp(0)} className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-8">Un partenaire de confiance pour votre réussite</h2>
        <div className="grid md:grid-cols-3 gap-8 text-left">
          {[
            {
              icon: Shield,
              title: "Sécurité maximale",
              desc: "Vos données sont stockées sur des serveurs européens chiffrés. ArtisansFlow respecte le RGPD.",
            },
            {
              icon: HeartHandshake,
              title: "Support humain",
              desc: "Une équipe à taille humaine qui répond sous 24h. On parle votre langage, pas celui des robots.",
            },
            {
              icon: TrendingUp,
              title: "Évolutif et durable",
              desc: "Des mises à jour continues et de nouvelles fonctions chaque mois, sans coût caché.",
            },
          ].map((s, i) => (
            <TiltCard key={i}>
              <motion.div
                {...fadeUp(0.05 * i)}
                className="rounded-2xl bg-white/5 border border-white/10 p-8 hover:border-blue-400/30 transition h-full"
              >
                <s.icon size={36} className="text-blue-400 mb-4" />
                <h4 className="text-xl font-semibold mb-2">{s.title}</h4>
                <p className="text-white/80">{s.desc}</p>
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section id="faq" {...fadeUp(0)} className="mx-auto max-w-6xl px-6 py-20">
        <h3 className="text-3xl font-bold text-center mb-12">Questions fréquentes</h3>
        <div className="grid md:grid-cols-2 gap-8 text-left">
          {[
            {
              q: "Est-ce compliqué à prendre en main ?",
              a: "Non. Interface simple et guidée, pensée pour le terrain. Aucune compétence technique nécessaire.",
            },
            {
              q: "Et côté légal (TVA, numérotation) ?",
              a: "Numérotation séquentielle, TVA configurable, mentions conformes. Les erreurs appartiennent au passé.",
            },
            {
              q: "Mes données sont-elles en sécurité ?",
              a: "Oui. HTTPS, sauvegardes, contrôle d’accès. Vos données vous appartiennent et restent exportables.",
            },
            {
              q: "Puis-je arrêter quand je veux ?",
              a: "Oui, sans engagement. Exportez vos données en un clic et résiliez librement.",
            },
          ].map((item, i) => (
            <TiltCard key={i}>
              <motion.div
                {...fadeUp(0.05 * i)}
                className="rounded-xl bg-white/5 border border-white/10 p-6"
              >
                <p className="font-semibold">{item.q}</p>
                <p className="text-white/75 mt-1">{item.a}</p>
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </motion.section>

      {/* CTA FINAL */}
      <motion.section {...fadeUp(0)} className="mx-auto max-w-6xl px-6 pb-20 text-center">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border border-blue-500/30 p-10">
          <h3 className="text-3xl font-extrabold">Rejoignez des centaines d’artisans satisfaits</h3>
          <p className="text-white/80 mt-2">
            Essayez gratuitement ArtisansFlow et transformez votre manière de travailler.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <Link
              href="/auth/sign-up"
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 transition"
            >
              Créer mon compte
            </Link>
            <Link
              href="/auth/sign-in"
              className="rounded-xl border border-white/20 px-6 py-3 font-semibold hover:border-white/40 transition"
            >
              J’ai déjà un compte
            </Link>
          </div>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-white/5">
        <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-white/60 flex flex-col md:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} ArtisansFlow — Tous droits réservés</p>
          <div className="flex gap-4">
            <Link href="#why" className="hover:text-white transition">
              Pourquoi
            </Link>
            <Link href="#features" className="hover:text-white transition">
              Fonctionnalités
            </Link>
            <Link href="#pricing" className="hover:text-white transition">
              Tarifs
            </Link>
            <Link href="#faq" className="hover:text-white transition">
              FAQ
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
