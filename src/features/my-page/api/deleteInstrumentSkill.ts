import type { Instrument } from "@/features/instrument-status";

export const deleteInstrumentSkill = async (instrument: Instrument) => {
  const response = await fetch("/instrument-skill/patch", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ instrument }),
  });

  if (!response.ok) {
    throw new Error("악기 정보 업데이트 실패");
  }

  const { response: data } = await response.json();
  const { instruments } = data;
  return instruments;
};

