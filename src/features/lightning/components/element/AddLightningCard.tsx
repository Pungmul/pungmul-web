import "@/app/globals.css";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";


export default function AddLightningCard() {
  return (
    <Link href="/lightning?create=true"
      className="w-full h-full rounded-lg items-center justify-center flex flex-col gap-1 bg-background border-[4px] border-grey-400 border-dashed cursor-pointer"
    >
      <div className="text-grey-400">번개 생성</div>
      <PlusIcon className="size-[28px] text-grey-400" />
    </Link>
  );
}
