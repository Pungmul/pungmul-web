"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  PanInfo,
  motion,
  AnimatePresence,
  useAnimate,
} from "framer-motion";
import PostDetail from "./PostDetail";

const PostDetailOverlay: React.FC<{ boardName?: string }> = ({ boardName }) => {
  const searchParams = useSearchParams();
  const postId = searchParams.get("postId")
  ? parseInt(searchParams.get("postId")!)
  : undefined;
  const [isAnimating, setIsAnimating] = useState(false);
  const [containerScope, animateContainer] = useAnimate<HTMLDivElement>();
  const [backdropScope, animateBackdrop] = useAnimate<HTMLDivElement>();
  const isFirstRender = useRef(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isFirstRender.current && animateContainer && animateBackdrop && containerScope.current && backdropScope.current) {
      animateContainer(containerScope.current, { x: 0 }, { duration: 0, ease: "easeOut" })
      animateBackdrop(backdropScope.current, { opacity: 1 }, { duration: 0, ease: "easeOut" }) 
    }
    if(isFirstRender.current){
      isFirstRender.current = false;
    }
  }, [postId, animateContainer, animateBackdrop, containerScope, backdropScope]);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x > 60 || info.velocity.x > 200) {
      // 충분히 오른쪽으로 드래그되면 닫기
      router.replace(pathname);
    } else {
      setIsAnimating(true);
      animateContainer(containerScope.current, { x: 0 }, { duration: 0.2, ease: "easeOut" }).then(() => {
        setIsAnimating(false);
      });
      animateBackdrop(backdropScope.current, { opacity: 1 }, { duration: 0.2, ease: "easeOut" }).then(() => {
        setIsAnimating(false);
      });
    }
  };

  return (
    <AnimatePresence mode="sync">
      {postId !== undefined && (
        <motion.div
          ref={backdropScope}
          key={"post-backdrop"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 , transition: { duration: 0.2, ease: "easeOut" }}}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute top-0 left-0 w-full h-dvh z-10"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        />
      )}
      {postId !== undefined && (
        <motion.div
          ref={containerScope}
          drag={isAnimating ? false : "x"}
          dragDirectionLock
          dragConstraints={{ left: 0 }} // 왼쪽으로 못 움직이게
          dragElastic={0} // 탄성 없애서 흔들림 제거
          onDragEnd={handleDragEnd}
          key={postId}
          initial={{ x: "100%" }}
          onAnimationStart={() => {
            setIsAnimating(true);
          }}
          onAnimationComplete={() => {
            setIsAnimating(false);
          }}
          animate={{ x: 0, transition: { duration: isFirstRender.current ? 0 : 0.3, ease: "easeOut" } }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute top-0 left-0 w-full h-dvh bg-white z-20"
        >
          <PostDetail boardName={boardName || ""} postId={postId} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostDetailOverlay;
