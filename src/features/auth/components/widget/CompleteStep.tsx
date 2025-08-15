"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@pThunder/shared";

interface CompleteStepProps {
  submitFinalSignUp: () => Promise<void>;
  isPending: boolean;
  error: Error | null;
}

export const CompleteStep = ({
  submitFinalSignUp,
  isPending,
  error,
}: CompleteStepProps) => {
  const router = useRouter();
  const [isRequested, setIsRequested] = useState(false);

  useEffect(() => {
    // 컴포넌트 마운트 시 회원가입 API 호출
    if (!isRequested) {
      submitFinalSignUp();
      setIsRequested(true);
    }
  }, [isRequested, submitFinalSignUp]);

  // 로딩 상태
  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6">
        <div className="text-center flex flex-col items-center justify-center">
          <Spinner size={64}/>
          <h2 className="text-2xl font-bold text-gray-900">
            회원가입 신청서 보내는 중...
          </h2>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            회원가입 실패
          </h2>
          <p className="text-gray-600 mb-4">
            {error.message || "회원가입 중 오류가 발생했습니다."}
          </p>
        </div>

        <button
          onClick={() => submitFinalSignUp()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 성공 상태
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#816DFF] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          회원가입이 완료되었어요!
        </h2>
        <p className="text-gray-600 mb-4">즐거운 풍물 생활을 시작해봐요</p>
      </div>

      <button
        onClick={() => router.push("/login")}
        className="px-6 py-2 bg-[#816DFF] text-white rounded-lg hover:bg-[#6353C3] transition-colors"
      >
        로그인 하러가기
      </button>
    </div>
  );
};
