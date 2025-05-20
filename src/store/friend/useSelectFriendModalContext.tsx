"use client";
import { createContext, useContext, useState } from "react";

import SelectFriendsModal from "@/features/chat/components/SelectFriendsModal";
import {
  createPersonalChatRoom,
  createMultiChatRoom,
} from "@/app/(main)/chats/utils";
import { useRouter } from "next/navigation";

interface SelectFriendModalContextType {
  openModalToSelectFriend: () => void;
}

export const SelectFriendModalContext =
  createContext<SelectFriendModalContextType | null>(null);

export const SelectFriendModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const openModalToSelectFriend = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const addChatRoom = async (friendEmails: string[]) => {
    const createChatRoomRequest = async () => {
      try {
        const response =
          friendEmails.length === 1
            ? await createPersonalChatRoom({
                receiverName: friendEmails[0] || "",
              })
            : await createMultiChatRoom({
                receiverName: friendEmails,
              });

        const { roomUUID } = response;

        setIsModalOpen(false);
        router.push(`/chats/r/${roomUUID}`);
      } catch (error) {
        alert("Failed to create chat room");
        console.error("Error creating chat room:", error);
      }
    };
    createChatRoomRequest();
  };

  return (
    <SelectFriendModalContext.Provider value={{ openModalToSelectFriend }}>
      <SelectFriendsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={addChatRoom}
      />
      {children}
    </SelectFriendModalContext.Provider>
  );
};

export const useSelectFriendModal = () => {
  const context = useContext(SelectFriendModalContext);
  if (!context)
    throw new Error(
      "친구 선택 모달 컨텍스트 프로바이더에 포함되지 않은 컴포넌트 입니다."
    );
  return context;
};
