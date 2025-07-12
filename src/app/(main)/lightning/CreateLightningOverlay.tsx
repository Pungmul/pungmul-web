"use client";

import { AnimatePresence, motion, PanInfo, useAnimation } from "framer-motion";
import { LightningCreateForm } from "@pThunder/features/lightning/components";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function LightningOverlay() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isCreate = searchParams.get("create") === "true";
  const controls = useAnimation();

  useEffect(() => {
    if (isCreate) {
      controls.start({ y: 0 });
    }
  }, [isCreate, controls]);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.y > 160 || info.velocity.y > 500) {
      window.history.back();
      return;
    }
    controls.start({ y: 0 }); // 아니면 원위치
  };

  return (
    <AnimatePresence key="create-lightning-overlay" mode="sync" initial={false}>
      {isCreate && (
        <motion.div
          key={"post-backdrop"}
          onClick={router.back}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute top-0 left-0 w-full h-dvh z-10"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        />
      )}
      {isCreate && (
        <motion.div
          key={"create-lightning"}
          drag="y"
          dragDirectionLock
          dragConstraints={{ top: -20 }} // 왼쪽으로 못 움직이게
          dragElastic={0} // 탄성 없애서 흔들림 제거
          initial={{ y: "100%" }}
          animate={controls}
          exit={{ y: "100%" }}
          onDragEnd={handleDragEnd}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute top-0 left-0 w-dvw z-50 mt-[6vh] bg-transparent"
          style={{
            height: "calc(100vh - 6vh)",
          }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="relative bg-white h-dvh pt-[8px] overflow-hidden md:max-w-[960px] md:mx-auto z-50"
            style={{
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <LightningCreateForm />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
