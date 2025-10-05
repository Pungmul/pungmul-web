"use client";

import { useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { Header, Modal, Spinner } from "@/shared/components";

import { useRouter } from "next/navigation";
import { usePromotionPostingStore } from "../../store";

const PromotionPostingModal: React.FC<{ FormComponent: React.ReactNode }> = ({
  FormComponent,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const formId = searchParams.get("formId");
  const { isPending, saveForm } = usePromotionPostingStore();

  const handleClose = useCallback(() => {
    if (isPending) return;
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      hasHeader={false}
      style={{ padding: 0 }}
      className="rounded-xl overflow-hidden w-[80dvw] h-[80dvh]"
    >
      <div>
        <Header
          title="공연 등록"
          onLeftClick={handleClose}
          className="sticky top-0 z-10"
          rightBtn={
            isPending ? (
              <Spinner />
            ) : (
              <button
                onClick={() => saveForm({ formId: Number(formId) })}
                className="text-center text-grey-500 cursor-pointer"
              >
                임시 저장
              </button>
            )
          }
        />
        {FormComponent}
      </div>
    </Modal>
  );
};

export default PromotionPostingModal;
