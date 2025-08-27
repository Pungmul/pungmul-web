"use client";
import { AnimatePresence } from "framer-motion";
import { Responsive } from "@/shared/components/Responsive";
import { default as PostingOverlay } from "./PostingOverlay";
import { default as PostingModal } from "./PostingModal";
import { useSearchParams, useParams } from "next/navigation";
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";

export function PostingPage() {
  const searchParams = useSearchParams();
  const isPosting = searchParams.get("isPosting") === "true";
  const boardID = Number(useParams().boardID);

  // 브라우저에서만 DOM 접근
  const [container, setContainer] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const el = document.getElementById("posting-section");
    setContainer(el ?? document.body);
  }, []);

  if (!container) return null; // 서버나 초기 렌더링 시 null 반환
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
