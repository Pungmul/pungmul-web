export interface ChatRoomInfo {
  chatRoomUUID: string;
  roomName: string;
  profileImageUrl: string | null;
  group: boolean;
}

export interface ProfileImage {
  id: number;
  originalFilename: string;
  convertedFileName: string;
  fullFilePath: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

export interface User {
  userId: number;
  username: string;
  name: string;
  profileImage: ProfileImage;
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
  chatRoomInfo: ChatRoomInfo;
  userInfoList: User[];
  messageList: MessageList;
}

// {
//   "messageLogId":189,
//   "domainType":"CHAT",
//   "businessIdentifier":"alarm",
//   "identifier":"3b928aa1-26f7-418f-ba4b-e7a9360453eb",
//   "stompDest":"/sub/chat/alarm/3b928aa1-26f7-418f-ba4b-e7a9360453eb",
//   "content":"{\"content\":\"김진현 님이 나갔습니다.\"}"
// }

export interface AlarmMessage {
  messageLogId: number;
  domainType: "CHAT";
  businessIdentifier: string;
  identifier: string;
  stompDest: string;
  content: string;
}
