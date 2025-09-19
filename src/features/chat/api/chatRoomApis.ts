import { ChatMessageDto, ChatRoomDto } from "@/features/chat";
import { getQueryClient } from "@pThunder/core";

export const loadChatRoomInfo = async (
  roomId: string
): Promise<ChatRoomDto> => {
  const response = await fetch(`/api/chats/${roomId}/info`, {
    credentials: "include",
    method: "GET",
  });
  return response.json();
};

// 채팅 로그 로드 (페이지네이션 지원)
export const loadChatLogs = async (
  roomId: string,
  page: number = 2
): Promise<ChatMessageDto> => {
  const response = await fetch(`/api/chats/${roomId}/message?page=${page}`, {
    credentials: "include",
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("채팅 로그를 불러오는데 실패했습니다.");
  }

  const data: ChatMessageDto = await response.json();
  return { ...data, pageNum: page };
};

// 텍스트 메시지 전송
export const sendTextContent = async (
  roomId: string,
  message: { content: string }
): Promise<void> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 5000);
  const signal = controller.signal;
  const response = await fetch(`/api/chats/${roomId}/text`, {
    credentials: "include",
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  clearTimeout(timeout);

  if (!response.ok) {
    throw new Error("메시지 전송에 실패했습니다.");
  }
};

// 이미지 메시지 전송
export const sendImageContent = async (
  roomId: string,
  formData: FormData
): Promise<void> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 5000);

  const signal = controller.signal;
  const response = await fetch(`/api/chats/${roomId}/images`, {
    credentials: "include",
    method: "POST",
    signal,
    body: formData,
  });

  clearTimeout(timeout);

  if (!response.ok) {
    throw new Error("이미지 전송에 실패했습니다.");
  }
};

// 채팅방 나가기
export const exitChat = async (roomId: string): Promise<void> => {
  const response = await fetch(`/api/chats/${roomId}/exit`, {
    credentials: "include",
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("채팅방 나가기에 실패했습니다.");
  }
};

// 사용자 초대 (주석 처리된 부분)
export const inviteUser = async (
  roomId: string,
  data: { newUsernameList: string[] }
): Promise<void> => {
  const response = await fetch(`/api/chats/${roomId}/invites`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("사용자 초대에 실패했습니다.");
  }
};

export const prefetchChatRoomData = async (roomId: string) => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["chatRoom", roomId],
    queryFn: () => loadChatLogs(roomId),
  });
  return queryClient;
};
