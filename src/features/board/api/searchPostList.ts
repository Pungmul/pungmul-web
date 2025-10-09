import { PostListResponse } from "../types";

export const searchPostList = async (
  boardID: number,
  keyword: string,
  page: number = 0,
  size: number = 10
): Promise<PostListResponse> => {
  const response = await fetch(
    `/api/boards/${boardID}/search?keyword=${keyword}&page=${page}&size=${size}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) throw new Error("검색 결과 로드 실패");

  const { searchPosts } = await response.json();

  return searchPosts;
};
