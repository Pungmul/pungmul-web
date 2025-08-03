import { LoginFormType } from "./login.schema";

export type LoginRequest = LoginFormType;
export type LoginMethod = "email" | "kakao" | "naver" | "apple" | "google";