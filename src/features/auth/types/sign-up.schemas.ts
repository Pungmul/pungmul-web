import { CLUB_NAMES, ClubInfo, clubListApi } from "@/features/club";
import { z } from "zod";
import { checkEmailRegistered } from "../api/emailCheckApi";

const emailCheckCache = new Map<string, boolean>();
const emailCheckCacheTime = new Map<string, number>();

export const accountSchema = z
  .object({
    email: z
      .email({ message: "이메일 형식이 올바르지 않습니다" })
      .min(1, "이메일을 입력해주세요")
      .refine(
        async (data) => {
          if (!data) return false;
          if (
            emailCheckCache.has(data) &&
            emailCheckCacheTime.has(data) &&
            emailCheckCacheTime.get(data)! > Date.now() - 1000 * 60 * 5
          )
            return !emailCheckCache.get(data)!;
          try {
            const { isRegistered } = await checkEmailRegistered({
              email: data,
            });
            emailCheckCache.set(data, isRegistered);
            emailCheckCacheTime.set(data, Date.now());
            return !isRegistered; // 이미 등록된 이메일
          } catch {
            return false;
          }
        },
        "이미 사용 중인 이메일입니다" // isRegistered === true일 때 메시지
      ),
    password: z
      .string()
      .min(8, "비밀번호는 8~12자로 이루어져야합니다")
      .max(12, "비밀번호는 8~12자로 이루어져야합니다")
      .regex(/[A-Za-z\d!@#$%^&*]{8,12}$/, {
        message: "특수 문자는 (!, @, #, $, %, ^, &, *)만 가능합니다",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

// 클럽 이름 배열로부터 zod enum을 동적으로 생성하는 함수
const createClubEnum = (clubNames: string[]) => {
  if (clubNames.length === 0) {
    // fallback: 기존 CLUB_NAMES 사용
    return z.enum(CLUB_NAMES as unknown as [string, ...string[]]);
  }
  return z.enum(clubNames as [string, ...string[]]);
};

// 동적으로 schema를 생성하는 함수 (클라이언트 사이드)
export const createPersonalSchema = async () => {
  let clubNames: string[];
  try {
    const clubList = await clubListApi();
    clubNames = clubList.map((club: ClubInfo) => club.clubName);
    // "없음" 옵션 추가
    if (!clubNames.includes("없음")) {
      clubNames.push("없음");
    }
  } catch (error) {
    console.error("Failed to fetch club list, using default", error);
    // fallback: 기존 CLUB_NAMES 사용
    clubNames = CLUB_NAMES as unknown as string[];
  }

  const basePersonalSchema = z.object({
    name: z
      .string()
      .min(1, "이름을 입력해주세요")
      .regex(/^[가-힣]+$/, { message: "올바른 형식의 한글 이름을 입력하세요" }),
    nickname: z.string().optional(),
    club: createClubEnum(clubNames).nullable().optional(),
    clubAge: z
      .string()
      .regex(/^\d{2}$/, { message: "두 자릿 수 학번을 입력해주세요" }),
    tellNumber: z
      .string()
      .min(1, "전화번호를 입력해주세요")
      .regex(/^(01[0-9]-?\d{3,4}-?\d{4}|0\d{2,3}-?\d{3,4}-?\d{4})$/, {
        message: "올바른 형식의 전화번호를 입력하세요",
      }),
    inviteCode: z.string().min(1, "초대 코드를 입력해주세요"),
  });

  return basePersonalSchema
    .refine((data) => !data.nickname || /^[가-힣]+$/.test(data.nickname), {
      message: "올바른 형식의 한글 패명을 입력하세요",
      path: ["nickname"],
    })
    .refine((data) => data.club !== undefined, {
      message: "소속패를 선택해주세요",
      path: ["club"],
    });
};

// 기존 호환성을 위한 fallback schema (클럽 목록을 가져올 수 없는 경우)
export const personalSchema = z
  .object({
    name: z
      .string()
      .min(1, "이름을 입력해주세요")
      .regex(/^[가-힣]+$/, { message: "올바른 형식의 한글 이름을 입력하세요" }),
    nickname: z.string().optional(),
    club: z
      .enum(CLUB_NAMES as unknown as [string, ...string[]])
      .nullable()
      .optional(),
    clubAge: z
      .string()
      .regex(/^\d{2}$/, { message: "두 자릿 수 학번을 입력해주세요" }),
    tellNumber: z
      .string()
      .min(1, "전화번호를 입력해주세요")
      .regex(/^(01[0-9]-?\d{3,4}-?\d{4}|0\d{2,3}-?\d{3,4}-?\d{4})$/, {
        message: "올바른 형식의 전화번호를 입력하세요",
      }),
    inviteCode: z.string().min(1, "초대 코드를 입력해주세요"),
  })
  .refine((data) => !data.nickname || /^[가-힣]+$/.test(data.nickname), {
    message: "올바른 형식의 한글 패명을 입력하세요",
    path: ["nickname"],
  })
  .refine((data) => data.club !== undefined, {
    message: "소속패를 선택해주세요",
    path: ["club"],
  });

// 통합 스키마 (먼저 merge 후 refine 적용)
export const fullSignUpSchema = accountSchema.safeExtend(personalSchema.shape);

// 타입 추출
export type AccountFormData = z.infer<typeof accountSchema>;
export type PersonalFormData = z.infer<typeof personalSchema>;
export type FullSignUpFormData = z.infer<typeof fullSignUpSchema>;

// 스텝별 검증 필드 매핑
export const stepValidationFields = {
  계정정보입력: ["email", "password", "confirmPassword"] as const,
  개인정보입력: [
    "name",
    "tellNumber",
    "inviteCode",
    "clubAge",
    "club",
  ] as const,
};
