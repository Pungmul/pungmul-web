import { FullSignUpFormData } from "../types/sign-up.schemas";
import { SignUpRequestForm } from "../types/sign-up.types";
import { ClubInfo, ClubName, mapClubToClubId } from "@pThunder/features/club";

/**
 * 카카오 회원가입 폼 데이터를 API 요청 형식으로 변환
 */
export const transformSignUpData = (
  clubList: ClubInfo[],
  formData: FullSignUpFormData
): SignUpRequestForm => {
  const { email, password, name, nickname, club, tellNumber, clubAge, inviteCode } = formData;

  return {
    username: email,
    password: password,
    name: name,
    clubName: nickname || "",
    clubId: club ? mapClubToClubId(clubList, club as ClubName) : null,
    phoneNumber: tellNumber.replace(/-/g, ""),
    clubAge: parseInt(clubAge),
    invitationCode: inviteCode,
  };
};
