import { Friend } from "@/shared/types/friend/type";
import { create } from "zustand";

interface FriendStore {
  friends: Friend[];
  fetchFriends: (keyword?: string) => Promise<void>;
}

export const useFriends = create<FriendStore>((set) => ({
  friends: [],
  fetchFriends: async (keyword?: string) => {
    const response = await fetch(`/friends/load${keyword ? `?keyword=${keyword}` : ""}`, {
      credentials: "include",
    });

    const data = await response.json();
    const { acceptedFriendList, pendingReceivedList } = data;
    
    return set({ friends: [...acceptedFriendList, ...pendingReceivedList] });
  },
}));
