import { Metadata } from "next";

import { RoomContainer, ChatRoomBoxSkeleton } from "@/features/chat";
import { lazy } from "react";
import { SuspenseComponent as Suspense } from "@/shared";

export const metadata: Metadata = {
  title: "풍덩 | 채팅",
  description: "풍덩 채팅 페이지",
};

export const dynamic = "force-dynamic";

const ChatRoomList = lazy(
  () => import("@pThunder/features/chat/components/widget/ChatRoomList")
);

const SelectFriendModal = lazy(
  () => import("@/features/friends/store/useSelectFriendModalContext")
  .then(module => ({ default: module.SelectFriendModal }))
);

function ChatLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative block md:flex md:flex-row w-full flex-grow overflow-y-auto">
      <Suspense fallback={<ChatRoomBoxSkeleton key={"room-skeleton"} />}>
        <ChatRoomList key="chat-list" />
      </Suspense>
      <RoomContainer>{children}</RoomContainer>
      <SelectFriendModal />
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ChatLayoutContent>{children}</ChatLayoutContent>;
}
