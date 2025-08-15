"use client";

import { useCallback } from "react";
import { usePathname } from "next/navigation";

import Suspense from "@/shared/components/SuspenseComponent"
import { Modal } from "@/shared/components";

import { useRouter } from "next/navigation";
import DraftEditor from "./Editor";

const PostingModal: React.FC<{
  boardId: number;
}> = ({ boardId }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClose = useCallback(() => {
    console.log(pathname);
    router.replace(pathname);
  }, [router, pathname]);

  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      hasHeader={false}
      style={{ padding: 0 }}
      className="rounded-xl overflow-hidden w-[80dvw] h-[80dvh]"
    >
      <Suspense>
        <DraftEditor boardID={boardId} />
      </Suspense>
    </Modal>
  );
};

export default PostingModal;
