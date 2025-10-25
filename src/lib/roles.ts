export type UserRole = "BASIC" | "PRO" | "ULTIMATE" | "VIP" | "ADMIN";

export const ROLE_ORDER: UserRole[] = ["BASIC", "PRO", "ULTIMATE", "VIP", "ADMIN"];

export const ROLE_FEATURE_LIMIT: Record<UserRole, number> = {
  BASIC: 5,
  PRO: 15,
  ULTIMATE: 25,
  VIP: 25,
  ADMIN: Number.POSITIVE_INFINITY,
};

export const ROLE_LABEL: Record<UserRole, string> = {
  BASIC: "Basic",
  PRO: "Pro",
  ULTIMATE: "Ultimate",
  VIP: "VIP",
  ADMIN: "Admin",
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  BASIC: "Les fondations pour lancer ton activité.",
  PRO: "Automatisation avancée et suivi quotidien.",
  ULTIMATE: "L'expérience complète ArtisansFlow.",
  VIP: "Accompagnement premium et support prioritaire.",
  ADMIN: "Contrôle total et visibilité globale.",
};

export const FEATURE_KEYS = ["dashboard", "clients", "stats", "settings", "admin"] as const;
export type FeatureKey = (typeof FEATURE_KEYS)[number];

export const ROLE_ACCESS: Record<UserRole, FeatureKey[]> = {
  BASIC: ["dashboard", "clients"],
  PRO: ["dashboard", "clients", "stats"],
  ULTIMATE: ["dashboard", "clients", "stats", "settings"],
  VIP: ["dashboard", "clients", "stats", "settings"],
  ADMIN: [...FEATURE_KEYS],
};

export const ROLE_HOME_ROUTE: Record<UserRole, string> = {
  BASIC: "/dashboard",
  PRO: "/dashboard",
  ULTIMATE: "/dashboard",
  VIP: "/dashboard",
  ADMIN: "/admin",
};

export const normalizeRole = (raw?: string | null): UserRole => {
  if (!raw) return "BASIC";
  const upper = raw.toUpperCase();
  return ROLE_ORDER.includes(upper as UserRole) ? (upper as UserRole) : "BASIC";
};

export const determineHomeRoute = (role: UserRole | null | undefined) => {
  if (!role) return "/dashboard";
  return ROLE_HOME_ROUTE[role];
};

export const ROLE_TO_PLAN_FEATURES: Record<UserRole, string[]> = {
  BASIC: ["Gestion clients", "Tableau de bord", "Suivi devis", "Exports PDF", "Support standard"],
  PRO: [
    "Automations e-mails",
    "Suivi des encaissements",
    "Accès statistiques",
    "Equipe illimitée",
    "Support prioritaire",
    "Widgets marketing",
    "Étiquettes avancées",
    "Historique détaillé",
    "Tags dynamiques",
    "Segments intelligents",
    "Modèles illimités",
    "Exports CSV",
    "Notes collaboratives",
    "Pipeline Kanban",
    "Rappels automatiques",
  ],
  ULTIMATE: [
    "Toutes les features Pro",
    "Automations conditionnelles",
    "Signature électronique",
    "Portail client",
    "API privée",
    "Webhooks avancés",
    "Documents personnalisés",
    "Auth SSO",
    "Gestion multi-marques",
    "Stockage prioritaire",
    "Monitorings temps réel",
    "Rapports premium",
    "Chiffre d'affaires projeté",
    "Budgets récurrents",
    "Campagnes SMS",
    "Automations multi-espaces",
    "Token API illimité",
    "Assistance VIP",
    "Support 7/7",
    "Formation onboarding",
    "Roadmap prioritaire",
    "Données brutes",
    "Workflows multi-equipes",
    "Tableaux personnalisés",
    "Exports white-label",
  ],
  VIP: [
    "Toutes les features Ultimate",
    "Customer success dédié",
    "Sessions live mensuelles",
    "Kits marketing exclusifs",
    "Beta tests prioritaires",
    "Stratégie croissance sur mesure",
    "Audit trimestriel",
    "Ateliers privés",
    "Design system personnalisé",
    "Roadmap co-pilotée",
    "Accès anticipé aux apps",
    "Monitoring custom",
    "Coaching direction",
    "SLA horaire",
    "Données consolidées",
    "Tableaux multi-organisations",
    "Exports automatiques",
    "Connecteurs premium",
    "Ressources VIP",
    "Formations dédiées",
    "Support WhatsApp",
    "A/B testing illimité",
    "Revues stratégiques",
    "Compagnonnage C-Level",
    "Sandbox illimitée",
  ],
  ADMIN: ["Accès total", "Supervision utilisateurs", "Stats globales", "Exports CSV/PDF", "Gestion des dépenses"],
};
