import React from "react";
import Image from "next/image";
import checkMark from "@public/icons/checkMark.svg";
import { postStore } from "@pThunder/store/post/postStore";

export default function PostFooter() {
  const { imageFiles, setImageFiles, anonymity, setAnonymity } = postStore();

  return (
    <div className="flex flex-row w-full items-center justify-between bottom-0 px-4 z-10 py-[12px]">
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
                <path
                  fillRule="evenodd"
                  d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>사진 첨부</div>
          </div>
        </label>
      </div>

      <label className="flex flex-row gap-2 items-center">
        <input
          type="checkbox"
          defaultChecked={anonymity}
          onChange={(e) => setAnonymity(e.currentTarget.checked)}
          name="anonymity"
          id="anonymity"
          className="hidden peer"
        />
        <div
          className="hidden w-5 h-5 peer-checked:flex rounded-sm items-center justify-center"
          style={{ backgroundColor: "#816DFF" }}
        >
          <Image src={checkMark} width={12} alt="" />
        </div>
        <div className="block w-5 h-5 bg-white border border-gray-300 peer-checked:hidden rounded-sm" />
        <div
          style={{ fontSize: 12 }}
          className="text-gray-400 peer-checked:text-black"
        >
          익명 작성
        </div>
      </label>
    </div>
  );
}

