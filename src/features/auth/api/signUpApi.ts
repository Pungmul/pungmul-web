import { useMutation } from "@tanstack/react-query";
import { SignUpRequestForm, SignUpResponse } from "../types/sign-up.types";

// 회원가입 API 함수 - FormData 지원
export const signUpRequest = async (data: SignUpRequestForm): Promise<SignUpResponse> => {
  try {
    const response = await fetch('/sign-up/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('회원가입 요청에 실패했습니다.');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('회원가입 오류:', error);
    throw error;
  }
};

// React Query Hook
export const useSignUpRequest = (options?: {
  onSuccess?: (data: SignUpResponse) => void;
  onError?: (error: Error) => void;
}) => {
  return useMutation({
    mutationFn: signUpRequest,
    onSuccess: options?.onSuccess || (() => {}),
    onError: options?.onError || (() => {}),
  });
}; 