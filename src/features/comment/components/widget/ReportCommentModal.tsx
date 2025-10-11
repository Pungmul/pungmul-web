"use client";
import { useEffect, useState } from "react";
import { Modal } from "@/shared/components";
import {
  CommentReportType,
  CommentReportTypes,
} from "@/shared/constants/comment";
import { Toast } from "@/shared/store";
import {
  useReportCommentModal,
  useReportComment,
} from "../../store/reportCommentStore";
import { useReportComment as useReportCommentAPI } from "../../queries/useReportComment";
import { CheckIcon } from "@heroicons/react/24/outline";

const ReportCommentModal: React.FC = () => {
  const { reportedComment, isModalOpen } = useReportCommentModal();
  const { closeModal } = useReportComment();
  const { mutate: reportComment, isPending } = useReportCommentAPI();

  const [selectedOption, setSelectedOption] =
    useState<CommentReportType | null>(null);

  useEffect(() => {
    setSelectedOption(null);
  }, [isModalOpen]);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.currentTarget.id as CommentReportType);
  };

  const handleReportSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedOption || !reportedComment) return;
    reportComment(
      {
        commentId: reportedComment.commentId,
        selectedOption,
      },
      {
        onSuccess: () => {
          Toast.show({
            message: "신고가 접수되었습니다.",
          });
          closeModal();
        },
        onError: () => {
          Toast.show({
            message: "신고 접수에 실패했습니다.",
          });
        },
      }
    );
  };

  if (!reportedComment) return null;

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      title="댓글 신고하기"
      className="border-none"
    >
      <form
        className="flex flex-col gap-4 justify-center items-center w-full h-full py-[12px]"
        onSubmit={handleReportSubmit}
      >
        <div className="text-left w-full bg-grey-200 py-3 px-4 rounded">
          <div>댓글 내용: {reportedComment?.content}</div>
          <div>작성자: {reportedComment?.userName}</div>
        </div>

        <div className="px-2 text-left w-full text-grey-400">사유 선택</div>

        <ul className="w-full border border-grey-100 py-3 px-4 rounded gap-4 flex flex-col">
          {Object.entries(CommentReportTypes).map(([key, value]) => (
            <li key={key}>
              <label htmlFor={key} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  id={key}
                  name="options"
                  className="hidden peer"
                  onChange={handleRadioChange}
                />
                <span className="w-6 h-6 mr-2 border-2 border-grey-400 rounded-full peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100">
                  <CheckIcon className="size-3 text-white stroke-2" />
                </span>
                {value}
              </label>
            </li>
          ))}
        </ul>
        <button
          type="submit"
          className="w-full py-4 rounded-md mt-2 disabled:bg-primary-light disabled:cursor-not-allowed  bg-primary-dark text-white peer-checked:enabled:bg-primary"
          disabled={selectedOption === null || isPending}
          title="신고하기"
        >
          {isPending ? "신고 중..." : "신고하기"}
        </button>
      </form>
    </Modal>
  );
};

export { ReportCommentModal };
export default ReportCommentModal;
