"use client";

import { HTMLInputTypeAttribute, InputHTMLAttributes, useState } from "react";
import { josa } from "es-hangul";
import { WarningCircleIcon } from "@/shared/components/Icons";
import { EyeIcon, EyeSlashIcon } from "../Icons";
import "@pThunder/app/globals.css";
import React from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  label?: string;
  errorMessage?: string | undefined;
  isEncrypted?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ref?: React.RefCallback<HTMLInputElement | null>;
}
function Input(props: InputProps) {
  const {
    type = "text",
    label = "",
    errorMessage,
    isEncrypted = false,
    placeholder = `${josa(label, "을/를")} 입력해주세요.`,
    onChange,
    ref,
    ...rest
  } = props;

  const [visible, setVisible] = useState(isEncrypted ? false : true);

  const toggleVisible = () => {
    setVisible((prev) => !prev);
  };

  return (
    <label className="w-full" htmlFor={label}>
      <div className="flex flex-col gap-[4px]">
        {label.trim().length > 0 && (
          <span className="text-grey-500 px-[4px] text-[14px]">{label}{rest.required && <span className="text-red-500 ml-[4px]">*</span>}</span>
        )}
        <div
          className={`relative flex flex-row items-center border-[2px] box-border gap-[8px] px-[8px] h-[48px] rounded-[5px] ${
            !!errorMessage
              ? "border-red-400"
              : "border-grey-300 focus-within:border-grey-500"
          } ${
            rest.disabled ? "bg-grey-100 text-grey-600 cursor-not-allowed border-grey-300" : ""
          }`}
        >
          <input
            ref={ref}
            placeholder={placeholder}
            onChange={onChange}
            type={isEncrypted ? (visible ? "text" : "password") : type}
            id={label.trim().length > 0 ? label : undefined}
            {...rest}
            className={`flex-grow w-full outline-none placeholder-grey-300 text-grey-500 bg-transparent border-none h-full ${
              rest.disabled
                ? "placeholder:bg-grey-100 placeholder-grey-500"
                : ""
            } ${rest.className} `}
          />
          {isEncrypted && (
            <span
              className="size-[32px] p-[4px] cursor-pointer flex items-center justify-center text-grey-300 hover:text-grey-500"
              onClick={toggleVisible}
            >
              {visible ? <EyeIcon /> : <EyeSlashIcon />}
            </span>
          )}
        </div>
        {!!errorMessage && (
          <div className="flex flex-row items-center gap-[4px]">
            <WarningCircleIcon className="text-red-400" />
            <div className="text-red-500 max-w-full text-[12px]">
              {errorMessage}
            </div>
          </div>
        )}
      </div>
    </label>
  );
}

export default React.memo(Input);
