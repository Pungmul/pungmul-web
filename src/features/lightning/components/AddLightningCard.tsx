"use client";

import "@/app/globals.css";
import { useRouter } from "next/navigation";

export default function AddLightningCard() {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push("/lightning?create=true")}
      className="w-full h-full rounded-lg items-center justify-center flex flex-col gap-1"
      style={{
        borderColor: "#DDDDDD",
        borderWidth: 4,
        borderStyle: "dashed",
        cursor: "pointer",
      }}
    >
      <div style={{ color: "#DDDDDD" }}>번개 생성하기</div>
      <div style={{ color: "#DDDDDD", fontSize: "28px" }}>+</div>
    </div>
  );
}
