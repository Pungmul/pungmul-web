import { useMutation, useQueryClient } from "@tanstack/react-query";

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

export const useAcceptFriendMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptFriend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });
};
