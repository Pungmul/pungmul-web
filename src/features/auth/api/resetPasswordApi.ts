import {
  EmailCheckRequest,
  EmailCheckResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../types/reset-password.types";

// 회원가입 API 함수 - FormData 지원
export const resetPasswordRequest = async (
  data: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  try {
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("비밀번호 재설정 요청에 실패했습니다.");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("비밀번호 재설정 오류:", error);
    throw error;
  }
};


export const sendResetPasswordEmail = async (
  data: EmailCheckRequest
): Promise<EmailCheckResponse> => {
  try {
    const response = await fetch("/api/auth/reset-password/send-link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("비밀번호 재설정 이메일 전송에 실패했습니다.");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("비밀번호 재설정 이메일 전송 오류:", error);
    throw error;
  }
};

