import type { ClubName } from "@/features/club";
import type { InstrumentStatus } from "@/features/instrument-status";

export interface ProfileImage {
  id: number;
  originalFilename: string;
  convertedFileName: string;
  fullFilePath: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

export interface Member {
  loginId: string;
  name: string;
  groupName?: ClubName;
  clubName?: string;
  birth: string;
  clubAge: number;
  phoneNumber: string;
  email: string;
  area?: string;
  username: string;
  profile: ProfileImage;
  instrumentStatusDTOList: InstrumentStatus[];
}

export interface User {
  userId: number;
  username: string;
  name: string;
  profileImage: ProfileImage;
}


