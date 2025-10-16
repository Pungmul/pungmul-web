import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Message, ChatRoomDto } from "../types";
import dayjs from "dayjs";

interface UseSocketMessageHandlerProps {
  roomId: string;
  myInfo?: { username: string };
  setSocketMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setPendingMessages: React.Dispatch<React.SetStateAction<(Message & { state: "pending" | "failed" })[]>>;
  readSign: () => void;
}

export const useSocketMessageHandler = ({
  roomId,
  myInfo,
  setSocketMessages,
  setPendingMessages,
  readSign,
}: UseSocketMessageHandlerProps) => {
  const queryClient = useQueryClient();

  const updateMessages = useCallback((newMessage: Message) => {
    setSocketMessages((prev) => [...prev, newMessage]);
    
    queryClient.setQueryData(["chatRoom", roomId], (prevData: ChatRoomDto): ChatRoomDto => ({
      ...prevData,
      messageList: {
        ...prevData?.messageList,
        list: [...(prevData?.messageList?.list || []), newMessage],
      },
    }));
  }, [roomId, queryClient, setSocketMessages]);

  const handleTextMessage = useCallback((message: Message) => {
    // 내가 보낸 메시지인 경우 pendingMessages에서 제거
    if (message.senderUsername === myInfo?.username) {
      setPendingMessages((prev) => {
        const idx = prev.findIndex((msg) => msg.content === message.content);
        if (idx === -1) return prev;
        return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
      });
    }

    const chatMessage: Message = {
      id: message.id,
      senderUsername: message.senderUsername,
      content: message.content || "",
      chatType: "TEXT",
      imageUrlList: null,
      chatRoomUUID: message.chatRoomUUID,
      createdAt: message.createdAt || dayjs().format("YYYY-MM-DD HH:mm:ss"),
    };

    updateMessages(chatMessage);
    readSign();
  }, [myInfo?.username, setPendingMessages, updateMessages, readSign]);

  const handleImageMessage = useCallback((message: Message) => {
    const chatMessage: Message = {
      id: message.id,
      senderUsername: message.senderUsername,
      content: null,
      chatType: "IMAGE",
      imageUrlList: message.imageUrlList || [],
      chatRoomUUID: message.chatRoomUUID,
      createdAt: message.createdAt || dayjs().format("YYYY-MM-DD HH:mm:ss"),
    };

    updateMessages(chatMessage);
    readSign();
  }, [updateMessages, readSign]);

  return {
    handleTextMessage,
    handleImageMessage,
  };
};
