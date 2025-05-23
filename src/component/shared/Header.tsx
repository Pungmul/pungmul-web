"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

import CloseIcon from "@public/icons/closeicon.svg";
import { useView } from "@pThunder/lib/shared/useView";

export function Header({
  title,
  rightBtn,
  onLeftClick,
}: {
  title: string;
  rightBtn?: React.ReactNode;
  onLeftClick?: () => void;
}) {
  const { view } = useView();
  const router = useRouter();

  return (
    <div
      style={{ height: 50 }}
      className="w-full bg-white flex flex-col justify-center items-center sticky flex-shrink-0 top-0"
    >
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
        <Image src={CloseIcon} width={28} alt="" unoptimized={true} />
      </div>
      <div style={{ fontSize: 20 }} className="font-normal">
        {title}
      </div>
      {!!rightBtn && (
        <div className="absolute" style={{ right: 24 }}>
          {rightBtn}
        </div>
      )}
    </div>
  );
}
