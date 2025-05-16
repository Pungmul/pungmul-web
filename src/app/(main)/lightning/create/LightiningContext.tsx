"use client";
import { createContext, useContext, useState } from "react";

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
};

const LightningCreateContext = createContext<
  LightningCreateContextType | undefined
>(undefined);

export const LightningCreateContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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
  const [isDetailAddressModalOpen, setIsDetailAddressModalOpen] =
    useState(false);
  const [tagList, setTagList] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const getNowTimeString = (): string => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1); // 현재 시간보다 1분 후부터 허용
    return now.toTimeString().slice(0, 5); // "HH:MM"
  };

  const addMinutes = (timeStr: string, minutes: number): string => {
    const [hour, minute] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute + minutes);
    return date.toTimeString().slice(0, 5);
  };

  const subMinutes = (timeStr: string, minutes: number): string => {
    const [hour, minute] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute - minutes);
    return date.toTimeString().slice(0, 5);
  };

  const minStartTime = getNowTimeString();
  const maxStartTime = endTime ? subMinutes(endTime, 30) : "23:59";
  const minEndTime = startTime ? addMinutes(startTime, 30) : "";

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
