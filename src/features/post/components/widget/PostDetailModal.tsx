"use client";

import { Modal } from "@/shared/components";
import DesktopPostDetail from "./DesktopPostDetail";

interface PostDetailModalProps {
  postId: number | undefined;
  onClose: () => void;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ postId, onClose }) => {
  if (!postId) return null;

  return (
    <Modal
      isOpen={!!postId}
      onClose={onClose}
      hasHeader={false}
      style={{ padding: 0 }}
      className="rounded-xl overflow-visible w-[80dvw] h-[80dvh]"
    >
      <DesktopPostDetail postId={postId} />
    </Modal>
  );
};

export default PostDetailModal;
