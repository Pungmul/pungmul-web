import { ClubName } from "../club/constant";
import { ImageObject } from "../image";
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
  profile: ImageObject;
}
