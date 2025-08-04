"use client";

import { useCallback } from "react";
import { usePathname } from "next/navigation";

import { Modal } from "@/shared/components";

import { useRouter, useSearchParams } from "next/navigation";
import DesktopPostDetail from "./DesktopPostDetail";

const PostDetailModal = () => {
  const searchParams = useSearchParams();
  const postId = searchParams.get("postId")
    ? parseInt(searchParams.get("postId")!)
    : undefined;

  const router = useRouter();
  const pathname = usePathname();

  const handleClose = useCallback(() => {
    router.replace(pathname);
  }, [router, pathname]);

  if (!postId) return null;

  return (
    <Modal
      isOpen={!!postId}
      onClose={handleClose}
      hasHeader={false}
      style={{ padding: 0 }}
      className="rounded-xl overflow-visible w-[80dvw] h-[80dvh]"
    >
      <DesktopPostDetail postId={postId} />
    </Modal>
  );
};

export default PostDetailModal;
