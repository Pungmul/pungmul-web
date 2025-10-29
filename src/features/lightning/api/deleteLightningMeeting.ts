export const deleteLightningMeetingAPI = async ({
  lightningMeetingId,
}: {
  lightningMeetingId: number;
}) => {
  const response = await fetch(`/api/lightning/cancel`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ meetingId: lightningMeetingId }),
  });

  if (!response.ok) throw new Error("서버 불안정" + response.status);

  return response.json();
};
