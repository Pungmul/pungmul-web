"use client";

import { HTMLInputTypeAttribute, InputHTMLAttributes, useState } from "react";
import { josa } from "es-hangul";
import Image from "next/image";
import WarningCircleIcon from "@public/icons/Warning-circle-icon.svg";
import EyeIcon from "../ui/EyeIcon";
import EyeSlashIcon from "../ui/EyeSlashIcon";
import "@pThunder/app/globals.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  className?: string;
  label: string;
  errorMessage?: string;
  isEncrypted?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export function Input(props: InputProps) {
  const {
    type = "text",
    className,
    label,
    errorMessage,
    isEncrypted = false,
    placeholder = `${josa(label, "을/를")} 입력해주세요.`,
    onChange,
    ...rest
  } = props;

  const [visible, setVisible] = useState(isEncrypted ? false : true);

  const toggleVisible = () => {
    setVisible((prev) => !prev);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col" style={{ gap: 4, padding: "0 12px" }}>
        <div
          className="text-[#816DFF]"
          style={{ fontSize: 14, marginLeft: 4, lineHeight: "15px" }}
        >
          {label}
        </div>
        <div
          className={`flex flex-row items-center border ${
            errorMessage ? "border-red-400" : "border-[#CDC5FF]"
          }`}
          style={{ gap: 8, padding: "8px 8px", borderRadius: 5 }}
        >
          <input
            className={`flex-grow outline-none placeholder-[#CDC5FF] text-[#816DFF] ${className}`}
            placeholder={placeholder}
            onChange={onChange}
            {...rest}
            type={isEncrypted ? (visible ? "text" : "password") : type}
          />
          {isEncrypted && (
            <span
              className="w-[24px] h-[24px] cursor-pointer flex items-center justify-center"
              onClick={toggleVisible}
            >
              {visible ? (
                <EyeIcon color="#816DFF" />
              ) : (
                <EyeSlashIcon color="#816DFF" />
              )}
            </span>
          )}
        </div>
        {errorMessage && (
          <div
            className="flex flex-row items-center"
            style={{ gap: 4, marginTop: 4 }}
          >
            <Image src={WarningCircleIcon} width={12} alt="" />
            <div
              className="text-red-500 max-w-full"
              style={{ fontSize: 12, lineHeight: "15px" }}
            >
              {errorMessage}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
