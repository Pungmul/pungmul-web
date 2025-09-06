"use client";

import { useRef, useState } from "react";

interface ChatSendFormProps {
  onSendMessage: (message: string) => Promise<void>;
  onSendImage: (files: FileList) => Promise<void>;
}

export const ChatSendForm: React.FC<ChatSendFormProps> = ({
  onSendMessage,
  onSendImage,
}) => {
  const messageRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  
  
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setInputValue("");
    onSendMessage(inputValue).then(() => {
    });
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      onSendImage(files);
    }
  };

  return (
    <form
      className="sticky bottom-0 w-full shadow-up-md"
      onSubmit={onSubmit}
    >
      <div className="bg-white items-center px-2 py-2">
        <div
          className="flex flex-row items-center px-0.5 py-0.5 rounded-full"
          style={{ backgroundColor: "#F9F9F9" }}
        >
          {inputValue.length === 0 && (
            <label
              htmlFor="image-upload"
              className="h-9 px-4 bg-[#816DFF] rounded-full text-white justify-center flex flex-col"
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
          )}
          <input
            ref={messageRef}
            type="text"
            name="comment"
            value={inputValue}
            onChange={(e) => setInputValue(e.currentTarget.value)}
            style={{ fontSize: 12 }}
            placeholder="메시지 입력"
            className="bg-transparent outline-none px-2 py-1 flex-grow"
          />
          {inputValue.length !== 0 && (
            <button
              type="submit"
              className="w-9 h-9 bg-[#816DFF] rounded-full text-white"
            >
              ↑
            </button>
          )}
        </div>
      </div>
    </form>
  );
};
