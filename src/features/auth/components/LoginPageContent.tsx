"use client";

import Link from "next/link";
import LoginForm from "./LoginForm";

export default function LoginPageContent() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative">
      <div
        className="min-w-[380px] lg:min-w-[640px] rounded-md flex flex-col gap-6"
        style={{ padding: "0 24px" }}
      >
        <div className="w-36 self-center h-20 bg-[#816DFF]" />

        <LoginForm />

        {/* <div className="flex flex-row items-center">
          <div className="flex-grow border-0.5" />
          <div className="text-sm text-gray-300 mx-2">소셜 계정으로 로그인</div>
          <div className="flex-grow border-0.5"></div>
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col w-14 items-center cursor-pointer">
            <div className="w-12 h-12 rounded-full">
              <div className="w-12 h-12 naverBtn"></div>
            </div>
            <div className="text-gray-300 pt-2 font-medium text-sm">네이버</div>
          </div>
          <div className="flex flex-col w-14 items-center cursor-pointer">
            <div className="w-12 h-12 rounded-full kakao-color overflow-hidden flex items-center justify-center">
              <div className="w-7 h-7 kakaoBtn"></div>
            </div>
            <div className="text-gray-300 pt-2 font-medium text-sm">카카오</div>
          </div>
          <div className="flex flex-col w-14 items-center cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-slate-300" />
            <div className="text-gray-300 pt-2 font-medium text-sm">Apple</div>
          </div>
          <div className="flex flex-col w-14 items-center cursor-pointer">
            <div className="w-12 h-12 rounded-full border-0.5 border-slate-300" />
            <div className="text-gray-300 pt-2 font-medium text-sm">Google</div>
          </div>
        </div> */}
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
