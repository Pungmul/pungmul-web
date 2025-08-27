"use client";

import { AnimatePresence } from "framer-motion";
import { Responsive } from "@/shared/components/Responsive";
import PostDetailOverlay from "./PostDetailOverlay";
import PostDetailModal from "./PostDetailModal";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { createPortal } from "react-dom";

export function PostDetailPage({ boardName }: { boardName: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const postId = searchParams.get("postId")
    ? parseInt(searchParams.get("postId")!)
    : undefined;

  const handleClose = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  // 브라우저에서만 DOM 접근
  const [container, setContainer] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const el = document.getElementById("post-detail-section");
    setContainer(el ?? document.body);
  }, []);

  if (!container) return null; // 서버나 초기 렌더링 시 null 반환

  return createPortal(
    <AnimatePresence>
      <Responsive
        key="post-detail-responsive"
        mobile={
          <PostDetailOverlay
            key="post-detail-overlay"
            boardName={boardName}
            postId={postId}
            onClose={handleClose}
          />
        }
        desktop={
          <PostDetailModal
            key="post-detail-modal"
            postId={postId}
            onClose={handleClose}
          />
        }
      />
    </AnimatePresence>,
    container
  );
}
