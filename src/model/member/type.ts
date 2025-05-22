import { ProfileImage } from "@/app/(main)/chats/r/[roomId]/types";
import { ClubName } from "../club/constant";
import { InstrumentStatus } from "../instrument/type";

export interface Member {
  loginId: string;
  name: string;
  groupName?: ClubName;
  clubName?: string;
  birth: string; // "YYYY-MM-DD" 형식
  clubAge: number;
  phoneNumber: string;
  email: string;
  area?: string;
  username: string;
  instrumentStatusDTOList: InstrumentStatus[];
}

export interface SimpleUserDTO {
  userId: number;
  username: string;
  name: string;
  profileImage: ProfileImage;
}