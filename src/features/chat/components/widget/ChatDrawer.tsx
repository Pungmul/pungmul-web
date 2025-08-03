"use client";

import React, { useCallback } from "react";
import { 
  AnimatePresence, 
  motion, 
  PanInfo, 
  useAnimate,
} from "framer-motion";

import Image from "next/image";
import { useGetMyPageInfo } from "@/features/my-page/api/api";
import { Header } from "@/shared/components";
import { User } from "@/features/member/types";

interface ChatDrawerProps {
  drawerOpen: boolean;
  onClose: () => void;
  onExitChat: () => void;
  userList: User[];
}

export const ChatDrawer = ({
  drawerOpen,
  onClose,
  onExitChat,
  userList,
}: ChatDrawerProps) => {
  const { data: myInfo } = useGetMyPageInfo();
  
  // useAnimate 훅으로 애니메이션 제어
  const [containerScope, animateContainer] = useAnimate<HTMLDivElement>();
  const [backdropScope, animateBackdrop] = useAnimate<HTMLDivElement>();

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.x > 80 || info.velocity.x > 500) {
        onClose();
      } else {
        // 임계점 도달 실패 시 명시적으로 완전히 열린 상태로 애니메이션
        animateContainer(containerScope.current, { x: 0 }, { duration: 0.3, ease: "easeOut" });
        animateBackdrop(backdropScope.current, { opacity: 1 }, { duration: 0.3, ease: "easeOut" });
      }
    },
    [onClose, animateContainer, animateBackdrop, containerScope, backdropScope]
  );

  return (
    <AnimatePresence mode="sync">
      {drawerOpen && (
        <motion.div
          key={"chat-drawer-backdrop"}
          ref={backdropScope}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute top-0 left-0 w-full h-dvh z-10"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        />
      )}
      {drawerOpen && (
        <motion.div
          ref={containerScope}
          key={"chat-drawer"}
          drag="x"
          dragListener={true}
          dragDirectionLock
          dragElastic={0}
          onDragEnd={handleDragEnd}
          dragConstraints={{ left: 0 }}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute top-0 right-0 w-full max-w-[360px] md:max-w-[420px] h-full bg-white flex flex-col z-50"
          style={{ touchAction: "none" }}
        >
          <div 
            style={{ touchAction: "none" }}
            className="w-full"
          >
            <Header title={"상세 정보"} onLeftClick={onClose} />
          </div>
          <div className="flex flex-col flex-grow">
            <div className="flex flex-col m-[12px] bg-gray-100 rounded-[12px] py-[12px]">
              <div className="text-[14px] font-medium px-[16px] py-[8px]">
                멤버
              </div>
              <div className="flex flex-row items-center gap-[12px] py-[8px] px-[16px] hover:bg-gray-200 cursor-pointer">
                <div className="size-[36px] bg-white rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#3b82f6"
                    className="size-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-sm font-medium text-blue-500">
                  초대하기
                </div>
              </div>
              {userList.map((user) => (
                <div
                  key={user.username}
                  className={
                    "flex flex-row items-center gap-[12px] py-[8px] px-[16px] hover:bg-gray-200 cursor-pointer"
                  }
                >
                  {user.profileImage?.fullFilePath ? (
                    <Image
                      src={user.profileImage.fullFilePath}
                      alt={user.username}
                      width={36}
                      height={36}
                      className="rounded-full object-cover overflow-hidden size-[36px]"
                    />
                  ) : (
                    <div className="size-[36px] bg-gray-300 rounded-full" />
                  )}
                  {myInfo?.username === user.username && (
                    <div className="text-[11px] font-medium text-white rounded-full bg-gray-500 size-[16px] flex items-center justify-center">
                      나
                    </div>
                  )}
                  <div className="text-md font-medium">{user.name}</div>
                </div>
              ))}
            </div>
            <div
              className="flex flex-col m-[12px] bg-gray-100 rounded-[12px] py-[4px] justify-center items-center cursor-pointer hover:bg-red-100"
              onClick={onExitChat}
            >
              <div className="text-sm text-center font-medium px-[16px] py-[8px] text-red-500">
                채팅방 나가기
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-end items-center gap-[16px] py-[8px] px-[16px]">
            <div className="cursor-pointer flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                fill="#9ca3af"
                className="size-[36px] p-[4px]"
              >
                <path
                  fillRule="evenodd"
                  d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 0 1-.517.608 7.45 7.45 0 0 0-.478.198.798.798 0 0 1-.796-.064l-.453-.324a1.875 1.875 0 0 0-2.416.2l-.243.243a1.875 1.875 0 0 0-.2 2.416l.324.453a.798.798 0 0 1 .064.796 7.448 7.448 0 0 0-.198.478.798.798 0 0 1-.608.517l-.55.092a1.875 1.875 0 0 0-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 0 1-.064.796l-.324.453a1.875 1.875 0 0 0 .2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 0 1 .796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 0 1 .517-.608 7.52 7.52 0 0 0 .478-.198.798.798 0 0 1 .796.064l.453.324a1.875 1.875 0 0 0 2.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 0 1-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 0 0 1.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 0 1-.608-.517 7.507 7.507 0 0 0-.198-.478.798.798 0 0 1 .064-.796l.324-.453a1.875 1.875 0 0 0-.2-2.416l-.243-.243a1.875 1.875 0 0 0-2.416-.2l-.453.324a.798.798 0 0 1-.796.064 7.462 7.462 0 0 0-.478-.198.798.798 0 0 1-.517-.608l-.091-.55a1.875 1.875 0 0 0-1.85-1.566h-.344ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(ChatDrawer);