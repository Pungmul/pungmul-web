"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function MyPageIcon() {
  const router = useRouter();

  return (
    <Image
      src={"/icons/MyPage-Icon.svg"}
      height={36}
      width={36}
      alt=""
      className="cursor-pointer"
      onClick={() => router.push("/my-page")}
    />
  );
} 