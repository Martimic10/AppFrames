import { DEFAULT_TEXT_FONT_ID } from "@/components/create/text-fonts";
import { DEFAULT_SLIDE_TEXT_STYLE } from "@/components/create/text-style";
import type { CategoryId } from "@/components/create/types";
import type { ScreenshotSlide } from "@/components/create/types";

function slides(pairs: [string, string][]): ScreenshotSlide[] {
  return pairs.map(([headline, subheadline]) => ({
    headline,
    subheadline,
    imageDataUrl: null,
    textBoxes: [],
    fontId: DEFAULT_TEXT_FONT_ID,
    ...DEFAULT_SLIDE_TEXT_STYLE
  }));
}

const productivitySlides: Record<string, ScreenshotSlide[]> = {
  minimal: slides([
    ["Organize your workflow beautifully", "Built for focused modern teams"],
    ["Plan your day in one place", "Tasks, notes, and goals unified"],
    ["Stay focused without distractions", "Clean UI designed for deep work"],
    ["Capture ideas instantly", "Quick input that never slows you down"],
    ["Review progress at a glance", "Simple dashboards for busy teams"],
    ["Collaborate without chaos", "Shared workspaces that stay tidy"],
    ["Start productive in minutes", "No setup, just launch and build"]
  ]),
  focus: slides([
    ["Deep work starts here", "Block noise and finish what matters"],
    ["One inbox for everything", "Email, tasks, and docs in sync"],
    ["Automate repetitive work", "Save hours every week"],
    ["Templates for every workflow", "Ship faster with proven layouts"],
    ["Track habits that stick", "Build routines with gentle reminders"],
    ["Sync across all devices", "Pick up exactly where you left off"],
    ["Built for solo creators", "Powerful tools without team overhead"]
  ]),
  studio: slides([
    ["Design your perfect workspace", "Flexible layouts for any role"],
    ["Visualize projects clearly", "Kanban, list, and calendar views"],
    ["Share updates effortlessly", "Status pages your team will love"],
    ["Integrate your favorite tools", "Connect the apps you already use"],
    ["Secure by default", "Enterprise-grade privacy for everyone"],
    ["Onboard teams in seconds", "Invite, assign, and go"],
    ["Scale from side project to startup", "Grows with your ambition"]
  ])
};

const financeSlides: Record<string, ScreenshotSlide[]> = {
  fintech: slides([
    ["Track your investments smarter", "Modern tools for next-generation investing"],
    ["See your portfolio in real time", "Live prices and performance in one view"],
    ["Build wealth with confidence", "Clear insights for every decision"],
    ["Automate recurring investments", "Set it once and stay consistent"],
    ["Understand risk at a glance", "Smart breakdowns for every holding"],
    ["Export tax-ready reports", "Less spreadsheet pain at year end"],
    ["Start investing in minutes", "No jargon, just guided onboarding"]
  ]),
  ledger: slides([
    ["Know where every dollar goes", "Expense tracking that actually sticks"],
    ["Budgets that adapt to you", "Flexible categories and monthly goals"],
    ["Split bills with friends", "Settle up in seconds, not days"],
    ["Forecast cash flow early", "See shortfalls before they hit"],
    ["Connect all your accounts", "One dashboard for banks and cards"],
    ["Alerts that protect you", "Unusual spending flagged instantly"],
    ["Your money, beautifully organized", "Premium design meets serious tools"]
  ]),
  markets: slides([
    ["Trade with clarity", "Charts and signals without the clutter"],
    ["Follow markets that matter", "Custom watchlists and alerts"],
    ["Research faster", "News and fundamentals side by side"],
    ["Paper trade with confidence", "Practice strategies risk free"],
    ["Options made approachable", "Guided flows for complex trades"],
    ["Portfolio stress testing", "Model scenarios before you commit"],
    ["Markets never sleep", "Mobile alerts keep you in the loop"]
  ])
};

const aiSlides: Record<string, ScreenshotSlide[]> = {
  neural: slides([
    ["The future of productivity", "AI-powered tools designed for modern teams"],
    ["Draft content in seconds", "From blank page to polished copy"],
    ["Summarize long documents", "Get the gist without the grind"],
    ["Brainstorm without limits", "Ideas that spark more ideas"],
    ["Translate with nuance", "Context-aware language support"],
    ["Automate customer replies", "Smart drafts your team can trust"],
    ["Ship AI features faster", "APIs and UI ready out of the box"]
  ]),
  glow: slides([
    ["Your copilot for daily work", "Assistive AI that stays out of the way"],
    ["Turn meetings into action items", "Notes and tasks generated automatically"],
    ["Search everything instantly", "Find answers across apps and files"],
    ["Personalize every response", "Tone and style that match your brand"],
    ["Review code with AI eyes", "Catch bugs before they ship"],
    ["Generate visuals on demand", "Concept art for pitches and posts"],
    ["Privacy-first intelligence", "Your data stays yours"]
  ]),
  pulse: slides([
    ["Analyze trends in real time", "Signals surfaced when they matter"],
    ["Predict what customers want", "Models trained on your workflow"],
    ["Reduce support load", "Deflect tickets with smart help"],
    ["Write SQL in plain English", "Query data without the syntax stress"],
    ["Build agents that execute", "Multi-step tasks on autopilot"],
    ["Evaluate model quality", "Benchmarks and guardrails built in"],
    ["Deploy AI in one click", "From prototype to production fast"]
  ])
};

const socialSlides: Record<string, ScreenshotSlide[]> = {
  feed: slides([
    ["Connect with your community", "Share moments that bring people together"],
    ["Discover what friends love", "A feed that feels personal again"],
    ["React and reply instantly", "Conversations that stay lively"],
    ["Share photos in full quality", "No compression, no compromise"],
    ["Join groups around interests", "Find your people faster"],
    ["Go live with one tap", "Streaming built for mobile creators"],
    ["Stay safe with smart moderation", "Tools that keep communities kind"]
  ]),
  stories: slides([
    ["Stories that disappear beautifully", "Ephemeral posts done right"],
    ["Stickers and polls that pop", "Engagement tools creators love"],
    ["Highlight your best moments", "Save stories beyond 24 hours"],
    ["DMs with rich media", "Voice, video, and GIFs in one thread"],
    ["Close friends only mode", "Share privately when you want to"],
    ["Trending sounds and templates", "Remix culture made easy"],
    ["Analytics for every story", "See who watched and engaged"]
  ]),
  club: slides([
    ["Build your inner circle", "Exclusive spaces for real connection"],
    ["Host audio rooms effortlessly", "Drop in, speak up, or listen"],
    ["Monetize your community", "Subscriptions that fans actually want"],
    ["Schedule events members love", "RSVPs and reminders built in"],
    ["Pin announcements that stick", "Keep important updates visible"],
    ["Invite-only vibes", "Curate who gets in the room"],
    ["Grow from 10 to 10,000", "Tools that scale with your club"]
  ])
};

const fitnessSlides: Record<string, ScreenshotSlide[]> = {
  energy: slides([
    ["Train smarter every day", "Your personal coach in your pocket"],
    ["Workouts that match your level", "Adaptive plans that evolve with you"],
    ["Track every rep and set", "Logging that takes seconds"],
    ["Hit your step goals", "Daily movement rings that motivate"],
    ["Recovery matters too", "Sleep and strain in one dashboard"],
    ["Challenge friends to move", "Leaderboards that keep you honest"],
    ["Start strong this week", "Quick starts for busy schedules"]
  ]),
  "pulse-fit": slides([
    ["Feel the burn, track the gain", "High-energy training made simple"],
    ["HIIT timers that keep pace", "Intervals without fumbling your phone"],
    ["Heart rate zones explained", "Train in the right band every session"],
    ["Meal ideas for athletes", "Fuel plans that match your goals"],
    ["Progress photos side by side", "See transformation over time"],
    ["Gym mode with rest alerts", "Focus on lifting, not the clock"],
    ["Celebrate PRs instantly", "Badges when you beat your best"]
  ]),
  grind: slides([
    ["No excuses, just results", "Programs for serious consistency"],
    ["Lift logs with plate math", "Bar loading calculated for you"],
    ["Custom splits your way", "Push pull legs or whatever you run"],
    ["Warm up scripts included", "Injury prevention baked in"],
    ["Export data to coaches", "Share progress in one tap"],
    ["Dark mode for 5am crews", "Easy on the eyes, hard on the work"],
    ["Built for the long grind", "Streaks that reward showing up"]
  ])
};

const gamingSlides: Record<string, ScreenshotSlide[]> = {
  neon: slides([
    ["Level up your experience", "Immersive worlds await every player"],
    ["Matchmaking in seconds", "Jump into ranked without the wait"],
    ["Clan wars on weekends", "Coordinate squads with voice chat"],
    ["Loot that feels legendary", "Rare drops worth the grind"],
    ["Cross-play everywhere", "Play with friends on any device"],
    ["Season passes that deliver", "Rewards you actually want to unlock"],
    ["Enter the neon arena", "Futuristic maps and blazing speed"]
  ]),
  arcade: slides([
    ["Classic fun, modern polish", "Arcade vibes with online leaderboards"],
    ["One more run syndrome", "Quick sessions, endless replay"],
    ["Boss fights that hit hard", "Patterns to learn, glory to earn"],
    ["Couch co-op ready", "Pass the controller mode included"],
    ["Retro skins collection", "Unlock pixel art cosmetics"],
    ["Daily challenges rotate", "Fresh goals every morning"],
    ["High scores hall of fame", "Prove it to the global board"]
  ]),
  cyber: slides([
    ["Hack the skyline", "Cyberpunk missions in your pocket"],
    ["Gear up with cyber mods", "Augments that change how you play"],
    ["Stealth or chaos", "Your playstyle, your run"],
    ["Faction wars never end", "Pick a side, defend your district"],
    ["Craft weapons from scraps", "Economy depth for builders"],
    ["Neon nights, loud bass", "Soundtrack that fuels the grind"],
    ["Download and dive in", "Optimized for mobile GPUs"]
  ])
};

const sportsSlides: Record<string, ScreenshotSlide[]> = {
  arena: slides([
    ["Dominate every match", "Stats, highlights, and live action"],
    ["Live scores without delay", "Every game, every league"],
    ["Fantasy lineups made easy", "Projections you can trust"],
    ["Watch highlights in HD", "Recaps minutes after the buzzer"],
    ["Follow your favorite teams", "Alerts for goals, trades, and news"],
    ["Bracket predictions with friends", "Compete all tournament long"],
    ["Stadium mode experience", "Immersive UI on game day"]
  ]),
  pro: slides([
    ["Train like the pros", "Drills used by elite athletes"],
    ["Track speed and distance", "GPS metrics for every session"],
    ["Coach feedback on video", "Upload clips, get notes back"],
    ["Periodization built in", "Peaking plans for race day"],
    ["Team roster management", "Schedules and availability synced"],
    ["Injury prevention tips", "Mobility routines between games"],
    ["Pro stats at amateur prices", "Analytics without the agency"]
  ]),
  classic: slides([
    ["Sports heritage, modern app", "Timeless design for fans"],
    ["Box scores done right", "Every stat from every game"],
    ["Podcast clips in app", "Listen while you commute"],
    ["Vintage jerseys shop", "Merch drops for collectors"],
    ["Historical records deep dive", "Compare legends across eras"],
    ["Local league coverage", "Community sports matter too"],
    ["Relive the greatest plays", "Archives that never get old"]
  ])
};

const ecommerceSlides: Record<string, ScreenshotSlide[]> = {
  boutique: slides([
    ["Shop smarter, sell faster", "Beautiful storefronts that convert browsers into buyers"],
    ["Curated collections you'll love", "Hand-picked products for every style"],
    ["One-tap checkout", "Buy in seconds, not minutes"],
    ["Track orders in real time", "From warehouse to doorstep"],
    ["Save favorites for later", "Wishlists that never lose a find"],
    ["Discover trending picks", "What's hot, updated daily"],
    ["Open your shop today", "Launch a brand in an afternoon"]
  ]),
  storefront: slides([
    ["Your brand, beautifully online", "Premium layouts for modern retailers"],
    ["Inventory that stays in sync", "Never oversell across channels"],
    ["Promo codes that convert", "Run sales without the spreadsheet mess"],
    ["Product pages that sell", "Zoom, variants, and reviews built in"],
    ["Analytics that matter", "See what drives revenue, not vanity metrics"],
    ["Multi-currency ready", "Sell globally from day one"],
    ["Trusted by growing brands", "Scale from first order to thousands"]
  ]),
  checkout: slides([
    ["Checkout without friction", "Fewer steps, more completed carts"],
    ["Apple Pay and cards", "Every payment method customers expect"],
    ["Abandoned cart recovery", "Win back shoppers automatically"],
    ["Shipping options upfront", "No surprise fees at the last step"],
    ["Secure payments always", "PCI-ready checkout your customers trust"],
    ["Upsells that feel helpful", "Bundles and add-ons that boost AOV"],
    ["Mobile-first buying", "Designed for thumbs, built for conversion"]
  ])
};

const travelSlides: Record<string, ScreenshotSlide[]> = {
  journey: slides([
    ["Explore the world your way", "Plan trips, book stays, and wander with confidence"],
    ["Flights compared in seconds", "Find the best route at the right price"],
    ["Hotels you'll actually love", "Reviews and photos you can trust"],
    ["Build itineraries effortlessly", "Drag, drop, and share your perfect trip"],
    ["Offline maps when you land", "Navigate without roaming charges"],
    ["Local tips from real travelers", "Skip tourist traps, find gems"],
    ["Your passport to adventure", "Start planning your next escape"]
  ]),
  wander: slides([
    ["Wander off the beaten path", "Adventures for curious explorers"],
    ["Backpacker budgets, pro tools", "Hostels to boutique stays in one app"],
    ["Group trips made simple", "Split costs and vote on plans"],
    ["Weather-aware packing lists", "Pack smart for every destination"],
    ["Trail guides in your pocket", "Hikes, campsites, and scenic routes"],
    ["Translate menus instantly", "Order with confidence abroad"],
    ["Memories mapped automatically", "Relive trips on an interactive timeline"]
  ]),
  voyage: slides([
    ["Luxury travel, simplified", "Five-star stays without the phone calls"],
    ["Concierge in your pocket", "Reservations and upgrades handled for you"],
    ["Private transfers booked", "Airport to villa without the stress"],
    ["Exclusive experiences", "Tours and tables money can't usually buy"],
    ["Loyalty perks unlocked", "Status benefits across partner brands"],
    ["Travel docs organized", "Boarding passes and visas in one place"],
    ["Arrive like a VIP", "Every detail polished before you land"]
  ])
};

const byCategory: Record<
  CategoryId,
  Record<string, ScreenshotSlide[]>
> = {
  productivity: productivitySlides,
  finance: financeSlides,
  ai: aiSlides,
  social: socialSlides,
  fitness: fitnessSlides,
  gaming: gamingSlides,
  sports: sportsSlides,
  ecommerce: ecommerceSlides,
  travel: travelSlides
};

export function getTemplateSlides(
  categoryId: CategoryId,
  templateId: string
): ScreenshotSlide[] {
  const categorySet = byCategory[categoryId];
  const found = categorySet[templateId];
  if (found) return found;

  const fallback = Object.values(categorySet)[0];
  return fallback ?? slides([["Your headline here", "Your subtitle appears here"]]);
}

/** Default slides per template (App Store sets often use 5–7). */
export const SCREENSHOT_COUNT = 7;
export const MIN_SLIDE_COUNT = 1;
/** Max slides in the editor (App Store allows 10 per device; extra room for drafts). */
export const MAX_SLIDE_COUNT = 20;
export const APP_STORE_SCREENSHOT_LIMIT = 10;

/** New slide copy cycles through template headlines when you add slides. */
export function createSlideFromTemplate(
  templateSlides: ScreenshotSlide[],
  index: number
): ScreenshotSlide {
  const source = templateSlides[index % templateSlides.length] ?? templateSlides[0];
  return {
    ...source,
    imageDataUrl: null,
    textBoxes: []
  };
}
