/**
 * Génère des PNG 144×144 (RGBA) pour assets/icons/, même format que les icônes du kit.
 * Usage : npm run generate:icons
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "assets", "icons");
const SIZE = 144;

async function writePng(filename, svg) {
  const dest = path.join(OUT, filename);
  await sharp(Buffer.from(svg, "utf8"))
    .resize(SIZE, SIZE)
    .png()
    .toFile(dest);
  console.log("écrit", dest);
}

const icons = [
  {
    file: "youtube.png",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
      <rect width="144" height="144" rx="36" fill="#FF0000"/>
      <path d="M58 42 L58 102 L98 72 Z" fill="#ffffff"/>
    </svg>`,
  },
  {
    file: "apple.png",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
      <rect width="144" height="144" rx="32" fill="#f5f5f7"/>
      <ellipse cx="72" cy="80" rx="30" ry="34" fill="#1d1d1f"/>
      <path fill="#3d6b2e" d="M72 48 Q80 36 90 42 Q86 52 78 58 Q70 52 72 48z"/>
      <rect x="70" y="38" width="4" height="14" rx="2" fill="#5c4033"/>
    </svg>`,
  },
  {
    file: "slack.png",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
      <rect width="144" height="144" rx="32" fill="#4A154B"/>
      <circle cx="54" cy="54" r="16" fill="#E01E5A"/>
      <circle cx="90" cy="54" r="16" fill="#36C5F0"/>
      <circle cx="54" cy="90" r="16" fill="#ECB22E"/>
      <circle cx="90" cy="90" r="16" fill="#2EB67D"/>
    </svg>`,
  },
  {
    file: "discord.png",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
      <rect width="144" height="144" rx="36" fill="#5865F2"/>
      <ellipse cx="56" cy="78" rx="10" ry="12" fill="#ffffff"/>
      <ellipse cx="88" cy="78" rx="10" ry="12" fill="#ffffff"/>
      <path fill="#ffffff" d="M44 58 Q72 48 100 58 L96 68 Q72 62 48 68 Z"/>
    </svg>`,
  },
  {
    file: "zoom.png",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
      <rect width="144" height="144" rx="36" fill="#0E71EB"/>
      <rect x="44" y="50" width="56" height="40" rx="8" fill="none" stroke="#ffffff" stroke-width="6"/>
      <polygon points="88,58 108,48 108,92 88,82" fill="#ffffff"/>
    </svg>`,
  },
  {
    file: "microsoft.png",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
      <rect width="144" height="144" rx="32" fill="#f3f3f3"/>
      <g transform="translate(42,42)">
        <rect width="27" height="27" fill="#F25022"/>
        <rect x="33" width="27" height="27" fill="#7FBA00"/>
        <rect y="33" width="27" height="27" fill="#00A4EF"/>
        <rect x="33" y="33" width="27" height="27" fill="#FFB900"/>
      </g>
    </svg>`,
  },
  {
    file: "twitch.png",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
      <rect width="144" height="144" rx="32" fill="#9146FF"/>
      <path fill="#ffffff" d="M48 38h20l12 12v28h-12v12H48V38zm16 16v20h8V54h8v-8H64z"/>
    </svg>`,
  },
  {
    file: "google.png",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
      <rect width="144" height="144" rx="32" fill="#ffffff"/>
      <rect x="40" y="44" width="18" height="56" rx="4" fill="#4285F4"/>
      <rect x="62" y="44" width="18" height="56" rx="4" fill="#EA4335"/>
      <rect x="84" y="44" width="18" height="56" rx="4" fill="#FBBC04"/>
    </svg>`,
  },
];

await mkdir(OUT, { recursive: true });
for (const { file, svg } of icons) {
  await writePng(file, svg);
}
console.log("Terminé :", icons.length, "icônes");
