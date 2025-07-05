"use client";
import Image from "next/image";
import NotificationIcon from "@public/icons/Notification-Icon.svg";
import { useChatRoomsQuery } from "./utils";
import { useView } from "@/shared/lib/useView";
import {
  ChatRoomBox,
  ChatRoomBoxSkeleton,
} from "@/features/chat/components/ChatRoomBox";
import { useSelectFriendModal } from "@/store/friend/useSelectFriendModalContext";

export default function ChatList() {
  const view = useView();
  const { openModalToSelectFriend } = useSelectFriendModal();

  const { data: chatRooms } = useChatRoomsQuery();

  const clickAddChatButton = () => {
    openModalToSelectFriend();
  };

  return (
    <div
      className={
        "flex flex-col h-full " +
        (view === "desktop"
          ? "md:w-[20%] lg:w-[360px] md:border-r md:border-gray-200 "
          : "w-full")
      }
    >
      <div
        className="flex flex-row items-center justify-between flex-shrink-0"
        style={{ height: 50, paddingLeft: 24, paddingRight: 24 }}
      >
        <div
          className="flex-grow block md:hidden lg:block"
          style={{ fontSize: 16, fontWeight: 700 }}
        >
          채팅 목록
        </div>
        <div className="flex flex-row" style={{ gap: 8 }}>
          {/* 돋보기로 수정 */}
          <Image
            src={NotificationIcon}
            width={view === "desktop" ? 36 : 32}
            alt=""
          />
          {/* 채팅 추가로 변경 */}
          <div
            className="cursor-pointer flex justify-center items-center"
            onClick={clickAddChatButton}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={view === "desktop" ? 32 : 28}
              height={view === "desktop" ? 32 : 28}
              viewBox={view === "desktop" ? "0 0 36 36" : "0 0 32 32"}
              fill="none"
            >
              <path
                d="M15.9951 4C22.5165 4 27.8232 9.20608 27.9873 15.6904L27.9912 16V24.4004C27.9915 25.6956 29.2331 26.9908 29.9297 27.6152C30.0728 27.7435 29.9822 28 29.79 28H15.9951L15.6855 27.9961C9.20387 27.8317 4 22.5238 4 16C4 9.37267 9.37037 4.00015 15.9951 4Z"
                fill="black"
              />
              <path
                d="M15.9951 4L15.9951 2.75L15.9951 2.75L15.9951 4ZM27.9873 15.6904L29.2372 15.6747L29.2371 15.6667L29.2369 15.6588L27.9873 15.6904ZM27.9912 16H29.2412V15.9921L29.2411 15.9842L27.9912 16ZM27.9912 24.4004L26.7412 24.4004L26.7412 24.4006L27.9912 24.4004ZM29.9297 27.6152L29.0953 28.546L29.0953 28.546L29.9297 27.6152ZM29.79 28L29.79 29.25L29.7901 29.25L29.79 28ZM15.9951 28L15.9793 29.2499L15.9872 29.25H15.9951V28ZM15.6855 27.9961L15.6539 29.2457L15.6618 29.2459L15.6698 29.246L15.6855 27.9961ZM15.9951 4V5.25C21.8364 5.25 26.5907 9.91346 26.7377 15.7221L27.9873 15.6904L29.2369 15.6588C29.0557 8.4987 23.1966 2.75 15.9951 2.75V4ZM27.9873 15.6904L26.7374 15.7062L26.7413 16.0158L27.9912 16L29.2411 15.9842L29.2372 15.6747L27.9873 15.6904ZM27.9912 16H26.7412V24.4004H27.9912H29.2412V16H27.9912ZM27.9912 24.4004L26.7412 24.4006C26.7414 25.4266 27.2208 26.3317 27.6777 26.9796C28.1505 27.6501 28.7105 28.201 29.0953 28.546L29.9297 27.6152L30.7641 26.6845C30.4523 26.405 30.0432 25.996 29.7209 25.539C29.3828 25.0595 29.2413 24.6694 29.2412 24.4001L27.9912 24.4004ZM29.9297 27.6152L29.0953 28.546C28.7226 28.2119 28.6979 27.7432 28.8091 27.4333C28.9222 27.1185 29.2584 26.75 29.79 26.75L29.79 28L29.7901 29.25C30.5139 29.25 30.9915 28.7533 31.1621 28.2781C31.3309 27.808 31.2799 27.1468 30.764 26.6845L29.9297 27.6152ZM29.79 28V26.75H15.9951V28V29.25H29.79V28ZM15.9951 28L16.0109 26.7501L15.7013 26.7462L15.6855 27.9961L15.6698 29.246L15.9793 29.2499L15.9951 28ZM15.6855 27.9961L15.7172 26.7465C9.91207 26.5993 5.25 21.8445 5.25 16H4H2.75C2.75 23.2031 8.49568 29.0641 15.6539 29.2457L15.6855 27.9961ZM4 16H5.25C5.25 10.0626 10.0612 5.25013 15.9951 5.25L15.9951 4L15.9951 2.75C8.67955 2.75016 2.75 8.68278 2.75 16H4Z"
                fill="black"
              />
              <path
                d="M16 11V21"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M11 16H21"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
      <div
        className="relative w-full h-full flex-grow flex flex-col overflow-y-auto"
        style={{ scrollbarWidth: "thin" }}
      >
        {chatRooms
          ? chatRooms.map((room, index) => (
              <ChatRoomBox key={"room-" + index} room={room} />
            ))
          : Array.from({ length: 10 }).map((_, index) => (
              <ChatRoomBoxSkeleton key={"room-" + index} />
            ))}
      </div>
    </div>
  );
}
