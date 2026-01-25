import { Header } from "@/shared/components";
import { SignUpForm } from "@/features/auth/components/widget/SignUpForm";

export default function SignUpPageContent() {
  return (
    <div className="w-full min-h-app h-full flex flex-col justify-center items-center">
      <div className="w-full max-w-[768px] mx-auto flex-1 flex flex-col">
        <Header title="회원가입" />
        <SignUpForm />
      </div>
    </div>
  );
}
