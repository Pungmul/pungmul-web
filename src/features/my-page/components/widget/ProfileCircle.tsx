import { Member } from "@pThunder/shared";

import Image from "next/image";

export default function ProfileCircle({myInfo}: {myInfo: Member}) {

  return (
    <div className="w-[36px] h-[36px] overflow-hidden rounded-full border-2 border-black relative">
      {myInfo?.profile.fullFilePath ? (
        <Image
          src={myInfo?.profile.fullFilePath || ""}
        fill={true}
        className="rounded-full object-cover object-center overflow-hidden"
        alt="profile"
      />
      ) : (
        <Image
          src={"/icons/MyPage-Icon.svg"}
          fill={true}
          className="rounded-full object-cover object-center overflow-hidden"
          alt="profile-default"
        />
      )}
    </div>
  );
}
