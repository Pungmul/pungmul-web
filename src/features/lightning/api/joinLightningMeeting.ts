export const joinLightningMeetingAPI = async ({ meetingId }: { meetingId: number }): Promise<void> => {
  const response = await fetch(`/api/lightning/join`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ meetingId }),
  });

  if (!response.ok) throw new Error("서버 불안정" + response.status);

  return response.json();
};
