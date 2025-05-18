"use client";

import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import PostList from "./PostList";
import PostingButton from "./PostingButton";
import { Header } from "@pThunder/component/shared/Header";
import PostBoxSkelleton from "../../../../component/post/PostBoxSkelleton";
import { AnimatePresence } from "framer-motion";
import { loadBoardInfo } from "./utils";
import PostDetailOverlay from "./PostDetailOverlay";
import { PostingOverlay } from "./PostingOverlay";
import { div } from "framer-motion/client";

interface BoardInfo {
  rootCategoryName: string;
  childCategoryName: string | null;
}

interface HotPost {
  postId: number;
  title: string;
  content: string;
  viewCount: number;
  likedNum: number;
  timeSincePosted: number;
  timeSincePostedText: string;
  author: string;
}

interface RecentPost {
  postId: number;
  title: string;
  content: string;
  viewCount: number;
  likedNum: number;
  timeSincePosted: number;
  timeSincePostedText: string;
  author: string;
}

interface RecentPostList {
  total: number;
  list: RecentPost[];
  pageNum: number;
  pageSize: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface BoardData {
  boardInfo: BoardInfo;
  hotPost: HotPost;
  recentPostList: RecentPostList;
}

export default function BoardPage({
  params,
  searchParams,
}: Readonly<{
  params: { boardID: number };
  searchParams?: { postId?: string; isPosting?: string };
}>) {
  const router = useRouter();
  const { boardID } = params;
  const { postId: postIdString, isPosting: isPostingString = "false" } =
    searchParams || {};
  const postId = postIdString ? parseInt(postIdString) : undefined;
  const isPosting = isPostingString === "true";
  const [boardData, setBoardData] = useState<BoardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (boardID) {
      const loadPostList = async () => {
        try {
          setIsLoading(true);
          const boardData = await loadBoardInfo(boardID);

          console.log(boardData);
          setBoardData(boardData);
        } catch (error) {
          console.error("Error loading post list:", error);
        } finally {
          setIsLoading(false);
        }
      };

      loadPostList();
    }
  }, [boardID]);

  if (!isLoading && !boardData) {
    return notFound();
  }

  return (
    <AnimatePresence mode="sync">
      <div className={"relative h-full flex flex-col  bg-white"}>
        {isLoading || !boardData ? (
          <>
            <Header
              title={"게시판 정보"}
              onLeftClick={() => {
                router.replace("/board/main", { scroll: false });
              }}
            />
            <PostBoxSkelleton length={8} />
          </>
        ) : (
          <>
            <Header
              title={boardData.boardInfo.rootCategoryName}
              rightBtn={<PostingButton />}
              onLeftClick={() => {
                router.replace("/board/main", { scroll: false });
              }}
            />
            <PostList boardData={boardData} boardId={params.boardID} />
          </>
        )}
      </div>
      <PostDetailOverlay
        boardName={boardData?.boardInfo.rootCategoryName}
        postId={postId}
      />
      <PostingOverlay boardId={boardID} isPosting={isPosting} />
    </AnimatePresence>
  );
}
