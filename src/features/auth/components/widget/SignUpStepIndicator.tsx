import { SignUpStep } from "@/features/auth/types";

export function StepIndicator({ currentStep }: { currentStep: SignUpStep }) {
    return (
      <div
        className="flex flex-row items-center my-[28px] mx-auto px-[12px] pt-[4px]"
      >
        <div
          className="flex flex-col items-center overflow-visible gap-[8px] w-[48px]"
        >
          <div
            className={`flex items-center justify-center ${
              currentStep === "약관동의" ? " bg-primary" : " bg-grey-300"
            }  rounded-full w-[36px] h-[36px]`}
          >
            <div className="text-white">1</div>
          </div>
          <div
            className="text-[14px] text-center text-grey-500 leading-[110%] w-[100px]"
          >
            약관동의
          </div>
        </div>
        <div
          className="border-dashed border border-grey-400 w-[65px] mb-[28px]"
        />
  
        <div
          className="flex flex-col items-center overflow-visible gap-[8px] w-[48px]"
        >
          <div
            className={`flex items-center justify-center ${
              currentStep === "계정정보입력" ? " bg-primary" : " bg-grey-300"
            }  rounded-full w-[36px] h-[36px]`}
          >
            <div className="text-white">2</div>
          </div>
          <div
            className="text-[14px] text-center text-grey-500 leading-[110%] w-[100px]"
          >
            계정 정보 입력
          </div>
        </div>
  
        <div
          className="border-dashed border border-grey-400 w-[65px] mb-[28px]"
        />
  
        <div
          className="flex flex-col items-center overflow-visible gap-[8px] w-[48px]"
        >
          <div
            className={`flex items-center justify-center ${
              currentStep === "개인정보입력" ? " bg-primary" : " bg-grey-300"
            }  rounded-full w-[36px] h-[36px]`}
          >
            <div className="text-white">3</div>
          </div>
          <div
            className="text-[14px] text-center text-grey-500 leading-[110%] w-[100px]"
          >
            개인 정보 입력
          </div>
        </div>
      </div>
    );
  }
  