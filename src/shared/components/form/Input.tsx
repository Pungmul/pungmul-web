"use client";

import { HTMLInputTypeAttribute, useState } from "react";
import { josa } from "es-hangul";
import Image from "next/image";
import WarningCircleIcon from "@public/icons/Warning-circle-icon.svg";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import EyeIcon from "../ui/EyeIcon";
import EyeSlashIcon from "../ui/EyeSlashIcon";
import "@pThunder/app/globals.css";

interface InputProps <T extends FieldValues>{
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  name: Path<T>;
  className?: string;
  label: string;
  errorMessage?: string;
  isEncrypted?: boolean;
  register: UseFormRegister<T>;
}
export function Input<T extends FieldValues>(props: InputProps<T>) {
  const {
    type = "text",
    name,
    className,
    label,
    errorMessage,
    isEncrypted = false,
    register,
    placeholder = `${josa(label, "을/를")} 입력해주세요.`,
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
            type={isEncrypted ? (visible ? "text" : "password") : type}
            className={`flex-grow outline-none placeholder-[#CDC5FF] text-[#816DFF] ${className}`}
            placeholder={placeholder}
            {...register(name)}
          />
          {isEncrypted && <span
            className="w-[24px] h-[24px] cursor-pointer flex items-center justify-center"
            onClick={toggleVisible}
          >
            {visible ? <EyeIcon color="#816DFF"/> : <EyeSlashIcon color="#816DFF"/>}
          </span>
        }
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