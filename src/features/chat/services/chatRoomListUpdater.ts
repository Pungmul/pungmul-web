import { ChatRoomListItemDto } from "../types";

/**
 * 채팅방 리스트에서 특정 방의 안 읽은 메시지 수를 0으로 리셋합니다.
 *
 * @param rooms - 채팅방 리스트
 * @param roomId - 리셋할 채팅방의 UUID
 * @returns unreadCount가 리셋된 새 배열
 *
 * @example
 * const updatedRooms = resetUnreadCount(rooms, "room-123");
 */
export const resetUnreadCount = (
  rooms: ChatRoomListItemDto[],
  roomId: string,
): ChatRoomListItemDto[] => {
  return rooms.map((room) =>
    room.chatRoomUUID === roomId ? { ...room, unreadCount: 0 } : room,
  );
};

/**
 * 채팅방 리스트에서 특정 방을 제거합니다.
 *
 * @param rooms - 채팅방 리스트
 * @param roomId - 제거할 채팅방의 UUID
 * @returns 해당 방이 제거된 새 배열
 *
 * @example
 * const updatedRooms = removeChatRoom(rooms, "room-123");
 */
export const removeChatRoom = (
  rooms: ChatRoomListItemDto[],
  roomId: string,
): ChatRoomListItemDto[] => {
  return rooms.filter((room) => room.chatRoomUUID !== roomId);
};

/**
 * 채팅방 리스트에서 특정 방의 마지막 메시지 정보를 업데이트합니다.
 *
 * @param rooms - 채팅방 리스트
 * @param roomId - 업데이트할 채팅방의 UUID
 * @param lastMessageContent - 마지막 메시지 내용
 * @param lastMessageTime - 마지막 메시지 시간
 * @returns 업데이트된 새 배열
 */
export const updateLastMessage = (
  rooms: ChatRoomListItemDto[],
  roomId: string,
  lastMessageContent: string,
  lastMessageTime: string,
): ChatRoomListItemDto[] => {
  return rooms.map((room) =>
    room.chatRoomUUID === roomId
      ? { ...room, lastMessageContent, lastMessageTime }
      : room,
  );
};

/**
 * 채팅방 리스트에서 특정 방의 안 읽은 메시지 수를 증가시킵니다.
 *
 * @param rooms - 채팅방 리스트
 * @param roomId - 증가시킬 채팅방의 UUID
 * @param increment - 증가시킬 수 (기본값: 1)
 * @returns unreadCount가 증가된 새 배열
 */
export const incrementUnreadCount = (
  rooms: ChatRoomListItemDto[],
  roomId: string,
  increment: number = 1,
): ChatRoomListItemDto[] => {
  return rooms.map((room) =>
    room.chatRoomUUID === roomId
      ? { ...room, unreadCount: (room.unreadCount ?? 0) + increment }
      : room,
  );
};
