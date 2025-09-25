"use client";
import { Modal } from "@/shared/components/ui";
import { alertStore } from "@/shared/store";

export function AlertModal() {
  const isOpen = alertStore((state) => state.isOpen);
  const data = alertStore((state) => state.data);
  const closeAlert = alertStore().close;

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeAlert}
      hasHeader={false}
      className="rounded-[16px] overflow-hidden"
      style={{
        padding: 0,
        margin: "0 24px",
      }}
    >
      <div className="flex flex-col rounded-md overflow-hidden gap-[12px] px-[24px] py-[24px]">
        <div className="text-[20px] text-center font-semibold">{data.title}</div>
        <div className="text-[16px] text-center px-[2px]">{data.message}</div>
        {data.subMessage.trim() !== "" && (
          <div className="text-[14px] text-center px-[2px] text-grey-400">
            {data.subMessage}
          </div>
        )}
      </div>
      {data.type === "confirm" ? (
        <div className="flex flex-row justify-center w-full border-t border-t-grey-300">
          <button
            onClick={data.onCancel}
            className="text-grey-600 px-4 pt-[8px] pb-[12px] shrink-0 flex-grow border-r-grey-300 border-r-[0.5px]"
          >
            {data.cancelText}
          </button>
          <button
            onClick={data.onConfirm}
            className="text-grey-800 px-4 pt-[8px] pb-[12px] shrink-0 flex-grow border-l-grey-300 border-l-[0.5px]"
            style={{
              color: data.confirmColor,
            }}
          >
            {data.confirmText}
          </button> 
        </div>
      ) : (
        <button
          onClick={data.onConfirm}
          className="flex justify-center w-full bg-background py-[12px] text-grey-800 border-t border-t-grey-300"
        >
          {data.confirmText}
        </button>
      )}
    </Modal>
  );
}
