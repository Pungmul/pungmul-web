import { PostReportType } from "@/shared/constants/post";

interface ReportPostParams {
  postId: number;
  selectedOption: PostReportType;
}

export const reportPost = async ({
  postId,
  selectedOption,
}: ReportPostParams) => {
  const body = {
    reportReason: selectedOption,
  };

  const response = await fetch(`/api/posts/${postId}/report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("신고 접수에 실패했습니다.");
  }

  return response.json();
};

