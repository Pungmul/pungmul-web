import React, { useCallback } from "react";
import { Message } from "../../types";
import { ChatMessage } from "../element/ChatMessage";
import { ImageMessage } from "../element/ImageMessage";
import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/outline";

type PendingMessage = Message & { state: "pending" | "failed" };

interface PendingMessageListProps {
  messages: PendingMessage[];

  onResendText: (message: string) => void;
  onResendImage: (imageList: FileList) => void;

  onDeleteMessage: (message: PendingMessage) => void;
}

const PendingMessageListComponent: React.FC<PendingMessageListProps> = ({
  messages,
  onResendText,
  onResendImage,
  onDeleteMessage,
}) => {
  const renderMessage = useCallback((message: PendingMessage) => {
    if (message.chatType === "TEXT") {
      return (
        <li key={message.id}>
          <ChatMessage
            key={message.id}
            message={message.content}
            sideContent={
              message.state === "pending" ? (
                <div className="text-[#DDD] text-[11px] lg:text-[12px]">
                  전송중
                </div>
              ) : (
                <div className="flex flex-row gap-2">
                  <PaperAirplaneIcon
                    className="w-4 h-4  "
                    color="#ff6767"
                    width={16}
                    height={16}
                    onClick={() => {
                      onResendText(message.content);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                  <XMarkIcon
                    className="w-4 h-4  "
                    color="#ff6767"
                    width={16}
                    height={16}
                    onClick={() => {
                      onDeleteMessage(message);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              )
            }
            isUser={true}
          />
        </li>
      );
    } else if (message.chatType === "IMAGE") {
      return (
        <li key={message.id}>
          <ImageMessage
            imageList={message.imageUrlList || []}
            sideContent={
              message.state === "pending" ? (
                <div className="flex flex-row gap-2">
                  <PaperAirplaneIcon
                    className="w-4 h-4  "
                    width={16}
                    height={16}
                    color="#ff6767"
                  />
                  <div className="text-[#DDD] text-[11px] lg:text-[12px]">
                    전송중
                  </div>
                </div>
              ) : (
                <div className="flex flex-row gap-2">
                  <PaperAirplaneIcon
                    className="w-4 h-4  "
                    width={16}
                    height={16}
                    color="#ff6767"
                    onClick={() => {
                      onResendImage(
                        message.imageUrlList.map(
                          (url) => new File([], url)
                        ) as unknown as FileList
                      );
                    }}
                    style={{ cursor: "pointer" }}
                  />
                  <XMarkIcon
                    className="w-4 h-4  "
                    width={16}
                    height={16}
                    color="#ff6767"
                    onClick={() => {
                      onDeleteMessage(message);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              )
            }
            isUser={true}
          />
        </li>
      );
    }

    return null;
  }, []);

  return (
    <ul className="flex flex-col list-none" style={{ gap: 12 }}>
      {messages.map((message) => renderMessage(message))}
    </ul>
  );
};

export const PendingMessageList = React.memo(PendingMessageListComponent);
