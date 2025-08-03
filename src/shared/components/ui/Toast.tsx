"use client";
import { toastStore } from "@pThunder/store/share/toastStore";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { useView } from "@/shared/lib/useView";
import { useEffect, useState } from "react";

export default function Toast() {
  const { toast, visible } = toastStore();
  const view = useView();
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.getElementById("notification-container");
    setContainer(el);
  }, []);

  if (!container) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          initial={
            view === "desktop" ? { opacity: 0, x: 300 } : { opacity: 0, y: 300 }
          }
          animate={
            view === "desktop" ? { opacity: 1, x: 0 } : { opacity: 1, y: 0 }
          }
          exit={
            view === "desktop" ? { opacity: 0, x: 300 } : { opacity: 0, y: 300 }
          }
          transition={{ duration: 0.5 }}
          style={{
            maxWidth: "320px",
            minWidth: "280px",
          }}
        >
          <div className="bg-blue-500 rounded-lg shadow-lg border border-gray-200 p-4">
            <div className="font-semibold text-white text-sm text-left">
              {toast.message}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    container
  );
} 