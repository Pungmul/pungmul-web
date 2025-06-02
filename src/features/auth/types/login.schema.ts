import { z } from "zod";

export const loginSchema = z.object({
    loginId: z
      .string()
      .min(1, "이메일을 입력해주세요.")
      .email({ message: "이메일 형식이 올바르지 않습니다." }),
  
    password: z
      .string()
      .min(8, "비밀번호는 8자~12자 이내 입니다.")
      .max(12, "비밀번호는 8자~12자 이내 입니다."),
  });
  
  export type LoginFormType = z.infer<typeof loginSchema>;
  