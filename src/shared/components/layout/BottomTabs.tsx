"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useView } from "@/shared/lib/useView";
import { useEffect, useRef, useState } from "react";

import HomeIconOutline from "@public/icons/Home-icon-outline.svg";
import HomeIconFilled from "@public/icons/Home-icon-filled.svg";
import ThunderIconOutline from "@public/icons/Thunder-Icon-outline.svg";
import ThunderIconFilled from "@public/icons/Thunder-Icon-filled.svg";
import BoardIconOutline from "@public/icons/Board-icon-outline.svg";
import BoardIconFilled from "@public/icons/Board-icon-filled.svg";
import ChatIconOutline from "@public/icons/Chat-icon-outline.svg";
import ChatIconFilled from "@public/icons/Chat-icon-filled.svg";
import { AnimatePresence, motion } from "framer-motion";
import { Spinner } from "@pThunder/shared";
import { Suspense } from "react";
import { Header } from "@/shared/components/layout/Header";
import NotificationList from "@pThunder/features/notification/components/NotificationList";
import ProfileCircle from "@pThunder/features/my-page/component/ProfileCircle";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function BottomTabs() {
  const view = useView();

  const tabsRef = useRef<HTMLDivElement>(null);
  const notificationOverlayRef = useRef<HTMLDivElement>(null);

  const [tabsWidth, setTabsWidth] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  useEffect(() => {
    const element = tabsRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // border, padding을 포함한 전체 너비를 가져오기 위해 offsetWidth 사용
        setTabsWidth(entry.target.clientWidth);
      }
    });

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        tabsRef.current &&
        !notificationOverlayRef.current?.contains(event.target as Node) &&
        isNotificationOpen
      ) {
        setIsNotificationOpen(false);
      }
    };

    resizeObserver.observe(element);
    document.addEventListener("click", handleOutsideClick);

    return () => {
      resizeObserver.disconnect();
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isNotificationOpen]);

  useEffect(() => {
    const issueToken = async (tokens: {
      accessToken: string;
      refreshToken: string;
    }) => {
      try {
        const res = await fetch("/cookie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tokens),
        });

        if (res.ok) {
          console.log("✅ 쿠키 설정 완료");
          if (typeof window === "undefined" || !window?.ReactNativeWebView) {
            return;
          }
          window?.ReactNativeWebView.postMessage(
            JSON.stringify("Cookie issued")
          );
        } else throw Error("Failed to issue cookies");
      } catch {
        console.log("⛔ 쿠키 설정 실패");
        if (typeof window === "undefined" || !window?.ReactNativeWebView) {
          return;
        }
        window?.ReactNativeWebView.postMessage(
          JSON.stringify("Cookie didn't issue")
        );
      }
    };

    const handleMessage = (event: MessageEvent) => {
      const isReactNativeWebView = () => {
        if (typeof window !== "undefined") {
          return /React-Native/i.test(window.navigator.userAgent);
        }
        return false;
      };

      const isWebView = isReactNativeWebView();

      if (isWebView) {
        const { accessToken, refreshToken } = JSON.parse(event.data);
        if (!accessToken || !refreshToken) return;

        issueToken({ accessToken, refreshToken });
      }
    };

    document.addEventListener("message", handleMessage as EventListener);
    window.addEventListener("message", handleMessage);

    return () => {
      document.addEventListener("message", handleMessage as EventListener);
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const pathname = usePathname(); // 현재 경로 가져오기

  if (view === "webview") {
    // webview에서의 동작
    return null;
  }

  if (
    view === "mobile" &&
    pathname !== "/home" &&
    pathname !== "/board/main" &&
    pathname !== "/chats/r/inbox" &&
    pathname != "/lightning" &&
    pathname != "/my-page"
  )
    return null;

  // const webviewAction = ()=>{
  //     window.ReactNativeWebView
  // }
  return (
    <>
      <nav
        className="w-full h-[84px] justify-between bg-white flex-shrink-0 flex flex-row bottom-0 border-t items-center sticky z-30 
        md:border-r md:border-t-0 md:flex-col md:w-auto md:h-dvh md:justify-start md:gap-[24px] md:top-0"
        style={{ padding: "12px 32px 24px 32px" }}
        ref={tabsRef}
      >
        {/* home page button */}
        <Link
          href={"/home"}
          className="h-12 justify-center items-center cursor-pointer flex gap-[24px] flex-row"
          prefetch
        >
          {pathname.startsWith("/home") ? (
            <Image src={HomeIconFilled} width={36} alt="" />
          ) : (
            <Image src={HomeIconOutline} width={36} alt="" />
          )}
          <div className="hidden 2xl:block w-[100px] text-[16px] self-end pb-[8px] font-semibold text-black">
            홈
          </div>
        </Link>
        {/* newsfeed page button  */}
        {/* <div className="w-12 h-12 justify-center items-center cursor-pointer flex" onClick={() => router.push('/newsfeed')}>
                {pathname == '/newsfeed' ? <Image src={NewsFeedIconFilled} width={36} alt="" /> : <Image src={NewsFeedIconOutline} width={36} alt="" />}
            </div> */}
        {/* lightning page button */}
        <Link
          href={"/lightning"}
          className="h-12 justify-center items-center cursor-pointer flex gap-[24px] flex-row"
        >
          {pathname.startsWith("/lightning") ? (
            <Image src={ThunderIconFilled} width={36} alt="" />
          ) : (
            <Image src={ThunderIconOutline} width={36} alt="" />
          )}
          <div className="hidden 2xl:block w-[100px] text-[16px] self-end pb-[8px] font-semibold text-black">
            번개
          </div>
        </Link>
        {/* board page button */}
        <Link
          href={"/board/main"}
          className="h-12 justify-center items-center cursor-pointer flex gap-[24px] flex-row"
          prefetch
        >
          {pathname.startsWith("/board") ? (
            <Image src={BoardIconFilled} width={36} alt="" />
          ) : (
            <Image src={BoardIconOutline} width={36} alt="" />
          )}
          <div className="hidden 2xl:block w-[100px] text-[16px] self-end pb-[8px] font-semibold text-black">
            게시판
          </div>
        </Link>
        {/* chat page button */}
        <Link
          href={"/chats"}
          className="h-12 justify-center items-center cursor-pointer flex gap-[24px] flex-row"
          prefetch
        >
          {pathname.startsWith("/chats") ? (
            <Image src={ChatIconFilled} width={36} alt="" />
          ) : (
            <Image src={ChatIconOutline} width={36} alt="" />
          )}
          <div className="hidden 2xl:block w-[100px] text-[16px] self-end pb-[8px] font-semibold text-black">
            채팅
          </div>
        </Link>
        <div
          className="hidden md:flex h-12 justify-center items-center cursor-pointer gap-[24px] flex-row"
          onClick={() => setIsNotificationOpen(true)}
        >
          {/* notification button */}
          <Image
            src={"/icons/Notification-Icon.svg"}
            width={36}
            height={36}
            alt=""
            className="cursor-pointer"
          />
          <div className="hidden 2xl:block w-[100px] text-[16px] self-end pb-[8px] font-semibold text-black">
            알림
          </div>
        </div>
        <Link
          href={"/my-page"}
          className="h-12 justify-center items-center cursor-pointer flex gap-[24px] flex-row"
          prefetch
        >
          <Suspense
            fallback={
              <Image
                src={"/icons/MyPage-Icon.svg"}
                width={36}
                height={36}
                alt=""
                className="rounded-full object-cover object-center overflow-hidden"
              />
            }
          >
            <ProfileCircle />
          </Suspense>
          <div className="hidden 2xl:block w-[100px] text-[16px] self-end pb-[8px] font-semibold text-black">
            프로필
          </div>
        </Link>
      </nav>
      <AnimatePresence mode="wait">
        {isNotificationOpen && (
          <motion.div
            key="notification-overlay"
            ref={notificationOverlayRef}
            initial={{ x: -360 + tabsWidth }}
            animate={{ x: tabsWidth }}
            exit={{ x: -360 + tabsWidth }}
            transition={{ duration: 0.5 }}
            className="md:flex hidden absolute bottom-0 left-0 w-[360px] h-full flex-shrink-0  flex-col items-center justify-between bg-white border backdrop-blur-sm z-20"
          >
            <Header
              title="알림"
              isBackBtn={false}
              rightBtn={
                <div
                  className="w-[36px] h-[36px] flex items-center justify-center cursor-pointer"
                  onClick={() => setIsNotificationOpen(false)}
                >
                  <XMarkIcon className="w-[24px] h-[24px]" />
                </div>
              }
            />
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-full">
                  <Spinner size={32} />
                </div>
              }
            >
              <NotificationList />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
