import { FullSignUpFormData } from "../types/kakao-sign-up.schemas";
import { SignUpRequestForm } from "../types/kakao-sign-up.types";
import { ClubInfo, ClubName, mapClubToClubId } from "@pThunder/features/club";

/**
 * 카카오 회원가입 폼 데이터를 API 요청 형식으로 변환
 */
export const transformKakaoSignUpData = (
  clubList: ClubInfo[],
  formData: FullSignUpFormData
): SignUpRequestForm => {
  const { name, nickname, club, tellNumber, clubAge, inviteCode } = formData;

  return {
    name: name,
    clubName: nickname || "",
    clubId: club ? mapClubToClubId(clubList, club as ClubName) : null,
    phoneNumber: tellNumber.replace(/-/g, ""),
    clubAge: parseInt(clubAge),
    invitationCode: inviteCode,
  };
};
