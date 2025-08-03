export interface ChatRoomInfo {
  chatRoomUUID: string;
  roomName: string;
  profileImageUrl: string | null;
  group: boolean;
}

export type Message =
  | {
      id: number;
      senderUsername: string;
      content: string;
      chatType: "TEXT";
      imageUrlList: null;
      chatRoomUUID: string;
      createdAt: string;
    }
  | {
      id: number;
      senderUsername: string;
      content: null;
      chatType: "IMAGE";
      imageUrlList: string[];
      chatRoomUUID: string;
      createdAt: string;
    };

export interface ChatMessage {
  messageLogId: number;
  domainType: "CHAT" | "IMAGE";
  businessIdentifier: string;
  identifier: string;
  stompDest: string;
  content: {
    id: number;
    senderUsername: string;
    content: string;
    chatType: "CHAT" | "ENTER" | "LEAVE";
    imageUrl: string | null;
    chatRoomUUID: string;
    createdAt: string;
  };
}

export interface MessageList {
  total: number;
  list: Message[];
  pageNum: number;
  pageSize: number;
  size: number;
  startRow: number;
  endRow: number;
  pages: number;
  prePage: number;
  nextPage: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  navigatePages: number;
  navigatepageNums: number[];
  navigateFirstPage: number;
  navigateLastPage: number;
}

export interface ChatRoomDto {
  chatRoomUUID: string;
  lastMessageTime: string | null;
  lastMessageContent: string | null;
  unreadCount: number | null;
  senderId: number | null;
  senderName: string | null;
  receiverId: number | null;
  receiverName: string | null;
  chatRoomMemberIds: number[];
  chatRoomMemberNames: string[];
  roomName: string;
  profileImageUrl: string | null;
  group: boolean;
}

export interface AlarmMessage {
  messageLogId: number;
  domainType: "CHAT";
  businessIdentifier: string;
  identifier: string;
  stompDest: string;
  content: string;
}
