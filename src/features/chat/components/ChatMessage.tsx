import React from "react";

interface ChatMessageProps {
  message: string;
  timestamp?: string;
  isUser: boolean;
  isRead: boolean;
}

const ChatMessageComponent: React.FC<ChatMessageProps> = ({
  message,
  timestamp,
  isUser,
  isRead,
}) => {
  return (
    <div className="px-[24px]">
      <div
        className={
          "flex items-end gap-2" + (isUser ? " flex-row-reverse" : " flex-row")
        }
      >
        <div
          className={
            "text-[13px] lg:text-[15px] font-light px-[12px] py-[8px] rounded-[8px] lg:rounded-[12px]" +
            (isUser
              ? " bg-[#816DFF] text-white"
              : " bg-white text-black border-[#EEE] border-[1px]")
          }
        >
          {message}
        </div>
        <div className="flex flex-col justify-end min-w-[56px] lg:min-w-[72px] gap-[4px]">
          {isRead && timestamp && (
            <div
              className={
                "text-[#DDD] text-[11px] lg:text-[12px]" +
                (isUser ? " self-start" : " self-end")
              }
            >
              읽음
            </div>
          )}
          {timestamp && (
            <div
              className={
                "text-[#DDD] text-[11px] lg:text-[13px]" +
                (isUser ? " self-start" : " self-end")
              }
            >
              {timestamp}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ChatMessage = React.memo(ChatMessageComponent);
