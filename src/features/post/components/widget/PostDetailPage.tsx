"use client";
import { AnimatePresence } from "framer-motion";
import { Responsive } from "@/shared/components/Responsive";
import { default as PostDetailOverlay } from "./PostDetailOverlay";
import { default as PostDetailModal } from "./PostDetailModal";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import { createPortal } from "react-dom";

export function PostDetailPage({ boardName }: { boardName: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const postId = searchParams.get("postId")
    ? parseInt(searchParams.get("postId")!)
    : undefined;

  const handleClose = useCallback(() => {
    router.replace(pathname);
  }, [router, pathname]);

  return createPortal(
    <AnimatePresence>   
        <Responsive
          key="post-detail-responsive"
          mobile={<PostDetailOverlay boardName={boardName} postId={postId} onClose={handleClose} />}
          desktop={<PostDetailModal postId={postId} onClose={handleClose} />}
        />
    </AnimatePresence>,
    document.getElementById("post-detail-section") ?? document.body
  )
}