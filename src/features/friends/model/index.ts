import { User } from "../../member/model/index";

export interface Friend {
    friendRequestId: number;
    friendStatus: string;
    simpleUserDTO: User;
}

export type FriendStatus = {
  user: User;
  friendRequestFrom: "ACCEPT" | "SEND" | "RECEIVE" | "NONE";
}; 