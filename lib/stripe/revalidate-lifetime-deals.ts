import { revalidateTag } from "next/cache";

export function revalidateLifetimeDealsCache(): void {
  try {
    revalidateTag("lifetime-deals");
  } catch {
    /* safe outside request context in dev */
  }
}
