"use client";
import { useRouter } from "next/navigation";
import { Post } from "@/shared/types/post/type";

export default function PostBox({
  post,
  onClick,
}: {
  post: Post;
  onClick?: (post: Post) => void;
}) {
  const router = useRouter();

  return (
    <div
      key={post.postId}
      onClick={() => {
        if (onClick) {
          onClick(post);
          return;
        }
        const currentParams = new URLSearchParams(window.location.search); // 현재 URL 쿼리 그대로 가져오기
        currentParams.set("postId", String(post.postId)); // postId만 추가 또는 덮어쓰기

        router.push(`?${currentParams.toString()}`, {
          scroll: false,
        });
      }}
      className="w-full bg-white flex flex-col px-[28px] py-[16px] gap-[8px] hover:bg-[#F5F5F5] cursor-pointer"
    >
      <div className="flex justify-between flex-col items-start">
        <div style={{ fontSize: 14 }} className="w-full truncate">
          {post.title}
        </div>
        <div
          style={{ fontSize: 12 }}
          className="text-gray-300 max-w-24 truncate"
        >
          {post.author == "Anonymous" ? "익명" : post.author}
        </div>
      </div>
      <div style={{ fontSize: 12 }} className="text-gray-400 w-full truncate">
        {post.content}
      </div>
      <div className="flex flex-row gap-2 items-center justify-between">
        <div className="flex flex-row gap-2 items-center">
          <div className="flex flex-row items-center gap-1">
            <div
              style={{ width: 16, height: 16 }}
              className="flex justify-center items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#FF7B7B"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                />
              </svg>
            </div>
            <div style={{ fontSize: 12 }} className="text-[#FF7B7B]">
              {post.likedNum}
            </div>
          </div>
          <div className="flex flex-row items-center gap-1">
            <div
              style={{ width: 16, height: 16 }}
              className="flex justify-center items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#9ca3af"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>
            <div style={{ fontSize: 12 }} className="text-gray-400">
              {post.viewCount}
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-2  items-end">
          <div className="flex flex-row gap-1 items-center">
            <div className="text-gray-400 text-xs">
              {post.timeSincePostedText === "0분 전"
                ? "방금"
                : post.timeSincePostedText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
