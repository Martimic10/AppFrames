import {
  Barlow_Condensed,
  Bebas_Neue,
  Cormorant,
  DM_Sans,
  Fraunces,
  Inter,
  JetBrains_Mono,
  Lora,
  Manrope,
  Montserrat,
  Nunito,
  Outfit,
  Playfair_Display,
  Poppins,
  Rubik,
  Sora,
  Space_Grotesk
} from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap"
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap"
});
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas", display: "swap" });
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-barlow-condensed",
  display: "swap"
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap"
});
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap"
});
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora", display: "swap" });
const rubik = Rubik({ subsets: ["latin"], variable: "--font-rubik", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });
const cormorant = Cormorant({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap"
});

export const createFontClassName = [
  inter.variable,
  poppins.variable,
  playfair.variable,
  spaceGrotesk.variable,
  dmSans.variable,
  outfit.variable,
  fraunces.variable,
  bebas.variable,
  barlowCondensed.variable,
  jetbrains.variable,
  montserrat.variable,
  sora.variable,
  lora.variable,
  rubik.variable,
  manrope.variable,
  nunito.variable,
  cormorant.variable
].join(" ");
