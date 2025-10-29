export const updateUserLocationAPI = async ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}): Promise<void> => {
  const response = await fetch(`/api/location`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ latitude, longitude }),
  });

  if (!response.ok) throw new Error("서버 불안정" + response.status);

  return response.json();
};
