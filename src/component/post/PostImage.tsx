"use client"

import Image from "next/image";
import { useState } from "react";

interface ImageObject {
    id: number;                          // 파일의 고유 ID
    originalFilename: string;            // 원본 파일명
    convertedFileName: string;           // 변환된 파일명 (S3 저장 경로 포함)
    fullFilePath: string;                // 전체 파일 경로 (S3 URL)
    fileType: string;                    // 파일 타입 (예: image/jpeg)
    fileSize: number;                    // 파일 크기 (바이트 단위)
    createdAt: string;                   // 파일이 생성된 시간 (ISO 형식)
}

export default function PostImage({ imageData }: { imageData: ImageObject }) {

    const [isLoading, setLoading] = useState(true);
    const imageUrl = imageData?.fullFilePath ? imageData.fullFilePath : "/default-image.png";

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
                alt={imageData.convertedFileName}
                layout="fill"
                quality={75}
                style={{ objectFit: "cover" }}
                onLoadingComplete={() => setLoading(false)}
            />
        </div>
    );
}





