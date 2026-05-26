import activity from "@/assets/icons/activity.png";
import add from "@/assets/icons/add.png";
import adobe from "@/assets/icons/adobe.png";
import apple from "@/assets/icons/apple.png";
import back from "@/assets/icons/back.png";
import canva from "@/assets/icons/canva.png";
import claude from "@/assets/icons/claude.png";
import discord from "@/assets/icons/discord.png";
import dropbox from "@/assets/icons/dropbox.png";
import figma from "@/assets/icons/figma.png";
import github from "@/assets/icons/github.png";
import google from "@/assets/icons/google.png";
import home from "@/assets/icons/home.png";
import medium from "@/assets/icons/medium.png";
import menu from "@/assets/icons/menu.png";
import microsoft from "@/assets/icons/microsoft.png";
import netflix from "@/assets/icons/netflix.png";
import notion from "@/assets/icons/notion.png";
import openai from "@/assets/icons/openai.png";
import plus from "@/assets/icons/plus.png";
import setting from "@/assets/icons/setting.png";
import slack from "@/assets/icons/slack.png";
import spotify from "@/assets/icons/spotify.png";
import twitch from "@/assets/icons/twitch.png";
import wallet from "@/assets/icons/wallet.png";
import youtube from "@/assets/icons/youtube.png";
import zoom from "@/assets/icons/zoom.png";

/** PNG dans `assets/icons/` (souvent 144×144, RGBA) — régénérer avec `npm run generate:icons` pour les icônes générées. */
export const icons = {
  activity,
  add,
  adobe,
  apple,
  back,
  canva,
  claude,
  discord,
  dropbox,
  figma,
  github,
  google,
  home,
  medium,
  menu,
  microsoft,
  netflix,
  notion,
  openai,
  plus,
  setting,
  slack,
  spotify,
  twitch,
  wallet,
  youtube,
  zoom,
} as const;

export type IconKey = keyof typeof icons;
