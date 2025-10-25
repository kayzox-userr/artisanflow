import { ROLE_FEATURE_LIMIT, ROLE_LABEL, ROLE_TO_PLAN_FEATURES, type UserRole } from "./roles";

type StripePlan = {
  role: Extract<UserRole, "BASIC" | "PRO" | "ULTIMATE">;
  name: string;
  priceId: string;
  monthly: number;
  features: string[];
  featureLimit: number;
};

export const stripePlans: StripePlan[] = [
  {
    role: "BASIC",
    name: ROLE_LABEL.BASIC,
    priceId: "price_basic_artisansflow",
    monthly: 19,
    features: ROLE_TO_PLAN_FEATURES.BASIC,
    featureLimit: ROLE_FEATURE_LIMIT.BASIC,
  },
  {
    role: "PRO",
    name: ROLE_LABEL.PRO,
    priceId: "price_pro_artisansflow",
    monthly: 49,
    features: ROLE_TO_PLAN_FEATURES.PRO,
    featureLimit: ROLE_FEATURE_LIMIT.PRO,
  },
  {
    role: "ULTIMATE",
    name: ROLE_LABEL.ULTIMATE,
    priceId: "price_ultimate_artisansflow",
    monthly: 119,
    features: ROLE_TO_PLAN_FEATURES.ULTIMATE,
    featureLimit: ROLE_FEATURE_LIMIT.ULTIMATE,
  },
];

export const getPlanByRole = (role: UserRole) =>
  stripePlans.find((plan) => plan.role === role) ?? stripePlans[0];

export const availableSignupPlans = stripePlans.map((plan) => ({
  value: plan.role,
  label: plan.name,
  price: plan.monthly,
  description: ROLE_TO_PLAN_FEATURES[plan.role][0],
}));
