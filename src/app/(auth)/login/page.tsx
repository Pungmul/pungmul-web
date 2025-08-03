"use client";

import Link from "next/link";
import LoginForm from "@/features/auth/components/widget/LoginForm";

export default function LoginPage() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative">
      <div
        className="min-w-[380px] lg:min-w-[640px] rounded-md flex flex-col gap-6"
        style={{ padding: "0 24px" }}
      >
        <div className="w-36 self-center h-20 bg-[#816DFF]" />
        <LoginForm />
        <div className="w-full px-[12px]">
          <Link
            className="block w-full border border-[#816DFF] text-[#816DFF] text-center bg-white py-2 rounded-md mt-2 cursor-pointer"
            href="/sign-up"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
