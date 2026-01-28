import { useState } from "react";
import { useKakaoSignUpRequest } from "../queries/useKakaoSignUpRequest";
import {
  FullSignUpFormData,
  fullSignUpSchema,
} from "../types/kakao-sign-up.schemas";
import { transformKakaoSignUpData } from "../services/kakaoSignUpService";
import { useClubList } from "@pThunder/features/club";

const useKakaoSignUpRequestHook = () => {
  const { data: clubList = [] } = useClubList();
  const [isLoading, setIsLoading] = useState(true);
  const {
    mutateAsync: submitSignUp,
    isPending,
    error,
  } = useKakaoSignUpRequest();

  interface SubmitSignUpOptions {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  }

  const submitFinalSignUp = async (
    formData: FullSignUpFormData,
    options?: SubmitSignUpOptions,
  ) => {
    try {
      // 스키마 검증
      await fullSignUpSchema.parseAsync(formData);

      // 데이터 변환
      const finalData = transformKakaoSignUpData(clubList, formData);

      // API 호출
      await submitSignUp(finalData);
      options?.onSuccess?.();
    } catch (error: unknown) {
      options?.onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitFinalSignUp,
    isPending: isPending || isLoading,
    error,
  };
};

export { useKakaoSignUpRequestHook as useKakaoSignUpRequest };
