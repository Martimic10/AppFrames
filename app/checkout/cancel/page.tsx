import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-50">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/80 p-8 text-center">
        <h1 className="text-xl font-semibold text-white">Checkout cancelled</h1>
        <p className="mt-2 text-sm text-zinc-400">
          No charge was made. You can upgrade anytime from the editor or pricing page.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/create"
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800"
          >
            Continue editing
          </Link>
          <Link
            href="/#pricing"
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
          >
            View pricing
          </Link>
        </div>
      </div>
    </main>
  );
}
