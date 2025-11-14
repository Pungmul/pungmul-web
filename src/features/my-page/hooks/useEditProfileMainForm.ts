"use client";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  EditProfileFormValues,
  EditProfileSchema,
  MyPageInfo,
} from "@pThunder/features/my-page/types";
import { formatPhoneNumber } from "@pThunder/features/auth/lib";

export const useEditProfileMainForm = (
  schema: EditProfileSchema,
  userData?: MyPageInfo
) => {
  const defaultValues = useMemo(() => {
    return {
      profileImage: userData?.profile.fullFilePath ?? undefined,
      name: userData?.name ?? "",
      club: userData?.groupName ?? null,
      clubAge: userData?.clubAge?.toString() ?? "",
      nickname: userData?.clubName ?? "",
      tellNumber: formatPhoneNumber(userData?.phoneNumber ?? ""),
    }
  }, [userData]);

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return form;
};
