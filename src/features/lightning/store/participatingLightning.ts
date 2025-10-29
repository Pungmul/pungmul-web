import { LightningMeeting } from "@pThunder/features/lightning";
import { create } from "zustand";

interface ParticipatingLightningStore {
  participatingLightning: LightningMeeting | null;
  setParticipatingLightning: (participatingLightning: LightningMeeting) => void;
  fetch: () => Promise<void>;
  delete: () => void;
}

export const participatingLightningStore =
  create<ParticipatingLightningStore>((set) => ({
    participatingLightning: null,
    setParticipatingLightning: (participatingLightning: LightningMeeting) =>
      set({ participatingLightning: participatingLightning }),
    fetch: async () => {
      const response = await fetch(`/api/lightning/status`, {
        credentials: "include",
      });
      set({ participatingLightning: await response.json() });
    },
    delete: async () => {
      set({ participatingLightning: null });
    },
  }));
