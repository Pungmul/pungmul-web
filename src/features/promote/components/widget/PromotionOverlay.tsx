"use client";
import { motion } from "framer-motion";
import { Header, Spinner } from "@/shared/components";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { alertStore, Toast } from "@/shared/store";
import { usePromotionPostingStore } from "../../store";

const PromotionPostingOverlay: React.FC<{ FormComponent: React.ReactNode }> = ({
  FormComponent,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const Alert = alertStore();

  const searchParams = useSearchParams();
  const formId = searchParams.get("formId");
  const { isPending, saveForm } = usePromotionPostingStore();

  const handleClose = () => {
    if (isPending) return;
    Alert.confirm({
      title: "홍보 게시판",
      message: "작성하던 내용을 잃게 됩니다. 닫으시겠습니까?",
      onConfirm: () => {
        router.replace(pathname, { scroll: false });
      },
      cancelText: "취소",
      confirmText: "확인",
    });
  };
  return (
    <>
      <motion.div
        key={"post-backdrop"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="absolute top-0 left-0 w-full h-app  z-10"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      />
      <motion.div
        key={"post-promotion"}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="absolute top-0 left-0 w-full h-app bg-white z-50 overflow-y-auto"
      >
        <div className="flex flex-col w-full h-full">
          <Header
            title="공연 등록"
            onLeftClick={handleClose}
            className="sticky top-0 z-10"
            rightBtn={
              isPending ? (
                <Spinner />
              ) : (
                <button
                  onClick={() =>
                    saveForm({
                      formId: Number(formId),
                      onSuccess: () => {
                        Toast.show({
                          message: "임시 저장 완료",
                          type: "success",
                          duration: 3000,
                        });
                      },
                    })
                  }
                  className="text-center text-grey-500 cursor-pointer"
                >
                  임시 저장
                </button>
              )
            }
          />
          {FormComponent}
        </div>
      </motion.div>
    </>
  );
};

export default PromotionPostingOverlay;
