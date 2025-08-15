"use client";
import { Header } from "@pThunder/shared";
import PostingButton from "@pThunder/features/post/components/element/PostingButton";
import { useRouter } from "next/navigation";
import { Responsive } from "@pThunder/shared/components/Responsive";
import { PencilIcon } from "@heroicons/react/24/outline";

interface BoardHeaderProps {
  boardName: string;
}

export default function BoardHeader({ boardName }: BoardHeaderProps) {
  const router = useRouter();

  const handleClick = () => {
    const currentParams = new URLSearchParams(window.location.search); // 현재 URL 쿼리 그대로 가져오기
    currentParams.set("isPosting", "true"); // postId만 추가 또는 덮어쓰기

    router.push(`?${currentParams.toString()}`, {
      scroll: false,
    });
  };

  return (
    <Responsive
      mobile={
        <Header
          title={boardName}
          rightBtn={<PostingButton />}
          onLeftClick={() => {
            router.replace("/board/main", { scroll: false });
          }}
          className="z-20"
        />
      }
      desktop={
        <>
          <div className="flex flex-col justify-start gap-[12px] mx-auto w-full px-[24px] max-w-[1024px] py-[16px] bg-white">
            <h1 className="text-[27px] font-normal">{boardName}</h1>
            <div className="text-[14px] text-[#B7A6FF]">
              대충 설명을 끄적끄적
            </div>
          </div>
          {boardName !== "인기 게시글" && (
            <div className="fixed bottom-[12px] flex justify-center w-full p-[8px] z-30">
              <button
                className="px-[12px] py-[8px] bg-white rounded-full flex items-center justify-center gap-[8px] border-[1px] border-[#EEE]"
                onClick={handleClick}
              >
                <div className="text-[14px] text-black">게시글 작성</div>
                <div
                  style={{ height: 24, width: 24, cursor: "pointer" }}
                  className="flex justify-center items-center"
                >
                  <PencilIcon className="size-6 text-[#816DFF]" />
                </div>
              </button>
            </div>
          )}
        </>
        // <Header
        //   title={boardName}
        //   rightBtn={<PostingButton />}
        //   onLeftClick={() => {
        //     router.replace("/board/main", { scroll: false });
        //   }}
        // />
      }
    />
  );
}
