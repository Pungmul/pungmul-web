import { Friend } from "../types"

export const loadMyFriends = async (
  keyword: string
): Promise<{ acceptedFriendList: Friend[]; pendingReceivedList: Friend[], pendingSentList: Friend[] }> => {
  try {
    const response = await fetch(`/api/friends/load?keyword=${keyword}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) throw Error("비정상 동작");

    const { acceptedFriendList, pendingReceivedList, pendingSentList } = await response.json();
    return { acceptedFriendList, pendingReceivedList, pendingSentList };
  } catch (e) {
    console.error(e);
  }
  return { acceptedFriendList: [], pendingReceivedList: [], pendingSentList: [] };
};
