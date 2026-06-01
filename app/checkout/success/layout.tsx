import { Suspense, type ReactNode } from "react";

export default function CheckoutSuccessLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
