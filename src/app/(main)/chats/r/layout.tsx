import { Metadata } from "next";

import {
  RoomContainer,
  ChatRoomBoxSkeleton,
  loadChatRoomList,
} from "@/features/chat";
import { lazy } from "react";
import { SuspenseComponent as Suspense } from "@/shared";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@pThunder/core";

export const metadata: Metadata = {
  title: "풍덩 | 채팅",
  description: "풍덩 채팅 페이지",
};

export const dynamic = "force-dynamic";

const ChatRoomList = lazy(
  () => import("@pThunder/features/chat/components/widget/ChatRoomList")
);

const SelectFriendModal = lazy(() =>
  import("@/features/friends/store/useSelectFriendModalContext").then(
    (module) => ({ default: module.SelectFriendModal })
  )
);

function ChatLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative block md:flex md:flex-row w-full flex-grow">
      <Suspense fallback={<ChatRoomBoxSkeleton key={"room-skeleton"} />}>
        <ChatRoomList key="chat-list" />
      </Suspense>
      <RoomContainer>{children}</RoomContainer>
      <SelectFriendModal />
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["chatRoomList"],
    queryFn: () => loadChatRoomList(),
  });

  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <ChatLayoutContent>{children}</ChatLayoutContent>
    </HydrationBoundary>
  );
}
