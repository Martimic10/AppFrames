import { Suspense } from "react";
import { CreateEditor } from "@/app/create/create-editor";

export const metadata = {
  title: "Create — AppFrames",
  description: "Design App Store screenshots in the AppFrames editor."
};

function CreatePageFallback() {
  return <div className="min-h-screen bg-[#09090b]" aria-busy="true" />;
}

type CreatePageProps = {
  searchParams: Promise<{ checkout?: string; session_id?: string }>;
};

export default async function CreatePage({ searchParams }: CreatePageProps) {
  const params = await searchParams;
  const pendingCheckoutSessionId =
    params.checkout === "success" && params.session_id?.trim()
      ? params.session_id.trim()
      : null;

  return (
    <Suspense fallback={<CreatePageFallback />}>
      <CreateEditor pendingCheckoutSessionId={pendingCheckoutSessionId} />
    </Suspense>
  );
}
