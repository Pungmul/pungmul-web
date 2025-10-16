export const sendImageMessage = async (
  roomId: string,
  formData: FormData
): Promise<void> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 5000);

  const signal = controller.signal;
  const response = await fetch(`/api/chats/${roomId}/images`, {
    credentials: "include",
    method: "POST",
    signal,
    body: formData,
  });

  clearTimeout(timeout);

  if (!response.ok) {
    throw new Error("이미지 전송에 실패했습니다.");
  }
};
