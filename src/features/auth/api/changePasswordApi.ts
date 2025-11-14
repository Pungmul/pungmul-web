export const changePasswordRequest = async (
  currentPassword: string,
  newPassword: string
) => {
  try {
    const response = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("에러:", errorText);
      throw Error("서버 불안정" + response.status);
    }
    
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    throw error;
  }
};
