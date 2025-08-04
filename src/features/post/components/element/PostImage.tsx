"use client"

import Image from "next/image";
import { useState } from "react";
import { ImageObject } from "@/shared/types/image/type";

export default function PostImage({ imageData }: { imageData: ImageObject }) {

    const [isLoading, setLoading] = useState(true);
    const imageUrl = imageData?.fullFilePath ? imageData.fullFilePath.split("?")[0]! : "/default-image.png";

    return (
        <div className="relative w-[100px] h-[100px] rounded overflow-hidden">
            {/* 로딩 스켈레톤 */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-300 animate-pulse w-full h-full" />
            )}

            {/* 실제 이미지 */}
            <Image
                key={imageData.id}
                src={imageUrl}
                fill
                alt={imageData.convertedFileName}
                quality={75}
                style={{ objectFit: "cover" }}
                onLoadingComplete={() => setLoading(false)}
            />
        </div>
    );
}





