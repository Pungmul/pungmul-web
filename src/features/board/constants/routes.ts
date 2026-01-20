/** 자유 게시판 등 고정 보드 ID – 한 곳에서 변경 가능 */
export const FREE_BOARD_ID = 1;

export function getBoardRoute(boardId: number | string): string {
  return `/board/${boardId}`;
}

export const ROUTES = {
  FREE_BOARD: getBoardRoute(FREE_BOARD_ID),
} as const;
