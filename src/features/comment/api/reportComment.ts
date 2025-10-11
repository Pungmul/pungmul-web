import { ReportCommentBody } from '../types';
import { CommentReportType } from "@/shared/constants/comment";

interface ReportCommentParams {
  commentId: number;
  selectedOption: CommentReportType;
}

export const reportComment = async ({
  commentId,
  selectedOption,
}: ReportCommentParams) => {
  const body: ReportCommentBody = {
    reportReason: selectedOption,
  };

  const response = await fetch(`/api/comments/${commentId}/report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  return response.json();
};