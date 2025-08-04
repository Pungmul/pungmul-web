"use client";
import { useRouter } from "next/navigation";
import React,{ createContext, useContext, useState, useEffect } from "react";
import { CreateLightningMeetingRequest } from "../../model/index";
import dayjs from "dayjs";
import { participatingLightningStore } from "../../store/participatingLightning";
  
type LightningCreateContextType = {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  minPersonnel: number;
  setMinPersonnel: React.Dispatch<React.SetStateAction<number>>;
  maxPersonnel: number;
  setMaxPersonnel: React.Dispatch<React.SetStateAction<number>>;
  lightningType: "일반 모임" | "풍물 모임";
  setLightningType: React.Dispatch<
    React.SetStateAction<"일반 모임" | "풍물 모임">
  >;
  recruitmentPeriod: number;
  setRecruitmentPeriod: React.Dispatch<React.SetStateAction<number>>;
  address: string | null;
  setAddress: React.Dispatch<React.SetStateAction<string | null>>;
  detailAddress: string | null;
  setDetailAddress: React.Dispatch<React.SetStateAction<string | null>>;
  locationPoint: { lat: number; lng: number } | null;
  setLocationPoint: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number } | null>
  >;
  target: "우리 학교만" | "전체";
  setTarget: React.Dispatch<React.SetStateAction<"우리 학교만" | "전체">>;
  isAddressModalOpen: boolean;
  setIsAddressModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDetailAddressModalOpen: boolean;
  setIsDetailAddressModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tagList: string[];
  setTagList: React.Dispatch<React.SetStateAction<string[]>>;
  startTime: string;
  setStartTime: React.Dispatch<React.SetStateAction<string>>;
  endTime: string;
  setEndTime: React.Dispatch<React.SetStateAction<string>>;
  minStartTime: string;
  minEndTime: string;
  maxStartTime: string;
  // instrumentAssignRequestDTOList: InstrumentAssignRequestDTOList;
  // setInstrumentAssignRequestDTOList: React.Dispatch<
  //   React.SetStateAction<InstrumentAssignRequestDTOList>
  // >;

  createLightning: () => void;
};

const LightningCreateContext = createContext<
  LightningCreateContextType | null
>(null);

export const LightningCreateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isClient, setIsClient] = useState(false);
  const { setParticipatingLightning } = participatingLightningStore();
  const [title, setTitle] = useState("");
  const [minPersonnel, setMinPersonnel] = useState(4);
  const [maxPersonnel, setMaxPersonnel] = useState(5);
  const [target, setTarget] = useState<"우리 학교만" | "전체">("전체");
  const [lightningType, setLightningType] = useState<"일반 모임" | "풍물 모임">(
    "일반 모임"
  );
  const [recruitmentPeriod, setRecruitmentPeriod] = useState(5);
  const [address, setAddress] = useState<string | null>(null);
  const [detailAddress, setDetailAddress] = useState<string | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [locationPoint, setLocationPoint] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isDetailAddressModalOpen, setIsDetailAddressModalOpen] =
    useState(false);
  const [tagList, setTagList] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  // const [instrumentAssignRequestDTOList, setInstrumentAssignRequestDTOList] =
  //   useState<InstrumentAssignRequestDTOList>([
  //     {
  //       instrument: "KKWAENGGWARI",
  //       minPersonNum: 1,
  //       maxPersonNum: 2,
  //     },
  //     {
  //       instrument: "JING",
  //       minPersonNum: 1,
  //       maxPersonNum: 2,
  //     },
  //     {
  //       instrument: "JANGGU",
  //       minPersonNum: 1,
  //       maxPersonNum: 2,
  //     },
  //     {
  //       instrument: "BUK",
  //       minPersonNum: 1,
  //       maxPersonNum: 2,
  //     },
  //     {
  //       instrument: "SOGO",
  //       minPersonNum: 1,
  //       maxPersonNum: 2,
  //     },
  //     {
  //       instrument: "TAEPYUNGSO",
  //       minPersonNum: 1,
  //       maxPersonNum: 2,
  //     },
  //   ]);

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getNowTimeString = (): string => {
    return dayjs().add(1, "minute").format("HH:mm"); // 현재 시간보다 1분 후부터 허용
  };

  const addMinutes = (timeStr: string, minutes: number): string => {
    const time = dayjs().format("YYYY-MM-DD") + "T" + timeStr;
    return dayjs(time).add(minutes, "minute").format("HH:mm");
  };

  const subMinutes = (timeStr: string, minutes: number): string => {
    const time = dayjs().format("YYYY-MM-DD") + "T" + timeStr;
    return dayjs(time).subtract(minutes, "minute").format("HH:mm");
  };

  const createLightning = () => {
    const createLightningRequest = async () => {
      try {
        const today = dayjs().format("YYYY-MM-DD");

        const recruitmentEndTime = addMinutes(
          getNowTimeString(),
          recruitmentPeriod
        );

        const requestBody: CreateLightningMeetingRequest =
          lightningType === "일반 모임"
            ? {
                meetingName: title,
                startTime: dayjs(today + "T" + startTime).format(
                  "YYYY-MM-DDTHH:mm:ss"
                ),
                endTime: dayjs(today + "T" + endTime).format(
                  "YYYY-MM-DDTHH:mm:ss"
                ),
                recruitmentEndTime: dayjs(
                  today + "T" + recruitmentEndTime
                ).format("YYYY-MM-DDTHH:mm:ss"),
                minPersonNum: minPersonnel,
                maxPersonNum: maxPersonnel,
                meetingType: "FREE",
                latitude: Number(locationPoint!.lat),
                longitude: Number(locationPoint!.lng),
                buildingName: address || "",
                locationDetail: detailAddress || "",
                visibilityScope: target === "전체" ? "ALL" : "SCHOOL_ONLY",
                tags: tagList,
              }
            : {
                meetingName: title,
                startTime: dayjs(today + "T" + startTime).format(
                  "YYYY-MM-DDTHH:mm:ss"
                ),
                endTime: dayjs(today + "T" + endTime).format(
                  "YYYY-MM-DDTHH:mm:ss"
                ),
                recruitmentEndTime: dayjs(
                  today + "T" + recruitmentEndTime
                ).format("YYYY-MM-DDTHH:mm:ss"),
                minPersonNum: minPersonnel,
                maxPersonNum: maxPersonnel,
                meetingType: "PAN",
                latitude: Number(locationPoint!.lat),
                longitude: Number(locationPoint!.lng),
                buildingName: address || "",
                locationDetail: detailAddress || "",
                visibilityScope: target === "전체" ? "ALL" : "SCHOOL_ONLY",
                tags: tagList,
                // instrumentAssignRequestDTOList: instrumentAssignRequestDTOList,
              };

        console.log("Request body:", requestBody);
        const response = await fetch(`/lightning/create/api`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        console.log("Response:", response);
        if (!response.ok) {
          throw new Error("Failed to create lightning");
        }
        alert("모임 생성에 성공했습니다.");

        const participatingLightning = await response.json();
        setParticipatingLightning(participatingLightning);

        router.replace("/lightning");
        console.log("모임 생성 성공", response);
      } catch (error) {
        console.error("Error creating lightning:", error);
        alert("모임 생성에 실패했습니다.");
      }
    };
    createLightningRequest();
  };

  const minStartTime = getNowTimeString();
  const maxStartTime = endTime ? subMinutes(endTime, 30) : "23:59";
  const minEndTime = startTime ? addMinutes(startTime, 30) : "";

  // 서버 사이드 렌더링 중에는 children을 그대로 반환
  if (!isClient) {
    return null;
  }

  return (
    <LightningCreateContext.Provider
      value={{
        title,
        setTitle,
        minPersonnel,
        setMinPersonnel,
        maxPersonnel,
        setMaxPersonnel,
        lightningType,
        setLightningType,
        recruitmentPeriod,
        setRecruitmentPeriod,
        locationPoint,
        setLocationPoint,
        address,
        setAddress,
        detailAddress,
        setDetailAddress,
        target,
        setTarget,
        setStartTime,
        setEndTime,
        startTime,
        endTime,
        minStartTime,
        minEndTime,
        maxStartTime,
        isAddressModalOpen,
        setIsAddressModalOpen,
        isDetailAddressModalOpen,
        setIsDetailAddressModalOpen,
        tagList,
        setTagList,
        // instrumentAssignRequestDTOList,
        // setInstrumentAssignRequestDTOList,
        createLightning,
      }}
    >
      {children}
    </LightningCreateContext.Provider>
  );
};

export const useLightningCreate = () => {
  const context = useContext(LightningCreateContext);
  if (!context) {
    throw new Error("useLightning must be used within a LightningProvider");
  }
  return context;
};
