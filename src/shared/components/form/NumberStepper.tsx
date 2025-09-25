"use client";

interface NumberStepperProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  setValue: (value: number) => void;
  className?: string;
  disabled?: boolean;
  validation?: {
    min?: number;
    max?: number;
  };
  inputComponent: React.ReactNode;
}

export function NumberStepper({
  min = 0,
  max = 100,
  step = 1,
  className = "",
  disabled = false,
  value,
  setValue,
  inputComponent,
}: NumberStepperProps) {
  return (
    <div
      className={`flex flex-row items-center justify-center gap-[8px] ${className}`}
    >
      {/* 감소 버튼 */}
      <div
        className={`rounded-full border-grey-400 text-grey-400 cursor-pointer border w-[24px] h-[24px] items-center justify-center flex
              ${value > min ? "bg-background" : "bg-grey-200"}
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
        onClick={() => {
          if (!disabled && value > min) {
            const newValue = Math.max(min, value - step);
            setValue(newValue);
          }
        }}
      >
        -
      </div>

      {/* 입력 필드 */}
      {inputComponent}
      
      {/* 증가 버튼 */}
      <div
        className={`rounded-full border-grey-400 text-grey-400 cursor-pointer border w-[24px] h-[24px] items-center justify-center flex
              ${value < max ? "bg-background" : "bg-grey-200"}
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
        onClick={() => {
          if (!disabled && value < max) {
            const newValue = Math.min(max, value + step);
            setValue(newValue);
          }
        }}
      >
        +
      </div>
    </div>
  );
}
