"use client";

import { AnimatePresence, motion, PanInfo, useAnimate } from "framer-motion";
import LightningCreateForm from "./LightningCreateForm";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function LightningOverlay() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const isCreate = searchParams.get("create") === "true";
  const [container, containerAnimate] = useAnimate<HTMLDivElement>();
  const [backdrop, backdropAnimate] = useAnimate<HTMLDivElement>();

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.y > 160 || info.velocity.y > 500) {
      router.replace(pathname);
    } else {
      // 원위치로 돌아가기
      containerAnimate(
        container.current,
        { y: 0 },
        { duration: 0.3, ease: "easeOut" }
      );
      backdropAnimate(
        backdrop.current,
        { opacity: 1 },
        { duration: 0.3, ease: "easeOut" }
      );
    }
  };

  return (
    <AnimatePresence key="create-lightning-overlay" mode="sync">
      {isCreate && (
        <motion.div
          key="create-lightning-backdrop"
          ref={backdrop}
          onClick={() => router.back()}
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
          key="create-lightning-container"
          ref={container}
          drag="y"
          dragDirectionLock
          dragConstraints={{ top: 0, bottom: 200 }}
          dragElastic={0.1}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          onDragEnd={handleDragEnd}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute top-0 left-0 w-dvw z-50 mt-[6vh] o"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="relative bg-background h-full pt-[8px] md:max-w-[960px] md:mx-auto z-50"
            style={{
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <div className="pt-[12px]">
              <LightningCreateForm />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
