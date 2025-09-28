import { z } from "zod";

export const emailCheckSchema = z.object({
  email: z
    .email({ message: "이메일 형식이 올바르지 않습니다" })
    .min(1, "이메일을 입력해주세요"),
});

export type EmailCheckFormData = z.infer<typeof emailCheckSchema>;

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "비밀번호는 8~12자로 이루어져야합니다")
    .max(12, "비밀번호는 8~12자로 이루어져야합니다")
    .regex(/[A-Za-z\d!@#$%^&*]{8,12}$/, {
      message: "특수 문자는 (!, @, #, $, %, ^, &, *)만 가능합니다",
    }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["confirmPassword"],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
