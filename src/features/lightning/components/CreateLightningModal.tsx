"use client";

import { Modal } from "@/shared/components";
import LightningCreateForm from "./LightningCreateForm";
import { useRouter, useSearchParams } from "next/navigation";

export function LightningModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isCreate = searchParams.get("create") === "true";

  return (
    <Modal
      hasHeader={false}
      isOpen={isCreate}
      onClose={() => {
        router.replace("/lightning");
      }}
      style={{
        width: "90%",
        maxWidth: 800,
        borderRadius: 8,
        maxHeight: "98vh",
        overflowY: "auto",
      }}
    >
      <LightningCreateForm />
    </Modal>
  );
}
