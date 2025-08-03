"use client";

import { useRouter } from "next/navigation";

import { useView } from "@/shared/lib/useView";
import { XMarkIcon } from "@heroicons/react/24/outline";

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

  return (
    <nav
      className={`w-full bg-white flex h-[50px] flex-col justify-center items-center sticky flex-shrink-0 top-0 ${className}`}
    >
      {isBackBtn && (
        <div
          className="absolute self-center flex items-center justify-center"
          style={{ left: 20, width: 32, height: 32, cursor: "pointer" }}
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
      )}
      <div style={{ fontSize: 20 }} className="font-normal">
        {title}
      </div>
      {!!rightBtn && (
        <div className="absolute" style={{ right: 24 }}>
          {rightBtn}
        </div>
      )}
    </nav>
  );
}
