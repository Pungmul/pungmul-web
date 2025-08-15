import { InstrumentStatus } from "../../instrument-status/model/index";

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
  birth: string; // "YYYY-MM-DD" 형식
  clubAge: number;
  phoneNumber: string;
  email: string;
  area?: string;
  username: string;
  instrumentStatusDTOList: InstrumentStatus[];
}

export interface User {
  userId: number;
  username: string;
  name: string;
  profileImage: ProfileImage;
} 