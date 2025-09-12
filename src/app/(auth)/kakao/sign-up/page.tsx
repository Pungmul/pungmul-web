import { Header } from "@/shared/components";
import { KaKaoSignUpForm } from "@/features/auth/components/widget/KaKaoSignUpForm";

export default function SignUpPageContent() {
  return (
    <div className="h-full w-full flex flex-col justify-center">
      <Header title="회원가입" />
      <KaKaoSignUpForm />
    </div>
  );
}
