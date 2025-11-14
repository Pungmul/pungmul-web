import type { InstrumentStatus } from "@/features/instrument-status";

export const updateInstrumentSkill = async (body: InstrumentStatus) => {
  const { instrument, instrumentAbility, major } = body;

  const response = await fetch("instrument-skill/patch", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ instrument, instrumentAbility, major }),
  });

  if (!response.ok) {
    throw new Error("악기 정보 업데이트 실패");
  }

  const { response: data } = await response.json();
  const { instruments } = data;
  return instruments;
};

