"use client";
import { useCallback, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/shared/components";

import { registerFCMToken } from "../../api";
import { requestFCMToken } from "../../services";
import { useNotificationPermission } from "../../hooks";

export default function NotificationPermissionRequestCTA() {
  const [open, setOpen] = useState(true);
  const permission = useNotificationPermission();

  const handleEnableNotification = useCallback(async () => {
    const deviceInfo = navigator.userAgent;

    const token = await requestFCMToken();
    if (!token) return;

    await registerFCMToken(token, deviceInfo);
    console.log("FCM 알림 활성화 완료");
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  if (permission === "granted") return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-x-0 bottom-20 md:bottom-4 md:left-[100px] lg:left-[224px] z-50 flex justify-center px-4"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 100 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.y > 40 || info.velocity.y > 400) {
              handleClose();
            }
          }}
        >
          <motion.div
            layout
            className="px-4 py-4 bg-black bg-opacity-75 rounded-lg shadow-lg flex flex-row justify-between items-center gap-4"
          >
            <div className="text-white text-sm md:text-base font-medium">
              원활한 사용을 위해 알림을 받으시겠어요?
            </div>
            <Button
              onClick={handleEnableNotification}
              className="w-auto px-2 py-2 text-xs md:text-sm"
            >
              알림 받기
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
