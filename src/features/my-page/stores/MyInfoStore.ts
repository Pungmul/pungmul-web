import { create } from "zustand";
import { persist, StorageValue } from "zustand/middleware";
import { Member } from "@/shared/types/member/type";
import { Instrument, InstrumentStatus } from "@/shared/types/instrument/type";


interface MyInfoStore {
  myInfo: Member | null;
  fetch: () => Promise<void>;
  addInstrumentSkill: (body: InstrumentStatus) => Promise<void>;
  deleteInstrumentSkill: (instrument: Instrument) => Promise<void>;
  updateInstrumentSkill: (body: InstrumentStatus) => Promise<void>;
}

const usingLocalStorage = () => {
  return {
    getItem: (name: string): StorageValue<MyInfoStore> | null => {
      try {
        const value = localStorage.getItem(name);
        if (!value) return null;

        const parsedData = JSON.parse(value);

        return parsedData as StorageValue<MyInfoStore>;
      } catch (error) {
        console.error("데이터 파싱 실패:", error);
        localStorage.removeItem(name);
        return null;
      }
    },

    setItem: (name: string, value: StorageValue<MyInfoStore>): void => {
      try {
        localStorage.setItem(name, JSON.stringify(value));
      } catch (error) {
        console.error("데이터 저장 실패:", error);
      }
    },

    removeItem: (name: string): void => {
      localStorage.removeItem(name);
    },
  };
};

export const useMyInfoStore = create<MyInfoStore>()(
  persist(
    (set, get) => ({
      myInfo: null,
      fetch: async () => {
        const response = await fetch("/my-page/api", {
          credentials: "include",
        });
        set({ myInfo: await response.json() });
      },
      addInstrumentSkill: async (body: InstrumentStatus) => {
        try {
          const response = await fetch("/instrument-skill/patch", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(body),
          });
          set({ myInfo: await response.json() });
        } catch (e) {
          console.error(e);
          alert("악기 정보 업데이트 실패");
        }
      },
      deleteInstrumentSkill: async (instrument: Instrument) => {
        try {
          const myInfo = get().myInfo;

          if (!myInfo) throw new Error("myInfo is null");

          const remainInstrumentSkill = myInfo.instrumentStatusDTOList
            .filter(
              (instrumentStatus) => instrumentStatus.instrument !== instrument
            )
            .map((instrumentStatus) => {
              return {
                instrument: instrumentStatus.instrument,
                instrumentAbility: instrumentStatus.instrumentAbility,
                major: instrumentStatus.major,
              };
            });

          const response = await fetch("/instrument-skill/patch", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(remainInstrumentSkill),
          });

          if (!response.ok) throw new Error("악기 정보 업데이트 실패");
          const { response: data } = await response.json();
          const { instruments } = data;
          set({
            myInfo: {
              ...myInfo,
              instrumentStatusDTOList: instruments,
            },
          });
        } catch (e) {
          console.error(e);
          alert("악기 정보 삭제 실패");
        }
      },
      updateInstrumentSkill: async (body: InstrumentStatus) => {
        try {
          const myInfo = get().myInfo;

          if (!myInfo) throw new Error("myInfo is null");
          const { instrument, instrumentAbility, major } = body;
          console.log(JSON.stringify({ instrument, instrumentAbility, major }));
          const response = await fetch("instrument-skill/patch", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ instrument, instrumentAbility, major }),
          });

          if (!response.ok) throw new Error("악기 정보 업데이트 실패");
          const { response: data } = await response.json();
          const { instruments } = data;
          set({
            myInfo: {
              ...myInfo,
              instrumentStatusDTOList: instruments,
            },
          });
        } catch (e) {
          console.error(e);
          alert("악기 정보 업데이트 실패");
        }
      },
    }),
    {
      name: "auth-storage",
      storage: usingLocalStorage(),
      partialize: (state) => ({ ...state }),
    }
  )
);
