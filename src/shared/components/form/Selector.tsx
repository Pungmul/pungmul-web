'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

import { josa } from "es-hangul";

import { ChevronRightIcon } from "@heroicons/react/24/outline";
import WarningCircleIcon from "@public/icons/Warning-circle-icon.svg";

export interface SelectorItem<T> {
  label: string;
  value: T | null;
}

export function Selector<T>({
  items,
  selectedItem,
  onSelect,
  hasSearch = false,
  label,
  errorMessage,
}: {
  items: SelectorItem<T>[];
  selectedItem: T | null;
  onSelect: (item: T | null) => void;
  hasSearch?: boolean;
  label: string;
  errorMessage?: string;
}) {
  const [isListOpen, setIsListOpen] = useState(false);

  const handleSelect = (item: T | null) => {
    onSelect(item);
    setIsListOpen(false);
  };

  const handleCloseList = useCallback(() => {
    setIsListOpen(false);
  }, []);

  return (
    <div className="w-full relative flex flex-col gap-[4px]">
      <div className="flex flex-col" style={{ gap: 4, padding: "0 12px" }}>
        <div
          className="text-[#816DFF]"
          style={{ fontSize: 14, marginLeft: 4, lineHeight: "15px" }}
        >
          {label}
        </div>
        <div
          className="flex flex-row items-center border border-[#CDC5FF] cursor-pointer"
          style={{ gap: 8, padding: "8px 8px", borderRadius: 5 }}
          onClick={() => {
            setIsListOpen(!isListOpen);
          }}
        >
          <div className="flex-grow text-[#816DFF] text-[14px] truncate max-w-[calc(100%-16px)]">
            {selectedItem === undefined
              ? `${josa(label, "을/를")} 선택해주세요`
              : items.find((item) => item.value === selectedItem)?.label}
          </div>
          <ChevronRightIcon className="w-[16px] h-[16px]" />
        </div>
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

      {isListOpen && (
        <SelectorList
          onClose={handleCloseList}
          items={items}
          selectedItem={selectedItem}
          onSelect={handleSelect}
          label={label}
          hasSearch={hasSearch}
        />
      )}
    </div>
  );
}

function SelectorItem<T>({
  item,
  selectedItem,
  onSelect,
}: {
  item: SelectorItem<T>;
  selectedItem: T | null | undefined;
  onSelect: (item: T | null) => void;
}) {
  return (
    <li
      className={`w-full p-[8px] cursor-pointer hover:bg-gray-50 text-[14px] ${
        selectedItem !== undefined && item.value === selectedItem
          ? "text-[#816DFF] font-semibold"
          : "text-[#bebebe]"
      }`}
      onClick={() => onSelect(item.value)}
    >
      {item.label}
    </li>
  );
}

function SelectorList<T>({
  items,
  selectedItem,
  onSelect,
  onClose,
  hasSearch = false,
  label,
  searchPlaceholder = `${label} 검색`,
}: {
  items: SelectorItem<T>[];
  selectedItem: T | null;
  onSelect: (item: T | null) => void;
  onClose: () => void;
  hasSearch?: boolean;
  label: string;
  searchPlaceholder?: string;
}) {
  const [searchText, setSearchText] = useState("");
  const listContainerRef = useRef<HTMLDivElement>(null);
  const filteredItems =
    searchText.trim() !== ""
      ? items.filter((item) =>
          item.label.toLowerCase().includes(searchText.toLowerCase())
        )
      : items;

  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        listContainerRef.current &&
        !listContainerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      className="absolute top-full left-0 w-full overflow-hidden z-10 px-[12px] mt-[8px]"
      style={{ maxHeight: 200 }}
      ref={listContainerRef}
    >
      <div className="border border-[#CDC5FF] rounded bg-white shadow-lg">
        {/* 검색 영역 */}
        {hasSearch && (
          <div
            className="bg-[#F4F2FF] sticky top-0"
            style={{ padding: "6px 12px" }}
          >
            <div
              className="bg-white flex flex-row items-center justify-between"
              style={{ padding: "4px 6px", gap: 4, borderRadius: 2.5 }}
            >
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="flex-grow outline-none text-sm"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <span className="text-gray-400 text-xs">🔍</span>
            </div>
          </div>
        )}

        {/* 클럽 목록 */}
        <ul
          className="flex flex-col overflow-y-auto list-none"
          style={{ maxHeight: 120, padding: "8px" }}
        >
          {filteredItems.length > 0
            ? filteredItems.map((item, idx) => (
                <SelectorItem
                  key={"selector-item-" + idx + "-" + item.label}
                  item={item}
                  selectedItem={selectedItem}
                  onSelect={onSelect}
                />
              ))
            : searchText && (
                <div
                  className="w-full text-gray-400 text-center"
                  style={{ padding: "16px", fontSize: 14 }}
                >
                  검색 결과가 없습니다
                </div>
              )}
        </ul>
      </div>
    </div>
  );
}
