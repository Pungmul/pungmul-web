import { User } from "../../member";

export type FriendStatus = {
  user: User;
  friendRequestFrom: "ACCEPT" | "SEND" | "RECEIVE" | "NONE";
};