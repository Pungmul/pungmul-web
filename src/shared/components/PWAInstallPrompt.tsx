"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { PlusIcon, ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";

import { useView } from "@/shared/lib/useView";
import { Button } from "./buttons";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches;
}

function detectIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(
      typeof window !== "undefined" &&
      (window as Window & { MSStream?: unknown }).MSStream
    )
  );
}

export default function PWAInstallPrompt() {
  const view = useView();
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setOpen(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ios = detectIOS();
    setIsIOS(ios);
    if (ios && !isStandalone()) setOpen(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(display-mode: standalone)");
    const handleDisplayModeChange = () => {
      if (isStandalone()) setOpen(false);
    };
    if (isStandalone()) setOpen(false);
    mql.addEventListener("change", handleDisplayModeChange);
    return () => {
      mql.removeEventListener("change", handleDisplayModeChange);
    };
  }, []);

  const handleInstallClick = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setOpen(false);
  }, [deferredPrompt]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setDeferredPrompt(null);
  }, []);

  if (isStandalone()) return null;
  if (view !== "mobile") return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-x-0 top-4 md:left-[100px] lg:left-[224px] z-50 flex justify-center px-4"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          drag="y"
          dragConstraints={{ top: -100, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.y < -40 || info.velocity.y < -400) handleClose();
          }}
        >
          <motion.div
            layout
            className="px-4 py-4 bg-grey-800 bg-opacity-75 rounded-lg shadow-lg flex flex-row justify-between items-center gap-4"
          >
            <div className="flex flex-col gap-0.5 text-background text-sm md:text-base">
              <span className="font-medium">앱 설치</span>
              {isIOS ? (
                <span className="text-background/80 text-xs md:text-sm inline-flex flex-wrap items-center gap-0.5">
                  공유 버튼
                  <ArrowUpOnSquareIcon
                    className="size-4 shrink-0 inline-block text-background/80"
                    aria-hidden={true}
                  />
                  을 탭한 후{" "}
                  <span className="font-bold">{"홈 화면에 추가"}</span>
                  <div className="size-4 shrink-0 inline-flex text-background/80 border border-background/80 rounded-sm items-center justify-center">
                    <PlusIcon
                      className="size-3 shrink-0 inline-block text-background/80"
                      aria-hidden={true}
                    />
                  </div>
                  를 선택하세요
                </span>
              ) : (
                <span className="text-background/80 text-xs md:text-sm">
                  홈 화면에 추가하여 빠르게 접속하세요
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg px-3 py-2 text-sm text-grey-300"
              >
                닫기
              </button>
              {!isIOS && (
                <Button
                  onClick={handleInstallClick}
                  className="w-auto px-2 py-2 text-xs md:text-sm shrink-0"
                >
                  설치
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
