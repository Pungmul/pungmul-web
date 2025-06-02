import { CLUB_NAMES } from "@/shared/types/club/constant";
import { z } from "zod";

const baseAccountSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .email({ message: "이메일 형식이 올바르지 않습니다" }),
  password: z
    .string()
    .min(8, "비밀번호는 8~12자로 이루어져야합니다")
    .max(12, "비밀번호는 8~12자로 이루어져야합니다")
    .regex(/[A-Za-z\d!@#$%^&*]{8,12}$/, {
      message: "특수 문자는 (!, @, #, $, %, ^, &, *)만 가능합니다",
    }),
  confirmPassword: z.string(),
});

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

// 통합 스키마 (먼저 merge 후 refine 적용)
const baseFullSchema = baseAccountSchema.merge(basePersonalSchema);

// refine이 적용된 최종 스키마
export const fullSignUpSchema = baseFullSchema
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  })
  .refine((data) => !data.nickname || /^[가-힣]+$/.test(data.nickname), {
    message: "올바른 형식의 한글 패명을 입력하세요",
    path: ["nickname"],
  })
  .refine((data) => data.club !== null, {
    message: "소속패를 선택해주세요",
    path: ["club"],
  });

export const accountSchema = baseAccountSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  }
);

export const personalSchema = basePersonalSchema
  .refine((data) => !data.nickname || /^[가-힣]+$/.test(data.nickname), {
    message: "올바른 형식의 한글 패명을 입력하세요",
    path: ["nickname"],
  })
  .refine((data) => data.club !== null, {
    message: "소속패를 선택해주세요",
    path: ["club"],
  });

// 타입 추출
export type AccountFormData = z.infer<typeof accountSchema>;
export type PersonalFormData = z.infer<typeof personalSchema>;
export type FullSignUpFormData = z.infer<typeof fullSignUpSchema>;

// 스텝별 검증 필드 매핑
export const stepValidationFields = {
  계정정보입력: ["email", "password", "confirmPassword"] as const,
  개인정보입력: ["name", "tellNumber", "inviteCode"] as const,
} as const;
