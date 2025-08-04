import { Metadata } from "next";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { SelectFriendModalProvider } from "@/store/friend/useSelectFriendModalContext";
import {
  prefetchChatRooms,
  RoomContainer,
  ChatRoomList,
} from "@/features/chat";
import Suspense from "@/shared/components/SuspenseComponent";

export const metadata: Metadata = {
  title: "풍물 머시기 | 채팅",
  description: "풍물 머시기 채팅 페이지",
};

function ChatLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="block md:flex md:flex-row w-full flex-grow overflow-y-auto">
      <SelectFriendModalProvider>
        <ChatRoomList key="chat-list" />
        <RoomContainer>{children}</RoomContainer>
      </SelectFriendModalProvider>
    </div>
  );
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = prefetchChatRooms();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <div className="flex flex-row h-full w-full flex-grow overflow-x-hidden">
            <div className="flex flex-col h-full md:w-[20%] lg:w-[360px] md:border-r md:border-gray-200">
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-500">로딩 중...</div>
              </div>
            </div>
            <div className="min-w-[50dvw] flex-grow flex items-center justify-center">
              <div className="text-gray-500">로딩 중...</div>
            </div>
          </div>
        }
      >
        <ChatLayoutContent>{children}</ChatLayoutContent>
      </Suspense>
    </HydrationBoundary>
  );
}
