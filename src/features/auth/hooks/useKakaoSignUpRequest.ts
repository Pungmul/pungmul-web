import { useKakaoSignUpRequest } from "../queries/useKakaoSignUpRequest";
import {
  FullSignUpFormData,
  fullSignUpSchema,
} from "../types/kakao-sign-up.schemas";
import { useRouter } from "next/navigation";
import { transformKakaoSignUpData } from "../services/kakaoSignUpService";
import { useClubList } from "@pThunder/features/club";

const useKakaoSignUpRequestHook = () => {
  const router = useRouter();

  const { data: clubList = [] } = useClubList();
  const { mutate: submitSignUp, isPending, error } = useKakaoSignUpRequest();

  interface SubmitSignUpOptions {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  }

  const submitFinalSignUp = async (
    formData: FullSignUpFormData,
    options?: SubmitSignUpOptions
  ) => {
    try {
      // 스키마 검증
      await fullSignUpSchema.parseAsync(formData);

      // 데이터 변환
      const finalData = transformKakaoSignUpData(clubList, formData);

      // API 호출
      submitSignUp(finalData, {
        onSuccess: () => {
          router.push("/home");
          options?.onSuccess?.();
        },
        onError: (error: Error) => {
          options?.onError?.(error);
        },
      });
    } catch (error: unknown) {
      options?.onError?.(error as Error);
    }
  };

  return {
    submitFinalSignUp,
    isPending,
    error,
  };
};

export { useKakaoSignUpRequestHook as useKakaoSignUpRequest };
