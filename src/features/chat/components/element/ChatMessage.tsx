import React from "react";

interface ChatMessageProps {
  message: string;
  sideContent?: React.ReactNode;
  isUser: boolean;
}

const ChatMessageComponent: React.FC<ChatMessageProps> = ({
  message,
  sideContent,
  isUser,
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
        {sideContent && <>{sideContent}</>}
      </div>
    </div>
  );
};

export const ChatMessage = React.memo(ChatMessageComponent);