import { Header } from "@/shared/components";
import { SignUpForm } from "@/features/auth/components/widget/SignUpForm";

export default function SignUpPageContent() {
  return (
    <div className="h-full w-full flex flex-col justify-center">
      <Header title="회원가입" />
      <SignUpForm />
    </div>
  );
}
