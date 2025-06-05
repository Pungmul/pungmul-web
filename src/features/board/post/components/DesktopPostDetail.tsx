"use client";

import PostContentSkeleton from "./PostContentSkeleton";
import PostContent from "./PostContent";
import PostMenu from "./PostMenu";
import CommentList from "../../comment/components/CommentsList";

import { useLoadPostDetail } from "@/features/post/api";

export default function DesktopPostDetail({ postId }: { postId: number }) {
  const { data: post, isLoading } = useLoadPostDetail(postId);
  return (
    <div className="relative w-full h-full overflow-visible flex flex-row">
      <div className="flex flex-row h-full rounded-xl overflow-hidden flex-grow relative">
        <div className="relative flex-grow flex-shrink min-w-0">
          <div className="absolute top-[8px] right-[8px] p-[2px] rounded-md flex justify-center items-center gap-[8px] bg-[#FFF] z-10">
            <div className=" w-[36px] h-[36px] cursor-pointer flex justify-center items-center">
              <PostMenu isWriter={false} />
            </div>
          </div>
          <div className="w-full h-full overflow-auto">
            {isLoading ? (
              <PostContentSkeleton />
            ) : (
              post && <PostContent post={post} />
            )}
          </div>
        </div>
        <div className="relative w-[40%] flex-shrink-0 h-full bg-[#F9F9F9]">
          <div className="h-full overflow-y-auto">
            {post?.commentList && (
              <CommentList comments={post.commentList} postId={post.postId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
