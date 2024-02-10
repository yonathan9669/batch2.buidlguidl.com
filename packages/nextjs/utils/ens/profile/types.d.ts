import { DecodedText } from "@ensdomains/ensjs/dist/types/types";

// --- INTERFACES ---
export interface Service {
  name: string;
  description: string;
  url: string;
  network: string;
}

export interface Project {
  title: string;
  description: string;
  image: string;
  link: string;
}

export interface Profile {
  name: string;
  avatar: string;
  address: string;
  description: string;
  links: Links;
  portfolio: Portfolio;
}

// --- TYPES ---
export type ENSRecords = { texts: DecodedText[] };

export type ENSTxtKey = string;
export type ProfileKey = string;
export type ProfileMap = Record<ENSTxtKey, ProfileKey | { target: ProfileKey; parse: (value: string) => any }>;

export type Links = Service[];
export type Portfolio = Project[];

// --- CONSTANTS ---
export const SERVICES: Record<string, string> = {
  url: "${value}",
  email: "mailto:${value}",
  twitter: "https://twitter.com/${value}",
  github: "http://github.com/${value}",
  telegram: "https://t.me/${value}",
  discord: "https://discord.gg/${value}",
  instagram: "https://instagram.com/${value}",
  linkedin: "https://linkedin.com/in/${value}",
  medium: "https://medium.com/${value}",
  reddit: "https://reddit.com/u/${value}",
  snapchat: "https://snapchat.com/add/${value}",
  whatsapp: "https://wa.me/${value}",
  youtube: "https://youtube.com/${value}",
  facebook: "https://facebook.com/${value}",
  tiktok: "https://tiktok.com/@${value}",
  weibo: "https://weibo.com/${value}",
  vk: "https://vk.com/${value}",
  soundcloud: "https://soundcloud.com/${value}",
  twitch: "https://twitch.tv/${value}",
  spotify: "https://open.spotify.com/user/${value}",
  pinterest: "https://pinterest.com/${value}",
  steam: "https://steamcommunity.com/id/${value}",
  patreon: "https://patreon.com/${value}",
  paypal: "https://paypal.me/${value}",
  cashapp: "https://cash.app/${value}",
  venmo: "https://venmo.com/${value}",
  zelle: "https://zellepay.com/${value}",
};

export const DEFAULT_RECORD_MAP: ProfileMap = {
  name: "name",
  avatar: "avatar",
  description: "description",
};

export const SERVICE_REGEX = new RegExp(`(${Object.keys(SERVICES).join("|")})`);
