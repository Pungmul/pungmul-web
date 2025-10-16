import { useMemo } from "react";
import { Message, MessageList } from "../types";
import { ChatRoomDto } from "../types";
import { InfiniteData } from "@tanstack/react-query";

interface UseMessageListProps {
  chatRoomData?: ChatRoomDto;
  infiniteData?: InfiniteData<MessageList, unknown> | undefined;
  socketMessages: Message[];
}

export const useMessageList = ({
  chatRoomData,
  infiniteData,
  socketMessages,
}: UseMessageListProps) => {
  return useMemo(() => {
    // 중복 제거용 Map
    const messageMap = new Map<string, Message>();

    // infiniteData 페이지의 메시지 추가
    if (infiniteData?.pages) {
      for (const page of infiniteData.pages) {
        if (page?.list) {
          for (const msg of page.list) {
            messageMap.set(String(msg.id), msg);
          }
        }
      }
    }

    // chatRoomData의 메시지 추가
    if (chatRoomData?.messageList?.list) {
      for (const msg of chatRoomData.messageList.list) {
        messageMap.set(String(msg.id), msg);
      }
    }

    // 소켓 메시지 추가
    for (const msg of socketMessages) {
      messageMap.set(String(msg.id), msg);
    }

    // Map을 배열로 변환하고 시간순 정렬
    // Date 객체 캐싱으로 중복 생성 방지
    return Array.from(messageMap.values()).sort((a, b) => {
      // 문자열 비교가 Date 객체 생성보다 빠를 수 있음
      return a.createdAt.localeCompare(b.createdAt);
    });
  }, [chatRoomData, infiniteData, socketMessages]);
};
