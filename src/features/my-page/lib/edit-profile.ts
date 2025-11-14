import {
  EditPageRequestForm,
  EditProfileFormValues,
} from "@/features/my-page";
import { ClubInfo } from "@/features/club";
import { NO_CLUB_VALUE } from "@/features/club/constant";

export const transformEditProfileData = (
  formData: EditProfileFormValues,
  clubList?: ClubInfo[]
): EditPageRequestForm => {
  const targetClub = formData.club
    ? [...(clubList ?? []), { clubName: NO_CLUB_VALUE, clubId: null }].find((club) => club.clubName === formData.club)
    : null;

  return {
    clubName: formData.nickname || "",
    clubId: formData.club ? targetClub?.clubId ?? null : null,
    phoneNumber: formData.tellNumber?.replace(/-/g, "") ?? "",
    clubAge: parseInt(formData.clubAge ?? ""),
  };
};


