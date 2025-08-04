"use client";
import DraftEditor from "./Editor";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

const PostingOverlay: React.FC<{
  boardId: number;
}> = ({ boardId }) => {
  const searchParams = useSearchParams();
  const isPosting = searchParams.get("isPosting") === "true";

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
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
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

export default PostingOverlay;