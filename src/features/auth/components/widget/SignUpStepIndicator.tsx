import { SignUpStep } from "@/features/auth/types";

export function StepIndicator({ currentStep }: { currentStep: SignUpStep }) {
    return (
      <div
        className="flex flex-row items-center"
        style={{ margin: "28px auto", padding: "0 12px", paddingTop: 4 }}
      >
        <div
          className="flex flex-col items-center overflow-visible"
          style={{ gap: 8, width: 48 }}
        >
          <div
            className={`flex items-center justify-center ${
              currentStep === "약관동의" ? " bg-[#816DFF]" : " bg-[#D9D9D9]"
            }  rounded-full`}
            style={{ height: 36, width: 36 }}
          >
            <div className="text-white">1</div>
          </div>
          <div
            style={{
              fontSize: 14,
              textAlign: "center",
              color: currentStep === "약관동의" ? "#816DFF" : "#D9D9D9",
              lineHeight: "110%",
              width: 100,
            }}
          >
            약관동의
          </div>
        </div>
        <div
          className="border-dashed border border-[#D9D9D9]"
          style={{ width: 65, marginBottom: 28 }}
        />
  
        <div
          className="flex flex-col items-center overflow-visible"
          style={{ gap: 8, width: 48 }}
        >
          <div
            className={`flex items-center justify-center ${
              currentStep === "계정정보입력" ? " bg-[#816DFF]" : " bg-[#D9D9D9]"
            }  rounded-full`}
            style={{ height: 36, width: 36 }}
          >
            <div className="text-white">2</div>
          </div>
          <div
            style={{
              fontSize: 14,
              textAlign: "center",
              color: currentStep === "계정정보입력" ? "#816DFF" : "#D9D9D9",
              lineHeight: "110%",
              width: 100,
            }}
          >
            계정 정보 입력
          </div>
        </div>
  
        <div
          className="border-dashed border border-[#D9D9D9]"
          style={{ width: 65, marginBottom: 28 }}
        />
  
        <div
          className="flex flex-col items-center overflow-visible"
          style={{ gap: 8, width: 48 }}
        >
          <div
            className={`flex items-center justify-center ${
              currentStep === "개인정보입력" ? " bg-[#816DFF]" : " bg-[#D9D9D9]"
            }  rounded-full`}
            style={{ height: 36, width: 36 }}
          >
            <div className="text-white">3</div>
          </div>
          <div
            style={{
              fontSize: 14,
              textAlign: "center",
              color: currentStep === "개인정보입력" ? "#816DFF" : "#D9D9D9",
              lineHeight: "110%",
              width: 100,
            }}
          >
            개인 정보 입력
          </div>
        </div>
      </div>
    );
  }
  