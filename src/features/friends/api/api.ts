import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@/shared/lib";
import { friendStore } from "@pThunder/store/friend/useFriends";
import { Friend } from "@pThunder/shared";

const acceptFriend = async (friendId: number) => {
  console.log(friendId, "friendId");

  const response = await fetch(`/friends/accept?friendRequestId=${friendId}`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to accept friend");
  }

  return response.json();
};

const findFriends = async (keyword: string): Promise<Friend[]> => {
  const response = await fetch(`/friends/load${keyword ? `?keyword=${keyword}` : ""}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to find friends");
  }

  return response.json().then((data) => {
    return data.acceptedFriendList;
  });
};

export const useFindFriends = () => {
  const searchKeyword = friendStore((state) => state.friendsFilter.keyword);
  const debouncedKeyword = useDebounce(searchKeyword, 300); // 300ms 디바운스

  return useQuery({
    queryKey: ["findFriends", debouncedKeyword],
    queryFn: () => findFriends(debouncedKeyword),
  });
};

export const useAcceptFriendMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptFriend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });
};
