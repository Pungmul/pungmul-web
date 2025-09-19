import { useMutation } from "@tanstack/react-query";
import { SignUpRequestForm, SignUpResponse } from "../types/kakao-sign-up.types";

// 회원가입 API 함수 - FormData 지원
export const kakaoSignUpRequest = async (data: SignUpRequestForm): Promise<SignUpResponse> => {
  try {
    const response = await fetch('/api/auth/kakao/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('카카오 회원가입 요청에 실패했습니다.');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('카카오 회원가입 오류:', error);
    throw error;
  }
};

// React Query Hook
export const useKakaoSignUpRequest = () => {
  return useMutation({
    mutationFn: kakaoSignUpRequest
  });
}; 