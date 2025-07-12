import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { TimeGapPannel } from "./TimeGapPannel";
import { LightningMeeting } from "../../../model/lightning/type";

import { useRouter } from "next/navigation";
import {
  useExitLightningMeeting,
  useDeleteLightningMeeting,
} from "../../../api/lightning/api";

export const LightningInformation = ({
  userPartinLightning,
  // setUserPartinLightning,
  waitingView,
  isFirst,
  setWaitingView,
}: {
  userPartinLightning:
    | (LightningMeeting & {
        isOrganizer: boolean;
        participationStatus: boolean;
        chatRoomUUID: string | null;
      })
    | null;

  // setUserPartinLightning: (
  //   value:
  //     | (LightningMeeting & {
  //         isOrganizer: boolean;
  //         participationStatus: boolean;
  //         chatRoomUUID: string | null;
  //       })
  //     | null
  // ) => void;
  waitingView: boolean;
  isFirst: React.MutableRefObject<boolean>;
  setWaitingView: (value: boolean) => void;
}) => {
  const router = useRouter();

  const { mutate: leaveLightningMeeting } =
    useExitLightningMeeting();

  const { mutate: deleteLightningMeeting } =
    useDeleteLightningMeeting();

  return (
    <AnimatePresence mode="wait">
      {userPartinLightning &&
        userPartinLightning?.participationStatus &&
        waitingView && (
          <motion.div
            initial={isFirst ? { y: 0 } : { y: "-100vh" }}
            animate={{ y: 0 }}
            exit={{ y: "-100vh" }}
            transition={{ duration: 0.2 }}
            onAnimationComplete={() => {
              isFirst.current = false;
            }}
            className="absolute w-full  h-[100dvh] lg:mb-0 z-20 bg-white flex flex-col items-center justify-center gap-[24px] lg:h-full"
          >
            <div className="flex flex-row items-center justify-center gap-[4px]">
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  stroke="#AAA"
                  className="size-[24px]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                  />
                </svg>
              </div>
              <div className="text-[16px] text-[#AAA] font-semibold">
                이미 참여 대기중인 번개가 있습니다
              </div>
            </div>
            {userPartinLightning.status === "SUCCESS" && (
              <div className="relative w-full max-w-[480px] flex flex-col items-center justify-center gap-[24px]">
                <h1 className="text-center text-[20px] font-semibold">
                  {userPartinLightning.meetingName}
                </h1>
                <div className="w-full flex flex-row items-center justify-between gap-[8px]">
                  <div className="text-center text-[16px] text-[#AAA]">
                    장소
                  </div>
                  <div className="text-center text-[16px] font-semibold">
                    {userPartinLightning.buildingName},{" "}
                    {userPartinLightning.locationDetail}
                  </div>
                </div>
                <div className="w-full flex flex-row items-center justify-between gap-[8px]">
                  <div className="text-center text-[16px] text-[#AAA]">
                    시작시간
                  </div>
                  <div className="text-center text-[16px] font-semibold">
                    {dayjs(userPartinLightning.startTime).format("A h시 mm분")}
                  </div>
                </div>
                <div
                  className="w-[320px] h-[48px] bg-[#5B2B99] rounded-lg text-white text-center flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    router.push(`/chats/r/${userPartinLightning.chatRoomUUID}`);
                  }}
                >
                  채팅으로 이동하기
                </div>
              </div>
            )}
            {(userPartinLightning.status === "OPEN" ||
              userPartinLightning.status === "READY") && (
              <>
                <div className="flex flex-col items-center gap-[12px]">
                  <div className="text-[20px] font-semibold">남은 시간</div>
                  <TimeGapPannel
                    timeString={userPartinLightning.recruitmentEndTime}
                  />
                </div>
                <div className="flex flex-col gap-3 p-4">
                  <div className="flex gap-6 justify-between">
                    <p className="text-[#475c72] text-base font-medium leading-normal">
                      참여자
                    </p>
                    <p className="text-[#121416] text-sm font-normal leading-normal">
                      {userPartinLightning.lightningMeetingParticipantList
                        .length + 1}
                      /{userPartinLightning.maxPersonNum}
                    </p>
                  </div>
                  <div className="rounded bg-[#dde1e3] w-full h-[8px]">
                    <div
                      className="h-full rounded bg-[#121416]"
                      style={{
                        width: `${
                          (userPartinLightning.lightningMeetingParticipantList
                            .length +
                            1 / userPartinLightning.maxPersonNum) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
                {userPartinLightning.isOrganizer ? (
                  <div
                    className="w-[320px] h-[48px] bg-[#5B2B99] rounded-lg text-white text-center flex items-center justify-center cursor-pointer"
                    onClick={() => {
                      deleteLightningMeeting({
                        lightningMeetingId: userPartinLightning.id,
                      });
                    }}
                  >
                    번개 삭제
                  </div>
                ) : (
                  <div
                    className="w-[320px] h-[48px] bg-[#5B2B99] rounded-lg text-white text-center flex items-center justify-center cursor-pointer"
                    onClick={() => {
                      leaveLightningMeeting({
                        lightningMeetingId: userPartinLightning.id,
                      });
                    }}
                  >
                    참여 취소
                  </div>
                )}

                <div
                  className="w-[320px] h-[48px] bg-[#5B2B99] rounded-lg text-white text-center flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    setWaitingView(false);
                  }}
                >
                  다른 번개 둘러보기
                </div>
                <div className="w-[320px] h-[48px] rounded-lg text-[#aaa] text-center flex items-center justify-center cursor-pointer">
                  공유하기
                </div>
              </>
            )}
          </motion.div>
        )}
    </AnimatePresence>
  );
};
