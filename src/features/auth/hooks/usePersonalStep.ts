import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PersonalFormData, personalSchema } from "../types/sign-up.schemas";
import { useClubList } from "@pThunder/features/club/queries";
import { useMemo, useEffect } from "react";
import { z } from "zod";

export const usePersonalStep = () => {
  const { data: clubList = [] } = useClubList();

  // 클럽 목록이 있으면 동적으로 schema 생성, 없으면 fallback schema 사용
  const dynamicSchema = useMemo(() => {
    if (!clubList || clubList.length === 0) {
      return personalSchema;
    }

    const clubNames = clubList.map((club) => club.groupName);
    if (!clubNames.includes("없음")) {
      clubNames.push("없음");
    }

    const createClubEnum = (clubNames: string[]) => {
      if (clubNames.length === 0) {
        return z.enum(["없음"] as [string, ...string[]]);
      }
      return z.enum(clubNames as [string, ...string[]]);
    };

    const baseSchema = z.object({
      name: z
        .string()
        .min(1, "이름을 입력해주세요")
        .regex(/^[가-힣]+$/, {
          message: "올바른 형식의 한글 이름을 입력하세요",
        }),
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

    return baseSchema
      .refine((data) => !data.nickname || /^[가-힣]+$/.test(data.nickname), {
        message: "올바른 형식의 한글 패명을 입력하세요",
        path: ["nickname"],
      })
      .refine((data) => data.club !== undefined, {
        message: "소속패를 선택해주세요",
        path: ["club"],
      });
  }, [clubList]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors: inputErrors, isValid },
    reset,
  } = useForm<PersonalFormData>({
    resolver: zodResolver(dynamicSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      nickname: "",
      club: undefined,
      clubAge: "",
      tellNumber: "",
      inviteCode: "",
    },
  });

  // schema가 변경되면 form 재검증
  useEffect(() => {
    reset(undefined, { keepValues: true });
  }, [dynamicSchema, reset]);

  return {
    register,
    handleSubmit,
    control,
    inputErrors,
    isValid,
  };
};

export default usePersonalStep;
