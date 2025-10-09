import { BoardData } from "@/features/board";

export const loadBoardDetails = async (
  boardId: number
): Promise<BoardData> => {
  const response = await fetch(`/api/boards/${boardId}/info`, {
    credentials: "include",
  });

  if (!response.ok)
    throw new Error("게시판 정보 로드 실패: " + response.status);

  return response.json();
};
