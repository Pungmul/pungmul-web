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
    (_message: Message, _prevMessage?: Message, _nextMessage?: Message) => {
      const isUser = _message.senderUsername === currentUserId;
      const userName = userList.find(
        (user) => user.username === _message.senderUsername
      )?.name;
      const timeStamp = TimeFormat(new Date(_message.createdAt));
      const isSameTime =
        _nextMessage &&
        _message.senderUsername === _nextMessage.senderUsername &&
        TimeFormat(new Date(_message.createdAt)) ===
          TimeFormat(new Date(_nextMessage?.createdAt));

      if (_message.chatType === "TEXT") {
        if (isSameTime) {
          return (
            <li className="flex flex-col gap-2" key={_message.id}>
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
                key={_message.id}
                message={_message.content}
                sideContent={
                  _message.createdAt && (
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
          <li key={_message.id}>
            <ChatMessage
              key={_message.id}
              message={_message.content}
              sideContent={
                _message.createdAt && (
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
      } else if (_message.chatType === "IMAGE") {
        return (
          <li key={_message.id}>
            <ImageMessage
              imageList={_message.imageUrlList || []}
              sideContent={
                _message.createdAt && (
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
