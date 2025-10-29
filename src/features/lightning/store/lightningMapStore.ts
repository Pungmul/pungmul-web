import { create } from 'zustand';
import { LightningMeeting } from '@pThunder/features/lightning';

interface LightningMapStore {
  // 상태
  lightningList: LightningMeeting[];
  focusedLightningIndex: number | null;
  target: "전체" | "우리학교";
  
  // 액션
  setLightningList: (list: LightningMeeting[]) => void;
  setFocusedLightningIndex: (index: number | null) => void;
  setTarget: (target: "전체" | "우리학교") => void;
  focusLightningByIndex: (index: number) => void;
  focusLightningById: (id: number) => void;
  clearFocus: () => void;
}

export const lightningMapStore = create<LightningMapStore>((set, get) => ({
  // 초기 상태
  lightningList: [],
  focusedLightningIndex: null,
  target: "전체",
  
  // 액션들
  setLightningList: (list) => set({ lightningList: list }),
  
  setFocusedLightningIndex: (index) => set({ focusedLightningIndex: index }),
  
  setTarget: (target) => set({ target }),
  
  focusLightningByIndex: (index) => {
    const { lightningList } = get();
    if (index >= 0 && index < lightningList.length) {
      set({ focusedLightningIndex: index });
    }
  },
  
  focusLightningById: (id: number) => {
    const { lightningList } = get();
    const index = lightningList.findIndex(lightning => lightning.id === id);
    if (index !== -1) {
      set({ focusedLightningIndex: index });
    }
  },
  
  clearFocus: () => set({ focusedLightningIndex: null }),
})); 