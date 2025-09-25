"use client";

import React, { useMemo, useCallback, forwardRef } from "react";
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { InputHTMLAttributes } from "react";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onClose: () => void;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, onClose, placeholder = "검색", ...rest }, ref) => {
    const isSearching = useMemo(
      () => value && typeof value === "string" && value.trim().length > 0,
      [value]
    );

    const handleClear = useCallback(() => {
      onChange?.({
        target: {
          value: "",
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }, [onChange]);

    return (
      <label
        htmlFor="search"
        className="flex flex-row items-center justify-between w-full bg-grey-100 rounded-[8px] px-[8px]"
      >
        <div className="flex items-center justify-center size-[24px] bg-grey-100 rounded-full">
          {isSearching ? (
            <ChevronLeftIcon
              className="size-[20px] text-grey-500 cursor-pointer"
              onClick={onClose}
            />
          ) : (
            <MagnifyingGlassIcon className="size-[20px] text-grey-500" />
          )}
        </div>
        <input
          ref={ref}
          type="text"
          name="search"
          id="search"
          value={value}
          onChange={onChange}
          className="w-full h-full bg-transparent rounded-[8px] px-[4px] py-[12px] outline-none border-none"
          placeholder={placeholder}
          {...rest}
        />
        {isSearching && (
          <div className="flex items-center justify-center size-[24px] bg-grey-100 rounded-full cursor-pointer">
            <XCircleIcon
              className="size-[22px] fill-grey-500"
              onClick={handleClear}
            />
          </div>
        )}
      </label>
    );
  }
);

SearchInput.displayName = "SearchInput";

export default React.memo(SearchInput);
