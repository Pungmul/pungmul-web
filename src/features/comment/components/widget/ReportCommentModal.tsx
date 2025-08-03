"use client";
import { useEffect, useState } from "react";
import { Modal } from "@/shared/components";
import {
  CommentReportType,
  CommentReportTypes,
} from "@/shared/constants/comment";
import { Toast } from "@/store/share/toastStore";
import {
  useReportCommentModal,
  useReportComment,
} from "../../store/ReportCommentStore";
import { useReportComment as useReportCommentAPI } from "../../api/reportComment";

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
    >
      <form
        className="flex flex-col gap-4 justify-center items-center w-full h-full"
        onSubmit={handleReportSubmit}
      >
        <div className="text-left w-full bg-[#F4F4F4] py-3 px-4 rounded">
          <div>댓글 내용: {reportedComment?.content}</div>
          <div>작성자: {reportedComment?.userName}</div>
        </div>

        <div className="px-2 text-left w-full text-[#8A8A8A]">사유 선택</div>

        <ul className="w-full border border-[#EAEAEA] py-3 px-4 rounded gap-4 flex flex-col">
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
                <span className="w-6 h-6 mr-2 border-2 border-gray-400 rounded-full peer-checked:bg-[#816DFF] peer-checked:border-[#816DFF]"></span>
                {value}
              </label>
            </li>
          ))}
        </ul>
        <button
          type="submit"
          className="w-full py-4 rounded-md mt-2 disabled:bg-[#CDC5FF] disabled:cursor-not-allowed  bg-[#816DFF] text-white peer-checked:enabled:bg-[#816DFF]"
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
