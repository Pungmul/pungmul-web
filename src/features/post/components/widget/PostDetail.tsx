"use client";

import { Header } from "@/shared/components";

import { CommentList } from "@/features/comment/components/widget/CommentsList";

import PostMenu from "./PostMenu";
import PostContentSkeleton from "./element/PostContentSkeleton";
import PostContent from "./widget/PostContent";

import { usePathname, useRouter } from "next/navigation";
import { useLoadPostDetail } from "@/features/post/api";

export default function PostDetailView({
  boardName,
  postId,
}: {
  boardName?: string;
  postId: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: post, isLoading } = useLoadPostDetail(postId);

  return (
    <div className="h-dvh w-full flex flex-col">
      <div className="grow-shrink-0">
        <Header
          title={boardName || ""}
          onLeftClick={() => {
            router.replace(pathname);
          }}
          rightBtn={<PostMenu isWriter={post?.isWriter ?? false} />}
        />
      </div>

      <div className="flex flex-col flex-grow overflow-y-auto">
        <div
          style={{ backgroundColor: "#F9F9F9" }}
          className="flex-grow flex flex-col"
        >
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
      </div>
    </div>
  );
}
