import { SimpleUserDTO } from "../member/type";

export interface Friend {
    friendRequestId: number;
    friendStatus: string;
    simpleUserDTO: SimpleUserDTO;
  }
  