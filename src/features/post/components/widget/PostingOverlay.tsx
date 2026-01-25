"use client";
import DraftEditor from "./Editor";
import { motion } from "framer-motion";

const PostingOverlay: React.FC<{
  boardId: number;
}> = ({ boardId }) => {
  return (
      <>
        <motion.div
          key={"post-backdrop"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute top-0 left-0 w-full h-app  z-10"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        />
        <motion.div
          key={"post" + boardId}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute top-0 left-0 w-full h-app bg-white z-50 overflow-y-auto"
        >
          <DraftEditor boardID={boardId} />
        </motion.div>
      </>
  );
};

export default PostingOverlay;