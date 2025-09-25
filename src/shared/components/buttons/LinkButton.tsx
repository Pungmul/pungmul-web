import React from "react";
import Link from "next/link";
import { LinkButtonProps } from "./type";

function LinkButton({
  children,
  className,
  ...props
}: LinkButtonProps) {
  return (
    <Link className={`w-full h-[48px] text-[16px] rounded-[4px] cursor-pointer flex justify-center items-center flex-row text-background disabled:cursor-not-allowed ${className ?? " bg-primary disabled:bg-primary-light"}`} {...props}>
      {children}
    </Link>
  );
}

export default React.memo(LinkButton);