import React from "react";
import { postStore } from "../../store";
import { CameraIcon } from "@heroicons/react/24/solid";
import { CheckIcon } from "@heroicons/react/24/outline";

export default function PostFooter() {
  const { imageFiles, setImageFiles, anonymity, setAnonymity } = postStore();

  return (
    <div className="sticky bg-background bottom-0 left-0 right-0 flex flex-row w-full items-center justify-between px-4 z-10 py-[12px] flex-shrink-0">
      <div className="flex">
        <input
          type="file"
          id="images"
          name="images"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files !== null && e.target.files.length > 0) {
              const newFile = { id: -1, blob: e.target.files![0] as Blob };
              setImageFiles([...imageFiles, newFile]);
            }
          }}
        />
        <label htmlFor="images">
          <div className="cursor-pointer px-[8px] py-[4px] rounded-full border-[#DDDDDD] border-[1px] flex flex-row gap-2 items-center justify-center">
            <div>
              <CameraIcon className="size-6 text-grey-400" />
            </div>
            <div>사진 첨부</div>
          </div>
        </label>
      </div>

      <label className="flex flex-row gap-[4px] items-center cursor-pointer">
        <input
          type="checkbox"
          defaultChecked={anonymity}
          onChange={(e) => setAnonymity(e.currentTarget.checked)}
          name="anonymity"
          id="anonymity"
          className="hidden peer"
        />
        <div
          className="hidden size-[24px] peer-checked:flex rounded-sm items-center justify-center bg-primary"
        >
          <CheckIcon className="size-4 text-white stroke-[4]" />
        </div>
        <div className="size-[24px] bg-background border border-grey-400 peer-checked:hidden rounded-sm" />
        <div
          className="text-grey-400 peer-checked:text-grey-800 text-[14px]"
        >
          익명 작성
        </div>
      </label>
    </div>
  );
}

