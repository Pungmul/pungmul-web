import React, { useCallback } from "react";
import { Message } from "../../types";
import { ChatMessage } from "../element/ChatMessage";
import { ImageMessage } from "../element/ImageMessage";

interface MessageListProps {
  messages: Message[];
}

const PendingMessageListComponent: React.FC<MessageListProps> = ({
  messages,
}) => {
  const renderMessage = useCallback((message: Message) => {
    if (message.chatType === "TEXT") {
      return (
        <li key={message.id}>
          <ChatMessage
            key={message.id}
            message={message.content}
            timestamp={"전송중"}
            isUser={true}
            isRead={false}
          />
        </li>
      );
    } else if (message.chatType === "IMAGE") {
      return (
        <li key={message.id}>
          <ImageMessage
            imageList={message.imageUrlList || []}
            timestamp={"전송중"}
            isUser={true}
            isRead={false}
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
