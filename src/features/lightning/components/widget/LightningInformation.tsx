"use client";

import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { TimeGapPannel } from "../element/TimeGapPannel";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  useExitLightningMeeting,
  useDeleteLightningMeeting,
  lightningQueryKeys,
} from "../../queries";
import { WarningCircleIcon } from "@pThunder/shared/components/Icons";
import { UserParticipationData } from "../../types";
import { Toast } from "@pThunder/shared";
import { useQueryClient } from "@tanstack/react-query";

export const LightningInformation = ({
  userPartinLightning,
  waitingView,
  isFirst,
  setWaitingView,
}: {
  userPartinLightning: UserParticipationData | undefined;
  waitingView: boolean;
  isFirst: React.RefObject<boolean>;
  setWaitingView: (value: boolean) => void;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: leaveLightningMeeting } = useExitLightningMeeting();
  const { mutate: deleteLightningMeeting } = useDeleteLightningMeeting();

  const handleLeaveLightningMeeting = useCallback(() => {
    if (!userPartinLightning) return;
    leaveLightningMeeting(
      {
        lightningMeetingId: userPartinLightning.lightningMeeting!.id,
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: lightningQueryKeys.all
          });
          Toast.show({ message: "번개 탈퇴에 성공했습니다.", type: "success" });
        },
        onError: () => {
          Toast.show({ message: "번개 탈퇴에 실패했습니다.", type: "error" });
        },
      }
    );
  }, [userPartinLightning, leaveLightningMeeting]);

  const handleDeleteLightningMeeting = useCallback(() => {
    if (!userPartinLightning) return;
    deleteLightningMeeting({
      lightningMeetingId: userPartinLightning.lightningMeeting!.id,
    }, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: lightningQueryKeys.all
        });
        Toast.show({ message: "번개 삭제에 성공했습니다.", type: "success" });
      },
      onError: () => {
        Toast.show({ message: "번개 삭제에 실패했습니다.", type: "error" });
      },
    }
  );
}, [userPartinLightning, deleteLightningMeeting]);

  const handleMoveToChat = useCallback(() => {
    if (!userPartinLightning) return;
    router.push(`/chats/r/${userPartinLightning.chatRoomUUID}`);
  }, [userPartinLightning, router]);

  return (
    <AnimatePresence mode="wait">
      {userPartinLightning &&
        userPartinLightning?.participant &&
        userPartinLightning.lightningMeeting &&
        waitingView && (
          <motion.div
            initial={isFirst ? { y: 0 } : { y: "-100vh" }}
            animate={{ y: 0 }}
            exit={{ y: "-100vh" }}
            transition={{ duration: 0.2 }}
            onAnimationComplete={() => {
              isFirst.current = false;
            }}
            className="absolute w-full  h-[100dvh] lg:mb-0 z-20 bg-background flex flex-col items-center justify-center gap-[24px] lg:h-full"
          >
            <div className="flex flex-row items-center justify-center gap-[4px]">
              <div className="flex items-center justify-center">
                <WarningCircleIcon className="size-[24px] text-warning" />
              </div>
              <div className="text-[16px] text-grey-400 font-semibold">
                이미 참여 대기중인 번개가 있습니다
              </div>
            </div>
            {userPartinLightning.lightningMeeting.status === "SUCCESS" && (
              <div className="relative w-full max-w-[480px] flex flex-col items-center justify-center gap-[24px]">
                <h1 className="text-center text-[20px] font-semibold">
                  {userPartinLightning.lightningMeeting.meetingName}
                </h1>
                <div className="w-full flex flex-row items-center justify-between gap-[8px]">
                  <div className="text-center text-[16px] text-grey-400">
                    장소
                  </div>
                  <div className="text-center text-[16px] font-semibold">
                    {userPartinLightning.lightningMeeting.buildingName},{" "}
                    {userPartinLightning.lightningMeeting.locationDetail}
                  </div>
                </div>
                <div className="w-full flex flex-row items-center justify-between gap-[8px]">
                  <div className="text-center text-[16px] text-grey-400">
                    시작시간
                  </div>
                  <div className="text-center text-[16px] font-semibold">
                    {dayjs(
                      userPartinLightning.lightningMeeting.startTime
                    ).format("A h시 mm분")}
                  </div>
                </div>
                <div
                  className="w-[320px] h-[48px] bg-primary rounded-lg text-background text-center flex items-center justify-center cursor-pointer"
                  onClick={handleMoveToChat}
                >
                  채팅으로 이동하기
                </div>
              </div>
            )}
            {(userPartinLightning.lightningMeeting.status === "OPEN" ||
              userPartinLightning.lightningMeeting.status === "READY") && (
              <>
                <div className="flex flex-col items-center gap-[12px]">
                  <div className="text-[20px] font-semibold">남은 시간</div>
                  <TimeGapPannel
                    timeString={
                      userPartinLightning.lightningMeeting.recruitmentEndTime
                    }
                  />
                </div>
                <div className="flex flex-col gap-3 p-4">
                  <div className="flex gap-6 justify-between">
                    <p className="text-grey-400 text-base font-medium leading-normal">
                      참여자
                    </p>
                    <p className="text-grey-400 text-sm font-normal leading-normal">
                      {userPartinLightning.lightningMeeting
                        .lightningMeetingParticipantList.length + 1}
                      /{userPartinLightning.lightningMeeting.maxPersonNum}
                    </p>
                  </div>
                  <div className="rounded bg-grey-200 w-full h-[8px]">
                    <div
                      className="h-full rounded bg-grey-400"
                      style={{
                        width: `${
                          (userPartinLightning.lightningMeeting
                            .lightningMeetingParticipantList.length +
                            1 /
                              userPartinLightning.lightningMeeting
                                .maxPersonNum) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
                {userPartinLightning.isOrganizer ? (
                  <div
                    className="w-[320px] h-[48px] bg-primary rounded-lg text-background text-center flex items-center justify-center cursor-pointer"
                    onClick={handleDeleteLightningMeeting}
                  >
                    번개 삭제
                  </div>
                ) : (
                  <div
                    className="w-[320px] h-[48px] bg-primary rounded-lg text-background text-center flex items-center justify-center cursor-pointer"
                    onClick={handleLeaveLightningMeeting}
                  >
                    참여 취소
                  </div>
                )}

                <div
                  className="w-[320px] h-[48px] bg-primary rounded-lg text-background text-center flex items-center justify-center cursor-pointer"
                  onClick={() => setWaitingView(false)}
                >
                  다른 번개 둘러보기
                </div>
                <div className="w-[320px] h-[48px] rounded-lg text-grey-400 text-center flex items-center justify-center cursor-pointer">
                  공유하기
                </div>
              </>
            )}
          </motion.div>
        )}
    </AnimatePresence>
  );
};
