"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ImageModal } from "@/shared/components/ui";

interface ImageMessageProps {
  imageList: string[];
  sideContent?: string| React.ReactNode;
  isUser: boolean;
}

const ImageMessageComponent: React.FC<ImageMessageProps> = ({
  imageList,
  sideContent,
  isUser,
}: ImageMessageProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={{ margin: "0 24px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: isUser ? "row-reverse" : "row",
          alignItems: "flex-end",
          gap: 8,
        }}
      >
        <div className="flex flex-row flex-wrap columns-3 gap-2">
          {imageList.map((imageUrl, index) => (
            <Image
              key={imageUrl}
              src={imageUrl}
              alt="image"
              height={128}
              width={128}
              className="object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleImageClick(index)}
            />
          ))}
        </div>
        {sideContent && <>{sideContent}</>}
      </div>
      <ImageModal
        isOpen={isModalOpen}
        images={imageList}
        initialIndex={selectedImageIndex}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export const ImageMessage = React.memo(ImageMessageComponent);
