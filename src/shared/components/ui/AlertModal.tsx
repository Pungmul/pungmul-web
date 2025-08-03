"use client";
import { Modal } from "@/shared/components/ui";
import { alertStore } from "@/store/share/alertStore";

export function AlertModal() {
  const { isOpen, data, close } = alertStore();

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      hasHeader={false}
      className="rounded-[16px] overflow-hidden"
      style={{
        padding: 0,
      }}
    >
      <div className="flex flex-col rounded-md overflow-hidden gap-[12px] px-[24px] py-[24px]">
        <div className="text-[20px] text-center font-semibold">{data.title}</div>
        <div className="text-[16px] text-center px-[2px]">{data.message}</div>
        {data.subMessage.trim() !== "" && (
          <div className="text-[14px] text-center px-[2px] text-[#CCCCCC]">
            {data.subMessage}
          </div>
        )}
      </div>
      {data.type === "confirm" ? (
        <div className="flex flex-row justify-center px-[12px] w-full border-t border-t-[#E5E5E5]">
          <button
            onClick={data.onCancel}
            className="text-[#CCCCCC] px-4 pt-[8px] pb-[12px] shrink-0 flex-grow border-r-[#E5E5E5] border-r-[0.5px]"
          >
            {data.cancelText}
          </button>
          <button
            onClick={data.onConfirm}
            className="text-black px-4 pt-[8px] pb-[12px] shrink-0 flex-grow border-l-[#E5E5E5] border-l-[0.5px]"
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
          className="flex justify-center w-full bg-white py-[12px] text-black border-t border-t-[#E5E5E5]"
        >
          {data.confirmText}
        </button>
      )}
    </Modal>
  );
}
