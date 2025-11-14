import { useMutation } from "@tanstack/react-query";
import { changePasswordRequest } from "../api";

interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export const useChangePasswordRequest = () => {
    return useMutation({
        mutationFn: ({ currentPassword, newPassword }: ChangePasswordRequest) => changePasswordRequest(currentPassword, newPassword),
    });
};