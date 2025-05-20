import { createContext, useContext, useState } from "react";
import ReportCommentModal from "@/features/board/comment/components/ReportCommentModal";
import { ReportedComment } from "@/shared/types/comment/type";

interface ReportCommentContextType {
  openModalToReport: (comment: ReportedComment) => void;
  closeModal: () => void;
}

export const ReportCommentContext =
  createContext<ReportCommentContextType | null>(null);

export const ReportCommentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [reportedComment, setReportedComment] = useState<ReportedComment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalToReport = (comment: ReportedComment) => {
    setReportedComment(comment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <ReportCommentContext.Provider
      value={{ openModalToReport, closeModal }}
    >
      {reportedComment && (
        <ReportCommentModal
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          comment={reportedComment}
        />
      )}
      {children}
    </ReportCommentContext.Provider>
  );
};

export const useReportComment = () => {
  const context = useContext(ReportCommentContext);
  if (!context)
    throw new Error(
      "댓글 신고 컨텍스트 프로바이더에 포함되지 않은 컴포넌트 입니다."
    );
  return context;
};
