import { memo } from "react";
import PostImage from "../element/PostImage";
import PostLikeButton from "../element/PostLikeButton";
import { PostDetail } from "@pThunder/features/post";
import { EyeIcon, CommentOutline } from "@pThunder/shared/components/Icons";

const PostContent = ({
  post,
  fitMode = "full",
}: {
  post: PostDetail;
  fitMode?: "fit" | "full";
}) => {
  return (
    <div
      className={
        "flex flex-col w-full gap-4 px-[24px] md:px-[32px] md:py-[24px] py-[16px] bg-background " +
        (fitMode === "fit" ? "h-fit" : "h-full")
      }
    >
      {!!post && (
        <div className="flex flex-col gap-[8px]">
          <div className="flex flex-row justify-between">
            <div className="font-semibold text-[17px]">
              {post.title.trim() ? post.title : "제목 없음"}
            </div>
          </div>

          <div className="flex flex-row justify-between items-start">
            <div className="flex flex-row gap-[8px] items-center">
              <div className="text-grey-400 text-[14px]">
                {post.author == "Anonymous" ? "익명" : post.author}
              </div>

              <div className="text-grey-300 text-[11px]">
                {post.timeSincePostedText === "0분 전"
                  ? "방금"
                  : post.timeSincePostedText}
              </div>
            </div>
            <div className="flex items-center flex-row gap-[4px]">
              <div className="flex justify-center items-center size-[20px]">
                <EyeIcon className="size-[20px] text-grey-500" />
              </div>
              <div className="text-grey-400 text-[14px]">{post?.viewCount}</div>
            </div>
          </div>
        </div>
      )}

      {post && (
        <div className="text-[14px] break-words w-full">{post.content}</div>
      )}

      <div className="w-full overflow-x-auto">
        <div className="flex flex-row w-full gap-[8px]">
          {post?.imageList?.map((image) => (
            <PostImage key={image.id} imageData={image} />
          ))}
        </div>
      </div>

      {post && (
        <div className="flex flex-row gap-[16px]">
          <PostLikeButton
            isLiked={post.isLiked}
            postId={post.postId}
            likedNum={post.likedNum}
          />
          <div className="flex items-center flex-row gap-[4px]">
            <div className="flex justify-center items-center size-[24px]">
              <CommentOutline className="size-[24px] text-grey-400" />
            </div>
            <div className="text-grey-400 text-[14px]">
              {post?.commentList?.length ?? 0}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(PostContent);
