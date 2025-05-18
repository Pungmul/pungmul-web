import { useAnimation, PanInfo, motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import PostDetail from "./PostDetail";

const PostDetailOverlay: React.FC<{ boardName?: string; postId?: number }> = ({
  boardName,
  postId,
}) => {
  const controls = useAnimation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (postId) {
      if (isFirstRender.current) {
        controls.set({ x: 0 });
      } else {
        controls.start({ x: 0 });
      }
    }
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, [postId]);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x > 80 || info.velocity.x > 500) {
      // 충분히 오른쪽으로 드래그되면 닫기
      window.history.back();
    } else {
      controls.start({ x: 0 }); // 아니면 원위치
    }
  };

  return (
    <AnimatePresence>
      {postId && (
        <motion.div
          key={"post-backdrop"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute top-0 left-0 w-full h-dvh "
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        />
      )}
      {postId && (
        <motion.div
          drag="x"
          dragDirectionLock
          dragConstraints={{ left: 0 }} // 왼쪽으로 못 움직이게
          dragElastic={0} // 탄성 없애서 흔들림 제거
          onDragEnd={handleDragEnd}
          key={postId}
          initial={{ x: "100%" }}
          animate={controls}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute top-0 left-0 w-full h-dvh bg-white"
        >
          <PostDetail boardName={boardName} postId={postId} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostDetailOverlay;
