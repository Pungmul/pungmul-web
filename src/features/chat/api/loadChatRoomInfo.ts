import { ChatRoomDto } from "@/features/chat";

export const loadChatRoomInfo = async (
  roomId: string
): Promise<ChatRoomDto> => {
  const response = await fetch(`/api/chats/${roomId}/info`, {
    credentials: "include",
    method: "GET",
  });
  return response.json();
};
