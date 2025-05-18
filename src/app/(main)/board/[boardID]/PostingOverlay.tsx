import DraftEditor from "@pThunder/component/post/Editor";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useRef, useEffect } from "react";

export const PostingOverlay: React.FC<{
  boardId: number;
  isPosting?: boolean;
}> = ({ boardId, isPosting }) => {
  const controls = useAnimation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isPosting) {
      if (isFirstRender.current) {
        controls.set({ y: 0 });
      } else {
        controls.start({ y: 0 });
      }
    }
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, [isPosting]);

  return (
    <AnimatePresence>
      {isPosting && (
        <motion.div
          key={"post-backdrop"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute top-0 left-0 w-full h-dvh  z-10"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        />
      )}
      {isPosting && (
        <motion.div
          key={"post" + boardId}
          dragDirectionLock
          dragConstraints={{ left: 0 }} // 왼쪽으로 못 움직이게
          dragElastic={0} // 탄성 없애서 흔들림 제거
          initial={{ y: "100%" }}
          animate={controls}
          exit={{ y: "100%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute top-0 left-0 w-full h-dvh bg-white z-50 overflow-y-auto"
        >
          <DraftEditor boardID={boardId} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
