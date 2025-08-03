import React from "react";
import Image from "next/image";
import { postStore } from "@pThunder/store/post/postStore";

export default function ImageListPreview() {
  const { imageFiles, setImageFiles } = postStore();

  if (imageFiles.length == 0) return null;
  return (
    <div
      className="flex flex-row gap-2 overflow-x-auto items-center"
      style={{ height: 160 }}
    >
      {imageFiles.map((file, index) => {
        const imageUrl = file.id === -1 ?  URL.createObjectURL(file.blob): file.url!;

        return (
          <div
            key={"첨부 이미지" + index}
            className="relative overflow-visible"
          >
            <Image
              src={imageUrl}
              alt="이미지"
              width={120}
              height={120}
              style={{
                objectFit: "cover",
                width: 120,
                height: 120,
              }}
            ></Image>
            <div
              className="absolute cursor-pointer -top-2 -right-2 w-6 h-6 bg-black rounded-full text-white items-center justify-center flex"
              onClick={() => {
                setImageFiles(imageFiles.filter((_, i) => index !== i));
              }}
            >
              x
            </div>
          </div>
        );
      })}
    </div>
  );
} 