import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { getLifetimeDealsStats } from "@/lib/stripe/lifetime-deals";

const getCachedLifetimeDealsStats = unstable_cache(
  async () => getLifetimeDealsStats(),
  ["lifetime-deals-stats"],
  { revalidate: 30, tags: ["lifetime-deals"] }
);

export async function GET() {
  try {
    const stats = await getCachedLifetimeDealsStats();
    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60"
      }
    });
  } catch (error) {
    console.error("[pricing/lifetime-deals]", error);
    return NextResponse.json(
      { error: "Could not load launch pricing stats" },
      { status: 500 }
    );
  }
}
