"use client";

import React from "react";
import { styles } from "../styles";

interface ChatMessageProps {
  message: string;
  timestamp?: string | undefined;
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
    <div style={{ margin: "0 24px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: isUser ? "row-reverse" : "row",
          alignItems: "flex-end",
          gap: 8,
        }}
      >
        <div style={isUser ? styles.MyMessage : styles.PartnerMessage}>
          {message}
        </div>
        <div className="flex flex-col justify-end items-end" style={{ gap: 2 }}>
          {isRead && <div style={styles.readSign}>읽음</div>}
          {timestamp && <div style={styles.timeStamp}>{timestamp}</div>}
        </div>
      </div>
    </div>
  );
};

export const ChatMessage = React.memo(ChatMessageComponent);
