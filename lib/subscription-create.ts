import dayjs from "dayjs";
import type { ImageSourcePropType } from "react-native";

import { icons, type IconKey } from "@/constants/icons";

export type SubscriptionFrequency = "Mensuel" | "Annuel";

export const SUBSCRIPTION_FREQUENCIES: SubscriptionFrequency[] = [
  "Mensuel",
  "Annuel",
];

export const SUBSCRIPTION_CATEGORIES = [
  "Design",
  "Outils dev",
  "IA",
  "Divertissement",
  "Productivité",
  "Autre",
] as const;

export type SubscriptionCategory = (typeof SUBSCRIPTION_CATEGORIES)[number];

const CATEGORY_COLORS: Record<SubscriptionCategory, string> = {
  Design: "#f5c542",
  "Outils dev": "#e8def8",
  IA: "#b8d4e3",
  Divertissement: "#ffb4a2",
  Productivité: "#b8e8d0",
  Autre: "#d4d4d8",
};

/** Clé = nom normalisé (minuscules, sans espaces ni ponctuation). */
const EXACT_NAME_ICON: Record<string, IconKey> = {
  spotify: "spotify",
  notion: "notion",
  figma: "figma",
  github: "github",
  githubpro: "github",
  claude: "claude",
  claudepro: "claude",
  canva: "canva",
  canvapro: "canva",
  adobe: "adobe",
  adobecreativecloud: "adobe",
  netflix: "netflix",
  youtubepremium: "youtube",
  youtube: "youtube",
  apple: "apple",
  applemusic: "apple",
  icloud: "apple",
  slack: "slack",
  discord: "discord",
  discordnitro: "discord",
  zoom: "zoom",
  microsoft: "microsoft",
  microsoft365: "microsoft",
  office365: "microsoft",
  twitch: "twitch",
  google: "google",
  googledrive: "google",
  googleone: "google",
  dropbox: "dropbox",
  openai: "openai",
  chatgpt: "openai",
  medium: "medium",
};

/** Premier motif qui matche gagne (ordre = du plus spécifique au plus large). */
const SUBSTRING_ICON: { pattern: RegExp; icon: IconKey }[] = [
  { pattern: /youtubepremium|youtube\s*\+|youtube\s*music/i, icon: "youtube" },
  { pattern: /youtube/i, icon: "youtube" },
  { pattern: /netflix/i, icon: "netflix" },
  { pattern: /spotify/i, icon: "spotify" },
  { pattern: /notion/i, icon: "notion" },
  { pattern: /figma/i, icon: "figma" },
  { pattern: /github/i, icon: "github" },
  { pattern: /claude/i, icon: "claude" },
  { pattern: /canva/i, icon: "canva" },
  { pattern: /adobe/i, icon: "adobe" },
  { pattern: /icloud|apple\s*(one|music|tv|arcade)|\bapple\b/i, icon: "apple" },
  { pattern: /slack/i, icon: "slack" },
  { pattern: /discord/i, icon: "discord" },
  { pattern: /\bzoom\b/i, icon: "zoom" },
  { pattern: /microsoft|office\s*365|m365|outlook\s*365/i, icon: "microsoft" },
  { pattern: /twitch/i, icon: "twitch" },
  { pattern: /google\s*(drive|one|workspace|photos)|\bgmail\b/i, icon: "google" },
  { pattern: /dropbox/i, icon: "dropbox" },
  { pattern: /chatgpt|openai|\bgpt\b/i, icon: "openai" },
];

function normalizeNameKey(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function slugifyId(name: string): string {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base || "subscription"}-${Date.now()}`;
}

export function iconForSubscriptionName(name: string): ImageSourcePropType {
  const compact = normalizeNameKey(name);
  const exact = EXACT_NAME_ICON[compact];
  if (exact) return icons[exact];

  for (const { pattern, icon } of SUBSTRING_ICON) {
    if (pattern.test(name)) return icons[icon];
  }

  return icons.plus;
}

export function buildSubscriptionFromForm(input: {
  name: string;
  price: number;
  frequency: SubscriptionFrequency;
  category: SubscriptionCategory;
}): Subscription {
  const now = dayjs();
  const renewalDate =
    input.frequency === "Annuel"
      ? now.add(1, "year").toISOString()
      : now.add(1, "month").toISOString();

  return {
    id: slugifyId(input.name),
    icon: iconForSubscriptionName(input.name),
    name: input.name.trim(),
    plan: input.frequency === "Annuel" ? "Accès annuel" : "Forfait mensuel",
    category: input.category,
    paymentMethod: "À définir",
    status: "active",
    startDate: now.toISOString(),
    price: input.price,
    currency: "EUR",
    billing: input.frequency,
    renewalDate,
    color: CATEGORY_COLORS[input.category],
  };
}

export function subscriptionsToUpcoming(
  subscriptions: Subscription[]
): UpcomingSubscription[] {
  return subscriptions
    .filter((s) => s.status === "active" && s.renewalDate)
    .map((s) => {
      const daysLeft = Math.max(
        0,
        dayjs(s.renewalDate).startOf("day").diff(dayjs().startOf("day"), "day")
      );
      return {
        id: s.id,
        icon: s.icon,
        name: s.name,
        price: s.price,
        currency: s.currency,
        daysLeft,
      };
    })
    .filter((u) => u.daysLeft <= 30)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 8);
}
