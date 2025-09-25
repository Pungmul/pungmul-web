import React from "react";

interface ChipButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  filled?: boolean;
}

function ChipButton({
  children,
  className,
  filled = false,
  ...props
}: ChipButtonProps) {
  return (
    <button
      type="button"
      className={
        (filled
          ? "bg-grey-700 text-background border-grey-700 "
          : "bg-background text-grey-500 border-grey-300 ") +
        ` px-[12px] py-[8px] rounded-[20px] text-[14px] border-[2px] leading-[16px] text-center ${className}`
      }
      {...props}
    >
      {children}
    </button>
  );
}

export default React.memo(ChipButton);