import discord from "../assets/ui/discord.svg?raw";
import github from "../assets/ui/github.svg?raw";
import kofi from "../assets/ui/kofi.svg?raw";
import logo from "../assets/ui/Logo.svg?raw";
import paypal from "../assets/ui/paypal.svg?raw";
import type { SiteLink, TextPart } from "../ui/site-chrome";

export const GLOSSARY_URL = "https://glossary.infil.net/?t=Numpad%20Notation";

export const siteLogo = logo;

export const siteLinks: SiteLink[] = [
  { label: "GitHub", url: "https://github.com/ygg-m/fg-input-translator", icon: github, group: "community" },
  { label: "Discord", url: "https://discord.gg/ZapfK82Fjk", icon: discord, group: "community" },
  { label: "Ko-fi", url: "https://ko-fi.com/yggm_", icon: kofi, group: "support" },
  {
    label: "PayPal",
    url: "https://www.paypal.com/donate/?business=3GPA48HHRS6Y6&no_recurring=0&item_name=Thank+you+so+much+for+your+kindness%21%0AYou%27re+helping+to+make+my+project+bright%21&currency_code=BRL",
    icon: paypal,
    group: "support",
  },
];

export const credit = { author: "Ygor Goulart", url: "https://linktr.ee/yggm" };

export const about: { title: string; paragraphs: TextPart[][] } = {
  title: "What is this all about?",
  paragraphs: [
    [
      "This website translates numpad inputs into the visual inputs commonly used by official guides of fighting games.",
    ],
    [
      "If you don't know what numpad notation is, read its definition in the ",
      { text: "Fighting Game Glossary", href: GLOSSARY_URL },
      ".",
    ],
    [
      "Use it to understand and learn the notation while you learn to combo, and to practice writing and reading it. Hover or focus any input to see what it means.",
    ],
    [
      "You can write more than plain inputs: [6] holds, {236P}x2 repeats, P+K presses together, and anything between double backticks is a comment.",
    ],
    [
      "Keep your combos in tabs for each game. Click any input to change how it looks, and save that change for the whole game if you like. Share a row or a whole tab with a link, or export and import everything as text.",
    ],
    [
      "It is an alpha version, so bugs are expected. If you find one, tell me on ",
      { text: "Discord", href: "https://discord.gg/ZapfK82Fjk" },
      ", ",
      { text: "Twitter", href: "https://twitter.com/yggm_" },
      " or ",
      { text: "GitHub", href: "https://github.com/ygg-m/fg-input-translator/issues" },
      ". That includes a game mechanic I missed.",
    ],
    [
      "Numpad notation was created by the community, so there is no single way to write it. This translator tries to understand most of the ways people take notes about combos. My starting point was ",
      { text: "Dustloop", href: "https://www.dustloop.com/" },
      ", so it should work with most of the notation rules there.",
    ],
    ["Suggestions are welcome: tell me which input to read, or which game should be next."],
  ],
};
