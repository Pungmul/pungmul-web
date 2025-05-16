import React from "react";
import { styles } from "../styles";

interface ImageMessageProps {
  imageList: string[];
  timestamp?: string;
  isUser: boolean;
  isRead: boolean;
}

export const ImageMessage = React.memo(
  ({ imageList, timestamp, isUser, isRead }: ImageMessageProps) => {
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
          <div className="flex flex-row flex-wrap columns-3 gap-2">
            {imageList.map((imageUrl) => (
              <img
                src={imageUrl}
                alt="image"
                height={128}
                width={128}
                className="object-cover rounded-md"
              />
            ))}
          </div>
          <div
            className="flex flex-col justify-end items-end"
            style={{ gap: 2 }}
          >
            {isRead && <div style={styles.readSign}>읽음</div>}
            {timestamp && <div style={styles.timeStamp}>{timestamp}</div>}
          </div>
        </div>
      </div>
    );
  }
);
