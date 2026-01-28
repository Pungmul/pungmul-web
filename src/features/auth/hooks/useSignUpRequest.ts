import { useSignUpRequest } from "../queries/useSignUpRequest";
import { FullSignUpFormData, fullSignUpSchema } from "../types/sign-up.schemas";
import { transformSignUpData } from "../services/signUpService";
import { useClubList } from "@pThunder/features/club";

const useSignUpRequestHook = () => {
  const { data: clubList = [] } = useClubList();
  const { mutateAsync: submitSignUp, isPending, error } = useSignUpRequest();

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
      const finalData = transformSignUpData(clubList, formData);

      // API 호출
      await submitSignUp(finalData);
      options?.onSuccess?.();
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

export { useSignUpRequestHook as useSignUpRequest };
