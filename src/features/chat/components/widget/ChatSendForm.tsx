"use client";

import { useCallback, useRef } from "react";

interface ChatSendFormProps {
  onSendMessage: (message: string) => Promise<void>;
  onSendImage: (files: FileList) => Promise<void>;
}

export const ChatSendForm: React.FC<ChatSendFormProps> = ({
  onSendMessage,
  onSendImage,
}) => {
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  // 텍스트 영역 높이 자동 조정
  const adjustHeight = () => {
    if (messageRef.current) {
      messageRef.current.style.height = "auto";
      messageRef.current.style.height = `${messageRef.current.scrollHeight}px`;
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = messageRef.current?.value || "";
    if (!message.trim()) return;
    messageRef.current!.value = "";
    adjustHeight();
    onSendMessage(message).then(() => {messageRef.current?.focus();});
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      onSendImage(files);
    }
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    },
    [onSendMessage]
  );

  return (
    <form
      ref={formRef}
      className="sticky bottom-0 w-full shadow-up-md bg-background"
      onSubmit={onSubmit}
    >
      <div className="bg-background items-center px-2 py-2">
        <div className="flex flex-row items-end px-0.5 py-0.5 rounded-lg bg-grey-100">
          <label
            htmlFor="image-upload"
            className="h-9 px-4 bg-primary rounded-full text-background justify-center flex flex-col"
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="image-upload"
              multiple={true}
              onChange={onImageChange}
            />
            +
          </label>
          <textarea
            ref={messageRef}
            name="comment"
            onChange={adjustHeight}
            onKeyDown={handleKeyDown}
            placeholder="메시지 입력"
            className="bg-transparent border-none outline-none px-4 py-2 flex-grow text-[12px] resize-none overflow-y-auto min-h-[20px] max-h-[120px] scrollbar-thin scrollbar-thumb-grey-300 scrollbar-track-transparent hover:scrollbar-thumb-grey-400"
            rows={1}
          />
          <button
            type="submit"
            className="w-9 h-9 bg-primary rounded-full text-background"
          >
            ↑
          </button>
        </div>
      </div>
    </form>
  );
};
