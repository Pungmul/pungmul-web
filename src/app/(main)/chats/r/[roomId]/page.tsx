"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Header } from "@/shared/components";
import {
  useChatRoomQuery,
  useSendTextMessageMutation,
  useSendImageMessageMutation,
  useExitChatMutation,
} from "@/features/chat/api/chatRoomHooks";
import {
  useRoomReadSocket,
  useRoomMessageSocket,
} from "@/features/chat/socket";

import { AnimatePresence } from "framer-motion";
import {
  ChatSendForm,
  ChatMessageList,
  ChatDrawer,
  Message,
} from "@/features/chat";
import { useSuspenseGetMyPageInfo } from "@/features/my-page";

// CSR로 완전 전환 - 서버 렌더링 비활성화

export default function Page() {
  const { roomId } = useParams();
  const { data: myInfo } = useSuspenseGetMyPageInfo();
  const router = useRouter();

  const wholeRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  // React Query 훅 사용
  const { data: chatRoomData, isLoading } = useChatRoomQuery(roomId as string);
  const [chatLog, setChatLog] = useState<Message[]>(
    chatRoomData?.messageList.list || []
  );

  const sendTextMessageMutation = useSendTextMessageMutation();
  const sendImageMessageMutation = useSendImageMessageMutation();
  const exitChatMutation = useExitChatMutation();

  // 소켓 훅 사용
  const { readSign } = useRoomReadSocket(roomId as string);
  const { isConnected: messageConnected } = useRoomMessageSocket(
    roomId as string,
    {
      onMessage: (message: Message) => {
        
        console.log(message, "chatMessage");
        if (message.chatType === "TEXT") {
          const chatMessage: Message = {
            id: message.id,
            senderUsername: message.senderUsername,
            content: message.content,
            chatType: message.chatType,
            imageUrlList: message.imageUrlList,
            chatRoomUUID: message.chatRoomUUID,
            createdAt: message.createdAt || Date.now().toString(),
          };
          setChatLog((prevChatLog) => [...prevChatLog, chatMessage]);
          readSign();
        } else if (message.chatType === "IMAGE") {
          const chatMessage: Message = {
            id: message.id,
            senderUsername: message.senderUsername,
            content: message.content,
            chatType: message.chatType,
            imageUrlList: message.imageUrlList,
            chatRoomUUID: message.chatRoomUUID,
            createdAt: message.createdAt || Date.now().toString(),
          };

          setChatLog((prevChatLog) => [...prevChatLog, chatMessage]);
          readSign();
        }
      },
      onAlarm: (message) => {
        console.log(message, "alarm message");
      },
    }
  );

  // 채팅방 데이터에서 필요한 정보 추출
  const userList = chatRoomData?.userInfoList || [];
  const loading = isLoading;

  const onSendMessage = useCallback(
    async (message: string) => {
      const messagePayload = {
        content: message,
      };
      try {
        await sendTextMessageMutation.mutateAsync({
          roomId: roomId as string,
          message: messagePayload,
        });
      } catch {
        alert("채팅 전송에 실패했습니다.");
      }
    },
    [roomId, sendTextMessageMutation]
  );

  const onSendImage = useCallback(
    async (files: FileList) => {
      try {
        const formData = new FormData();
        if (!files) throw new Error("파일이 없습니다.");
        Array.from(files).forEach((file) => {
          formData.append("files", file);
        });
        await sendImageMessageMutation.mutateAsync({
          roomId: roomId as string,
          formData,
        });
      } catch (error) {
        if (error instanceof Error) {
          alert("채팅 전송에 실패했습니다.\n" + error.message);
        } else {
          alert("채팅 전송에 실패했습니다.");
        }
      }
    },
    [roomId, sendImageMessageMutation]
  );

  const onExitChat = useCallback(async () => {
    if (!confirm("채팅방을 나가시겠습니까?")) return;
    exitChatMutation.mutate(roomId as string, {
      onSuccess: () => {
        router.push("/chats/r/inbox");
      },
      onError: (error) => {
        console.error("채팅방 나가기 실패", error);
      },
    });
  }, [roomId, router, exitChatMutation]);

  // 채팅방 데이터가 로드되면 title 설정
  useEffect(() => {
    if (chatRoomData) {
      setTitle(
        chatRoomData.chatRoomInfo.group
          ? `${chatRoomData.chatRoomInfo.roomName} (${chatRoomData.userInfoList.length})`
          : chatRoomData.chatRoomInfo.roomName
      );
    }
  }, [chatRoomData]);

  useEffect(() => {
    if (title) {
      document.title = `풍물 머시기 | ${title}`;
    } else {
      document.title = "풍물 머시기 | 채팅";
    }
  }, [title]);

  return (
    <AnimatePresence mode="wait">
      <div className="flex flex-col h-full bg-white relative overflow-y-auto overflow-x-hidden">
        <Header
          title={title}
          onLeftClick={() => router.push("/chats/r/inbox")}
          rightBtn={
            <div
              className="w-10 h-10 flex items-center justify-center cursor-pointer"
              onClick={() => setDrawerOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 32 32"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-12 fill-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </div>
          }
        />
        {loading || !messageConnected ? (
          <div className="flex justify-center items-center h-full">
            {roomId}번 방 로딩중...
          </div>
        ) : (
          <div className="h-full flex flex-col-reverse gap-2 flex-grow overflow-y-auto">
            <div
              ref={wholeRef}
              style={{ backgroundColor: "#FFF", padding: "24px 0" }}
              className="flex-grow"
            >
              <ChatMessageList
                messages={chatLog}
                userList={userList}
                currentUserId={myInfo?.username ?? ""}
              />
            </div>
          </div>
        )}
        <ChatSendForm onSendMessage={onSendMessage} onSendImage={onSendImage} />
        <ChatDrawer
          drawerOpen={drawerOpen}
          onExitChat={onExitChat}
          userList={userList}
          onClose={() => setDrawerOpen(false)}
        />
      </div>
    </AnimatePresence>
  );
}
