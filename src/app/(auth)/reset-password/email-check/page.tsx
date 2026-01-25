import { EmailCheckForm } from "@pThunder/features/auth";
import { Header } from "@pThunder/shared";

export default function ResetPassword() {
  return (
    <div className="w-full min-h-app h-full flex flex-col justify-center items-center">
      <div className="w-full max-w-[768px] mx-auto flex-1 flex flex-col">
        <Header title="비밀번호 재설정" />
        <EmailCheckForm />
      </div>
    </div>
  );
}

