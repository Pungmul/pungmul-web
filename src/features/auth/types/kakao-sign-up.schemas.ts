import { CLUB_NAMES } from "../../club/model/constant";
import { z } from "zod";

const basePersonalSchema = z.object({
  name: z
    .string()
    .min(1, "이름을 입력해주세요")
    .regex(/^[가-힣]+$/, { message: "올바른 형식의 한글 이름을 입력하세요" }),
  nickname: z.string().optional(),
  club: z.enum(CLUB_NAMES).nullable().optional(),
  tellNumber: z
    .string()
    .min(1, "전화번호를 입력해주세요")
    .regex(/^(01[0-9]-?\d{3,4}-?\d{4}|0\d{2,3}-?\d{3,4}-?\d{4})$/, {
      message: "올바른 형식의 전화번호를 입력하세요",
    }),
  inviteCode: z.string().min(1, "초대 코드를 입력해주세요"),
});

// refine이 적용된 최종 스키마
export const fullSignUpSchema = basePersonalSchema
  .refine((data) => !data.nickname || /^[가-힣]+$/.test(data.nickname), {
    message: "올바른 형식의 한글 패명을 입력하세요",
    path: ["nickname"],
  })
  .refine((data) => data.club !== undefined, {
    message: "소속패를 선택해주세요",
    path: ["club"],
  });

export const personalSchema = basePersonalSchema
  .refine((data) => !data.nickname || /^[가-힣]+$/.test(data.nickname), {
    message: "올바른 형식의 한글 패명을 입력하세요",
    path: ["nickname"],
  })
  .refine((data) => data.club !== undefined, {
    message: "소속패를 선택해주세요",
    path: ["club"],
  });

export type PersonalFormData = z.infer<typeof personalSchema>;
export type FullSignUpFormData = z.infer<typeof fullSignUpSchema>;

// 스텝별 검증 필드 매핑
export const stepValidationFields = {
  개인정보입력: ["name", "tellNumber", "inviteCode"] as const,
} as const;
