"use client";
import { LightningMeeting } from "../types";

export const loadLightningData = async (): Promise<{ normalLightningMeetings: LightningMeeting[], schoolLightningMeetings: LightningMeeting[] }>  => {
  const response = await fetch(`/api/lightning/search`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch lightning data");
  }

  const { normalLightningMeetings, schoolLightningMeetings } =
    await response.json();
  return { normalLightningMeetings, schoolLightningMeetings };
};
