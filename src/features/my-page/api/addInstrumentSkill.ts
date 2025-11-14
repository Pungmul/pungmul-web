import type { InstrumentStatus } from "@/features/instrument-status";

export const addInstrumentSkill = async (body: InstrumentStatus) => {
  const response = await fetch("/instrument-skill/patch", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("악기 정보 업데이트 실패");
  }

  return response.json();
};

