import { User } from "@/features/member/types";

export interface Friend {
  friendRequestId: number;
  friendStatus: string;
  simpleUserDTO: User;
  isRequestSentByUser: boolean;
}