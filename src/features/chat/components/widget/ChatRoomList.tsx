"use client";
import { ChatRoomBox, ChatRoomBoxSkeleton } from "./ChatRoomBox";
import { useSelectFriendModal } from "@/features/friends/store";
import { useState } from "react";
import { getChoseong } from "es-hangul";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRoomList } from "../../hooks";
import { ChatAddIcon } from "@pThunder/shared/components/Icons";
import { SearchInput } from "@/shared/components";

export default function ChatRoomList() {
  const { chatRooms, isLoading } = useRoomList();

  const { openModalToSelectFriend } = useSelectFriendModal();
  const clickAddChatButton = () => {
    openModalToSelectFriend();
  };

  const [isSearching, setIsSearching] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  return (
    <div className="flex flex-col h-full md:w-[360px] lg:w-[400px] md:border-r md:border-grey-200 w-full">
      <div
        className="flex flex-row items-center justify-between flex-shrink-0"
        style={{ height: 50, paddingLeft: 24, paddingRight: 24 }}
      >
        <div
          className="flex-grow"
          style={{ fontSize: 16, fontWeight: 700 }}
        >
          채팅 목록
        </div>
        <div className="flex flex-row gap-1">
          {/* 돋보기로 수정 */}
          <MagnifyingGlassIcon
            className="size-[32px] cursor-pointer p-[4px]"
            onClick={() => setIsSearching(true)}
          />
          {/* 채팅 추가로 변경 */}
          <ChatAddIcon
            className="size-[32px] p-[4px] text-grey-800 cursor-pointer"
            onClick={clickAddChatButton}
          />
        </div>
      </div>
      {isSearching && (
        <div className="w-full p-2 bg-background">
          <SearchInput
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onClose={() => {
              setSearchKeyword("");
              setIsSearching(false);
            }}
          />
        </div>
      )}
      <div
        className="relative w-full h-full flex-grow flex flex-col overflow-y-auto"
        style={{ scrollbarWidth: "thin" }}
      >
        {!isLoading && chatRooms
          ? isSearching
            ? chatRooms
                .filter((room) =>
                  getChoseong(room.roomName).includes(
                    getChoseong(searchKeyword)
                  )
                )
                .map((room, index) => (
                  <ChatRoomBox
                    key={room.chatRoomUUID || "room-" + index}
                    room={room}
                  />
                ))
            : chatRooms.map((room, index) => (
                <ChatRoomBox
                  key={room.chatRoomUUID || "room-" + index}
                  room={room}
                />
              ))
          : Array.from({ length: 10 }).map((_, index) => (
              <ChatRoomBoxSkeleton key={"room-skeleton-" + index} />
            ))}
      </div>
    </div>
  );
}
