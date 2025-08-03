"use client";
import { useEffect, useState } from "react";

import { Header } from "@/shared/components/layout/Header";
import { useRouter } from "next/navigation";
import { Instrument, InstrumentStatus } from "@pThunder/features/instrument-status/model/index";
import {
  instrumentNamesMap,
  instruments,
} from "@pThunder/features/instrument-status/model/constant";

import { InstrumentStatusBlock } from "@pThunder/features/lightning/components/deprecated/InstrumentStatus";
import Image from "next/image";
import {
  useAddInstrumentSkill,
  useDeleteInstrumentSkill,
  useGetMyPageInfo,
  useUpdateInstrumentSkill,
} from "@pThunder/features/my-page/api/api";

export default function MyPageClient() {
  const router = useRouter();

  const [selectVisible, setVisible] = useState(false);
  const { data: userData } = useGetMyPageInfo();
  const { mutate: addInstrumentSkill } = useAddInstrumentSkill();
  const { mutate: deleteInstrumentSkill } = useDeleteInstrumentSkill();
  const { mutate: updateInstrumentSkill } = useUpdateInstrumentSkill();
  const [instrumentsData, setInstrumentsData] = useState<InstrumentStatus[]>(
    userData?.instrumentStatusDTOList || []
  );

  const addableInstruments = instruments.filter(
    (instrument) =>
      !instrumentsData?.map((data) => data.instrument).includes(instrument)
  );

  useEffect(() => {
    setInstrumentsData(userData?.instrumentStatusDTOList || []);
  }, [userData]);
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const addInst = formData.get("add_instrument") as Instrument;
    if (addInst == null) return;
    addInstrumentSkill(
      {
        instrument: addInst,
        instrumentAbility: "UNSKILLED",
        major: false,
      },
      {
        onSuccess: () => {
          console.log("업로드 완료");
          setVisible(false);
        },
        onError: (e) => {
          console.error(e);
        },
      }
    );
  };

  const updateHandler = (newInstrumentStatus: InstrumentStatus) => {
    updateInstrumentSkill(newInstrumentStatus, {
      onSuccess: () => {
        console.log("업데이트 완료");
      },
      onError: (e) => {
        console.error(e);
      },
    });
  };

  const deleteHandler = (instrument: Instrument) => {
    deleteInstrumentSkill(instrument, {
      onSuccess: () => {
        console.log("삭제 완료");
      },
      onError: (e) => {
        console.error(e);
      },
    });
  };

  useEffect(() => {
    if (userData) {
      document.title = `풍물 머시기 | ${userData?.clubName || userData?.name}`;
    } else {
      document.title = "풍물 머시기 | 마이 페이지";
    }
  }, [userData]);
  return (
    <div className="flex flex-col h-full w-full min-w-[360px] max-w-[768px] mx-auto relative">
      <Header
        title="마이 페이지"
        isBackBtn={false}
        rightBtn={<div className="text-[16px] text-[#816DFF]">수정</div>}
      />
      <div className="px-[32px] py-[24px] flex-grow flex flex-col gap-[32px] w-full">
        <Image
          src={userData?.profile.fullFilePath || "/icons/MyPage-Icon.svg"}
          alt="profile"
          width={128}
          height={128}
          className="rounded-lg w-[128px] h-[128px] object-cover self-center border-[2px]"
        />
        <div className="flex flex-row justify-between">
          <span className="text-gray-400 text-[18px]">이름</span>
          <span className="text-[18px]">
            {userData?.name}
            {`${userData?.groupName ? ` (${userData.groupName})` : ""}`}
          </span>
        </div>
        <div className="flex flex-row justify-between">
          <span className="text-gray-400 text-[18px]">동아리</span>
          <span className="text-[18px]">
            {userData?.clubName}
            {userData?.clubAge ? ` (${userData?.clubAge})` : ""}{" "}
          </span>
        </div>
        <div className="flex flex-row justify-between">
          <span className="text-gray-400 text-[18px]">전화번호</span>
          <span className="text-[18px]">{userData?.phoneNumber}</span>
        </div>
        <div className="relative">
          <form
            onSubmit={submitHandler}
            className={`absolute ${
              selectVisible ? `flex` : `hidden`
            } right-0 z-10 top-6 bg-white flex-col rounded-md px-4 py-4 gap-4 shadow-md`}
          >
            <div className="flex flex-row justify-between items-start  w-48">
              <div className="text-xl font-semibold">추가할 악기</div>
              <div
                className="text-md text-gray-200 cursor-pointer"
                onClick={() => setVisible(false)}
              >
                X
              </div>
            </div>
            <div className="flex flex-row justify-between mx-1">
              <div>악기</div>
              <div>
                <select
                  name="add_instrument"
                  id="add_instrument"
                  className="text-right"
                >
                  {addableInstruments.map((instrument) => {
                    return (
                      <option key={instrument} value={instrument}>
                        {instrumentNamesMap[instrument]}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <button className="px-3 py-1 rounded-md bg-blue-600 text-white self-end cursor-pointer">
              추가
            </button>
          </form>
          <div className="text-xl">악기 정보</div>
          {addableInstruments.length > 0 && (
            <div
              className="-right-0.5 top-0 p-0.5 absolute cursor-pointer text-gray-300"
              onClick={() => setVisible(true)}
            >
              추가하기
            </div>
          )}
          <div className="flex flex-col gap-8 py-4 px-0.5 rounded border border-gray-200 my-2">
            {instrumentsData
              .sort((a) => (a.major ? -1 : 1))
              .map((instrumentStatus: InstrumentStatus) => (
                <InstrumentStatusBlock
                  key={instrumentStatus.instrument}
                  instrumentStatus={instrumentStatus}
                  deleteHandler={deleteHandler}
                  updateHandler={updateHandler}
                />
              ))}
          </div>
        </div>

        <div
          className="w-full py-3 rounded-md text-white text-base font-semibold justify-center items-center bg-red-400 cursor-pointer flex"
          onClick={() => router.push("/logout")}
        >
          로그아웃
        </div>
      </div>
    </div>
  );
}
