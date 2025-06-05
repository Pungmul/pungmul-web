"use client";

import { Modal } from "@/shared/components";
import { PostReportTypes } from "@/shared/constants/post";
import { ReportPostBody } from "@/shared/types/post/type";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "@/store/share/toastStore";

function PostMenu({ isWriter }: { isWriter: boolean }) {
  const [isOpen, setOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<PostReportType | null>(
    null
  );

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (isOpen)
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
        }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClick);
    }

    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  const handleReportClick = () => {
    setModalOpen(true); // 신고 클릭 시 모달 열기
    setOpen(false); // 메뉴 닫기
    setSelectedOption(null);
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.currentTarget.id as PostReportType);
  };
  const router = useRouter();

  const postId = useSearchParams().get("postId");

  const handleReportSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedOption) return;

    const body: ReportPostBody = {
      reportReason: selectedOption,
    };

    console.log(body);

    const response = await fetch(`/board/post/${postId}/report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    if (response.ok) {
      setModalOpen(false);
      Toast.show({
        message: "신고가 접수되었습니다.",
      });
    }
  };

  const handleDeleteClick = async () => {
    try {
      const response = await fetch(`/board/post/${postId}/delete`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        router.back();
      } else {
        const errorText = await response.text();
        console.log(errorText);
        alert("삭제에 실패했습니다." + errorText);
      }
    } catch (error) {
      console.error(error);
      alert("삭제에 실패했습니다." + error);
    }
  };
  return (
    <>
      <div
        ref={containerRef}
        className="relative select-none cursor-pointer"
        onClick={() => {
          setOpen((prev) => !prev);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
          />
        </svg>
        {isOpen && (
          <ul
            className="absolute right-0 top-full px-3 py-2 border mt-2 bg-white rounded-sm flex flex-col gap-2"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {isWriter && (
              <li
                className="w-12 text-right"
                onClick={() => {
                  const currentParams = new URLSearchParams(
                    window.location.search
                  ); // 현재 URL 쿼리 그대로 가져오기

                  currentParams.set("isPosting", "true"); // isPosting 추가

                  router.push(`?${currentParams.toString()}`, {
                    scroll: false,
                  });
                }}
              >
                수정
              </li>
            )}
            {!isWriter && (
              <li className="w-12 text-right" onClick={handleReportClick}>
                신고
              </li>
            )}
            {isWriter && (
              <li
                className="w-12 text-right text-red-400"
                onClick={handleDeleteClick}
              >
                삭제
              </li>
            )}
          </ul>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        title="게시글 신고하기"
      >
        <form
          className="flex flex-col gap-4 justify-center items-center w-full h-full"
          onSubmit={handleReportSubmit}
        >
          <div className="text-left w-full bg-[#F4F4F4] py-3 px-4 rounded">
            <div>제목: 어쩌구 저쩌구</div>
            <div>작성자: 어쩌구 저쩌구</div>
          </div>

          <div className="px-2 text-left w-full text-[#8A8A8A]">사유 선택</div>

          <ul className="w-full border border-[#EAEAEA] py-3 px-4 rounded gap-4 flex flex-col">
            {Object.entries(PostReportTypes).map(([key, value]) => (
              <li key={key}>
                <label
                  htmlFor={key}
                  className="flex items-center cursor-pointer"
                >
                  <input
                    type="radio"
                    id={key}
                    name="options"
                    className="hidden peer"
                    onChange={handleRadioChange}
                  />
                  <span className="w-6 h-6 mr-2 border-2 border-gray-400 rounded-full peer-checked:bg-[#816DFF] peer-checked:border-[#816DFF]"></span>
                  {value}
                </label>
              </li>
            ))}
          </ul>
          <button
            type="submit"
            className="w-full py-4 rounded-md mt-2 disabled:bg-[#CDC5FF] disabled:cursor-not-allowed  bg-[#816DFF] text-white peer-checked:enabled:bg-[#816DFF]"
            disabled={selectedOption === null}
            title="신고하기"
          >
            신고하기
          </button>
        </form>
      </Modal>
    </>
  );
}

export default PostMenu;
