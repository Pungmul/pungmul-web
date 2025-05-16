"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { Header } from "@pThunder/component/shared/Header";
import { useToken } from "../TokenProvider";
import { loadChatLogs, sendImageContent, sendTextConent } from "./utils";
import { ChatRoomDto, Message, User } from "./types";
import { ChatMessageList } from "./components/ChatMessageList";

export const dynamic = "force-dynamic";

export default function Page() {
  const { roomId } = useParams();
  const token = useToken();

  const wholeRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLInputElement>(null);
  const clientRef = useRef<Client | null>(null);

  const [title, setTitle] = useState("");
  const [userList, setUserList] = useState<User[]>([]);
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);

  const onSendMessage = useCallback(
    // (e: React.FormEvent<HTMLFormElement>) => {
    //   e.preventDefault();

    //   const client = clientRef.current;
    //   if (!client || !client.connected) {
    //     console.warn("WebSocket not connected");
    //     return;
    //   }

    // const trimmedContent = inputValue.trim();
    // if (!trimmedContent) return;

    // const messagePayload = {
    //   content: trimmedContent,
    // };

    //   client.publish({
    //     headers: {
    //       "Authorization": `Bearer ${token}`,
    //       "Content-Type": "application/json",
    //     },
    //     destination: `/pub/chat/message/${roomId}`,
    //     body: JSON.stringify(messagePayload),
    //   });

    //   setInputValue("");
    // },
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmedContent = inputValue.trim();
      if (!trimmedContent) return;
      const messagePayload = {
        content: trimmedContent,
      };
      try {
        await sendTextConent(roomId as string, messagePayload);
        setInputValue("");
      } catch (error) {
        alert("채팅 전송에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    },
    [inputValue, roomId, token]
  );

  const onSendImage = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      try {
        const formData = new FormData();
        const files: Blob[] | null = e.target.files as Blob[] | null;
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
    [inputValue, roomId, token]
  );

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

    const socket = new SockJS(`${process.env.NEXT_PUBLIC_BASE_URL}/ws`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => {
        console.log("✅ 연결 완료");
        setLoading(false);
        console.log(roomId, "roomId");
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

  return (
    <div className="flex flex-col h-full">
      <Header title={title} />
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
              currentUserId="ajtwoddl1236@naver.com"
            />
          </div>
        </div>
      )}
      <form
        className="sticky bottom-0 w-full shadow-up-md"
        onSubmit={onSendMessage}
      >
        <div className="bg-white items-center px-2 py-2">
          <div
            className="flex flex-row items-center px-0.5 py-0.5 rounded-full"
            style={{ backgroundColor: "#F9F9F9" }}
          >
            {inputValue.length === 0 && (
              <label
                // type="image"
                htmlFor="image-upload"
                className="h-9 px-4 bg-[#816DFF] rounded-full text-white justify-center flex flex-col"
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                  multiple={true}
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      onSendImage(e);
                    }
                  }}
                />
                +
              </label>
            )}
            <input
              ref={messageRef}
              type="text"
              name="comment"
              value={inputValue}
              onChange={(e) => setInputValue(e.currentTarget.value)}
              style={{ fontSize: 12 }}
              placeholder="메시지 입력"
              className="bg-transparent outline-none px-2 py-1 flex-grow"
            />
            {inputValue.length !== 0 && (
              <button
                type="submit"
                className="w-9 h-9 bg-[#816DFF] rounded-full text-white"
              >
                ↑
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
