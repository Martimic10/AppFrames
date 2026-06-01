"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";
import { CheckoutReturnHandler } from "@/components/pro/checkout-return-handler";
import { CheckoutSuccessModal } from "@/components/pro/checkout-success-modal";
import { UpgradeModal } from "@/components/pro/upgrade-modal";
import { FREE_EXPORT_LIMIT } from "@/lib/pro/constants";
import {
  canExport,
  consumeExportCredit,
  getExportsRemaining,
  readExportsUsed
} from "@/lib/pro/export-storage";

type ProContextValue = {
  isPro: boolean;
  isLoading: boolean;
  exportsRemaining: number;
  canExport: boolean;
  upgradeOpen: boolean;
  upgradeReason: string | null;
  checkoutBusy: boolean;
  openUpgrade: (reason?: string) => void;
  closeUpgrade: () => void;
  startCheckout: () => Promise<void>;
  restorePurchase: (email: string) => Promise<{ ok: boolean; message: string }>;
  refreshProStatus: () => Promise<void>;
  tryConsumeExport: () => boolean;
  syncExportsRemaining: () => void;
  registerCheckoutPrepare: (fn: (() => void) | null) => void;
};

const ProContext = createContext<ProContextValue | null>(null);

async function verifyCheckoutSession(sessionId: string): Promise<boolean> {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch("/api/stripe/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId })
    });
    if (res.ok) return true;
    if (attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
  }
  return false;
}

type ProProviderProps = {
  children: ReactNode;
  /** From server searchParams on first paint after Stripe redirect */
  pendingCheckoutSessionId?: string | null;
};

export function ProProvider({
  children,
  pendingCheckoutSessionId = null
}: ProProviderProps) {
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [exportsRemaining, setExportsRemaining] = useState(FREE_EXPORT_LIMIT);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<string | null>(null);
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutSuccessOpen, setCheckoutSuccessOpen] = useState(false);
  const [checkoutSuccessStatus, setCheckoutSuccessStatus] = useState<
    "loading" | "ok" | "error"
  >("loading");
  const prepareCheckoutRef = useRef<(() => void) | null>(null);

  const registerCheckoutPrepare = useCallback((fn: (() => void) | null) => {
    prepareCheckoutRef.current = fn;
  }, []);

  const syncExportsRemaining = useCallback(() => {
    setExportsRemaining(getExportsRemaining(isPro));
  }, [isPro]);

  const refreshProStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/pro/status", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { isPro?: boolean };
      setIsPro(Boolean(data.isPro));
    } catch {
      /* offline — keep current state */
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshProStatus();
  }, [refreshProStatus]);

  useEffect(() => {
    syncExportsRemaining();
  }, [isPro, syncExportsRemaining]);

  const openUpgrade = useCallback((reason?: string) => {
    setUpgradeReason(reason ?? null);
    setUpgradeOpen(true);
  }, []);

  const closeUpgrade = useCallback(() => {
    setUpgradeOpen(false);
    setUpgradeReason(null);
  }, []);

  const closeCheckoutSuccess = useCallback(() => {
    setCheckoutSuccessOpen(false);
    setCheckoutSuccessStatus("loading");
  }, []);

  const handleCheckoutReturn = useCallback(
    async (sessionId: string) => {
      setCheckoutSuccessOpen(true);
      setCheckoutSuccessStatus("loading");
      setUpgradeOpen(false);

      try {
        const ok = await verifyCheckoutSession(sessionId);
        if (ok) {
          setIsPro(true);
          syncExportsRemaining();
          await refreshProStatus();
          setCheckoutSuccessStatus("ok");
          return;
        }
        setCheckoutSuccessStatus("error");
      } catch {
        setCheckoutSuccessStatus("error");
      }
    },
    [refreshProStatus, syncExportsRemaining]
  );

  const startCheckout = useCallback(async () => {
    setCheckoutBusy(true);
    try {
      prepareCheckoutRef.current?.();
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Could not start checkout");
      }
      window.location.href = data.url;
    } catch (error) {
      setCheckoutBusy(false);
      alert(
        error instanceof Error
          ? error.message
          : "Checkout is unavailable. Check Stripe configuration."
      );
    }
  }, []);

  const restorePurchase = useCallback(
    async (email: string) => {
      const res = await fetch("/api/stripe/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
        error?: string;
        isPro?: boolean;
      };

      if (res.ok && data.isPro) {
        setIsPro(true);
        syncExportsRemaining();
        return {
          ok: true,
          message: data.message ?? "Pro access restored."
        };
      }

      return {
        ok: false,
        message: data.message ?? data.error ?? "Could not restore purchase."
      };
    },
    [syncExportsRemaining]
  );

  const tryConsumeExport = useCallback(() => {
    if (isPro) return true;
    if (!canExport(false)) {
      openUpgrade(
        "You've used all 3 free exports. Upgrade to Pro for unlimited HD exports."
      );
      return false;
    }
    consumeExportCredit(false);
    syncExportsRemaining();
    return true;
  }, [isPro, openUpgrade, syncExportsRemaining]);

  const value = useMemo<ProContextValue>(
    () => ({
      isPro,
      isLoading,
      exportsRemaining: isPro ? Number.POSITIVE_INFINITY : exportsRemaining,
      canExport: isPro || canExport(false),
      upgradeOpen,
      upgradeReason,
      checkoutBusy,
      openUpgrade,
      closeUpgrade,
      startCheckout,
      restorePurchase,
      refreshProStatus,
      tryConsumeExport,
      syncExportsRemaining,
      registerCheckoutPrepare
    }),
    [
      isPro,
      isLoading,
      exportsRemaining,
      upgradeOpen,
      upgradeReason,
      checkoutBusy,
      openUpgrade,
      closeUpgrade,
      startCheckout,
      restorePurchase,
      refreshProStatus,
      tryConsumeExport,
      syncExportsRemaining,
      registerCheckoutPrepare
    ]
  );

  return (
    <ProContext.Provider value={value}>
      <CheckoutReturnHandler
        pendingSessionId={pendingCheckoutSessionId}
        onReturn={(sessionId) => void handleCheckoutReturn(sessionId)}
      />
      {children}
      <UpgradeModal
        open={upgradeOpen}
        reason={upgradeReason}
        busy={checkoutBusy}
        onClose={closeUpgrade}
        onUpgrade={startCheckout}
        onRestore={restorePurchase}
      />
      <CheckoutSuccessModal
        open={checkoutSuccessOpen}
        status={checkoutSuccessStatus}
        onClose={closeCheckoutSuccess}
      />
    </ProContext.Provider>
  );
}

export function usePro() {
  const ctx = useContext(ProContext);
  if (!ctx) {
    throw new Error("usePro must be used within ProProvider");
  }
  return ctx;
}

/** Safe hook for landing pages outside ProProvider */
export function useProOptional() {
  return useContext(ProContext);
}

export function getExportsUsedClient(): number {
  return readExportsUsed();
}
