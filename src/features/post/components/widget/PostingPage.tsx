"use client";
import { AnimatePresence } from "framer-motion";
import { Responsive } from "@/shared/components/Responsive";
import { default as PostingOverlay } from "./PostingOverlay";
import { default as PostingModal } from "./PostingModal";
import { useSearchParams, useParams } from "next/navigation";
import { createPortal } from "react-dom";

export function PostingPage() {
  const searchParams = useSearchParams();
  const isPosting = searchParams.get("isPosting") === "true";
  const boardID = Number(useParams().boardID);

  return createPortal(
    <AnimatePresence mode="sync">
      {isPosting && (
        <Responsive
          key="posting-overlay-responsive"
          mobile={<PostingOverlay boardId={boardID} />}
          desktop={<PostingModal boardId={boardID} />}
        />
      )}
    </AnimatePresence>,
    document.getElementById("posting-section") ?? document.body
  );
}
