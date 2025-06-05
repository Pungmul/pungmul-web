"use client";
import { useRouter } from "next/navigation";

export default function PostingButton() {
  const router = useRouter();
  const handleClick = () => {
    const currentParams = new URLSearchParams(window.location.search); // 현재 URL 쿼리 그대로 가져오기
    currentParams.set("isPosting", "true"); // postId만 추가 또는 덮어쓰기

    router.push(`?${currentParams.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div
      style={{ height: 24, width: 24,cursor: "pointer" }}
      onClick={handleClick}
      className="flex justify-center items-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
        />
      </svg>
    </div>
  );
}
