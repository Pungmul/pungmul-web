"use client";
import { Header, Space } from "@pThunder/shared";
import {
  FindFriendSection,
  FriendBox,
  useLoadMyFriends,
} from "@pThunder/features/friends";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, PanInfo, useAnimate } from "framer-motion";
import { FriendReceivedBox } from "@pThunder/features/friends/components/element/FriendBox";
import { Suspense } from "react";
export default function FriendsPage() {
  const {
    data: { acceptedFriendList, pendingReceivedList, pendingSentList } = {
      acceptedFriendList: [],
      pendingReceivedList: [],
      pendingSentList: [],
    },
  } = useLoadMyFriends();
  return (
    <div className="bg-grey-100 h-full w-full">
      <div className="flex flex-col h-full w-full min-w-[360px] max-w-[768px] mx-auto relative bg-grey-100">
        <Header title="친구 관리" />
        <Space h={12} />
        <Link
          href={"/my-page/friends?findFriend=true"}
          className="text-grey-600 font-semibold text-base p-6 bg-background flex flex-row items-center justify-between"
        >
          <p className="text-grey-600 font-semibold text-base">친구 검색</p>
          <ChevronRightIcon className="w-4 h-4" />
        </Link>
        <main className="bg-background px-6 flex-grow flex flex-col">
          <Space h={12} />

          {pendingSentList?.length > 0 && (
            <>
              <details>
                <summary className="text-grey-600 font-semibold text-base cursor-pointer">
                  대기중인 요청{" "}
                  <span className="text-primary">
                    {pendingSentList?.length}
                  </span>
                </summary>
                <Space h={12} />
                {pendingSentList?.map((friend) => (
                  <FriendBox
                    key={friend.friendRequestId}
                    friend={friend.simpleUserDTO}
                  />
                ))}
              </details>
              <Space h={16} />
            </>
          )}
          {pendingReceivedList?.length > 0 && (
            <>
              <h3 className="text-grey-600 font-semibold text-base">
                친구 요청{" "}
                <span className="text-primary">
                  {pendingReceivedList?.length}
                </span>
              </h3>
              <Space h={12} />
              {pendingReceivedList?.map((friend) => (
                <FriendReceivedBox
                  key={friend.friendRequestId}
                  friend={friend.simpleUserDTO}
                  friendRequestId={friend.friendRequestId}
                />
              ))}
              <Space h={12} />
            </>
          )}

          <h3 className="text-grey-600 font-semibold text-base">친구 목록</h3>
          <Space h={12} />
          {acceptedFriendList?.map((friend) => (
            <FriendBox
              key={friend.friendRequestId}
              friend={friend.simpleUserDTO}
            />
          ))}
        </main>
      </div>
      <Suspense fallback={null}>
        <FindFriendOverlay />
      </Suspense>
    </div>
  );
}

function FindFriendOverlay() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isFindFriend = searchParams.get("findFriend") === "true";
  const [container, containerAnimate] = useAnimate<HTMLDivElement>();
  const [backdrop, backdropAnimate] = useAnimate<HTMLDivElement>();

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.y > 160 || info.velocity.y > 500) {
      router.back();
    } else {
      // 원위치로 돌아가기
      containerAnimate(
        container.current,
        { y: 0 },
        { duration: 0.3, ease: "easeOut" }
      );
      backdropAnimate(
        backdrop.current,
        { opacity: 1 },
        { duration: 0.3, ease: "easeOut" }
      );
    }
  };

  return (
    <AnimatePresence key="find-friend-overlay" mode="sync">
      {isFindFriend && (
        <motion.div
          key="find-friend-backdrop"
          ref={backdrop}
          onClick={() => router.back()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute top-0 left-0 w-full h-app z-10"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        />
      )}
      {isFindFriend && (
        <motion.div
          key="find-friend-container"
          ref={container}
          drag="y"
          dragDirectionLock
          dragConstraints={{ top: 0, bottom: 200 }}
          dragElastic={0.1}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          onDragEnd={handleDragEnd}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute top-0 left-0 w-dvw z-50 mt-[6vh] o"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="relative bg-background h-full pt-[8px] md:max-w-[960px] md:mx-auto z-50"
            style={{
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <div className="pt-[12px]">
              <FindFriendSection />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
