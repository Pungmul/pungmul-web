"use client";

import { Post } from "@/shared/types/post/type";
import { redirect } from "next/navigation";
import PostBox from "../../post/components/PostBox";
import Link from "next/link";

export default function HomeHotPostList({ hotPosts , timeString}: { hotPosts: Post[] , timeString: string }) {

  return (
    <section  className="flex flex-col" style={{ gap: 20, paddingBottom: 32 }}>
      <h2
        className="flex flex-row items-end px-[24px] text-[18px] font-bold"
      >
        지금 뜨는 인기글 <span className="text-gray-400 text-[12px] px-[4px]">{timeString}기준</span>
      </h2>
      <div style={{ padding: "0 32px" }}>
        <div
          className="flex flex-col overflow-hidden"
          style={{
            boxShadow: "0.25px 0.5px 6px 0px rgba(0, 0, 0, 0.15)",
            borderRadius: 5,
          }}
        >
          {hotPosts.length > 0 ? (
            hotPosts.map((post) => (
              <PostBox
                key={'main-hot-post-'+post.postId}
                post={post}
                onClick={(post) => {
                  const currentParams = new URLSearchParams(
                    window.location.search
                  ); // 현재 URL 쿼리 그대로 가져오기
                  currentParams.set("postId", String(post.postId)); // postId만 추가 또는 덮어쓰기

                  redirect(`board/3?${currentParams.toString()}`);
                }}
              />
            ))
          ) : (
            <div
              className="flex flex-col items-center justify-center"
              style={{ gap: 12, height: 560 }}
            >
              <div className="text-gray-600 font-semibold text-[18px] md:text-[21px]">
                지금 뜨는 인기글이 없습니다.
              </div>
              <Link
                className="flex flex-row items-center gap-[2px] cursor-pointer"
                href="/board/main"
              >
                <div className="text-gray-400">인기글을 작성하러 가볼까요?</div>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#9ca3af"
                  className="w-[32px] h-[32px] p-[4px]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
