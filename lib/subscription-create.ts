import dayjs from "dayjs";
import type { ImageSourcePropType } from "react-native";

import { icons, type IconKey } from "@/constants/icons";

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

export function iconForSubscriptionName(name: string): ImageSourcePropType {
  const compact = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
  const exact = EXACT_NAME_ICON[compact];
  if (exact) return icons[exact];

  for (const { pattern, icon } of SUBSTRING_ICON) {
    if (pattern.test(name)) return icons[icon];
  }

  return icons.plus;
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
