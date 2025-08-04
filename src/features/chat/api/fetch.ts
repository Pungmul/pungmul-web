import { getQueryClient } from "@pThunder/core";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export async function createPersonalChatRoom(body: { receiverName: string }) {
  try {
    const response = await fetch("/chats/create/personal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });
    if (!response.ok) throw Error("비정상 동작");

    const data = await response.json();

    return data;
  } catch (e) {
    console.error(e);
    alert("비정상 동작");
  }
}

export async function createMultiChatRoom(body: { receiverName: string[] }) {
  try {
    if (body.receiverName.length === 0) throw Error("친구를 선택해주세요");

    const response = await fetch("/chats/create/multi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });
    if (!response.ok) throw Error("비정상 동작");

    const data = await response.json();

    return data;
  } catch (e) {
    console.error(e);
    alert("비정상 동작");
  }
}

interface ChatRoomDto {
  chatRoomUUID: string;
  lastMessageTime: string | null;
  lastMessageContent: string | null;
  unreadCount: number | null;
  senderId: number | null;
  senderName: string | null;
  receiverId: number | null;
  receiverName: string | null;
  chatRoomMemberIds: number[];
  chatRoomMemberNames: string[];
  roomName: string;
  profileImageUrl: string | null;
  group: boolean;
}

const loadChatRooms = async (): Promise<ChatRoomDto[]> => {
  try {
    // 서버/클라이언트 환경에 따라 URL 분기
    const proxyUrl = `/chats/roomlist`;

    const response = await fetch(proxyUrl, {
      credentials: "include",
    });

    if (!response.ok) throw Error("서버 불안정" + response.status);

    const { list: data } = await response.json();

    return data;
  } catch (e) {

    throw e;
  }
}

export const useChatRoomsQuery = () => {
  return useQuery({
    queryKey: ["chatRooms"],
    queryFn: loadChatRooms,
    retry: 2,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
};

export const prefetchChatRooms = () => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: ["chatRooms"],
    queryFn: loadChatRooms,
  });
  return queryClient;
};