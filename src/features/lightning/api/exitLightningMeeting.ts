export const exitLightningMeetingAPI = async ({
  lightningMeetingId,
}: {
  lightningMeetingId: number;
}) => {
  const response = await fetch(`/api/lightning/exit`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lightningMeetingId }),
  });

  if (!response.ok) throw new Error("서버 불안정" + response.status);

  return response.json();
};
