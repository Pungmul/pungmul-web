/**
 * Chat 관련 React Query 키 상수
 * 모든 쿼리 키를 중앙에서 관리하여 일관성 유지
 */
export const chatQueryKeys = {
  /** 모든 chat 관련 쿼리의 루트 키 */
  all: ["chat"] as const,

  /** 채팅방 리스트 */
  roomList: () => ["chatRoomList"] as const,

  /** 특정 채팅방 정보 */
  room: (roomId: string) => ["chatRoom", roomId] as const,

  /** 특정 채팅방의 무한스크롤 메시지 */
  roomInfinite: (roomId: string) => ["chatRoomInfinite", roomId] as const,

  /** 특정 채팅방 관련 모든 쿼리 (room + roomInfinite) */
  roomAll: (roomId: string) =>
    [["chatRoom", roomId], ["chatRoomInfinite", roomId]] as const,
} as const;

export type ChatQueryKeys = typeof chatQueryKeys;
