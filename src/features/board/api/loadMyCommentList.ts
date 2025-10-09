import type { MyCommentResponse } from "@/features/comment";

export const loadMyCommentList = async (
  pageParam: number
): Promise<MyCommentResponse> => {
  const response = await fetch(`/api/comments/me?page=${pageParam}`, {
    credentials: "include",
  });
  const data = await response.json();
  return data;
};

