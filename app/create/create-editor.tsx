"use client";

import { CreateWorkspace } from "@/components/create/create-workspace";
import { ProProvider } from "@/components/pro/pro-provider";

type CreateEditorProps = {
  pendingCheckoutSessionId?: string | null;
};

export function CreateEditor({ pendingCheckoutSessionId = null }: CreateEditorProps) {
  return (
    <ProProvider pendingCheckoutSessionId={pendingCheckoutSessionId}>
      <CreateWorkspace />
    </ProProvider>
  );
}
