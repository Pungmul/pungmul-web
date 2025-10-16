"use client";
import React, { useCallback, useRef } from "react";
import { Message } from "../../types";
import { ChatMessage } from "../element/ChatMessage";
import { ImageMessage } from "../element/ImageMessage";
import dayjs from "dayjs";
import DateItem from "./DateItem";
import getScrollableParent from "@/shared/lib/getScrollableParent";

interface UserImageMap {
  [key: string]: string | null;
}

interface UserNameMap {
  [key: string]: string | null;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  userImageMap: UserImageMap;
  userNameMap: UserNameMap;
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

const HEADER_HEIGHT = 50;
const DATE_ITEM_HEIGHT = 24;
const MESSAGE_LIST_GAP = 12;

const MessageListComponent: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  userImageMap,
  userNameMap,
}) => {
  const dateRefs = useRef<Map<string, HTMLLIElement | null>>(new Map());
  // 날짜 타임스탬프 클릭 핸들러
  const handleDateClick = useCallback((dateKey: string) => {
    const targetElement = dateRefs.current.get(dateKey);
    if (targetElement) {
      const scrollableParent = getScrollableParent(targetElement);
      if (scrollableParent) {
        const targetTop =
          targetElement.offsetTop -
          HEADER_HEIGHT -
          DATE_ITEM_HEIGHT -
          MESSAGE_LIST_GAP;

        const currentScrollTop = scrollableParent.scrollTop;
        const distance = targetTop - currentScrollTop; // 양수: 아래로 이동, 음수: 위로 이동

        let behavior: ScrollBehavior;

        if (distance < 0) {
          // 위로 이동할 때
          behavior = Math.abs(distance) < 400 ? "smooth" : "auto";
        } else {
          // 아래로 이동할 때
          behavior = distance < 800 ? "smooth" : "auto";
        }

        scrollableParent.scrollTo({
          top: targetTop,
          behavior,
        });
      }
    }
  }, []);

  const renderMessage = useCallback(
    (_message: Message, _prevMessage?: Message, _nextMessage?: Message) => {
      const isUser = _message.senderUsername === currentUserId;
      const timeStamp = TimeFormat(new Date(_message.createdAt));
      const isSameTimeBefore =
        _prevMessage &&
        _message.senderUsername === _prevMessage.senderUsername &&
        TimeFormat(new Date(_message.createdAt)) ===
          TimeFormat(new Date(_prevMessage?.createdAt));

      const isSameTimeAfter =
        _nextMessage &&
        _message.senderUsername === _nextMessage.senderUsername &&
        TimeFormat(new Date(_message.createdAt)) ===
          TimeFormat(new Date(_nextMessage?.createdAt));

      const isSameDate =
        _prevMessage &&
        dayjs(_message.createdAt).format("YYYY.MM.DD ddd") ===
          dayjs(_prevMessage.createdAt).format("YYYY.MM.DD ddd");

      const dateKey = dayjs(_message.createdAt).format("YYYY-MM-DD");

      if (_message.chatType === "TEXT") {
        return (
          <React.Fragment key={_message.id}>
            {!isSameDate && (
              <DateItem
                key={_message.id + "date"}
                date={dayjs(_message.createdAt).format("YYYY.MM.DD ddd")}
                onClick={() => handleDateClick(dateKey)}
              />
            )}
            <li
              className="flex flex-col gap-2"
              key={_message.id}
              ref={(el) => {
                if (!isSameDate) {
                  dateRefs.current.set(dateKey, el);
                }
              }}
            >
              <ChatMessage
                key={_message.id}
                message={_message.content}
                sideContent={
                  _message.createdAt && (
                    <div className="flex flex-col gap-[2px] shrink-0 min-w-fit">
                      <div
                        className={
                          "text-[#DDD] text-[10px] lg:text-[11px]" +
                          (isUser ? " self-start" : " self-end")
                        }
                      >
                        읽음
                      </div>
                      {!isSameTimeAfter && (
                        <div
                          className={
                            "text-[#DDD] text-[10px] lg:text-[11px]" +
                            (isUser ? " self-start" : " self-end")
                          }
                        >
                          {timeStamp}
                        </div>
                      )}
                    </div>
                  )
                }
                isUser={isUser}
                userImageUrl={userImageMap[_message.senderUsername] ?? null}
                senderUsername={userNameMap[_message.senderUsername] ?? ""}
                isProfileRevealed={!isSameTimeBefore}
              />
            </li>
          </React.Fragment>
        );
      } else if (_message.chatType === "IMAGE") {
        return (
          <React.Fragment key={_message.id}>
            {!isSameDate && (
              <DateItem
                key={_message.id + "date"}
                date={dayjs(_message.createdAt).format("YYYY.MM.DD ddd")}
                onClick={() => handleDateClick(dateKey)}
              />
            )}

            <li
              key={_message.id}
              ref={(el) => {
                if (!isSameDate) {
                  dateRefs.current.set(dateKey, el);
                }
              }}
            >
              <ImageMessage
                imageList={_message.imageUrlList || []}
                sideContent={
                  _message.createdAt && (
                    <div className="flex flex-col gap-[2px] shrink-0 min-w-fit">
                      <div
                        className={
                          "text-[#DDD] text-[10px] lg:text-[11px]" +
                          (isUser ? " self-start" : " self-end")
                        }
                      >
                        읽음
                      </div>
                      {!isSameTimeAfter && (
                        <div
                          className={
                            "text-[#DDD] text-[10px] lg:text-[11px]" +
                            (isUser ? " self-start" : " self-end")
                          }
                        >
                          {timeStamp}
                        </div>
                      )}
                    </div>
                  )
                }
                isUser={isUser}
                userImageUrl={userImageMap[_message.senderUsername] ?? null}
                senderUsername={userNameMap[_message.senderUsername] ?? ""}
                isProfileRevealed={!isSameTimeBefore}
              />
            </li>
          </React.Fragment>
        );
      } else if (_message.chatType === "JOIN") {
        const inviter = userNameMap[_message.senderUsername] ?? "";
        return (
          <React.Fragment key={_message.id}>
            {!isSameDate && (
              <DateItem
                key={_message.id + "date"}
                date={dayjs(_message.createdAt).format("YYYY.MM.DD ddd")}
                onClick={() => handleDateClick(dateKey)}
              />
            )}
            <li key={_message.id}>
              <LogMessage>
                {`${inviter}님이 ${_message.content
                  .split("님")[0]!
                  .trim()}님을 초대했습니다.`}
              </LogMessage>
            </li>
          </React.Fragment>
        );
      } else if (_message.chatType === "LEAVE") {
        return (
          <React.Fragment key={_message.id}>
            {!isSameDate && (
              <DateItem
                key={_message.id + "date"}
                date={dayjs(_message.createdAt).format("YYYY.MM.DD ddd")}
                onClick={() => handleDateClick(dateKey)}
              />
            )}
            <LogMessage>{`${_message.content}`}</LogMessage>
          </React.Fragment>
        );
      }

      return null;
    },
    [currentUserId, userImageMap, userNameMap]
  );

  return (
    <ul className="flex flex-col list-none gap-[12px]">
      {messages.map((message, index) => {
        const prevMessage = messages[index - 1];
        const nextMessage = messages[index + 1];
        return renderMessage(message, prevMessage, nextMessage);
      })}
    </ul>
  );
};

export const MessageList = React.memo(MessageListComponent);

const LogMessage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex flex-row justify-center items-end">
      <div className="text-grey-500 bg-grey-100 px-2 py-1 h-full flex items-center rounded-md text-xs lg:text-sm">
        {children}
      </div>
    </div>
  );
};
