"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";

import { useView } from "@/shared/lib/useView";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { throttle } from "lodash";

export function Header({
  title,
  rightBtn,
  onLeftClick,
  isBackBtn = true,
  className = "",
}: {
  title: string;
  rightBtn?: React.ReactNode;
  onLeftClick?: () => void;
  isBackBtn?: boolean;
  className?: string;
}) {
  const view = useView();
  const router = useRouter();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = throttle(
      () => {
        const scrollTop = window.scrollY;
        setIsSticky(scrollTop > 0);
      },
      100,
      { leading: true, trailing: true }
    );

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const leftButton = useMemo(
    () => (
      <div
        className="absolute self-center flex items-center justify-center z-10 size-[32px] cursor-pointer left-[20px]"
        onClick={() => {
          if (onLeftClick) {
            onLeftClick();
          } else {
            if (view === "webview") {
              window.ReactNativeWebView?.postMessage(
                JSON.stringify({ action: "pop" })
              );
            } else router.back();
          }
        }}
      >
        <XMarkIcon className="w-[28px] h-[28px]" />
      </div>
    ),
    [onLeftClick]
  );

  return (
    <nav
      className={`w-full bg-background flex h-[50px] flex-col z-10 justify-center items-center sticky flex-shrink-0 top-0 ${className}`}
    >
      <div
        className={
          "left-0 top-0 w-full h-[64px] z-0 bg-gradient-to-b from-background via-background via-80% to-transparent " +
          (isSticky ? "absolute" : "hidden")
        }
      />
      {isBackBtn && leftButton}
      <div className="font-normal z-10 text-grey-800 text-[20px]">{title}</div>
      {!!rightBtn && (
        <div className="absolute" style={{ right: 24 }}>
          {rightBtn}
        </div>
      )}
    </nav>
  );
}
