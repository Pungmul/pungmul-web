import React, { useCallback } from "react";
import { Message } from "../../types";
import { ChatMessage } from "../element/ChatMessage";
import { ImageMessage } from "../element/ImageMessage";

interface MessageListProps {
  messages: Message[];
  userList: { username: string; name: string }[];
  currentUserId: string;
}

const TimeFormat = (time: Date): string => {
  const Hours = time.getHours();
  const Minutes = time.getMinutes();

  if (Hours === 0) return "오전 12:00";
  if (Hours < 12)
    return `오전 ${Hours.toString().padStart(
      2,
      "0"
    )}:${Minutes.toString().padStart(2, "0")}`;
  if (Hours === 12) return `오후 12:00`;
  return `오후 ${(Hours - 12)
    .toString()
    .padStart(2, "0")}:${Minutes.toString().padStart(2, "0")}`;
};

const MessageListComponent: React.FC<MessageListProps> = ({
  messages,
  userList,
  currentUserId,
}) => {
  const renderMessage = useCallback(
    (message: Message, prevMessage?: Message, nextMessage?: Message) => {
      const isUser = message.senderUsername === currentUserId;
      const userName = userList.find(
        (user) => user.username === message.senderUsername
      )?.name;
      const timeStamp = TimeFormat(new Date(message.createdAt));
      const isSameTime =
        nextMessage &&
        message.senderUsername === nextMessage.senderUsername &&
        TimeFormat(new Date(message.createdAt)) ===
          TimeFormat(new Date(nextMessage?.createdAt));

      if (message.chatType === "TEXT") {
        if (isSameTime) {
          return (
            <li className="flex flex-col gap-2" key={message.id}>
              {!isUser && (
                <div
                  className={`${
                    isUser ? "self-end" : "self-start"
                  } px-[24px] font-light text-[#cdcdcd] text-[11px]`}
                >
                  {userName}
                </div>
              )}
              <ChatMessage
                key={message.id}
                message={message.content}
                sideContent={
                  message.createdAt && (
                    <div>
                      <div
                        className={
                          "text-[#DDD] text-[10px] lg:text-[11px]" +
                          (isUser ? " self-start" : " self-end")
                        }
                      >
                        읽음
                      </div>
                    </div>
                  )
                }
                isUser={isUser}
              />
            </li>
          );
        }

        return (
          <li key={message.id}>
            <ChatMessage
              key={message.id}
              message={message.content}
              sideContent={
                message.createdAt && (
                  <div className="flex flex-col gap-[2px]">
                    <div
                      className={
                        "text-[#DDD] text-[10px] lg:text-[11px]" +
                        (isUser ? " self-start" : " self-end")
                      }
                    >
                      읽음
                    </div>
                    <div
                      className={
                        "text-[#DDD] text-[10px] lg:text-[11px]" +
                        (isUser ? " self-start" : " self-end")
                      }
                    >
                      {timeStamp}
                    </div>
                  </div>
                )
              }
              isUser={isUser}
            />
          </li>
        );
      } else if (message.chatType === "IMAGE") {
        return (
          <li key={message.id}>
            <ImageMessage
              imageList={message.imageUrlList || []}
              sideContent={
                message.createdAt && (
                  <div
                    className={
                      "text-[#DDD] text-[10px] lg:text-[11px]" +
                      (isUser ? " self-start" : " self-end")
                    }
                  >
                    읽음
                  </div>
                )
              }
              isUser={isUser}
            />
          </li>
        );
      }

      return null;
    },
    [userList, currentUserId]
  );

  return (
    <ul className="flex flex-col list-none" style={{ gap: 12 }}>
      {messages.map((message, index) => {
        const prevMessage = messages[index - 1];
        const nextMessage = messages[index + 1];
        return renderMessage(message, prevMessage, nextMessage);
      })}
    </ul>
  );
};

export const MessageList = React.memo(MessageListComponent);
