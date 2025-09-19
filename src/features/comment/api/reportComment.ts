import { ReportCommentBody } from "../model/index";
import { CommentReportType } from "@/shared/constants/comment";
import { useMutation } from "@tanstack/react-query";
import { getQueryClient } from "@/core";

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

export const useReportComment = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: reportComment,
    mutationKey: ["reportComment"],
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ["postDetail"] });
    },
  });
};
