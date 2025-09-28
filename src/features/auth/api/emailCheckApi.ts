interface EmailCheckRequest {
  email: string;
}

interface EmailCheckResponse {
  isRegistered: boolean;
}

// 이메일 중복 체크 API 함수
export const checkEmailRegistered = async (
  data: EmailCheckRequest
): Promise<EmailCheckResponse> => {
  try {
    const response = await fetch("/api/auth/sign-up/check-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("이메일 중복 체크에 실패했습니다.");
    }

    const { isRegistered } = await response.json();
    return { isRegistered };
  } catch (error) {
    console.error("이메일 중복 체크 오류:", error);
    throw error;
  }
};
