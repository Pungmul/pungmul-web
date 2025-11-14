import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  EditProfilePasswordFormValues,
  editProfilePasswordSchema,
} from "@/features/my-page";

export const useEditProfilePasswordForm = () =>
  useForm<EditProfilePasswordFormValues>({
    resolver: zodResolver(editProfilePasswordSchema),
    mode: "onChange",
    defaultValues: {
      oldPassword: "",
    },
  });
