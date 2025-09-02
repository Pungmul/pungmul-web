import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import {
  ChatRoomListItemDto,
  ChatRoomUpdateMessage,
} from "@/features/chat/types";

interface ChatRoomState {
  // 상태
  chatRooms: ChatRoomListItemDto[];
  isLoading: boolean;
  isSocketConnected: boolean;
  lastSyncTime: string | null;
  userFocusingRoomId: string | null;
  totalUnreadCount: number;
  // 계산된 값들

  // 액션들
  setChatRooms: (rooms: ChatRoomListItemDto[]) => void;
  updateChatRoom: (
    roomId: string,
    updates: Partial<ChatRoomListItemDto>
  ) => void;
  addChatRoom: (room: ChatRoomListItemDto) => void;
  removeChatRoom: (roomId: string) => void;
  setLoading: (loading: boolean) => void;
  setSocketConnected: (connected: boolean) => void;
  setLastSyncTime: (time: string) => void;
  userCheckIn: (roomId: string) => void;
  userCheckOut: () => void;

  // 메시지 관련 액션들
  updateLastMessage: (
    roomId: string,
    content: string,
    timestamp: string
  ) => void;
  incrementUnreadCount: (roomId: string) => void;
  resetUnreadCount: (roomId: string) => void;
  markAllAsRead: () => void;

  // 소켓 메시지 핸들러
  handleSocketMessage: (message: ChatRoomUpdateMessage) => void;

  // 유틸리티
  getRoomById: (roomId: string) => ChatRoomListItemDto | undefined;
  getSortedRooms: () => ChatRoomListItemDto[];
  reset: () => void;
}

const initialState = {
  chatRooms: [],
  isLoading: false,
  isSocketConnected: false,
  lastSyncTime: null,
  totalUnreadCount: 0,
  userFocusingRoomId: null,
};

export const useChatRoomStore = create<ChatRoomState>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,
    userCheckIn: (roomId) => {
      const updatedRooms = get().chatRooms.map((room) =>
        room.chatRoomUUID === roomId ? { ...room, unreadCount: 0 } : room
      );
      const totalUnreadCount = updatedRooms.reduce(
        (sum, room) =>
          room.chatRoomUUID === roomId ? sum : sum + (room.unreadCount || 0),
        0
      );
      
      set((state) => ({
        ...state,
        chatRooms: updatedRooms,
        totalUnreadCount,
        userFocusingRoomId: roomId,
      }));
    },
    userCheckOut: () => {
      set((state) => ({
        ...state,
        userFocusingRoomId: null,
      }));
    },

    // 기본 액션들
    setChatRooms: (rooms) => {
      if (get().userFocusingRoomId) {
        const userFocusingRoom = rooms.find(
          (room) => room.chatRoomUUID === get().userFocusingRoomId
        );
        if (userFocusingRoom) {
          userFocusingRoom.unreadCount = 0;
        }
        return;
      }
      const totalUnreadCount = rooms.reduce(
        (sum, room) =>
          room.chatRoomUUID === get().userFocusingRoomId
            ? sum
            : sum + (room.unreadCount || 0),
        0
      );
      set({
        chatRooms: rooms,
        totalUnreadCount,
      });
    },

    updateChatRoom: (roomId, updates) => {
      set((state) => {
        const updatedRooms = state.chatRooms.map((room) =>
          room.chatRoomUUID === roomId ? { ...room, ...updates } : room
        );
        const totalUnreadCount = updatedRooms.reduce(
          (sum, room) =>
            room.chatRoomUUID === roomId ? sum : sum + (room.unreadCount || 0),
          0
        );

        return {
          chatRooms: updatedRooms,
          totalUnreadCount,
        };
      });
    },

    addChatRoom: (room) => {
      set((state) => {
        const exists = state.chatRooms.some(
          (r) => r.chatRoomUUID === room.chatRoomUUID
        );
        if (exists) return state;

        const newRooms = [room, ...state.chatRooms];
        const totalUnreadCount = newRooms.reduce(
          (sum, r) => sum + (r.unreadCount || 0),
          0
        );

        return {
          chatRooms: newRooms,
          totalUnreadCount,
        };
      });
    },

    removeChatRoom: (roomId) => {
      set((state) => {
        const filteredRooms = state.chatRooms.filter(
          (room) => room.chatRoomUUID !== roomId
        );
        const totalUnreadCount = filteredRooms.reduce(
          (sum, room) => sum + (room.unreadCount || 0),
          0
        );

        return {
          chatRooms: filteredRooms,
          totalUnreadCount,
        };
      });
    },

    setLoading: (loading) => set({ isLoading: loading }),
    setSocketConnected: (connected) => set({ isSocketConnected: connected }),
    setLastSyncTime: (time) => set({ lastSyncTime: time }),

    // 메시지 관련 액션들
    updateLastMessage: (roomId, content, timestamp) => {
      set((state) => {
        const updatedRooms = state.chatRooms.map((room) => {
          if (room.chatRoomUUID === roomId) {
            return {
              ...room,
              lastMessageContent: content,
              lastMessageTime: timestamp,
            };
          }
          return room;
        });

        // 최신 메시지 순으로 정렬
        const sortedRooms = updatedRooms.sort((a, b) => {
          const timeA = new Date(a.lastMessageTime || 0).getTime();
          const timeB = new Date(b.lastMessageTime || 0).getTime();
          return timeB - timeA;
        });

        return { chatRooms: sortedRooms };
      });
    },

    incrementUnreadCount: (roomId) => {
      set((state) => {
        const updatedRooms = state.chatRooms.map((room) => {
          if (room.chatRoomUUID === roomId) {
            if (room.chatRoomUUID === get().userFocusingRoomId)
              return { ...room, unreadCount: 0 };
            return {
              ...room,
              unreadCount: (room.unreadCount || 0) + 1,
            };
          }
          return room;
        });

        const userFocusingRoomId = get().userFocusingRoomId;
        
        const totalUnreadCount = updatedRooms.reduce(
          (sum, room) =>
            room.chatRoomUUID === userFocusingRoomId ? sum : sum + (room.unreadCount ?? 0),
          0
        );

        return {
          chatRooms: updatedRooms,
          totalUnreadCount,
        };
      });
    },

    resetUnreadCount: (roomId) => {
      get().updateChatRoom(roomId, { unreadCount: 0 });
    },

    markAllAsRead: () => {
      set((state) => ({
        chatRooms: state.chatRooms.map((room) => ({ ...room, unreadCount: 0 })),
        totalUnreadCount: 0,
      }));
    },

    // 소켓 메시지 핸들러
    handleSocketMessage: (message) => {
      const { chatRoomUUID, content, timestamp } = message;

      get().updateLastMessage(chatRoomUUID, content, timestamp);
      get().incrementUnreadCount(chatRoomUUID);

      console.log("chatRoom Update", message);
    },

    // 유틸리티 함수들
    getRoomById: (roomId) => {
      return get().chatRooms.find((room) => room.chatRoomUUID === roomId);
    },

    getSortedRooms: () => {
      return [...get().chatRooms].sort((a, b) => {
        const timeA = new Date(a.lastMessageTime || 0).getTime();
        const timeB = new Date(b.lastMessageTime || 0).getTime();
        return timeB - timeA;
      });
    },

    reset: () => set(initialState),
  }))
);

// 타입 유틸리티
export type ChatRoomStore = typeof useChatRoomStore;
