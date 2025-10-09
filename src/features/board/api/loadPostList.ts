import { BoardData, PostListResponse } from "../types";

export const loadPostList = async (
  id: number,
  page: number = 0,
  size: number = 10
): Promise<PostListResponse> => {
  const response = await fetch(
    `/api/boards/${id}/list?page=${page}&size=${size}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) throw new Error("게시글 목록 로드 실패");

  const { recentPostList } = (await response.json()) as BoardData;

  return recentPostList;
};
