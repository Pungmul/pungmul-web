import { create } from "zustand";

interface FriendFilter {
  keyword: string;
}

interface FriendStore {
  friendsFilter: FriendFilter;
  setSearchKeyword: (keyword: string) => void;
}

export const friendStore = create<FriendStore>((set) => ({
  friendsFilter: {
    keyword: "",
  },
  setSearchKeyword: (keyword: string) => set({ friendsFilter: { keyword } }),
}));
