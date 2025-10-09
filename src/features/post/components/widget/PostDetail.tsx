"use client";

import { Header } from "@/shared/components";

import { CommentList } from "@/features/comment/components/widget/CommentsList";

import PostMenu from "../element/PostMenu";
import PostContentSkeleton from "../element/PostContentSkeleton";
import PostContent from "./PostContent";
import ReportPostModal from "./ReportPostModal";

import { useLoadPostDetail } from "@/features/post";
import { useEffect, useMemo } from "react";
import { BriefBoardInfo } from "@pThunder/features/board";
import { useQueryClient } from "@tanstack/react-query";

export default function PostDetailView({ postId }: { postId: number }) {
  const { data: post, isLoading } = useLoadPostDetail(postId);
  const queryClient = useQueryClient();
  const boardList: BriefBoardInfo[] =
    queryClient.getQueryData(["boardList"]) || [];
  const boardName =
    boardList?.find((board) => board.id === post?.categoryId)?.name || "";

  const isWriter = post?.isWriter ?? false;

  const postMenu = useMemo(() => <PostMenu isWriter={isWriter} />, [isWriter]);

  useEffect(() => {
    if(!post) return;
    
    document.title = `풍덩 | ${post.title}`;
  }, [post]);

  return (
    <div className="min-h-full w-fwull md:max-w-[768px] mx-auto flex flex-col">
      <Header
        title={boardName || ""}
        className="flex-shrink-0 z-30"
        rightBtn={postMenu}
      />

      <article className="flex flex-col flex-grow">
        <div className="flex-grow flex flex-col bg-grey-100">
          <div className="h-4" />
          {isLoading ? (
            <PostContentSkeleton />
          ) : (
            post && <PostContent post={post} fitMode="fit" />
          )}

          <div className="h-4" />
          {post?.commentList && (
            <CommentList comments={post.commentList} postId={post.postId} />
          )}
        </div>
      </article>
      <ReportPostModal />
    </div>
  );
}
