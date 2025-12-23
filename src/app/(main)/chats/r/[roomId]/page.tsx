"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Header, Spinner } from "@/shared/components";
import {
  useChatRoomInfiniteQuery,
  useSendTextMessageMutation,
  useSendImageMessageMutation,
  useExitChatMutation,
  useChatRoomQuery,
} from "@/features/chat/queries";
import {
  useRoomReadSocket,
  useRoomMessageSocket,
} from "@/features/chat/socket";

import { AnimatePresence } from "framer-motion";
import {
  ChatSendForm,
  ChatMessageList,
  ChatDrawer,
  Message,
  ChatRoomListItemDto,
} from "@/features/chat";
import { useSuspenseGetMyPageInfo } from "@/features/my-page";
import dayjs from "dayjs";
import { PendingMessageList } from "@pThunder/features/chat/components/widget/PendingMessageList";
import { Space } from "@pThunder/shared/components";
import ObserveTrigger from "@/shared/components/ObserveTrigger";
import { debounce } from "lodash";
import { useMessageList } from "@/features/chat/hooks/useMessageList";
import { useSocketMessageHandler } from "@/features/chat/hooks/useSocketMessageHandler";
import { useScrollPosition } from "@/features/chat/hooks/useScrollPosition";
import InviteUserModal from "@pThunder/features/chat/components/widget/InviteUserModal";
import { useQueryClient } from "@tanstack/react-query";
import { Alert, Toast } from "@pThunder/shared";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useChatRoomStore } from "@pThunder/features/chat/store/chatRoomStore";
import { useSocketConnection } from "@pThunder/core/socket";

// CSR로 완전 전환 - 서버 렌더링 비활성화

export default function Page() {
  const { roomId } = useParams();
  const isConnected = useSocketConnection();
  const { data: myInfo } = useSuspenseGetMyPageInfo();
  const setFocusingRoomId = useChatRoomStore(state=> state.setFocusingRoomId);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [inviteUserModalOpen, setInviteUserModalOpen] = useState(false);
  const queryClient = useQueryClient();
  // 스크롤 위치 관리 훅
  const {
    wholeRef,
    messageContainerRef,
    saveScrollPosition,
    maintainScrollPosition,
    scrollToTop,
  } = useScrollPosition();

  // 무한 스크롤을 위한 React Query 훅 사용
  const { data: chatRoomData, isLoading: isChatRoomLoading } = useChatRoomQuery(
    roomId as string
  );
  const {
    data: infiniteData,
    isLoading: isInfiniteLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChatRoomInfiniteQuery(roomId as string);

  const [pendingMessages, setPendingMessages] = useState<
    (Message & { state: "pending" | "failed" })[]
  >([]);

  // 소켓에서 받은 실시간 메시지들을 저장
  const [socketMessages, setSocketMessages] = useState<Message[]>([]);

  const resetRoomUnreadCount = useCallback(
    (roomId: string) => {
      queryClient.setQueryData(
        ["chatRoomList"],
        (oldData: ChatRoomListItemDto[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.map((room) =>
            room.chatRoomUUID === roomId ? { ...room, unreadCount: 0 } : room
          );
        }
      );
    },
    [queryClient]
  );

  useEffect(() => {
    setFocusingRoomId(roomId as string);
    resetRoomUnreadCount(roomId as string);
  }, [roomId, resetRoomUnreadCount, setFocusingRoomId]);
  // 메시지 리스트 최적화된 훅 사용
  const messageList = useMessageList({
    chatRoomData,
    infiniteData,
    socketMessages,
  });

  const sendTextMessageMutation = useSendTextMessageMutation();
  const sendImageMessageMutation = useSendImageMessageMutation();
  const exitChatMutation = useExitChatMutation();

  const onTrigger = useCallback(
    debounce(
      () => {
        if (isFetchingNextPage) return;
        saveScrollPosition();
        fetchNextPage();
      },
      1000,
      { leading: true, trailing: false }
    ),
    [fetchNextPage, isFetchingNextPage, saveScrollPosition]
  );
  // 소켓 readSign 훅
  const { readSign } = useRoomReadSocket(roomId as string);

  // 소켓 메시지 핸들러 훅 사용
  const { handleTextMessage, handleImageMessage } = useSocketMessageHandler({
    roomId: roomId as string,
    myInfo,
    setSocketMessages,
    setPendingMessages,
    readSign,
  });

  // 소켓 훅 사용
  useRoomMessageSocket(
    roomId as string,
    {
      onMessage: (message: Message) => {
        if (message.chatType === "TEXT") {
          handleTextMessage(message);
        } else if (message.chatType === "IMAGE") {
          handleImageMessage(message);
        }
      },
      onAlarm: (message) => {
        console.log(message, "alarm message");
      },
    }
  );

  // 무한 스크롤 시 스크롤 위치 유지
  useEffect(() => {
    maintainScrollPosition();
  }, [messageList, maintainScrollPosition]);

  // 채팅방 데이터에서 필요한 정보 추출 (첫 번째 페이지에서 가져오기)
  const userList =
    chatRoomData?.userInfoList.sort((a, b) => a.name.localeCompare(b.name)) ||
    [];
  const userImageMap = useMemo(() => {
    return userList.reduce((acc, user) => {
      acc[user.username] = user.profileImage?.fullFilePath || "";
      return acc;
    }, {} as Record<string, string | null>);
  }, [chatRoomData]);

  const userNameMap = useMemo(() => {
    return userList.reduce((acc, user) => {
      acc[user.username] = user.name || "";
      return acc;
    }, {} as Record<string, string | null>);
  }, [chatRoomData]);

  const loading = isChatRoomLoading || isInfiniteLoading;

  const onSendMessage = useCallback(
    async (message: string) => {
      const pendingUniqueId = uuidv4();
      const createdAt = dayjs().format("YYYY-MM-DD HH:mm:ss");
      setPendingMessages((prevPendingMessages) => [
        ...prevPendingMessages,
        {
          id: pendingUniqueId,
          senderUsername: myInfo?.username ?? "",
          content: message,
          chatType: "TEXT",
          imageUrlList: null,
          chatRoomUUID: roomId as string,
          createdAt: createdAt,
          state: "pending",
        },
      ]);

      const messagePayload = {
        content: message,
      };

      scrollToTop();

      try {
        sendTextMessageMutation.mutate(
          {
            roomId: roomId as string,
            message: messagePayload,
          },
          {
            onSuccess: () => {
              setPendingMessages((prevPendingMessages) =>
                prevPendingMessages.filter(
                  (pendingMsg) => pendingMsg.id !== pendingUniqueId
                )
              );
              readSign();
            },
            onError: () => {
              setPendingMessages((prevPendingMessages) =>
                prevPendingMessages.map((pendingMsg) =>
                  pendingMsg.id === pendingUniqueId
                    ? { ...pendingMsg, state: "failed" }
                    : pendingMsg
                )
              );
            },
          }
        );
      } catch {
        Toast.show({
          message: "채팅 전송에 실패했습니다.",
          type: "error",
        });
        setPendingMessages((prevPendingMessages) =>
          prevPendingMessages.map((pendingMsg) =>
            pendingMsg.id === pendingUniqueId
              ? { ...pendingMsg, state: "failed" }
              : pendingMsg
          )
        );
      }
    },
    [roomId, sendTextMessageMutation, myInfo?.username]
  );

  const onSendImage = useCallback(
    async (files: FileList) => {
      const pendingUniqueId = uuidv4();
      const createdAt = dayjs().format("YYYY-MM-DD HH:mm:ss");
      setPendingMessages((prevPendingMessages) => [
        ...prevPendingMessages,
        {
          id: pendingUniqueId,
          senderUsername: myInfo?.username ?? "",
          content: null,
          chatType: "IMAGE",
          imageUrlList: Array.from(files).map((file) =>
            URL.createObjectURL(file)
          ),
          chatRoomUUID: roomId as string,
          createdAt: createdAt,
          state: "pending",
        },
      ]);

      scrollToTop();
      try {
        const formData = new FormData();
        if (!files) throw new Error("파일이 없습니다.");
        Array.from(files).forEach((file) => {
          formData.append("files", file);
        });
        sendImageMessageMutation.mutate(
          {
            roomId: roomId as string,
            formData,
          },
          {
            onSuccess: () => {
              setPendingMessages((prevPendingMessages) =>
                prevPendingMessages.filter(
                  (pendingMsg) => pendingMsg.id !== pendingUniqueId
                )
              );
              readSign();
            },
            onError: () => {
              setPendingMessages((prevPendingMessages) =>
                prevPendingMessages.map((pendingMsg) =>
                  pendingMsg.id === pendingUniqueId
                    ? { ...pendingMsg, state: "failed" }
                    : pendingMsg
                )
              );
            },
          }
        );
      } catch (error) {
        if (error instanceof Error) {
          Toast.show({
            message: "채팅 전송에 실패했습니다.\n" + error.message,
            type: "error",
          });
        } else {
          Toast.show({
            message: "채팅 전송에 실패했습니다.",
            type: "error",
          });
        }

        setPendingMessages((prevPendingMessages) =>
          prevPendingMessages.map((pendingMsg) =>
            pendingMsg.id === pendingUniqueId
              ? { ...pendingMsg, state: "failed" }
              : pendingMsg
          )
        );
      }
    },
    [roomId, sendImageMessageMutation]
  );

  const onExitChat = useCallback(async () => {
    Alert.confirm({
      title: "채팅방 나가기",
      message: "채팅방을 나가시겠습니까?",
      confirmColor: "var(--color-red-500)",
      onConfirm: () => {
        exitChatMutation.mutate(roomId as string, {
          onSuccess: async () => {
            // 1. 현재 채팅방 데이터 완전히 제거
            queryClient.removeQueries({
              queryKey: ["chatRoom", roomId],
            });
            queryClient.removeQueries({
              queryKey: ["chatRoomInfinite", roomId],
            });

            // 2. 페이지 이동
            router.replace("/chats/r/inbox");

            // 3. 채팅방 리스트 갱신
            await queryClient.setQueryData(
              ["chatRoomList"],
              (old: ChatRoomListItemDto[]) => {
                return old.filter((chatRoom) => chatRoom.chatRoomUUID !== roomId);
              }
            );
          },
          onError: () => {
            Alert.alert({
              title: "채팅방 나가기 실패",
              message: "채팅방 나가기에 실패했습니다.\n다시 시도해주세요.",
            });
          },
        });
      },
    });
  }, [roomId, router, exitChatMutation, queryClient]);

  const onDeleteMessage = useCallback(
    (message: Message & { state: "pending" | "failed" }) => {
      setPendingMessages((prevPendingMessages) =>
        prevPendingMessages.filter((pendingMsg) => pendingMsg.id !== message.id)
      );
    },
    []
  );

  // 채팅방 데이터가 로드되면 title 설정
  useEffect(() => {
    if (chatRoomData) {
      setTitle(
        chatRoomData.chatRoomInfo.group
          ? `${chatRoomData.chatRoomInfo.roomName} (${chatRoomData.userInfoList.length})`
          : chatRoomData.chatRoomInfo.roomName
      );
    }
  }, [chatRoomData]);

  useEffect(() => {
    if (title) {
      document.title = `풍덩 | ${title}`;
    } else {
      document.title = "풍덩 | 채팅";
    }
  }, [title]);

  return (
    <AnimatePresence mode="wait">
      <div className="flex flex-col h-full bg-background relative overflow-y-auto overflow-x-hidden">
        <Header
          title={title}
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
              {/* 무한 스크롤 트리거 (채팅은 위로 스크롤하므로 상단에 배치) */}
              {hasNextPage && (
                <>
                  {/* 로딩 인디케이터 */}
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
          onExitChat={onExitChat}
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
