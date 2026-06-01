import {
  Dumbbell,
  Gamepad2,
  LayoutGrid,
  MessageCircle,
  Plane,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Trophy
} from "lucide-react";
import type { CategoryConfig, CategoryId } from "@/components/create/types";

export const categories: CategoryConfig[] = [
  {
    id: "productivity",
    title: "Productivity",
    description: "Clean and minimal layouts",
    icon: LayoutGrid,
    headline: "Organize your workflow beautifully",
    subheadline: "Built for focused modern teams",
    canvasGradient: "from-zinc-800 via-zinc-900 to-zinc-950",
    glowColor: "rgba(168, 85, 247, 0.25)",
    templates: [
      { id: "minimal", name: "Minimal", tier: "free" },
      { id: "focus", name: "Focus", tier: "pro", styleName: "Productivity Minimal" },
      { id: "studio", name: "Studio", tier: "pro", styleName: "Startup SaaS" }
    ],
    backgrounds: ["#09090b", "#18181b", "#27272a", "#fafafa"]
  },
  {
    id: "finance",
    title: "Finance",
    description: "Modern fintech-inspired styles",
    icon: TrendingUp,
    headline: "Track your investments smarter",
    subheadline: "Modern tools for next-generation investing",
    canvasGradient: "from-emerald-950 via-zinc-900 to-black",
    glowColor: "rgba(34, 197, 94, 0.28)",
    templates: [
      { id: "fintech", name: "Fintech", tier: "free" },
      { id: "ledger", name: "Ledger", tier: "pro", styleName: "Luxury Dark" },
      { id: "markets", name: "Markets", tier: "pro", styleName: "Apple Feature", popular: true }
    ],
    backgrounds: ["#022c22", "#09090b", "#14532d", "#ecfdf5"]
  },
  {
    id: "ai",
    title: "AI",
    description: "Futuristic and bold templates",
    icon: Sparkles,
    headline: "The future of productivity",
    subheadline: "AI-powered tools designed for modern teams",
    canvasGradient: "from-purple-950 via-zinc-900 to-black",
    glowColor: "rgba(168, 85, 247, 0.35)",
    templates: [
      { id: "neural", name: "Neural", tier: "free" },
      { id: "glow", name: "Glow", tier: "pro", styleName: "AI Futuristic" },
      { id: "pulse", name: "Pulse", tier: "pro", styleName: "Cinematic" }
    ],
    backgrounds: ["#1e1b4b", "#09090b", "#312e81", "#ede9fe"]
  },
  {
    id: "social",
    title: "Social",
    description: "Engaging social-style visuals",
    icon: MessageCircle,
    headline: "Connect with your community",
    subheadline: "Share moments that bring people together",
    canvasGradient: "from-rose-950 via-zinc-900 to-black",
    glowColor: "rgba(244, 63, 94, 0.2)",
    templates: [
      { id: "feed", name: "Feed", tier: "free" },
      { id: "stories", name: "Stories", tier: "pro", styleName: "Social Stories" },
      { id: "club", name: "Club", tier: "pro", styleName: "Community Club" }
    ],
    backgrounds: ["#4c0519", "#09090b", "#881337", "#fff1f2"]
  },
  {
    id: "fitness",
    title: "Fitness",
    description: "High-energy modern layouts",
    icon: Dumbbell,
    headline: "Train smarter every day",
    subheadline: "Your personal coach in your pocket",
    canvasGradient: "from-lime-950 via-zinc-900 to-black",
    glowColor: "rgba(34, 197, 94, 0.3)",
    templates: [
      { id: "energy", name: "Energy", tier: "free" },
      { id: "pulse-fit", name: "Pulse", tier: "pro", styleName: "High Energy" },
      { id: "grind", name: "Grind", tier: "pro", styleName: "Athletic Pro" }
    ],
    backgrounds: ["#14532d", "#09090b", "#365314", "#ecfccb"]
  },
  {
    id: "gaming",
    title: "Gaming",
    description: "Neon and immersive styles",
    icon: Gamepad2,
    headline: "Level up your experience",
    subheadline: "Immersive worlds await every player",
    canvasGradient: "from-violet-950 via-zinc-900 to-black",
    glowColor: "rgba(139, 92, 246, 0.35)",
    templates: [
      { id: "neon", name: "Neon", tier: "free" },
      { id: "arcade", name: "Arcade", tier: "pro", styleName: "Gaming Neon", popular: true },
      { id: "cyber", name: "Cyber", tier: "pro", styleName: "Cyber Arena" }
    ],
    backgrounds: ["#2e1065", "#09090b", "#4c1d95", "#f5f3ff"]
  },
  {
    id: "sports",
    title: "Sports",
    description: "Premium sports-inspired designs",
    icon: Trophy,
    headline: "Dominate every match",
    subheadline: "Stats, highlights, and live action",
    canvasGradient: "from-blue-950 via-zinc-900 to-black",
    glowColor: "rgba(59, 130, 246, 0.25)",
    templates: [
      { id: "arena", name: "Arena", tier: "free" },
      { id: "pro", name: "Pro", tier: "pro", styleName: "Sports Pro" },
      { id: "classic", name: "Classic", tier: "pro", styleName: "Classic Broadcast" }
    ],
    backgrounds: ["#172554", "#09090b", "#1e3a8a", "#eff6ff"]
  },
  {
    id: "ecommerce",
    title: "Ecommerce",
    description: "Conversion-focused shop layouts",
    icon: ShoppingBag,
    headline: "Shop smarter, sell faster",
    subheadline: "Beautiful storefronts that convert browsers into buyers",
    canvasGradient: "from-amber-950 via-zinc-900 to-black",
    glowColor: "rgba(245, 158, 11, 0.28)",
    templates: [
      { id: "boutique", name: "Boutique", tier: "free" },
      { id: "storefront", name: "Storefront", tier: "pro", styleName: "Retail Pro" },
      { id: "checkout", name: "Checkout", tier: "pro", styleName: "Conversion Lab", popular: true }
    ],
    backgrounds: ["#451a03", "#09090b", "#78350f", "#fffbeb"]
  },
  {
    id: "travel",
    title: "Travel",
    description: "Inspiring trip and booking styles",
    icon: Plane,
    headline: "Explore the world your way",
    subheadline: "Plan trips, book stays, and wander with confidence",
    canvasGradient: "from-sky-950 via-zinc-900 to-black",
    glowColor: "rgba(56, 189, 248, 0.28)",
    templates: [
      { id: "journey", name: "Journey", tier: "free" },
      { id: "wander", name: "Wander", tier: "pro", styleName: "Adventure Atlas" },
      { id: "voyage", name: "Voyage", tier: "pro", styleName: "Luxury Escape" }
    ],
    backgrounds: ["#0c4a6e", "#09090b", "#075985", "#f0f9ff"]
  }
];

export function getCategoryById(id: CategoryId): CategoryConfig {
  return categories.find((c) => c.id === id) ?? categories[0];
}

export const defaultCategoryId: CategoryId = "productivity";
