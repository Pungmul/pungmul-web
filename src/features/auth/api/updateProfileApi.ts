export const updateProfileAPI = async (formData: FormData) => {
  try {
    const response = await fetch(`/api/auth/profile`, {
      method: "PATCH",
      body: formData,
    });
    if (!response.ok) throw Error("서버 불안정" + response.status);
    return response.json();
  } catch (error) {
    console.error("프로필 수정 중 에러:", error);
    throw error;
  }
};