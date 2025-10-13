import { FriendStatus } from "../types";

export const findFriends = async (keyword: string):Promise<FriendStatus[]> => {
  try {
    const response = await fetch(`/api/friends/search?keyword=${keyword}`, {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) throw Error('비정상 동작')

    const foundList = await response.json();
    return foundList;
  } catch (e) {
    console.error(e);
  }
  return [];
}

