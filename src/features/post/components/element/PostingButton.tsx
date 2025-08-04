"use client";
import { useRouter } from "next/navigation";
import { PencilIcon } from "@heroicons/react/24/outline";

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
      <PencilIcon className="size-6 text-[#816DFF]" />
    </div>
  );
}
