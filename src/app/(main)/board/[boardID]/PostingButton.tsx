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
      style={{ height: 24, width: 48, textAlign: "right", cursor: "pointer" }}
      onClick={handleClick}
    >
      글쓰기
    </div>
  );
}
