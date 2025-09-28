import { LoginResponse } from "../types/login-response";

export async function loginApi(
  loginId: string,
  password: string
): Promise<LoginResponse> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ loginId, password }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(error);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "프록시 처리 실패"
    );
  }
}
