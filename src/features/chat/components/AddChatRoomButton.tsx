"use client";

import { useSelectFriendModal } from "@/store/friend/useSelectFriendModalContext";
import { useCallback } from "react";

export default function AddChatRoomButton() {
  const { openModalToSelectFriend } = useSelectFriendModal();

  const clickAddChatRoom = useCallback(() => {
    openModalToSelectFriend();
  }, [openModalToSelectFriend]);
  
  return (
    <div
      className="text-[16px] px-[12px] py-[8px] rounded-lg bg-[#816DFF] text-white cursor-pointer"
      onClick={clickAddChatRoom}
    >
      채팅방 만들기
    </div>
  );
}
