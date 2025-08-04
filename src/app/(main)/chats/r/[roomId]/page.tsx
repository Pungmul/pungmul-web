"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Client } from "@stomp/stompjs";
import { Header } from "@/shared/components";
import { useToken } from "@/features/auth";
import { mySocketFactory } from "@pThunder/core";
import {
  loadChatLogs,
  sendImageContent,
  sendTextConent,
  exitChat,
} from "@/features/chat/api/apis";

import { User } from "@/features/member/types";
import { AnimatePresence } from "framer-motion";
import { Message,ChatRoomDto, ChatSendForm, ChatMessageList, ChatDrawer } from "@/features/chat";
import { useGetMyPageInfo } from "@/features/my-page";

export const dynamic = "force-dynamic";

export default function Page() {
  const { roomId } = useParams();
  const { data: myInfo } = useGetMyPageInfo();
  const token = useToken();
  const router = useRouter();
  
  const wholeRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<Client | null>(null);
  
  const [title, setTitle] = useState("");
  const [userList, setUserList] = useState<User[]>([]);
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const onSendMessage = useCallback(
    async (message: string) => {
      const messagePayload = {
        content: message,
      };
      try {
        await sendTextConent(roomId as string, messagePayload);
      } catch {
        alert("채팅 전송에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    },
    [roomId]
  );

  const onSendImage = useCallback(
    async (files: FileList) => {
      try {
        const formData = new FormData();
        if (!files) throw new Error("파일이 없습니다.");
        Array.from(files).forEach((file) => {
          formData.append("files", file);
        });
        await sendImageContent(roomId as string, formData);
      } catch (error) {
        if (error instanceof Error) {
          alert("채팅 전송에 실패했습니다.\n" + error.message);
        } else {
          alert("채팅 전송에 실패했습니다.");
        }
      } finally {
      }
    },
    [roomId]
  );

  // const onInviteUser = useCallback(async () => {
  //   try {
  //     await inviteUser(roomId as string, { newUsernameList: ["test"] });
  //   } catch (error) {
  //     console.error("초대 실패", error);
  //   } finally {
  //     setDrawerOpen(false);
  //   }
  // }, [roomId, setDrawerOpen]);

  const onExitChat = useCallback(async () => {
    if (!confirm("채팅방을 나가시겠습니까?")) return;
    try {
      await exitChat(roomId as string);
      clientRef.current?.deactivate();
      router.push("/chats/r/inbox");
    } catch (error) {
      console.error("채팅방 나가기 실패", error);
    }
  }, [roomId, router]);

  useEffect(() => {
    const initLoadChatLogs = async () => {
      try {
        setLoading(true);
        const data = (await loadChatLogs(roomId as string)) as ChatRoomDto;

        setUserList(data.userInfoList);
        setChatLog(data.messageList.list);
        setTitle(
          data.chatRoomInfo.group
            ? `${data.chatRoomInfo.roomName} (${data.userInfoList.length})`
            : data.chatRoomInfo.roomName
        );
      } catch (error) {
        console.error("채팅 로그 로드 실패", error);
      } finally {
        setLoading(false);
      }
    };

    initLoadChatLogs();
  }, [roomId]);

  useEffect(() => {
    if (!token) {
      console.error("Token is not found");
      return;
    }

    const stompClient = new Client({
      webSocketFactory: () => mySocketFactory(),
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => {
        console.log("✅ 연결 완료");
        setLoading(false);
        console.log(roomId, "roomId");

        stompClient.subscribe(`/sub/chat/alarm/${roomId}`, (message) => {
          // {
          //   "messageLogId":189,
          //   "domainType":"CHAT",
          //   "businessIdentifier":"alarm",
          //   "identifier":"3b928aa1-26f7-418f-ba4b-e7a9360453eb",
          //   "stompDest":"/sub/chat/alarm/3b928aa1-26f7-418f-ba4b-e7a9360453eb",
          //   "content":"{\"content\":\"김진현 님이 나갔습니다.\"}"
          // }
          const parsedMessage = JSON.parse(message.body);
          console.log(parsedMessage, "message");
        });

        stompClient.subscribe(`/sub/chat/message/${roomId}`, (message) => {
          const parsedMessage = JSON.parse(message.body);
          console.log(parsedMessage, "message");
          if (parsedMessage.chatType === "TEXT") {
            const chatMessage: Message = {
              id: parsedMessage.id,
              senderUsername: parsedMessage.senderUsername,
              content: parsedMessage.content,
              chatType: parsedMessage.chatType,
              imageUrlList: parsedMessage.imageUrlList,
              chatRoomUUID: parsedMessage.chatRoomUUID,
              createdAt: parsedMessage.createdAt || Date.now().toString(),
            };
            console.log(chatMessage, "chatMessage");
            setChatLog((prevChatLog) => [...prevChatLog, chatMessage]);
          } else if (parsedMessage.chatType === "IMAGE") {
            const chatMessage: Message = {
              id: parsedMessage.id,
              senderUsername: parsedMessage.senderUsername,
              content: parsedMessage.content,
              chatType: parsedMessage.chatType,
              imageUrlList: parsedMessage.imageUrlList,
              chatRoomUUID: parsedMessage.chatRoomUUID,
              createdAt: parsedMessage.createdAt || Date.now().toString(),
            };

            setChatLog((prevChatLog) => [...prevChatLog, chatMessage]);
          }
        });

        stompClient.subscribe(`/sub/chat/read/${roomId}`, (message) => {
          console.log(message, "read message");
        });

        stompClient.publish({
          destination: `/pub/chat/read/${roomId}`,
          body: JSON.stringify(roomId),
        });


        console.log("Sending message:", {
          roomId: roomId,
        });
      },
      onStompError: (frame) => {
        console.error("❌ STOMP 에러 발생", frame);
      },
    });

    stompClient.activate();
    clientRef.current = stompClient;

    return () => {
      clientRef.current?.deactivate();
    };
  }, [roomId, token]);

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
        {loading ? (
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
        <ChatSendForm
          onSendMessage={onSendMessage}
          onSendImage={onSendImage}
        />
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
