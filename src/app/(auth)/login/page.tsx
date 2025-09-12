"use client";

import Link from "next/link";
import LoginForm from "@/features/auth/components/widget/LoginForm";
import Image from "next/image";
import { KakaoLogo } from "@pThunder/shared/components/Icons";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectURL = searchParams.get("redirectURL");


  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative">
      <div
        className="min-w-[380px] lg:min-w-[640px] rounded-md flex flex-col gap-6"
        style={{ padding: "0 24px" }}
      >
        <div className="relative w-[320px] self-center aspect-[2/1]">
          <Image
            src={"/logos/pungdeong_logo.png"}
            alt="logo"
            className="object-contain"
            fill
          />
        </div>
        <LoginForm />
        <div className="w-full px-[12px]">
          <a
            className="flex w-full bg-[#FEE500] py-2 rounded-md mt-2 cursor-pointer flex-row items-center justify-center gap-[16px] px-[24px]"
            href={`/kakao/login?redirectURL=${redirectURL}`}
          >
            <KakaoLogo style={{ width: 20, height: 20 }} />
            <div className="text-[16px] font-semibold">카카오로 시작하기</div>
          </a>
          <Link
            className="block w-full border border-grey-500 text-grey-500 text-center bg-white py-2 rounded-md mt-2 cursor-pointer"
            href="/sign-up"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
