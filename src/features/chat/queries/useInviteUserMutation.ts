import { useMutation } from "@tanstack/react-query";
import { inviteUser } from "../api";

export const useInviteUserMutation = () => {
  return useMutation({
    mutationFn: ({
      roomId,
      data,
    }: {
      roomId: string;
      data: { newUsernameList: string[] };
    }) => inviteUser(roomId, data),
  });
};
