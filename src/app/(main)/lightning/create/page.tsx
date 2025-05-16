"use client";
import { Header } from "@pThunder/component/shared/Header";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@pThunder/component/shared/Modal";
import LocationIcon from "@public/icons/Location-icon.svg";
import Image from "next/image";
import DaumPostcode, { Address } from "react-daum-postcode";
import { useLightningCreate } from "./LightiningContext";

const inputStyle = {
  "::placeholder": {
    color: "#CDC5FF", // 원하는 색상
  },
  fontSize: 16,
};
export default function LightningCreatePage() {
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
    minStartTime,
    minEndTime,
    maxStartTime,
  } = useLightningCreate();

  const completeHandler = (data: Address) => {
    const { address, roadAddress } = data;
    setAddress(roadAddress);
    setIsAddressModalOpen(false);
    setIsDetailAddressModalOpen(true);
    // setZonecode(zonecode);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <Header title="번개 만들기" />
      <div
        style={{ paddingTop: 24, gap: 28 }}
        className="flex flex-col flex-grow"
      >
        <div
          style={{ paddingLeft: 24, paddingRight: 24, gap: 6 }}
          className="w-full flex flex-col"
        >
          <div style={{ marginLeft: 4, fontSize: 14, color: "#9A9A9A" }}>
            번개 이름
          </div>
          <input
            type="text"
            name="lightningName"
            id="lightningName"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            style={{
              ...inputStyle,
              borderColor: "#CDC5FF",
              fontSize: 14,
              outlineColor: "#816DFF",
            }}
            className="px-2 py-3 w-full border rounded"
            placeholder="번개의 이름을 입력해주세요."
          />
        </div>
        <div className="w-full flex flex-row justify-between px-[24px] items-center">
          <div style={{ fontSize: 14, color: "#9A9A9A" }}>주소</div>
          {address ? (
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-row">
                {address}, {detailAddress}
              </div>
              <div
                className="cursor-pointer px-[8px] py-[4px] rounded-full border border-[#CDC5FF] text-[#CDC5FF] font-semibold"
                onClick={() => setIsAddressModalOpen(true)}
                style={{
                  fontSize: 14,
                  color: "#9A9A9A",
                }}
              >
                다시 선택
              </div>
            </div>
          ) : (
            <div
              className="cursor-pointer px-[8px] py-[4px] rounded-full border border-[#CDC5FF] text-[#CDC5FF] font-semibold"
              onClick={() => setIsAddressModalOpen(true)}
              style={{
                fontSize: 14,
                color: isAddressModalOpen ? "#816DFF" : "#9A9A9A",
              }}
            >
              주소 선택
            </div>
          )}
        </div>
        <Modal
          isOpen={isAddressModalOpen}
          title="주소 선택"
          onClose={() => setIsAddressModalOpen(false)}
        >
          <div className="flex">
            <DaumPostcode
              style={{ width: "100%", height: "500px" }}
              onComplete={completeHandler}
            />
            {/* <div style={{ gap: 6 }} className="w-full flex flex-col bg-white">
              <div style={{ paddingLeft: 4, fontSize: 14, color: "#9A9A9A" }}>
                주소 검색
              </div>
              <input
                type="text"
                name="lightningName"
                id="lightningName"
                value={title}
                onChange={(e) => setTitle(e.currentTarget.value)}
                style={{
                  ...inputStyle,
                  borderColor: "#CDC5FF",
                  fontSize: 14,
                  outlineColor: "#816DFF",
                }}
                className="px-2 py-3 w-full border rounded"
                placeholder="주소를 입력해주세요."
              />
            </div>
            <div className="w-full flex flex-col py-[24px] overflow-y-auto">
              {[
                "상수동",
                "성수동",
                "공덕동",
                "서교동",
                "대흥동",
                "유아이",
                "호집",
                "상수동",
                "성수동",
                "공덕동",
                "서교동",
                "대흥동",
                "유아이",
                "호집",
              ].map((result, index) => (
                <div
                  className="w-full flex flex-row justify-between px-4 py-[24px] items-center cursor-pointer border-t border-gray-200 last:border-b"
                  onClick={() => {
                    setAddress(result);
                    setIsAddressModalOpen(false);
                  }}
                >
                  <div>
                    <Image src={LocationIcon} width={24} alt="" />
                  </div>
                  <div>{result}</div>
                </div>
              ))}
            </div> */}
          </div>
        </Modal>
        <Modal
          isOpen={isDetailAddressModalOpen}
          title="상세 주소 입력"
          onClose={() => setIsDetailAddressModalOpen(false)}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4 items-center">
              <div className="text-center p-2 rounded-md font-light bg-gray-100 text-gray-400 text-[14px]">
                기본 주소
              </div>
              <div className="flex-grow">{address}</div>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <div className="text-center p-2 rounded-md font-light bg-gray-100 text-gray-400 text-[14px]">
                상세 주소
              </div>
              <div className="flex-grow">
                <input
                  type="text"
                  value={detailAddress ?? ""}
                  placeholder="상세 주소를 입력해주세요."
                  onChange={(e) => setDetailAddress(e.currentTarget.value)}
                  className="flex w-full"
                  style={{
                    ...inputStyle,
                    padding: 12,
                    borderWidth: 1,
                    borderRadius: 8,
                    borderColor: "#CDC5FF",
                    fontSize: 14,
                    outlineColor: "#816DFF",
                  }}
                />
              </div>
            </div>
            <div
              className={
                "w-full text-center p-4 rounded-md text-white cursor-pointer " +
                (detailAddress && detailAddress.length > 0
                  ? "bg-[#816DFF]"
                  : "bg-[#CDC5FF]")
              }
              onClick={() => {
                if (detailAddress && detailAddress.length > 0) {
                  setIsDetailAddressModalOpen(false);
                }
              }}
            >
              확인
            </div>
          </div>
        </Modal>
        <div
          style={{ paddingLeft: 24, paddingRight: 24, gap: 6 }}
          className="w-full flex flex-row justify-between items-center"
        >
          <div style={{ marginLeft: 4, fontSize: 14, color: "#9A9A9A" }}>
            타입
          </div>
          <div className="flex flex-row flex-wrap justify-end flex-grow items-center gap-3">
            {(["일반 모임", "풍물 모임"] as const).map((type) => (
              <div
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
            {(["전체", "우리 학교만"] as const).map((type) => (
              <div
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
                    if (maxPersonnel < 100) setMaxPersonnel((prev) => prev + 1);
                  }}
                >
                  +
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div
          style={{ paddingLeft: 24, paddingRight: 24, gap: 4 }}
          className="flex flex-col"
        >
          <div className="w-full relative" style={{ height: 24 }}>
            <div
              className="relative h-full"
              style={{ marginLeft: 12, marginRight: 12 }}
            >
              <div
                style={{
                  paddingLeft: 24,
                  paddingRight: 24,
                  top: 10,
                  backgroundColor: "#CBCBCB",
                }}
                className="absolute w-full h-1 "
              ></div>
              <div
                style={{
                  top: 10,
                  left: (minPersonnel - 4) * 22,
                  width: 22 * (maxPersonnel - minPersonnel),
                  backgroundColor: "#816DFF",
                }}
                className="absolute w-full h-1 "
              ></div>
            </div>
            <div
              className="absolute rounded-full border"
              style={{
                left: (minPersonnel - 4) * 22,
                top: 0,
                borderColor: "#CBCBCB",
                backgroundColor: "#FFF",
                width: 22,
                height: 22,
              }}
            ></div>
            <div
              className="absolute rounded-full border"
              style={{
                left: (maxPersonnel - 4) * 22,
                top: 0,
                borderColor: "#CBCBCB",
                backgroundColor: "#FFF",
                width: 22,
                height: 22,
              }}
              onDrag={(e) => {
                e;
              }}
            ></div>
          </div>
          <div className="flex flex-row w-full justify-between">
            {Array.from({ length: 17 }).map((_, index) => {
              return index + 4 == minPersonnel || index + 4 == maxPersonnel ? (
                <div
                  style={{ width: 24, color: "#9A9A9A", fontSize: 10 }}
                  className="flex items-center justify-center"
                >
                  {index + 4}
                </div>
              ) : (
                <div
                  style={{ width: 24, color: "#9A9A9A", fontSize: 6 }}
                  className="flex items-center justify-center"
                >
                  |
                </div>
              );
            })}
          </div>
        </div> */}

        <div
          className="flex flex-row justify-between items-center"
          style={{ paddingLeft: 28, paddingRight: 28 }}
        >
          <div style={{ fontSize: 14, color: "#9A9A9A" }}>모임 시작 시간</div>
          <input
            type="time"
            value={startTime}
            onChange={(e) => {
              const value = e.target.value;
              if (value <= minStartTime)
                alert("현재 시간보다 최소 30분 이후로 설정해주세요.");
              else if (value > maxStartTime)
                alert("모임 종료 시간보다 최소 30분 이전으로 설정해주세요.");
              else setStartTime(value);
            }}
            min={minStartTime}
            max={maxStartTime}
          />
        </div>
        <div
          className="flex flex-row justify-between items-center"
          style={{ paddingLeft: 28, paddingRight: 28 }}
        >
          <div style={{ fontSize: 14, color: "#9A9A9A" }}>모임 종료 시간</div>
          {startTime ? (
            <input
              type="time"
              value={endTime}
              onChange={(e) => {
                const value = e.target.value;
                if (startTime && value < minEndTime) {
                  alert("시작 시간보다 최소 30분 뒤로 설정해주세요.");
                  return;
                }
                if (value >= minStartTime) setEndTime(value);
                else alert("현재 시간보다 이후로 설정해주세요.");
              }}
              min={minEndTime || minStartTime}
              disabled={!startTime}
            />
          ) : (
            <div style={{ height: 24, color: "#CCC" }}>
              시작 시간을 설정해주세요.
            </div>
          )}
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
            {["#노래", "#춤", "#물", "#풀"].map((type) => (
              <div
                className="font-semibold px-3 py-1 flex items-center justify-center rounded-full border cursor-pointer"
                style={{
                  borderColor: tagList.includes(type) ? "#816DFF" : "#CDC5FF",
                  backgroundColor: tagList.includes(type) ? "#816DFF" : "#FFF",
                  color: tagList.includes(type) ? "#FFF" : "#CDC5FF",
                  fontSize: 14,
                }}
                onClick={() => {
                  tagList.includes(type)
                    ? setTagList(tagList.filter((tag) => tag !== type))
                    : setTagList([...tagList, type]);
                }}
              >
                {type}
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
              router.push("create/check");
          }}
        >
          생성하기
        </div>
      </div>
    </div>
  );
}
