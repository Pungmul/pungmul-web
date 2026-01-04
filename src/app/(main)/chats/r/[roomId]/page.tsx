"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Bars3Icon } from "@heroicons/react/24/outline";
import { AnimatePresence } from "framer-motion";
import { debounce } from "lodash";

import { useSocketConnection } from "@/core/socket";

import { Space } from "@/shared/components";
import { Header, Spinner } from "@/shared/components";
import ObserveTrigger from "@/shared/components/ObserveTrigger";

import {
  ChatDrawer,
  ChatMessageList,
  ChatSendForm,
  Message,
} from "@/features/chat";
import InviteUserModal from "@/features/chat/components/widget/InviteUserModal";
import { PendingMessageList } from "@/features/chat/components/widget/PendingMessageList";
import { useMessageList } from "@/features/chat/hooks/useMessageList";
import { useScrollPosition } from "@/features/chat/hooks/useScrollPosition";
import { useChatMessageHandler } from "@/features/chat/hooks/useChatMessageHandler";
import { usePendingMessages } from "@/features/chat/hooks/usePendingMessages";
import { useChatRoomTitle } from "@/features/chat/hooks/useChatRoomTitle";
import { useResetRoomUnreadCount } from "@/features/chat/hooks/useResetRoomUnreadCount";
import { useChatRoomUserMaps } from "@/features/chat/hooks/useChatRoomUserMaps";
import { useExitChatRoom } from "@/features/chat/hooks/useExitChatRoom";
import {
  useChatRoomInfiniteQuery,
  useChatRoomQuery,
  useSendImageMessageMutation,
  useSendTextMessageMutation,
} from "@/features/chat/queries";
import {
  useRoomMessageSocket,
  useRoomReadSocket,
} from "@/features/chat/socket";
import { useChatRoomStore } from "@/features/chat/store/chatRoomStore";
import { isTextMessage, isImageMessage } from "@/features/chat/types/guards";
import { INFINITE_SCROLL_DEBOUNCE_MS } from "@/features/chat/constant/ui";
import { useSuspenseGetMyPageInfo } from "@/features/my-page";

export default function Page() {
  const { roomId } = useParams();
  const isConnected = useSocketConnection();
  const { data: myInfo } = useSuspenseGetMyPageInfo();
  const setFocusingRoomId = useChatRoomStore(
    (state) => state.setFocusingRoomId,
  );
  const router = useRouter();

  // UI 상태
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [inviteUserModalOpen, setInviteUserModalOpen] = useState(false);

  // 스크롤 위치 관리 훅
  const {
    wholeRef,
    messageContainerRef,
    saveScrollPosition,
    maintainScrollPosition,
    scrollToTop,
  } = useScrollPosition();

  // 채팅방 데이터 조회
  const { data: chatRoomData, isLoading: isChatRoomLoading } = useChatRoomQuery(
    roomId as string,
  );
  const {
    data: infiniteData,
    isLoading: isInfiniteLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChatRoomInfiniteQuery(roomId as string);

  // 소켓에서 받은 실시간 메시지들을 저장
  const [socketMessages, setSocketMessages] = useState<Message[]>([]);

  // 채팅방 제목 관리
  const { title } = useChatRoomTitle({ chatRoomData });

  // 안 읽은 메시지 수 리셋
  const { resetRoomUnreadCount } = useResetRoomUnreadCount();

  // 유저 관련 맵 생성
  const { userList, userLastReadMessageIdMap, userImageMap, userNameMap } =
    useChatRoomUserMaps({ chatRoomData });

  // 소켓 readSign 훅
  const { readSign } = useRoomReadSocket(roomId as string);

  // 채팅방 나가기 훅
  const { exitChatRoom } = useExitChatRoom({ roomId: roomId as string });

  // Mutation 훅들
  const sendTextMessageMutation = useSendTextMessageMutation();
  const sendImageMessageMutation = useSendImageMessageMutation();

  // pending 메시지 관리
  const {
    pendingMessages,
    setPendingMessages,
    onSendMessage,
    onSendImage,
    onDeleteMessage,
  } = usePendingMessages({
    roomId: roomId as string,
    senderUsername: myInfo?.username ?? "",
    sendTextMessageMutation,
    sendImageMessageMutation,
    onMessageSent: scrollToTop,
    onMessageSuccess: readSign,
  });

  // 방 입장 시 초기화
  useEffect(() => {
    setFocusingRoomId(roomId as string);
    resetRoomUnreadCount(roomId as string);
  }, [roomId, resetRoomUnreadCount, setFocusingRoomId]);

  // 전역 스크롤 비활성화
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // 메시지 리스트 최적화된 훅 사용
  const messageList = useMessageList({
    chatRoomData,
    infiniteData,
    socketMessages,
  });

  // 무한 스크롤 트리거
  const onTrigger = useCallback(
    debounce(
      () => {
        if (isFetchingNextPage) return;
        saveScrollPosition();
        fetchNextPage();
      },
      INFINITE_SCROLL_DEBOUNCE_MS,
      { leading: true, trailing: false },
    ),
    [fetchNextPage, isFetchingNextPage, saveScrollPosition],
  );

  // 채팅 메시지 핸들러 훅 사용
  const { handleTextMessage, handleImageMessage } = useChatMessageHandler({
    roomId: roomId as string,
    myInfo,
    setSocketMessages,
    setPendingMessages,
    readSign,
  });

  // 소켓 훅 사용
  useRoomMessageSocket(roomId as string, {
    onMessage: (message: Message) => {
      if (isTextMessage(message)) {
        handleTextMessage(message);
      } else if (isImageMessage(message)) {
        handleImageMessage(message);
      }
    },
    onAlarm: (message) => {
      console.log(message, "alarm message");
    },
  });

  // 무한 스크롤 시 스크롤 위치 유지
  useEffect(() => {
    maintainScrollPosition();
  }, [messageList, maintainScrollPosition]);

  const loading = isChatRoomLoading || isInfiniteLoading;

  return (
    <AnimatePresence mode="wait">
      <div className="flex flex-col h-full bg-background relative overflow-y-auto overflow-x-hidden">
        <Header
          title={
            <div className="flex items-center gap-2 h-full">
              <div className="text-sm lg:text-base w-[160px] lg:w-[300px] truncate">
                {title}
              </div>
              <div className="text-sm lg:text-base text-grey-500">
                {chatRoomData?.userInfoList.length}
              </div>
            </div>
          }
          onLeftClick={() => router.push("/chats/r/inbox")}
          rightBtn={
            <div
              className="w-10 h-10 flex items-center justify-center cursor-pointer"
              onClick={() => setDrawerOpen(true)}
            >
              <Bars3Icon className="size-6 text-grey-500" />
            </div>
          }
        />
        {loading || !isConnected ? (
          <div className="flex justify-center items-center h-full">
            <Spinner size={36} />
          </div>
        ) : (
          <div
            ref={wholeRef}
            className="h-full flex flex-col-reverse gap-2 flex-grow overflow-y-auto"
          >
            <div
              ref={messageContainerRef}
              className="flex-grow bg-background py-[24px] px-[16px]"
            >
              {hasNextPage && (
                <>
                  <ObserveTrigger
                    trigger={onTrigger}
                    unmountCondition={!hasNextPage}
                    triggerCondition={{ rootMargin: "100px" }}
                  />
                  {isFetchingNextPage && (
                    <div className="flex justify-center py-4 flex-col items-center">
                      <Spinner size={36} />
                    </div>
                  )}
                </>
              )}
              <ChatMessageList
                messages={messageList}
                currentUserId={myInfo?.username ?? ""}
                userLastReadMessageIdMap={userLastReadMessageIdMap}
                userImageMap={userImageMap}
                userNameMap={userNameMap}
              />
              <Space h={12} />
              <PendingMessageList
                messages={pendingMessages}
                onResendText={onSendMessage}
                onResendImage={onSendImage}
                onDeleteMessage={onDeleteMessage}
              />
            </div>
          </div>
        )}
        <ChatSendForm onSendMessage={onSendMessage} onSendImage={onSendImage} />
        <ChatDrawer
          drawerOpen={drawerOpen}
          onExitChat={exitChatRoom}
          userList={userList}
          onClose={() => setDrawerOpen(false)}
          onInviteUser={() => setInviteUserModalOpen(true)}
        />
        <InviteUserModal
          roomId={roomId as string}
          currentUsernames={userList.map((user) => user.username)}
          isOpen={inviteUserModalOpen}
          onClose={() => {
            setInviteUserModalOpen(false);
          }}
        />
      </div>
    </AnimatePresence>
  );
}
