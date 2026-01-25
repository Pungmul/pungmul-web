import { Header } from "@/shared/components";
import { KaKaoSignUpForm } from "@/features/auth/components/widget/KaKaoSignUpForm";

export default function SignUpPageContent() {
  return (
    <main className="h-full w-full flex flex-col min-h-app">
      <Header title="회원가입" />
      <KaKaoSignUpForm />
    </main>
  );
}
