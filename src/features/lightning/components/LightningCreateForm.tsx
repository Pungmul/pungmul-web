"use client";
import { Header } from "@/shared/components";
import { useRouter } from "next/navigation";
import { useLightningCreate } from "./LightiningContext";
import { LIGHTNING_TAGS } from "../model/index";
import { useView } from "@/shared/lib/useView";
import LightningNameInput from "@/features/lightning/components/LightningNameInput";
import LightningAddressInput from "@pThunder/features/lightning/components/widget/LightningAddressInput";
import TimePicker from "@pThunder/shared/components/TimePicker";

export default function LightningCreateForm() {
  const view = useView();
  const router = useRouter();
  const {
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
    isAddressModalOpen,
    setIsAddressModalOpen,
    isDetailAddressModalOpen,
    setIsDetailAddressModalOpen,
    tagList,
    setTagList,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
  } = useLightningCreate();

  // const completeHandler = (data: Address) => {
  //   const { roadAddress } = data;
  //   setAddress(roadAddress);
  //   setIsAddressModalOpen(false);
  //   setIsDetailAddressModalOpen(true);
  // };

  return (
    <div
      className="relative flex flex-col w-full overflow-visible"
      style={{ height: view === "desktop" ? "auto" : "calc(94vh - 8px)" }}
    >
      <Header title="번개 만들기" />
      <div
        style={{ paddingTop: 24, gap: 28 }}
        className="flex flex-col flex-grow"
      >
        <LightningNameInput title={title} setTitle={setTitle} />
        <LightningAddressInput
          address={address ?? ""}
          setAddress={setAddress}
          detailAddress={detailAddress ?? ""}
          setDetailAddress={setDetailAddress}
          isAddressModalOpen={isAddressModalOpen}
          setIsAddressModalOpen={setIsAddressModalOpen}
          isDetailAddressModalOpen={isDetailAddressModalOpen}
          setIsDetailAddressModalOpen={setIsDetailAddressModalOpen}
        />
        <div
          style={{ paddingLeft: 24, paddingRight: 24, gap: 6 }}
          className="w-full flex flex-row justify-between items-center"
        >
          <div style={{ marginLeft: 4, fontSize: 14, color: "#9A9A9A" }}>
            타입
          </div>
          <div className="flex flex-row flex-wrap justify-end flex-grow items-center gap-3">
            {(["일반 모임", "풍물 모임"] as const).map((type, index) => (
              <div
                key={"type-text-" + index}
                className="font-semibold px-3 py-1 flex items-center justify-center rounded-full border cursor-pointer"
                style={{
                  borderColor: lightningType == type ? "#816DFF" : "#CDC5FF",
                  backgroundColor: lightningType == type ? "#816DFF" : "#FFF",
                  color: lightningType == type ? "#FFF" : "#CDC5FF",
                  fontSize: 14,
                }}
                onClick={() => {
                  setLightningType(type);
                }}
              >
                {type}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{ paddingLeft: 24, paddingRight: 24, gap: 6 }}
          className="w-full flex flex-row justify-between items-center"
        >
          <div style={{ marginLeft: 4, fontSize: 14, color: "#9A9A9A" }}>
            대상
          </div>
          <div className="flex flex-row flex-wrap justify-end flex-grow items-center gap-3">
            {(["전체", "우리 학교만"] as const).map((type, index) => (
              <div
                key={"target-text-" + index}
                className="font-semibold px-3 py-1 flex items-center justify-center rounded-full border cursor-pointer"
                style={{
                  borderColor: target == type ? "#816DFF" : "#CDC5FF",
                  backgroundColor: target == type ? "#816DFF" : "#FFF",
                  color: target == type ? "#FFF" : "#CDC5FF",
                  fontSize: 14,
                }}
                onClick={() => {
                  setTarget(type);
                }}
              >
                {type}
              </div>
            ))}
          </div>
        </div>
        {
          // lightningType === "일반 모임" ?
          <div
            style={{ paddingLeft: 24, paddingRight: 24, gap: 6 }}
            className="w-full flex flex-col"
          >
            <div className="w-full flex flex-col" style={{ gap: 20 }}>
              <div
                className="flex flex-row justify-between"
                style={{ paddingLeft: 4, paddingRight: 4 }}
              >
                <div style={{ fontSize: 14, color: "#9A9A9A" }}>최소 인원</div>
                <div
                  className="flex flex-row items-center justify-center"
                  style={{ gap: 8 }}
                >
                  <div
                    className="rounded-full border-gray-300 text-gray-500 cursor-pointer border w-6 h-6 items-center justify-center flex"
                    style={{
                      backgroundColor: minPersonnel > 2 ? "#FFF" : "#DDD",
                    }}
                    onClick={() => {
                      if (minPersonnel > 2) {
                        setMinPersonnel((prev) => prev - 1);
                      }
                    }}
                  >
                    -
                  </div>
                  <div style={{ width: 32, textAlign: "center" }}>
                    <input
                      type="text"
                      className="px-2 py-1"
                      style={{
                        width: "100%",
                        border: "none",
                        textAlign: "right",
                      }}
                      value={minPersonnel}
                      onKeyDown={(e) => {
                        if (e.key == "Enter") {
                          if (parseInt(e.currentTarget.value) >= maxPersonnel) {
                            setMinPersonnel(maxPersonnel - 1);
                          } else if (parseInt(e.currentTarget.value) < 2) {
                            setMinPersonnel(2);
                          } else {
                            setMinPersonnel(parseInt(e.currentTarget.value));
                          }
                        }
                      }}
                      onBlur={(e) => {
                        if (parseInt(e.currentTarget.value) >= maxPersonnel) {
                          setMinPersonnel(maxPersonnel - 1);
                        } else if (parseInt(e.currentTarget.value) < 2) {
                          setMinPersonnel(2);
                        } else {
                          setMinPersonnel(parseInt(e.currentTarget.value));
                        }
                      }}
                      onChange={(e) => {
                        const newValue = e.currentTarget.value;
                        if (newValue === "") {
                          setMinPersonnel(0);
                        } else if (/^\d+$/.test(newValue)) {
                          setMinPersonnel(parseInt(newValue));
                        }
                      }}
                    />
                  </div>
                  <div
                    className="rounded-full border-gray-300 text-gray-500 cursor-pointer border w-6 h-6 items-center justify-center flex"
                    style={{
                      backgroundColor:
                        minPersonnel + 1 < maxPersonnel ? "#FFF" : "#DDD",
                    }}
                    onClick={() => {
                      if (minPersonnel + 1 < maxPersonnel) {
                        setMinPersonnel((prev) => prev + 1);
                      }
                    }}
                  >
                    +
                  </div>
                </div>
              </div>
              <div
                className="flex flex-row justify-between items-center"
                style={{ paddingLeft: 4, paddingRight: 4 }}
              >
                <div style={{ fontSize: 14, color: "#9A9A9A" }}>최대 인원</div>
                <div
                  className="flex flex-row items-center justify-center"
                  style={{ gap: 8 }}
                >
                  <div
                    className="rounded-full border-gray-300 text-gray-500 cursor-pointer border w-6 h-6 items-center justify-center flex"
                    style={{
                      backgroundColor:
                        maxPersonnel > minPersonnel + 1 ? "#FFF" : "#DDD",
                    }}
                    onClick={() => {
                      if (maxPersonnel > minPersonnel + 1)
                        setMaxPersonnel((prev) => prev - 1);
                    }}
                  >
                    -
                  </div>
                  <div style={{ width: 32, textAlign: "center" }}>
                    <input
                      type="text"
                      className="px-2 py-1"
                      style={{
                        width: "100%",
                        border: "none",
                        textAlign: "right",
                      }}
                      value={maxPersonnel}
                      onKeyDown={(e) => {
                        if (e.key == "Enter") {
                          if (parseInt(e.currentTarget.value) <= minPersonnel) {
                            setMaxPersonnel(minPersonnel + 1);
                          } else {
                            setMaxPersonnel(parseInt(e.currentTarget.value));
                          }
                        }
                      }}
                      onBlur={(e) => {
                        if (parseInt(e.currentTarget.value) <= minPersonnel) {
                          setMaxPersonnel(minPersonnel + 1);
                        } else if (parseInt(e.currentTarget.value) > 100) {
                          setMaxPersonnel(100);
                        } else {
                          setMaxPersonnel(parseInt(e.currentTarget.value));
                        }
                      }}
                      onChange={(e) => {
                        const newValue = e.currentTarget.value;
                        if (newValue === "") {
                          setMaxPersonnel(0);
                        } else if (/^\d+$/.test(newValue)) {
                          setMaxPersonnel(parseInt(newValue));
                        }
                      }}
                    />
                  </div>
                  <div
                    className="rounded-full border-gray-300 text-gray-500 cursor-pointer border w-6 h-6 items-center justify-center flex"
                    style={{
                      backgroundColor: maxPersonnel < 100 ? "#FFF" : "#DDD",
                    }}
                    onClick={() => {
                      if (maxPersonnel < 100)
                        setMaxPersonnel((prev) => prev + 1);
                    }}
                  >
                    +
                  </div>
                </div>
              </div>
            </div>
          </div>
          // : (
          //   <div
          //     className="flex flex-col"
          //     style={{ gap: 24, paddingLeft: 24, paddingRight: 24 }}
          //   >
          //     <div style={{ fontSize: 14, color: "#9A9A9A" }}>악기별 모집 인원</div>
          //     <div className="flex flex-row justify-between items-center">
          //       {instrumentAssignRequestDTOList.map(
          //         (data) => (
          //           <InstrumentAssignForm
          //             InstrumentAssignRequestData={data}
          //             setInstrumentAssignRequestDTOList={
          //               setInstrumentAssignRequestDTOList
          //             }
          //           />
          //         )
          //       )}
          //     </div>
          //   </div>
          // )
        }
        <div
          className="flex flex-row justify-between items-center"
          style={{ paddingLeft: 28, paddingRight: 28 }}
        >
          <div style={{ fontSize: 14, color: "#9A9A9A" }}>모임 진행 시간</div>
          <div
            className="flex flex-row items-center justify-center"
            style={{ gap: 8 }}
          >
            {startTime.trim() && endTime.trim() && `${startTime} ~ ${endTime}`}
            <TimePicker
              trigger={
                <div className="cursor-pointer px-[8px] py-[4px] rounded-full border border-[#CDC5FF] text-[#CDC5FF] font-semibold text-[14px]">
                  {startTime.trim() && endTime.trim() ? "시간 수정" : "시간 선택"}
                </div>
              }
              onChange={(startTime, endTime) => {
                setStartTime(startTime);
                setEndTime(endTime);
              }}
              value={{ startTime, endTime }}
            />
          </div>
        </div>
        <div
          className="flex flex-row justify-between items-center"
          style={{ paddingLeft: 28, paddingRight: 28 }}
        >
          <div style={{ fontSize: 14, color: "#9A9A9A" }}>시작 시간</div>
          <div
            className="flex flex-row items-center justify-center"
            style={{ gap: 8 }}
          >
            <div
              className="rounded-full border-gray-300 text-gray-500 cursor-pointer border w-6 h-6 items-center justify-center flex"
              style={{
                backgroundColor: recruitmentPeriod > 5 ? "#FFF" : "#DDD",
              }}
              onClick={() => {
                if (recruitmentPeriod > 5)
                  setRecruitmentPeriod((prev) => prev - 5);
              }}
            >
              -
            </div>
            <div style={{ width: 64 }} className="text-center">
              {recruitmentPeriod} 분 후
            </div>
            <div
              className="rounded-full border-gray-300 text-gray-500 cursor-pointer border w-6 h-6 items-center justify-center flex"
              style={{
                backgroundColor: recruitmentPeriod < 60 ? "#FFF" : "#DDD",
              }}
              onClick={() => {
                if (recruitmentPeriod < 60)
                  setRecruitmentPeriod((prev) => prev + 5);
              }}
            >
              +
            </div>
          </div>
        </div>
        <div
          style={{ paddingLeft: 24, paddingRight: 24, gap: 6 }}
          className="w-full flex flex-col"
        >
          <div style={{ marginLeft: 4, fontSize: 14, color: "#9A9A9A" }}>
            태그
          </div>
          <div className="flex flex-row flex-wrap w-full gap-3">
            {LIGHTNING_TAGS.map((type, index) => (
              <div
                key={"tag-text-" + index}
                className="font-semibold px-3 py-1 flex items-center justify-center rounded-full border cursor-pointer"
                style={{
                  borderColor: tagList.includes(type) ? "#816DFF" : "#CDC5FF",
                  backgroundColor: tagList.includes(type) ? "#816DFF" : "#FFF",
                  color: tagList.includes(type) ? "#FFF" : "#CDC5FF",
                  fontSize: 14,
                }}
                onClick={() => {
                  if (tagList.includes(type)) {
                    setTagList(tagList.filter((tag) => tag !== type));
                  } else {
                    setTagList([...tagList, type]);
                  }
                }}
              >
                {`${type}`}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className="w-full py-4"
        style={{ paddingLeft: 24, paddingRight: 24 }}
      >
        <div
          className="w-full flex items-center justify-center text-white rounded"
          style={{
            height: 48,
            backgroundColor:
              lightningType &&
              title.length > 0 &&
              address &&
              detailAddress &&
              startTime &&
              endTime &&
              recruitmentPeriod
                ? "#816DFF"
                : "#CDC5FF",
            cursor:
              lightningType &&
              title.length > 0 &&
              address &&
              detailAddress &&
              startTime &&
              endTime &&
              recruitmentPeriod
                ? "pointer"
                : "auto",
          }}
          onClick={() => {
            if (
              lightningType &&
              title.length > 0 &&
              address &&
              detailAddress &&
              startTime &&
              endTime &&
              recruitmentPeriod
            )
              console.log("생성하기");
              router.push("lightning/create/check");
          }}
        >
          생성하기
        </div>
      </div>
    </div>
  );
}
