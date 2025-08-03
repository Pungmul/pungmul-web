"use client";
import { useEffect } from "react";
import { notFound, useParams } from "next/navigation";

import PostBoxSkelleton from "@/features/board/post/components/PostBoxSkelleton";

import PostList from "@/features/board/post/components/PostList";
import { useLoadBoardInfo } from "@/features/board/api";
import { AnimatePresence } from "framer-motion";
import { Responsive } from "@/shared/components/Responsive";
import PostDetailOverlay from "@/features/board/post/components/PostDetailOverlay";
import PostDetailModal from "@/features/board/post/components/PostDetailModal";
import { PostingOverlay } from "@/features/board/post/components/PostingOverlay";
import PostingModal from "@/features/board/post/components/PostingModal";

export const dynamic = "force-dynamic";

export default function BoardPage() {
  const boardID = Number(useParams().boardID);
  const { data: boardData, isLoading } = useLoadBoardInfo(boardID);

  useEffect(() => {
    const preventBack = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.history.pushState(null, "", window.location.href);

    window.addEventListener("popstate", preventBack);
    return () => window.removeEventListener("popstate", preventBack);
  }, []);

  if (!isLoading && !boardData) {
    return notFound();
  }

  return (
    <> 
    <section
      key="board-post-list-section"
      className={"relative flex flex-col w-full bg-white"}
    >
      {isLoading || !boardData ? (
        <PostBoxSkelleton length={8} />
      ) : (
        <PostList boardData={boardData} boardId={boardID} />
      )}
    </section>
     <AnimatePresence mode="sync">
     <Responsive
       key="post-detail-overlay-responsive"
       mobile={
         <PostDetailOverlay
           boardName={
             boardData?.boardInfo.rootCategoryName || "알 수 없는 게시판"
           }
         />
       }
       desktop={<PostDetailModal />}
     />

     <Responsive
       key="posting-overlay-responsive"
       mobile={<PostingOverlay boardId={Number(boardID)} />}
       desktop={<PostingModal boardId={Number(boardID)} />}
     />
   </AnimatePresence>
   </>
  );
}
